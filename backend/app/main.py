from fastapi import FastAPI, UploadFile, File
from app.utils import extract_text_from_pdf, chunk_text
from app.rag import add_chunks_to_index, query_rag
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mistral Document Q&A")

# Allow CORS
origins = [
    "*" 
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # origins allowed to make requests
    allow_credentials=True,
    allow_methods=["*"],     # GET, POST, etc.
    allow_headers=["*"],     # headers like Content-Type, Authorization
)

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
