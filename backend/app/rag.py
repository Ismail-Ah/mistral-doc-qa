import os
import faiss
import numpy as np
from dotenv import load_dotenv
import requests

load_dotenv()
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
MISTRAL_API_URL = os.getenv("MISTRAL_API_URL")
MISTRAL_EMBED_URL = os.getenv("MISTRAL_EMBED_URL")



def embed_text(text: str):
    headers = {"Authorization": f"Bearer {MISTRAL_API_KEY}"}
    payload = {"model": "mistral-embed", "input": [text]}
    resp = requests.post(MISTRAL_EMBED_URL, headers=headers, json=payload)
    resp.raise_for_status()
    return np.array(resp.json()["data"][0]["embedding"], dtype=np.float32)

def add_chunks_to_index(text_chunks):
    global chunks, index
    chunks = text_chunks

    # get embedding of the first chunk
    first_embed = embed_text(chunks[0])
    dim = first_embed.shape[0] # embeding dimension

    # create FAISS index with correct dimension
    index = faiss.IndexFlatL2(dim)

    # embed all chunks
    embeddings = [embed_text(c) for c in chunks]
    index.add(np.stack(embeddings))



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
        "model": "mistral-small-latest",  # your working model
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
