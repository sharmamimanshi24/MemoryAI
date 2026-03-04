import ThoughtOfDay from "./ThoughtOfDay"
import CodeMessage from "./CodeMessage"
import { useState, useRef, useEffect } from "react"
import { PencilIcon, Trash2Icon,Palette, MessageSquarePlus, MoreHorizontal } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { themes } from "./themes"
import Aurora from "./Aurora"

const glassStyle = (t) => ({
  backdropFilter: "blur(28px) saturate(180%)",
  WebkitBackdropFilter: "blur(28px) saturate(180%)",
  background: t.mode === "dark" ? "rgba(10,0,25,0.55)" : "rgba(255,255,255,0.6)",
  border: `1px solid ${t.border}`,
  boxShadow: t.mode === "dark"
    ? "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)"
    : "0 8px 32px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)"
})

export default function App() {
  const [messages, setMessages] = useState([])
  const [USER_ID, setUSER_ID] = useState(() => localStorage.getItem("memory_ai_user") || "");
  const [userName, setUserName] = useState(() => localStorage.getItem("memory_ai_user") || "");
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState("session_" + Date.now())
  const [sessions, setSessions] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [memoryCount, setMemoryCount] = useState(0)
  const [themeKey, setThemeKey] = useState(() => {
    const saved = localStorage.getItem("themeKey")
    return (saved && themes[saved]) ? saved : "darkAurora"
  });
  const [showThemes, setShowThemes] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState("")
  const bottomRef = useRef(null)
  const navigate = useNavigate()
  const t = themes[themeKey] || themes["darkAurora"]
  const [openMenuId, setOpenMenuId] = useState(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  useEffect(() => {
    loadSessions()
  }, [])

  async function loadSessions() {
    try {
      const res = await fetch(`${API_URL}/sessions/${USER_ID}`)
      const data = await res.json()
      const saved = JSON.parse(localStorage.getItem("sessionTitles") || "{}")
      setSessions((data.sessions || []).map(s => ({
        ...s,
        title: saved[s.session_id] || s.preview?.slice(0, 40) || "New Chat"
      })))
    } catch { setSessions([]) }
  }

  function startNewChat(reloadSessions = true) {
    const newId = "session_" + Date.now()
    setSessionId(newId)
    localStorage.setItem("lastSessionId", newId)
    setMessages([])
    setMemoryCount(0)
    if (reloadSessions) setTimeout(loadSessions, 500)
  }

  async function loadSession(sid) {
    setSessionId(sid)
    localStorage.setItem("lastSessionId", sid)
    setMessages([])
    setMemoryCount(0)
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/sessions/${USER_ID}/${sid}/messages`)
      const data = await res.json()
      const msgs = []
      for (const m of (data.messages || [])) {
        if (m.user) msgs.push({ role: "user", content: m.user })
        if (m.assistant) msgs.push({ role: "assistant", content: m.assistant })
      }
      setMessages(msgs.length > 0 ? msgs : [])
      setMemoryCount(Math.floor(msgs.length / 2))
    } catch {
      setMessages([])
    }
    setLoading(false)
  }

  async function deleteSession(e, sid) {
    e.stopPropagation()
    try {
      await fetch(`${API_URL}/sessions/${USER_ID}/${sid}`, { method: "DELETE" })
      setSessions(prev => prev.filter(s => s.session_id !== sid))
      if (sid === sessionId) {
        localStorage.removeItem("lastSessionId")
        startNewChat(false)
      }
    } catch { }
  }

  function saveTitle(sid, title) {
    const saved = JSON.parse(localStorage.getItem("sessionTitles") || "{}")
    saved[sid] = title
    localStorage.setItem("sessionTitles", JSON.stringify(saved))
    setSessions(prev => prev.map(s => s.session_id === sid ? { ...s, title } : s))
    setEditingId(null)
  }

  function changeTheme(key) {
    setThemeKey(key)
    localStorage.setItem("themeKey", key)
    setShowThemes(false)
  }

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMsg }])
    setLoading(true)
    setSessions(prev => {
      const exists = prev.find(s => s.session_id === sessionId)
      if (!exists) {
        const title = userMsg.slice(0, 35) + (userMsg.length > 35 ? "..." : "")
        return [{ session_id: sessionId, preview: userMsg, title }, ...prev]
      }
      return prev
    })
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: USER_ID, message: userMsg, session_id: sessionId })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
      setMemoryCount(c => c + 1)
      localStorage.setItem("lastSessionId", sessionId)
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Error connecting. Please try again." }])
    }
    setLoading(false)
  }

  const gradStyle = {
    backgroundImage: t.headerGradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "inline-block"
  }
  const gs = glassStyle(t)

  if (!USER_ID) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0019" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "40px", display: "flex", flexDirection: "column", gap: "16px", minWidth: "300px" }}>
          <h2 style={{ color: "white", margin: 0, fontSize: "1.4rem" }}> Welcome to Memory AI</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", margin: 0, fontSize: "0.85rem" }}>Enter your name to get started</p>
          <input
            autoFocus
            placeholder="Your name..."
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "white", fontSize: "1rem", outline: "none" }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                const name = e.target.value.trim();
                localStorage.setItem("memory_ai_user", name);
                setUSER_ID(name);
                setUserName(name);
              }
            }}
          />
          <p style={{ color: "rgba(255,255,255,0.3)", margin: 0, fontSize: "0.75rem" }}>Press Enter to continue</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: t.bgColor, transition: "background 0.5s ease", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, opacity: t.mode === 'dark' ? 0.4 : 0.2, pointerEvents: "none" }}>
        <Aurora baseColor={t.accent} />
      </div>
      <div style={{ display: "flex", height: "100vh" }}>

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ x: -270, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -270, opacity: 0 }} transition={{ duration: 0.3 }}
              style={{ width: "255px", minWidth: "255px", ...glassStyle(t), borderRadius: "0 20px 20px 0", borderLeft: "none", display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 10 }}>

              <div style={{ padding: "18px 16px 12px", borderBottom: `1px solid ${t.border}` }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 800, margin: "0 0 2px" }}>
                  <span style={gradStyle}> Memory AI</span>
                </h2>
                <p style={{ color: t.subtext, fontSize: "0.67rem", margin: 0 }}>Remembers you always</p>
              </div>

              <div style={{ padding: "10px 12px 6px" }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => startNewChat(true)}
                  style={{ width: "100%", ...gs, borderRadius: "12px", padding: "10px 16px", color: t.text, fontWeight: 700, cursor: "pointer", fontSize: "0.84rem", textAlign: "left" }}>
                  <MessageSquarePlus size={16} style={{ marginRight: "8px" }} /> New Chat
                </motion.button>
              </div>

              <p style={{ color: t.subtext, fontSize: "0.63rem", letterSpacing: "1.5px", padding: "8px 16px 4px", margin: 0 }}>RECENT CHATS</p>

              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px", padding: "0 8px" }}>
                {sessions.length === 0 && <p style={{ color: t.subtext, fontSize: "0.74rem", padding: "8px" }}>No past chats yet</p>}
                {sessions.map((s, i) => (
                  <div key={s.session_id} style={{
                    display: "flex", alignItems: "center", gap: "2px", borderRadius: "10px",
                    background: s.session_id === sessionId ? (t.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.75)") : "transparent",
                    border: `1px solid ${s.session_id === sessionId ? t.border : "transparent"}`,
                  }}>
                    {editingId === s.session_id ? (
                      <input autoFocus value={editingTitle}
                        onChange={e => setEditingTitle(e.target.value)}
                        onBlur={() => saveTitle(s.session_id, editingTitle)}
                        onKeyDown={e => { if (e.key === "Enter") saveTitle(s.session_id, editingTitle); if (e.key === "Escape") setEditingId(null) }}
                        style={{ flex: 1, background: t.inputBg, border: `1px solid ${t.accent}`, borderRadius: "8px", padding: "7px 10px", color: t.text, fontSize: "0.73rem", outline: "none", margin: "4px" }}
                      />
                    ) : (
                      <motion.button
                        whileHover={{ background: t.mode === "dark" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.6)" }}
                        onClick={() => loadSession(s.session_id)}
                        style={{ flex: 1, background: "transparent", border: "none", padding: "9px 10px", color: t.text, cursor: "pointer", fontSize: "0.8rem", textAlign: "left", lineHeight: 1.4, borderRadius: "10px", fontWeight: 700 }}>
                        <div style={{ color: t.accent, fontSize: "0.61rem", marginBottom: "1px", fontWeight: 700 }}>
                          💬 {(() => { try { return new Date(parseInt(s.session_id.replace("session_", ""))).toLocaleDateString() } catch { return `Chat ${i + 1}` } })()}
                        </div>
                        {s.title || "New Chat"}
                      </motion.button>
                    )}
                    <div style={{ position: "relative", paddingRight: "4px" }}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === s.session_id ? null : s.session_id) }}
                        style={{ background: "transparent", border: "none", color: t.subtext, cursor: "pointer", padding: "4px", borderRadius: "6px" }}>
                       <MoreHorizontal size={16} />
                       </motion.button>
                       <AnimatePresence>
                         {openMenuId === s.session_id && (
                           <motion.div
                             initial={{ opacity: 0, scale: 0.9, y: -4 }}
                             animate={{ opacity: 1, scale: 1, y: 0 }}
                             exit={{ opacity: 0, scale: 0.9, y: -4 }}
                             transition={{ duration: 0.15 }}
                             style={{
                               position: "absolute", right: 0, top: "28px", zIndex: 100,
                               background: t.mode === "dark" ? "rgba(20,10,40,0.95)" : "rgba(255,255,255,0.98)",
                               border: `1px solid ${t.border}`, borderRadius: "12px",
                               padding: "6px", minWidth: "130px",
                               boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                               backdropFilter: "blur(12px)"
                            }}>
                            <motion.button
                              whileHover={{ background: t.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }}
                              onClick={e => { e.stopPropagation(); setOpenMenuId(null); setEditingId(s.session_id); setEditingTitle(s.title || ""); }}
                              style={{ width: "100%", background: "transparent", border: "none", borderRadius: "8px", padding: "8px 12px", color: t.text, cursor: "pointer", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "8px", textAlign: "left" }}>
                              <PencilIcon size={13} /> Rename
                            </motion.button>
                            <motion.button
                              whileHover={{ background: "rgba(239,68,68,0.1)" }}
                              onClick={e => { e.stopPropagation(); setOpenMenuId(null); deleteSession(e, s.session_id); }}
                              style={{ width: "100%", background: "transparent", border: "none", borderRadius: "8px", padding: "8px 12px", color: "#ef4444", cursor: "pointer", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "8px", textAlign: "left" }}>
                              <Trash2Icon size={13} /> Delete
                            </motion.button>
                          </motion.div>
                       )}
                    </AnimatePresence>
                  </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: `1px solid ${t.border}`, padding: "12px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: t.sendBtn, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, color: "white", flexShrink: 0 }}>{userName.charAt(0).toUpperCase()}</div>
                <div>
                  <p style={{ color: t.text, fontSize: "0.77rem", fontWeight: 600, margin: 0 }}>{userName}</p>
                  <p style={{ color: t.subtext, fontSize: "0.66rem", margin: 0 }}>{USER_ID}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSidebarOpen(o => !o)}
            style={{ position: "absolute", top: "18px", left: "12px", ...gs, borderRadius: "12px", padding: "6px 10px", color: t.accent, cursor: "pointer", fontSize: "0.85rem", zIndex: 10 }}>
            {sidebarOpen ? "◀" : "▶"}
          </motion.button>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate("/")}
            style={{ position: "absolute", top: "18px", right: "12px", ...gs, borderRadius: "12px", padding: "6px 10px", color: t.accent, cursor: "pointer", fontSize: "0.85rem", zIndex: 10 }}>
            Home
          </motion.button>


          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "16px 0", zIndex: 5 }}>
            <h1 style={{ fontSize: "clamp(1.3rem,2.5vw,1.9rem)", fontWeight: 900, margin: "0 0 6px" }}>
              <span style={gradStyle}>Memory AI </span>
            </h1>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
              <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ color: t.subtext, fontSize: "0.7rem", letterSpacing: "2px", margin: 0 }}>
                ✦ GEMINI 2.0 · VERTEX AI · FIRESTORE ✦
              </motion.p>

              {/* Theme Picker */}
              <div style={{ position: "relative" }}>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setShowThemes(o => !o)}
                  style={{ ...gs, borderRadius: "20px", padding: "5px 14px", color: t.text, fontWeight: 600, cursor: "pointer", fontSize: "0.73rem", display: "flex", alignItems: "center" }}>
                  <Palette size={16} style={{ marginRight: "8px" }} /> {t.name}
                </motion.button>
                <AnimatePresence>
                  {showThemes && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: "40px", ...gs, borderRadius: "18px", padding: "16px", zIndex: 100, width: "320px" }}>
                      <p style={{ color: t.subtext, fontSize: "0.6rem", letterSpacing: "1.5px", margin: "0 0 8px 2px" }}>🌙 DARK</p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "5px", marginBottom: "12px" }}>
                        {Object.entries(themes).filter(([, v]) => v.mode === "dark").map(([key, theme]) => (
                          <motion.button key={key} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                            onClick={() => changeTheme(key)}
                            style={{ background: themeKey === key ? theme.sendBtn : (t.mode === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"), border: `1px solid ${themeKey === key ? theme.accent : t.border}`, borderRadius: "10px", padding: "8px 3px", color: themeKey === key ? "white" : t.text, cursor: "pointer", fontSize: "0.6rem", fontWeight: 600, textAlign: "center" }}>
                            {theme.name}
                          </motion.button>
                        ))}
                      </div>
                      <p style={{ color: t.subtext, fontSize: "0.6rem", letterSpacing: "1.5px", margin: "0 0 8px 2px" }}>☀️ LIGHT</p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "5px" }}>
                        {Object.entries(themes).filter(([, v]) => v.mode === "light").map(([key, theme]) => (
                          <motion.button key={key} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                            onClick={() => changeTheme(key)}
                            style={{ background: themeKey === key ? theme.sendBtn : (t.mode === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"), border: `1px solid ${themeKey === key ? theme.accent : t.border}`, borderRadius: "10px", padding: "8px 3px", color: themeKey === key ? "white" : t.text, cursor: "pointer", fontSize: "0.6rem", fontWeight: 600, textAlign: "center" }}>
                            {theme.name}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Chat Box */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Top Bar */}
            <div style={{ padding: "11px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: t.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: "7px", height: "7px", borderRadius: "50%", background: t.dot, boxShadow: `0 0 8px ${t.dot}` }} />
                <span style={{ color: t.accent, fontSize: "0.76rem", fontWeight: 600, letterSpacing: "1px" }}>MEMORY AI · ACTIVE</span>
              </div>
              <span style={{ color: t.subtext, fontSize: "0.7rem" }}>⚡ {memoryCount} memories</span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", maxWidth: "820px", width: "100%", margin: "0 auto" }}>
              <AnimatePresence mode="wait">
                {messages.length === 0 ? (
                  <ThoughtOfDay key="thought" t={t} />
                ) : (
                  <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {messages.map((msg, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                        style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                        <div style={{
                          maxWidth: "75%", padding: "12px 16px",
                          borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                          background: msg.role === "user" ? t.userBubble : (t.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.72)"),
                          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                          border: msg.role === "assistant" ? `1px solid ${t.border}` : "none",
                          color: msg.role === "user" ? "white" : t.text,
                          fontSize: "0.91rem", lineHeight: 1.65,
                          boxShadow: msg.role === "user" ? `0 4px 20px ${t.accentGlow}` : `0 2px 8px rgba(0,0,0,0.05)`
                        }}>
                          {msg.role === "assistant" && (
                            <div style={{ fontSize: "0.62rem", color: t.accent, marginBottom: "4px", fontWeight: 700, letterSpacing: "1.5px" }}>✦ MEMORY AI</div>
                          )}
                          <CodeMessage content={msg.content} darkMode={t.mode === "dark"} t={t} />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: "flex", gap: "6px", padding: "12px 16px", background: t.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.72)", backdropFilter: "blur(12px)", borderRadius: "18px 18px 18px 4px", width: "fit-content", border: `1px solid ${t.border}` }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                      style={{ width: "7px", height: "7px", borderRadius: "50%", background: t.accent, boxShadow: `0 0 6px ${t.accent}` }} />
                  ))}
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "13px 16px", borderTop: `1px solid ${t.border}`, display: "flex", gap: "10px", background: t.mode === "dark" ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.35)", backdropFilter: "blur(10px)", maxWidth: "820px", width: "100%", margin: "0 auto" }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                style={{ flex: 1, background: t.inputBg, backdropFilter: "blur(10px)", border: `1px solid ${t.border}`, borderRadius: "14px", padding: "12px 16px", color: t.text, fontSize: "0.9rem", outline: "none" }}
                onFocus={e => e.target.style.borderColor = t.accent}
                onBlur={e => e.target.style.borderColor = t.border}
              />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={sendMessage} disabled={loading}
                style={{ ...gs, borderRadius: "14px", padding: "12px 22px", color: t.text, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontSize: "0.9rem", opacity: loading ? 0.7 : 1 }}>
                {loading ? "..." : "Send ✦"}
              </motion.button>
            </div>
          </motion.div>

          <p style={{ color: t.subtext, fontSize: "0.66rem", padding: "10px", opacity: 0.5, textAlign: "center" }}>
            Powered by Gemini 2.0 · Firestore · Vertex AI
          </p>
        </div>
      </div>
    </div>
  )
}