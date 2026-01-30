AI Document Orchestrator

This repository contains a simple MERN-style app (Express backend + Vite + React frontend) for extracting information from documents using an LLM.

This file explains how to deploy the frontend to Vercel (or Netlify) and the backend to Render, how to set environment variables securely, and where to find sample documents for testing.

IMPORTANT: Never commit real secrets. Use the service dashboards (Render / Vercel / Netlify) to set environment variables. Use the provided `.env.example` files locally.

Quick links to sample documents for testing:
- https://www.orimi.com/pdf-test.pdf
- https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf
- https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf

Local setup
1. Backend
	- Copy `backend/.env.example` to `backend/.env` and set `OPENAI_API_KEY` (or leave `TEST_MODE=true` for mock responses).
	- Install and run:

```bash
cd backend
npm install
npm run dev
```

2. Frontend
	- Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` (e.g. `http://localhost:4000`).
	- Install and run:

```bash
cd frontend
npm install
npm run dev
```

Deploying

Backend (Render)
- Push the repo to GitHub.
- Create a new Web Service on Render and connect your GitHub repo.
- In Render service settings set:
  - Start Command: `npm start`
  - Environment: `Node`
  - Build Command: `npm install`
- In the Render dashboard add environment variables (do NOT commit them): `OPENAI_API_KEY` and `TEST_MODE` (optional).
- Optionally use `backend/render.yaml` when creating the service via Render's spec support.

Frontend (Vercel or Netlify)
- Connect the `frontend` folder as a separate project to Vercel or Netlify (select the frontend subfolder when prompted).
- Set environment variable `VITE_API_URL` in Vercel/Netlify to your backend URL (Render-provided URL), for example `https://your-backend.onrender.com`.
- Build command: `npm run build`. Publish directory: `dist`.

Notes on environment variables and security
- Keep secrets out of source control. Use `.env` locally and `.env.example` in repo.
- In Render/Vercel/Netlify set environment variables in the project settings UI.

If you'd like, I can attempt to deploy the services for you if you provide repo access or connect the services — otherwise follow these steps and paste back the Render/Vercel URLs and I will verify integration.

CI / GitHub Actions
-------------------

This repository includes a simple GitHub Actions workflow that installs dependencies and builds the frontend on push and pull requests. The workflow ensures the frontend builds correctly and that backend dependencies install successfully.

Files:
- `.github/workflows/ci.yml` — installs dependencies for `frontend` and `backend` and runs `npm run build` for the frontend.

You can customize the workflow in `.github/workflows/ci.yml` to add tests, linting, or deployment steps.

