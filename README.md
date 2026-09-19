# Task Board — To-Do / Task Management Application

A simple full-stack task manager with a Flask REST API backend, MySQL database, and a vanilla HTML/CSS/JS frontend.

## Tech Stack

- **Frontend:** HTML, JavaScript (vanilla, no framework)
- **Backend:** Python, Flask
- **Database:** MySQL (via SQLAlchemy ORM + PyMySQL driver)
- **Version Control:** Git / GitHub

## Features

- Add a task with title, description, and priority (Low / Medium / High)
- View all tasks
- Update task status (Pending / Completed)
- Delete a task
- Filter tasks by All / Pending / Completed

## REST API

| Method | Endpoint            | Description               |
|--------|---------------------|----------------------------|
| GET    | `/api/tasks`        | Get all tasks (optional `?status=Pending`) |
| POST   | `/api/tasks`        | Create a new task          |
| PUT    | `/api/tasks/<id>`   | Update a task               |
| DELETE | `/api/tasks/<id>`   | Delete a task               |

## Setup & Run

### 1. Start MySQL (using Docker)

```bash
docker-compose up -d
```

This starts a MySQL 8.0 container with a `tododb` database, user `root`, password `rootpassword`, exposed on port 3306.

### 2. Create a virtual environment and install dependencies

```bash
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
```

### 3. Run the app

```bash
python app.py
```

The app will be available at **http://localhost:5000**

The Flask app automatically creates the `tasks` table on startup if it doesn't exist (`db.create_all()`).

### Environment variables (optional)

If you're not using the default docker-compose values, set these before running:

```bash
DB_USER=root
DB_PASSWORD=rootpassword
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tododb
```

## Project Structure

```
todo-app/
├── app.py                 # Flask app + REST API + DB model
├── requirements.txt
├── docker-compose.yml      # MySQL container for local dev
├── .gitignore
├── README.md
├── templates/
│   └── index.html          # Main page
└── static/
    ├── style.css
    └── script.js            # Frontend logic (fetch calls, rendering)
```

## Design Notes

- **SQLAlchemy ORM** is used instead of raw SQL for cleaner, safer queries (avoids manual SQL injection risks) and easier schema management.
- **Status/priority filtering** is done server-side via a query parameter (`?status=`) rather than in the frontend, so the API stays the single source of truth.
- **Event delegation** is used in `script.js` for task actions (toggle/delete) so newly rendered tasks don't need individual listeners re-attached.
