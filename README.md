# PROJET HACKATHON EPF - EPF RAG Assistant

## À propos

Ce projet a été réalisé dans le cadre du hackathon EPF. Il combine :
- une API **FastAPI** ;
- un moteur RAG pour retrouver les extraits de cours pertinents ;
- le modèle **GLM-5.3-Flash** de Z.AI pour générer les réponses ;
- une documentation Swagger directement accessible depuis l'API.

## 1. La partie Backend & IA

### 1. Installer les dépendances

Depuis la racine du projet :

```bash
pip install -r requirements.txt
```
### 2. Créer fichier .env

Créer un fichier .env
Mettre dedans : ZAI_API_KEY=cle api presente dans le google doc

### 3. Lancer l'API

```bash
uvicorn app:app --reload
```

L'API est alors disponible à l'adresse `http://127.0.0.1:8000`.

La documentation interactive est disponible dans Swagger UI :(http://127.0.0.1:8000/docs)



## 2. Partie Data & Indexation 



## 3. Partie Frontend & Déploiement Cloud

Frontend Angular dans [`SquaDZ/`](SquaDZ/), structuré avec [Spec Kit](https://github.com/github/spec-kit)
(voir `SquaDZ/.specify/memory/constitution.md` et `SquaDZ/specs/`).

### Lancer le frontend en local

```bash
cd SquaDZ
npm install
npm start
```

Le front est alors disponible sur `http://localhost:4200` et appelle le backend FastAPI sur
`http://localhost:8000` (URL configurable dans `SquaDZ/src/environments/`). Le backend doit tourner
en parallèle (voir section 1 ci-dessus) et autoriser les requêtes cross-origin depuis `localhost:4200`
(middleware CORS déjà ajouté dans `app.py`).

### Lancer les tests

```bash
cd SquaDZ
npm test
```

Déploiement cloud : à faire (Vercel/Render conseillés, cf. contraintes du hackathon).

## Ressources
- Google Doc du projet : https://docs.google.com/document/d/1myFolo8XYt-GVdhv70WXydvFMq8WGzxfzMNzHik3y3s/edit?usp=sharing
- Clé API Z.AI (GLM-5.3-Flash) : voir le Google Doc du projet (ne pas la remettre ici, cf. section 1 pour la config `.env`)


## Équipe
Solene Martinez
Adam Benlaharche
Yasmine Nehad