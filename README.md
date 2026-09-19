# To-Do List App

A simple task manager built with Flask, MySQL, and vanilla JS.

## Tech Used

- Frontend: HTML, CSS, JavaScript
- Backend: Python, Flask
- Database: MySQL (SQLAlchemy + PyMySQL)

## Features

- Add a task (title, description, priority)
- View all tasks
- Mark task as done / undo
- Delete a task
- Filter by All / Pending / Completed

## API

- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/<id>
- DELETE /api/tasks/<id>

## Setup

1. Start MySQL:
```
docker-compose up -d
```

2. Create virtual environment and install packages:
```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

3. Run the app:
```
python app.py
```

4. Open http://localhost:5000

## Notes

Default DB values (host, user, password) are set in app.py using environment variables, so it works with the docker-compose file out of the box. If your MySQL is on a different port, set DB_PORT before running.
