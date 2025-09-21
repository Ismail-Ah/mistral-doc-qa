import io
import pytest
from reportlab.pdfgen import canvas

@pytest.mark.asyncio
async def test_upload_file(async_client):
    # Create a small valid PDF in memory
    pdf_buffer = io.BytesIO()
    c = canvas.Canvas(pdf_buffer)
    c.drawString(100, 750, "Hello, world!")
    c.save()
    pdf_buffer.seek(0) 

    response = await async_client.post(
        "/upload",
        files={"file": ("test.pdf", pdf_buffer, "application/pdf")}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == "test.pdf"
    assert isinstance(data["chunks"], int)
