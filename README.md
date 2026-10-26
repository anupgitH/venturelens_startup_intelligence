# 🚀 VentureLens — AI Startup Idea Validator

**Validate your startup idea. Understand the risks. Plan your next move.**

VentureLens is an AI-powered startup idea validation platform that helps aspiring entrepreneurs evaluate business ideas and generate structured insights using Google Gemini. It provides a foundation for analyzing startup feasibility, identifying potential risks, and organizing ideas for further research.

## ✨ Features

- 🤖 **AI-Powered Analysis** — Generate startup validation reports using Google Gemini.
- 📊 **Startup Evaluation** — Receive a feasibility score and structured analysis.
- 🎯 **Idea Management** — Submit startup ideas with industry, target audience, budget, geography, and description.
- 🔐 **User Authentication** — Register and log in to access protected features.
- 💾 **Persistent Storage** — Store startup analyses in MySQL.
- 📚 **Report History** — Retrieve saved analyses associated with your account.
- ⚡ **REST API** — Backend endpoints built with FastAPI.
- 🎨 **Responsive Interface** — React-based frontend for submitting ideas and viewing reports.

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Vite, CSS |
| Backend | Python, FastAPI |
| Database | MySQL |
| ORM | SQLAlchemy |
| AI Integration | Google Gemini API |
| Authentication | Token-based authentication |
| API Documentation | FastAPI / Swagger UI |
| Version Control | Git and GitHub |

## 🏗️ Project Architecture

```text
VentureLens/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── security.py
│   │   ├── dependencies.py
│   │   └── ai_service.py
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
├── .gitignore
└── README.md
```

## ⚙️ Prerequisites

Install the following before running the project:

- Python 3.11 or a compatible Python version
- Node.js and npm
- MySQL Server
- Google Gemini API key
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/anupgitH/venturelens_startup_intelligence.git
cd venturelens_startup_intelligence
```

> Ensure the repository contains the `frontend/` and `backend/` directories at its root. Adjust the commands if you use a different repository structure.

### 2. Configure the MySQL database

Open MySQL and execute:

```sql
CREATE DATABASE startup_validator;
```

Ensure that your MySQL server is running and that your database user has permission to access this database.

### 3. Configure the backend

Navigate to the backend directory:

```bash
cd backend
python3 -m venv ../.venv
source ../.venv/bin/activate
python -m pip install -r requirements.txt
```

Create a `.env` file inside `backend/`, based on `.env.example`, and configure your environment variables:

```env
APP_NAME=VentureLens
SECRET_KEY=replace-with-a-long-random-secret
DATABASE_URL=mysql+pymysql://USER:PASSWORD@127.0.0.1:3306/startup_validator
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
FRONTEND_ORIGINS=http://localhost:5173
ACCESS_TOKEN_MINUTES=120
```

Replace the database credentials and API key with your own values. URL-encode special characters in the database password when required.

Start the backend:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

Backend URL: `http://localhost:8000`

Interactive API documentation: `http://localhost:8000/docs`

### 4. Configure the frontend

Open a separate terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/` if required by your frontend configuration:

```env
VITE_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API status |
| GET | `/api/health` | Health and AI configuration status |
| POST | `/api/auth/register` | Register an account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Retrieve the authenticated user |
| POST | `/api/analyses` | Generate and save a startup analysis |
| GET | `/api/analyses` | List the current user's analyses |
| GET | `/api/analyses/{analysis_id}` | Retrieve an analysis |
| DELETE | `/api/analyses/{analysis_id}` | Delete an analysis |

Protected endpoints require valid authentication.

## 🗄️ Database

VentureLens uses MySQL to persist user accounts and startup analyses.

The backend uses SQLAlchemy models for database operations. Startup analysis records include fields such as the idea name, industry, target audience, budget, geography, description, feasibility score, generated report, and creation timestamp.

## 🔒 Security

- Store API keys and database credentials in environment variables.
- Never commit `.env` files or production secrets.
- Use a strong, unique secret key.
- Use HTTPS and secure environment configuration in production.
- Restrict database access and permissions.
- Configure CORS for trusted frontend origins.

## 🧪 Testing

The backend includes a test directory. Run the available tests with:

```bash
cd backend
source ../.venv/bin/activate
python -m pytest
```

Ensure that the required test dependencies are installed.

## 🗺️ Future Enhancements

- Competitor research with cited sources.
- Market opportunity and customer-segment analysis.
- Explainable scoring with configurable evaluation criteria.
- Exportable startup validation reports.
- Startup idea comparison and version history.
- Additional automated tests and production monitoring.

## ⚠️ Disclaimer

VentureLens provides AI-generated decision-support insights, not guaranteed business outcomes or professional financial, legal, or investment advice. AI-generated scores and market estimates should be independently verified before making business decisions.

## 👨‍💻 Author

**Anup Kumar**

GitHub: [@anupgitH](https://github.com/anupgitH)

## 📄 License

Choose and add an appropriate open-source license before distributing the project. Until a license is added, do not assume others have permission to reuse the source code.

---

**VentureLens — Turn startup ideas into informed next steps.** 🚀
