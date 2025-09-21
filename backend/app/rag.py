import os
import faiss
import numpy as np
from dotenv import load_dotenv
import requests

load_dotenv()
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
MISTRAL_API_URL = os.getenv("MISTRAL_API_URL")
MISTRAL_EMBED_URL = os.getenv("MISTRAL_EMBED_URL")
MODEL = os.getenv("MODEL")

def embed_text(texts: list[str]):
    headers = {"Authorization": f"Bearer {MISTRAL_API_KEY}"}
    payload = {"model": "mistral-embed", "input": texts}
    resp = requests.post(MISTRAL_EMBED_URL, headers=headers, json=payload)
    resp.raise_for_status()
    return np.array([d["embedding"] for d in resp.json()["data"]], dtype=np.float32)


def add_chunks_to_index(text_chunks: list[str]):
    global chunks, index
    chunks = text_chunks

    # embed all chunks in one request
    embeddings = embed_text(chunks)

    # get dimension from embeddings
    dim = embeddings.shape[1]

    # create FAISS index with correct dimension
    index = faiss.IndexFlatL2(dim)

    # add all embeddings to index
    index.add(embeddings)



def query_rag(question: str, top_k=3):
    """Query uploaded documents and get an answer from Mistral chat API."""
    if index.ntotal == 0:
        return "No documents uploaded."

    # Find relevant chunks
    q_embed = embed_text(question).reshape(1, -1)
    D, I = index.search(q_embed, top_k)
    valid_indices = [i for i in I[0] if i < len(chunks)]
    if not valid_indices:
        return "No relevant chunks found."

    context = " ".join([chunks[i] for i in valid_indices])

    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL, 
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"Answer the question using this context:\n{context}\nQuestion: {question}"}
        ],
        "temperature": 0.7,
        "max_tokens": 512
    }

    resp = requests.post(MISTRAL_API_URL, headers=headers, json=payload)

    if resp.status_code != 200:
        print("Mistral API error:", resp.text)
    resp.raise_for_status()

    return resp.json()["choices"][0]["message"]["content"]
