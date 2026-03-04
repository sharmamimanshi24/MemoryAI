import vertexai
from vertexai.language_models import TextEmbeddingModel
from google.cloud import firestore
import datetime
import sys
sys.path.append('/home/' + __import__('os').environ.get('USER', '') + '/memory-ai-system')
from config.settings import PROJECT_ID, LOCATION, EMBEDDING_MODEL, USERS_COLLECTION, SESSIONS_COLLECTION

# Initialize
vertexai.init(project=PROJECT_ID, location=LOCATION)
db = firestore.Client(project=PROJECT_ID)

def get_embedding(text: str) -> list:
    """Convert any text into a vector (list of numbers)"""
    model = TextEmbeddingModel.from_pretrained(EMBEDDING_MODEL)
    embeddings = model.get_embeddings([text])
    return embeddings[0].values

def save_memory(user_id: str, text: str, memory_type: str, metadata: dict = {}):
    """Save a memory to Firestore"""
    embedding = get_embedding(text)
    doc = {
        "text": text,
        "embedding": embedding,
        "type": memory_type,
        "metadata": metadata,
        "timestamp": datetime.datetime.utcnow(),
        "user_id": user_id
    }
    db.collection(USERS_COLLECTION)\
      .document(user_id)\
      .collection("memories")\
      .add(doc)
    print(f"Memory saved: {text[:50]}...")
    return doc

def save_user_profile(user_id: str, facts: dict):
    """Save or update user profile facts"""
    db.collection(USERS_COLLECTION)\
      .document(user_id)\
      .set(facts, merge=True)
    print(f"Profile updated for {user_id}")
