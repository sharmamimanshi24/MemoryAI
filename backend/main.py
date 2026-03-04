import vertexai
import httpx
from vertexai.generative_models import GenerativeModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from google.cloud import firestore
import sys, os, datetime, time

sys.path.append('/home/' + os.environ.get('USER', '') + '/memory-ai-system')
from config.settings import PROJECT_ID, LOCATION, GEMINI_MODEL
from backend.memory import save_memory
from backend.retrieval import retrieve_memories, get_user_profile

vertexai.init(project=PROJECT_ID, location=LOCATION)
app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Lazy Firestore client with retry
_db = None
def get_db():
    global _db
    for attempt in range(3):
        try:
            if _db is None:
                _db = firestore.Client(project=PROJECT_ID)
            return _db
        except Exception:
            _db = None
            time.sleep(1)
    raise Exception("Firestore unavailable")

class ChatRequest(BaseModel):
    user_id: str
    message: str
    session_id: str

GREETING_TRIGGERS = ["greet me", "say hello", "short casual greeting", "5 words max", "one sentence max"]

def is_greeting(message: str) -> bool:
    return any(t in message.lower() for t in GREETING_TRIGGERS)

def build_system_prompt(user_id: str, message: str) -> str:
    greeting = is_greeting(message)

    prompt = """You are a smart, casual AI assistant — like a knowledgeable friend who remembers everything.

PERSONALITY:
- Talk like a real person, not a robot
- Add dry humor when appropriate
- Never start with "Hey [name]!" or "Great question!" or "Of course!"
- Use the person's name only very occasionally
- Keep responses concise unless detail is needed
- Skeptical, analytical, provocative — find flaws in weak logic
- Casual language, contractions, short sentences
- Never be sycophantic or overly enthusiastic
- Grumpy, ultra-fast, zero fluff, ancient wisdom

GOOD TONE EXAMPLES:
- "Sure, here's how that works..."
- "Bold claim. Here's why that's not entirely true..."
- "Nope. Here's what actually happens..."

"""

    if not greeting:
        try:
            profile = get_user_profile(user_id)
            if profile:
                prompt += "WHAT YOU KNOW ABOUT THIS PERSON:\n"
                for key, value in profile.items():
                    prompt += f"- {key}: {value}\n"
                prompt += "\n"
        except Exception:
            pass

        try:
            memories = retrieve_memories(user_id, message, top_k=4)
            if memories:
                prompt += "RELEVANT PAST CONTEXT:\n"
                for mem in memories:
                    prompt += f"- {mem['text']}\n"
                prompt += "\n"
        except Exception:
            pass

        prompt += "Use context naturally. Only mention past topics if directly relevant. Never summarize old projects unprompted.\n"
    else:
        prompt += "This is a greeting. Reply with MAX 5 words, super casual. No names, no project mentions.\n"

    return prompt

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        system_prompt = build_system_prompt(request.user_id, request.message)
        model = GenerativeModel(GEMINI_MODEL, system_instruction=system_prompt)
        response = model.generate_content(request.message)
        reply = response.text

        # Save memory
        try:
            if not is_greeting(request.message):
                save_memory(
                    user_id=request.user_id,
                    text=f"User: {request.message} | Assistant: {reply[:200]}",
                    memory_type="episodic",
                    metadata={"session_id": request.session_id}
                )
        except Exception:
            pass

        # Save to Firestore
        try:
            db = get_db()
            db.collection("sessions").document(request.session_id)\
              .collection("messages").add({
                "user": request.message,
                "assistant": reply,
                "timestamp": datetime.datetime.utcnow()
            })
            db.collection("sessions").document(request.session_id).set({
                "user_id": request.user_id,
                "session_id": request.session_id,
                "preview": request.message[:60],
                "timestamp": datetime.datetime.utcnow()
            }, merge=True)
        except Exception:
            pass

        return {"reply": reply, "session_id": request.session_id}

    except Exception as e:
        return {"reply": "Connection hiccup — try sending again.", "session_id": request.session_id}

@app.get("/sessions/{user_id}")
async def get_sessions(user_id: str):
    try:
        db = get_db()
        sessions = db.collection("sessions")\
                     .where("user_id", "==", user_id)\
                     .order_by("timestamp", direction=firestore.Query.DESCENDING)\
                     .limit(20).stream()
        result = []
        for s in sessions:
            data = s.to_dict()
            result.append({
                "session_id": data.get("session_id"),
                "preview": data.get("preview", "Chat session"),
                "timestamp": str(data.get("timestamp", ""))
            })
        return {"sessions": result}
    except Exception as e:
        return {"sessions": [], "error": str(e)}

@app.get("/sessions/{user_id}/{session_id}/messages")
async def get_messages(user_id: str, session_id: str):
    try:
        db = get_db()
        msgs = db.collection("sessions").document(session_id)\
                 .collection("messages")\
                 .order_by("timestamp").stream()
        result = []
        for m in msgs:
            data = m.to_dict()
            result.append({
                "user": data.get("user", ""),
                "assistant": data.get("assistant", "")
            })
        return {"messages": result}
    except Exception as e:
        return {"messages": [], "error": str(e)}

@app.delete("/sessions/{user_id}/{session_id}")
async def delete_session(user_id: str, session_id: str):
    try:
        db = get_db()
        msgs = db.collection("sessions").document(session_id).collection("messages").stream()

        for m in msgs:
            m.reference.delete()
        db.collection("sessions").document(session_id).delete()
        return {"status": "deleted",  "session_id": session_id}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
import httpx

@app.get("/quote")
async def get_quote():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("https://zenquotes.io/api/random", timeout=5)
            data = response.json()
            return {"quote": data[0]["q"], "author": data[0]["a"]}
    except Exception:
        return {"quote": "Keep going.", "author": "Unknown"}

@app.get("/health")
async def health():
    return {"status": "ok", "model": GEMINI_MODEL}

@app.get("/")
async def serve_frontend():
    return FileResponse("frontend/index.html")

@app.get("/chat")
async def serve_chat():
    return FileResponse("frontend/index.html")

app.mount("/", StaticFiles(directory="frontend", html=True), name="static")