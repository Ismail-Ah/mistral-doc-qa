import fitz

def extract_text_from_pdf(pdf_path: str) -> str:
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def chunk_text(text: str, chunk_size: int = 500):
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
