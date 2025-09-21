# Mistral Document QA App

## Description

Mistral is a full-stack web application for document processing and question-answering (RAG).
- **Backend**: Python/FastAPI handling PDF extraction, FAISS vector indexing, and Mistral API integration for answers.
- **Frontend**: React/TypeScript/Vite allowing file uploads, asking questions, and viewing responses.

---

## Branches Overview

- **main**: Stable branch.
- **backend**: Core backend development.
- **backend-tests**: Backend with testing features.
- **backend-performance**: Optimized backend (batch embeddings, etc.).
- **frontend**: Frontend development.
- **rag-feature**: Retrieval-Augmented Generation (RAG) feature integration.
- **devops**: Dockerfiles and docker-compose for deployment.

---

## Running the App

### 1. Manual (Development Mode)

#### Backend
```bash
cd backend
pip install -r requirements.txt
```

Create `.env` inside `backend/app/` with your credentials:
```
MISTRAL_API_KEY=your_api_key
MISTRAL_API_URL = https://api.mistral.ai/v1/chat/completions
MISTRAL_EMBED_URL = https://api.mistral.ai/v1/embeddings
MODEL = mistral-small-latest
```

Run backend:
```bash
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### 2. Using Docker

#### ENV
Create `.env` inside `backend/app/` with your credentials:
```
MISTRAL_API_KEY=your_api_key
MISTRAL_API_URL = https://api.mistral.ai/v1/chat/completions
MISTRAL_EMBED_URL = https://api.mistral.ai/v1/embeddings
MODEL = mistral-small-latest
```

#### Build & Run
```bash
docker compose up --build
```

- Backend: [http://localhost:8000](http://localhost:8000)
- Frontend: [http://localhost:5173](http://localhost:5173)

---

## Testing Backend
```bash
cd backend
pytest -v
```

---

## Project Structure

```
mistral/
├─ backend/
│  ├─ app/
│  ├─ tests/
│  ├─ requirements.txt
│  └─ Dockerfile
├─ frontend/
│  ├─ src/
│  ├─ public/
│  ├─ package.json
│  └─ Dockerfile
├─ docker-compose.yml
└─ README.md
```

---

## Author

Ismail Ahakay
