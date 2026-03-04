import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"

function detectLanguage(code) {
  if (code.includes("def ") || code.includes("import ") && code.includes(":")) return "python"
  if (code.includes("const ") || code.includes("function ") || code.includes("=>")) return "javascript"
  if (code.includes("<div") || code.includes("</")) return "html"
  if (code.includes("SELECT ") || code.includes("FROM ")) return "sql"
  if (code.includes("npm ") || code.includes("pip ") || code.includes("curl ")) return "bash"
  return "python"
}

function parseMessage(content) {
  const parts = []
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g
  let lastIndex = 0
  let match
  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: content.slice(lastIndex, match.index) })
    }
    parts.push({ type: "code", language: match[1] || detectLanguage(match[2]), content: match[2].trim() })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < content.length) {
    parts.push({ type: "text", content: content.slice(lastIndex) })
  }
  return parts
}

function CodeBlock({ code, language, darkMode, t }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div style={{ margin: "10px 0", borderRadius: "12px", overflow: "hidden", border: `1px solid ${t.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 14px", background: darkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.06)" }}>
        <span style={{ color: t.accent, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1px" }}>{language.toUpperCase()}</span>
        <button onClick={copy} style={{ background: copied ? t.sendBtn : "transparent", border: `1px solid ${t.border}`, borderRadius: "6px", padding: "3px 10px", color: copied ? "white" : t.subtext, cursor: "pointer", fontSize: "0.65rem", fontWeight: 600, transition: "all 0.2s" }}>
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter language={language} style={darkMode ? oneDark : oneLight} customStyle={{ margin: 0, borderRadius: 0, fontSize: "0.82rem", padding: "16px" }} showLineNumbers={code.split("\n").length > 4}>
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default function CodeMessage({ content, darkMode, t }) {
  const parts = parseMessage(content)
  return (
    <div>
      {parts.map((part, i) =>
        part.type === "code" ? (
          <CodeBlock key={i} code={part.content} language={part.language} darkMode={darkMode} t={t} />
        ) : (
          <p key={i} style={{ margin: "4px 0", whiteSpace: "pre-wrap", lineHeight: 1.65 }}>{part.content}</p>
        )
      )}
    </div>
  )
}
