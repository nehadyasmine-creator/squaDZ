# PROJET HACKATHON EPF - EPF RAG Assistant

## À propos

Ce projet a été réalisé dans le cadre du hackathon EPF. Il combine :
- une API **FastAPI** ;
- un moteur RAG pour retrouver les extraits de cours pertinents ;
- le modèle **GLM-5.3-Flash** de Z.AI pour générer les réponses ;
- une documentation Swagger directement accessible depuis l'API.

## Lancer la partie Backend & IA

### 1. Installer les dépendances

Depuis la racine du projet :

```bash
pip install -r requirements.txt
```

### 2. Lancer l'API

```bash
uvicorn app:app --reload
```

L'API est alors disponible à l'adresse `http://127.0.0.1:8000`.

La documentation interactive est disponible dans Swagger UI :(http://127.0.0.1:8000/docs)



## 2. Partie Data & Indexation 



## 3. Partie Frontend & Déploiement Cloud


## Ressources
- Google Doc du projet : https://docs.google.com/document/d/1myFolo8XYt-GVdhv70WXydvFMq8WGzxfzMNzHik3y3s/edit?usp=sharing

- Clé API Z.AI (GLM-5.3-Flash) : 0f1fbf3a15834367bde8d67374162335.gwIsj29sxso9gNZl


## Équipe
Solene Martinez
Adam Benlaharche
Yasmine Nehad