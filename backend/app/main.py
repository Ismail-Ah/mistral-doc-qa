from fastapi import FastAPI, UploadFile, File
from app.utils import extract_text_from_pdf, chunk_text

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
    return {"filename": file.filename, "chunks": len(chunks)}

@app.post("/ask")
async def ask_question(question: str):
    return {"question": question, "answer": "This will be powered by Mistral soon!"}
