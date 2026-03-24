# 🧠 Memory AI

> An AI assistant that actually remembers you — across every conversation, forever.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Built With](https://img.shields.io/badge/built%20with-Gemini%202.0-blue)
![Cloud](https://img.shields.io/badge/cloud-Google%20Cloud%20Run-orange)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
![Made By](https://img.shields.io/badge/made%20by-Mimanshi%20Sharma-ff69b4)

Most AI chatbots forget everything the moment you close the tab. **Memory AI** is different — it builds a persistent, growing understanding of who you are. Your projects, your preferences, your decisions — remembered across every session, forever. Built as a full-stack AI system using Google Cloud infrastructure, Gemini 2.0 Flash, and semantic memory retrieval.

🌍 **Live Demo:** [memory-ai-671546906215.us-central1.run.app](https://memory-ai-671546906215.us-central1.run.app)
💻 **GitHub:** [github.com/sharmamimanshi24/MemoryAI](https://github.com/sharmamimanshi24/MemoryAI)

---

## 📑 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [How Memory Works](#-how-memory-works)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [Author & Acknowledgments](#-author--acknowledgments)
- [Support](#-support)
- [Project Status](#-project-status)

---

## ✨ Features

- 🧠 **Persistent Memory** — remembers your projects, preferences, and context across all sessions
- 🔍 **Semantic Search** — finds relevant memories using meaning, not just keywords
- 💻 **Code Highlighting** — syntax highlighting for Python, JavaScript, HTML, SQL, Bash, and more
- 🎨 **Choose your own Themes** — 5 dark, 5 light with glassmorphic UI design
- 💡 **Thought of the Day** — fresh quote on every new session
- 🗂️ **Session Management** — create, rename, and delete chat sessions
- 🚀 **Landing Page** — full product page with Aurora background and animated components
- 😤 **Grumpy AI Personality** — witty, no-nonsense responses with full context awareness
- 👤 **Per-user Memory** — each user gets their own isolated memory space

---

## UI Showcase
## 🏠 Landing Page
The landing page features a high-performance animated hero section and a clear entry point into the persistent chat environment. There are 2 modes as well- light and dark.
<img src="https://github.com/user-attachments/assets/82a422c6-fde2-4c60-98a9-a2196a723e37" width="100%" alt="MemoryAI Landing Page Hero Section">
<img width="1920" height="1080" alt="Screenshot (56)" src="https://github.com/user-attachments/assets/f65e1693-ba93-4e8c-aa28-528e0fcb8c12" />

## 🔐 User Onboarding
Simple name-based entry to retrieve personalized long-term memories.
<img width="1920" height="1080" alt="Screenshot (58)" src="https://github.com/user-attachments/assets/f91b6a53-d676-433c-8a6f-287b7073c38c" />

## 💬 Chat Interface & Memory in Action
The core chat experience where the system actively retrieves and utilizes your past context. There are various themes that you can choose along with the "Thought of the Day".
<img width="1920" height="1080" alt="Screenshot (57)" src="https://github.com/user-attachments/assets/3d973bce-5996-4233-b3dc-0df9797f5c64" />

---

## 🛠️ Tech Stack

### AI & Cloud
| Technology | Purpose |
|---|---|
| **Gemini 2.0 Flash** | Core language model |
| **Vertex AI** | Text embedding generation for semantic search |
| **Google Cloud Firestore** | NoSQL database for chat history + long-term memories |
| **Google Cloud Run** | Serverless container deployment |
| **Google Cloud Build** | Automated container builds on deploy |

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** | Python web framework for REST API |
| **Python 3.11** | Runtime |
| **httpx** | Async HTTP client |
| **uvicorn** | ASGI server |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool and dev server |
| **Framer Motion** | Animations and transitions |
| **React Router v6** | Client-side routing (Landing → Chat) |
| **lucide-react** | Icon library |

---

## 🏗️ Architecture

```
User Browser
     │
     ▼
React Frontend
     │
     ▼
FastAPI Backend (Cloud Run)
     │
     ├──► Gemini 2.0 Flash (Vertex AI) — response generation
     ├──► Vertex AI Embeddings — semantic memory search
     └──► Firestore — session storage + memory storage
```

### Request Flow
1. User sends a message from the React frontend
2. FastAPI receives `POST /chat` with `user_id`, `session_id`, `message`
3. Relevant memories are retrieved using vector similarity search (cosine similarity)
4. System prompt is built with user profile + top memories + AI personality
5. Gemini 2.0 Flash generates a response with full context
6. Response is saved to Firestore and returned to frontend
7. Memory extraction runs to update long-term memories for future sessions

---

## 🧠 How Memory Works

**Short-term** — every message in the current session is passed as conversation history to Gemini.

**Long-term** — after each turn, key facts are extracted and stored as memory documents in Firestore with their vector embeddings.

**Retrieval** — on each new message, the user's input is embedded and compared against all stored memory embeddings using cosine similarity. The top-k most relevant memories are injected into the system prompt.

```python
# Simplified memory retrieval
def get_relevant_memories(user_id: str, query: str, top_k: int = 5):
    query_embedding = embed_text(query)
    memories = db.collection("memories").where("user_id", "==", user_id).stream()
    scored = [(cosine_similarity(query_embedding, m.embedding), m) for m in memories]
    return sorted(scored, reverse=True)[:top_k]
```

---

## ⚙️ Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- Google Cloud account with Vertex AI and Firestore enabled
- `gcloud` CLI installed

### Clone the repo
```bash
git clone https://github.com/sharmamimanshi24/MemoryAI.git
cd MemoryAI
```

### Backend setup
```bash
pip install -r backend/requirements.txt
```

### Frontend setup
```bash
cd frontend-react
npm install
npm run dev
```

### Environment
Create a `config/settings.py` with your Google Cloud project details:
```python
PROJECT_ID = "your-project-id"
LOCATION = "us-central1"
GEMINI_MODEL = "gemini-2.0-flash-001"
```

---

## 🚀 Usage

1. Open the live app or run locally
2. Enter your name on the welcome screen
3. Start chatting — the AI will remember facts about you
4. Open a new session anytime — your memories carry over automatically
5. Manage sessions from the sidebar (rename, delete)

---

## 📡 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/chat` | POST | Send message, get AI reply |
| `/sessions/{user_id}` | GET | List all sessions |
| `/sessions/{user_id}/{session_id}/messages` | GET | Load session history |
| `/sessions/{user_id}/{session_id}` | DELETE | Delete session |
| `/memories/{user_id}` | GET | Get all memories |
| `/quote` | GET | Fetch thought of the day |
| `/health` | GET | Health check |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repo
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please keep code clean and consistent with the existing style.

---



## 👩‍💻 Author & Acknowledgments

**Mimanshi Sharma** — AI/ML Engineering

- Built on Google Cloud infrastructure
- Powered by Gemini 2.0 Flash
- Inspired by the idea that AI should know you, not forget you

---

## 🆘 Support

If you run into issues:
- Open an issue on [GitHub](https://github.com/sharmamimanshi24/MemoryAI/issues)
- Or reach out via LinkedIn

---

## 📌 Project Status

🟢 **Actively maintained** — March 2026

Features in progress:
- Google login
- Image/file upload and analysis
- Audio input using @Sarvam.ai
  
