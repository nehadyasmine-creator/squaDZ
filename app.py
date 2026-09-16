from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_engine import generer_reponse_rag
from vector_db import chercher_documents_epf

app = FastAPI(title="EPF RAG API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

class QueryRequest(BaseModel):
    question: str

@app.post("/ask")
def poser_question(request: QueryRequest):
    try:
        # On récupère les chunks via la passerelle
        chunks_recuperes = chercher_documents_epf(request.question)

        # On génère la réponse avec le LLM Z.AI
        reponse = generer_reponse_rag(request.question, chunks_recuperes)
        return {"question": request.question, "reponse": reponse}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur interne : {str(e)}")