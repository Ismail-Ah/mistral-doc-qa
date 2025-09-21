import pytest

@pytest.mark.asyncio
async def test_ask_question(async_client):
    response = await async_client.post("/ask", params={"question": "What is AI?"})
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
