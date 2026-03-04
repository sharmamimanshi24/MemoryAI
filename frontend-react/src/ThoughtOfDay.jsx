import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const FALLBACK_QUOTES = [
  { quote: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { quote: "We suffer more in imagination than in reality.", author: "Seneca" },
  { quote: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { quote: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { quote: "The obstacle is the path.", author: "Zen Proverb" }
]

export default function ThoughtOfDay({ t }) {
  const [thought, setThought] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchQuote() {
      try {
        // Free quote API - no key needed
const res = await fetch("/quote")
const data = await res.json()
if (data[0] && data[0].q) {
  setThought({ quote: data[0].q, author: data[0].a })
} else {
  throw new Error("no quote")
}
      } catch {
        // Fallback to local if API fails
        const random = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
        setThought(random)
      } finally {
        setLoading(false)
      }
    }
    fetchQuote()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", textAlign: "center" }}
    >
      

      <p style={{ color: t.accent, fontSize: "0.65rem", letterSpacing: "3px", fontWeight: 700, marginBottom: "24px", opacity: 0.8 }}>
        THOUGHT OF THE DAY
      </p>

      {loading ? (
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}
          style={{ color: t.subtext, fontSize: "0.85rem" }}>
          fetching today's thought...
        </motion.div>
      ) : (
        <>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
            style={{ color: t.text, fontSize: "clamp(1rem,2.5vw,1.35rem)", fontWeight: 600, lineHeight: 1.75, maxWidth: "580px", marginBottom: "20px", fontStyle: "italic" }}
          >
            "{thought.quote}"
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
            style={{ color: t.accent, fontSize: "0.85rem", fontWeight: 600, marginBottom: "40px" }}
          >
            — {thought.author}
          </motion.p>
        </>
      )}

      <motion.p
        animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ color: t.subtext, fontSize: "0.72rem", letterSpacing: "1px" }}
      >
        ✦ start typing to begin your session
      </motion.p>
    </motion.div>
  )
}
