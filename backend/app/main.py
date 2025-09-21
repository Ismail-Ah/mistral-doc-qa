from fastapi import FastAPI, UploadFile, File
from app.utils import extract_text_from_pdf, chunk_text
from app.rag import add_chunks_to_index, query_rag

app = FastAPI(title="Mistral Document Q&A")

@app.get("/")
def root():
    return {"message": "Welcome to Mistral Document Q&A API"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()
    with open(f"temp_{file.filename}", "wb") as f:
        f.write(content)
    text = extract_text_from_pdf(f"temp_{file.filename}")
    chunks = chunk_text(text)
    add_chunks_to_index(chunks)
    return {"filename": file.filename, "chunks": len(chunks)}

@app.post("/ask")
async def ask_question(question: str):
    answer = query_rag(question)
    return {"question": question, "answer": answer}
