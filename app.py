import chainlit as cl
import vertexai
from vertexai.generative_models import GenerativeModel
import sys
sys.path.append('.')
from config.settings import PROJECT_ID, LOCATION, GEMINI_MODEL
from backend.memory import save_memory, save_user_profile
from backend.retrieval import retrieve_memories, get_user_profile

vertexai.init(project=PROJECT_ID, location=LOCATION)

@cl.on_chat_start
async def start():
    # Get user profile from memory
    profile = get_user_profile('user_001')
    name = profile.get('name', 'there')
    
    # Store chat history in session
    cl.user_session.set("history", [])
    cl.user_session.set("user_id", "user_001")
    
    await cl.Message(
        content=f"Hey {name}! I'm your Memory AI assistant. I remember your context across sessions. What would you like to work on today?"
    ).send()

@cl.on_message
async def main(message: cl.Message):
    user_id = cl.user_session.get("user_id")
    history = cl.user_session.get("history")
    
    # Retrieve relevant memories
    memories = retrieve_memories(user_id, message.content, top_k=5)
    profile = get_user_profile(user_id)
    
    # Build system prompt
    system_prompt = "You are a helpful AI assistant with memory.\n\n"
    if profile:
        system_prompt += "USER PROFILE:\n"
        for key, value in profile.items():
            system_prompt += f"- {key}: {value}\n"
        system_prompt += "\n"
    if memories:
        system_prompt += "RELEVANT PAST CONTEXT:\n"
        for mem in memories:
            system_prompt += f"- {mem['text']}\n"
        system_prompt += "\n"
    system_prompt += "Be natural, helpful and conversational. Don't always bring up the project unless relevant."

    # Build conversation history
    model = GenerativeModel(GEMINI_MODEL, system_instruction=system_prompt)
    chat = model.start_chat(history=history)
    
    # Stream response
    msg = cl.Message(content="")
    await msg.send()
    
    response = chat.send_message(message.content, stream=True)
    full_reply = ""
    for chunk in response:
        if chunk.text:
            full_reply += chunk.text
            await msg.stream_token(chunk.text)
    
    await msg.update()
    
    # Update history
    history.append({"role": "user", "parts": [message.content]})
    history.append({"role": "model", "parts": [full_reply]})
    cl.user_session.set("history", history)
    
    # Save to memory
    save_memory(
        user_id=user_id,
        text=f"User: {message.content} | Assistant: {full_reply[:200]}",
        memory_type="episodic",
        metadata={"session": "chainlit"}
    )
