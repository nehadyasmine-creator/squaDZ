from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
api_key=os.getenv("ZAI_API_KEY"),
base_url="https://open.bigmodel.cn/api/paas/v4/"
)

def generer_reponse_rag(question_utilisateur, chunks_documents):
    contexte_fusionne = "\n---\n".join(chunks_documents)

    prompt_systeme = (
            "Tu es un assistant pédagogique intelligent pour l'école EPF. "
            "Tu dois répondre aux questions en te basant STRICTEMENT "
            "sur les extraits de cours fournis dans le contexte. "
            "Ne répète jamais la question au début de ta réponse et ne mets aucun titre reprenant la question. "
            "Commence directement par le contenu de la réponse. "
            "Si la réponse n'y est pas, dis clairement que l'information "
            "ne se trouve pas dans les documents de l'EPF."
        )
    

    prompt_utilisateur = f"Contexte des cours EPF :\n{contexte_fusionne}\n\nQuestion de l'étudiant : {question_utilisateur}"

    response = client.chat.completions.create(
        model="glm-5.3-flash",
        messages=[
            {"role": "system", "content": prompt_systeme},
            {"role": "user", "content": prompt_utilisateur}
        ],
        temperature=0.3,
        max_tokens=1024
    )

    return response.choices[0].message.content
