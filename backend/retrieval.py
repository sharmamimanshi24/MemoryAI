from google.cloud import firestore
import numpy as np
import sys
import os
sys.path.append('/home/' + os.environ.get('USER', '') + '/memory-ai-system')
from config.settings import PROJECT_ID, USERS_COLLECTION
from backend.memory import get_embedding

db = firestore.Client(project=PROJECT_ID)

def cosine_similarity(vec1: list, vec2: list) -> float:
    """Calculate how similar two embeddings are (0 = different, 1 = identical)"""
    a = np.array(vec1)
    b = np.array(vec2)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

def retrieve_memories(user_id: str, query: str, top_k: int = 5) -> list:
    """Find the most relevant past memories for a given query"""
    query_embedding = get_embedding(query)

    # Get all memories for this user from Firestore
    memories_ref = db.collection(USERS_COLLECTION)\
                     .document(user_id)\
                     .collection("memories")\
                     .stream()

    scored = []
    for mem in memories_ref:
        data = mem.to_dict()
        score = cosine_similarity(query_embedding, data["embedding"])
        scored.append((score, data))

    # Sort by similarity score, return top_k
    scored.sort(key=lambda x: x[0], reverse=True)
    return [data for score, data in scored[:top_k]]

def get_user_profile(user_id: str) -> dict:
    """Get the user's stored profile facts"""
    doc = db.collection(USERS_COLLECTION).document(user_id).get()
    return doc.to_dict() if doc.exists else {}
