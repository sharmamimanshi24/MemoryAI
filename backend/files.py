"""File upload handling — turns an uploaded file of any supported format
into something Gemini can actually read.

Three buckets:
  1. Images / PDFs / audio / video  -> sent straight to Gemini as binary parts
  2. Word documents (.docx)          -> text extracted with python-docx
  3. Plain text & code files         -> decoded and inlined as text
"""

import io
import os
from vertexai.generative_models import Part

# Cap uploads so a giant file can't blow up the request. 15 MB.
MAX_FILE_BYTES = 15 * 1024 * 1024

# Trim inlined text so a huge log file doesn't eat the whole context window.
MAX_TEXT_CHARS = 20000

# MIME types Gemini can ingest directly as binary parts.
NATIVE_MIME_TYPES = {
    "application/pdf",
    "image/png", "image/jpeg", "image/webp", "image/gif", "image/heic", "image/heif",
    "audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/ogg", "audio/flac",
    "video/mp4", "video/mpeg", "video/quicktime", "video/webm",
}

# Extension -> MIME fallback when the browser doesn't send a usable content type.
EXT_MIME = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".heic": "image/heic", ".heif": "image/heif",
    ".mp3": "audio/mpeg", ".wav": "audio/wav", ".ogg": "audio/ogg", ".flac": "audio/flac",
    ".mp4": "video/mp4", ".mov": "video/quicktime", ".webm": "video/webm",
}

# Files we read as plain UTF-8 text.
TEXT_EXTENSIONS = {
    ".txt", ".md", ".markdown", ".rst", ".csv", ".tsv", ".json", ".jsonl",
    ".xml", ".yaml", ".yml", ".toml", ".ini", ".cfg", ".env", ".log",
    ".html", ".htm", ".css", ".scss", ".sql",
    ".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".c", ".cc", ".cpp", ".h", ".hpp",
    ".go", ".rs", ".rb", ".php", ".sh", ".bash", ".swift", ".kt", ".r", ".pl", ".lua",
}

DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


def _text_part(name: str, text: str) -> str:
    """Wrap extracted text so the model knows it came from a file."""
    if len(text) > MAX_TEXT_CHARS:
        text = text[:MAX_TEXT_CHARS] + "\n\n[...file truncated...]"
    return f"--- Contents of uploaded file '{name}' ---\n{text}\n--- End of file ---"


def _extract_docx(raw: bytes) -> str:
    """Pull paragraph text out of a .docx. Requires python-docx."""
    try:
        import docx  # python-docx
    except ImportError:
        raise ValueError("Word document support isn't installed on the server.")
    document = docx.Document(io.BytesIO(raw))
    return "\n".join(p.text for p in document.paragraphs if p.text)


def build_file_part(filename: str, content_type: str, raw: bytes):
    """Convert an uploaded file into (part, description).

    - ``part`` is either a plain string (text files) or a
      ``vertexai.generative_models.Part`` (images, PDFs, media) ready to
      hand to ``model.generate_content([...])``.
    - ``description`` is a short human label saved alongside the message.

    Raises ``ValueError`` for anything unsupported or too large.
    """
    if not raw:
        raise ValueError("that file is empty.")
    if len(raw) > MAX_FILE_BYTES:
        raise ValueError(f"that file is too big (max {MAX_FILE_BYTES // (1024 * 1024)} MB).")

    name = (filename or "file").strip()
    ext = os.path.splitext(name)[1].lower()
    ctype = (content_type or "").lower().split(";")[0].strip()

    # 1. Word documents -> extract text
    if ext == ".docx" or ctype == DOCX_MIME:
        return _text_part(name, _extract_docx(raw)), f"[Word document: {name}]"

    # 2. Images / PDFs / media Gemini reads natively
    mime = ctype if ctype in NATIVE_MIME_TYPES else EXT_MIME.get(ext)
    if mime in NATIVE_MIME_TYPES:
        kind = mime.split("/")[0]  # "image", "application", "audio", "video"
        label = "PDF" if mime == "application/pdf" else kind.capitalize()
        return Part.from_data(mime_type=mime, data=raw), f"[{label}: {name}]"

    # 3. Plain text / code
    if ext in TEXT_EXTENSIONS or ctype.startswith("text/"):
        return _text_part(name, raw.decode("utf-8", errors="replace")), f"[Text file: {name}]"

    # 4. Last resort — if it decodes cleanly as UTF-8, treat it as text
    try:
        return _text_part(name, raw.decode("utf-8")), f"[File: {name}]"
    except UnicodeDecodeError:
        raise ValueError(f"unsupported file type ({ctype or ext or 'unknown'}).")
