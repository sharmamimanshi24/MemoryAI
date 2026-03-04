import os
os.environ["GOOGLE_CLOUD_PROJECT"] = "memory-ai-system"
os.environ["GOOGLE_CLOUD_LOCATION"] = "us-central1"
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "TRUE"

from google.adk.agents import Agent
from google.adk.tools import FunctionTool
import sys
sys.path.append('/home/' + os.environ.get('USER', '') + '/memory-ai-system')
from backend.memory import save_memory, save_user_profile
from backend.retrieval import retrieve_memories, get_user_profile

def get_my_profile(user_id: str) -> dict:
    """Get the user's stored profile and preferences."""
    return get_user_profile(user_id)

def get_my_memories(user_id: str, query: str) -> list:
    """Search past memories relevant to a query."""
    memories = retrieve_memories(user_id, query, top_k=5)
    return [m['text'] for m in memories]

def save_my_memory(user_id: str, text: str) -> str:
    """Save an important fact to long-term memory."""
    save_memory(user_id, text, memory_type="user_confirmed")
    return f"Saved to memory: {text}"

def update_my_profile(user_id: str, key: str, value: str) -> str:
    """Update a user profile fact."""
    save_user_profile(user_id, {key: value})
    return f"Profile updated: {key} = {value}"

root_agent = Agent(
    name="memory_ai_assistant",
    model="gemini-2.0-flash-001",
    description="A personal AI assistant that remembers you across sessions.",
    instruction="""
    You are a helpful, friendly personal AI assistant with long-term memory.
    
    At the start of each conversation:
    1. Use get_my_profile with user_id='user_001' to load the user's profile
    2. Use get_my_memories with user_id='user_001' to find relevant past context
    3. Greet them naturally based on what you know
    
    During conversation:
    - Answer any question on any topic
    - If the user shares something important, use save_my_memory to store it
    - If the user shares a preference, use update_my_profile to store it
    - Never force conversations back to one topic
    - Be natural, helpful and conversational like Claude or ChatGPT
    
    You can help with: coding, writing, analysis, planning, general questions, 
    project advice, brainstorming — anything!
    """,
    tools=[
        FunctionTool(get_my_profile),
        FunctionTool(get_my_memories),
        FunctionTool(save_my_memory),
        FunctionTool(update_my_profile),
    ]
)
