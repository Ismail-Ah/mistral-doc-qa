import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.rag import add_chunks_to_index

client = TestClient(app)

@pytest.fixture
def setup_index():
    dummy_chunks = ["This is a test document.", "It contains some text."]
    add_chunks_to_index(dummy_chunks)

def test_ask_question(setup_index):
    response = client.post("/ask", params={"question": "What is this document about?"})
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    print(data)
