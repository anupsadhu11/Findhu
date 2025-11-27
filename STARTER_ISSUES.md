Issue 1 — MVP: Backend — Register / Login (JWT) + File Upload
Title: MVP: implement user registration, login (JWT), and document upload
Implement minimal backend endpoints to support user signup, login (JWT-based auth), and a document upload endpoint for the Androidlient
.Needed for basic app flows: create account, sign in, and upload documents from the app.
Keep implementation simple and safe for MVP (SQLite, bcrypt, env-based secrets, local file storage).
POST /auth/register accepts JSON { "username", "password" } and creates a user with a hashed password.
POST /auth/login accepts form data (OAuth2PasswordRequestForm) and returns a bearer access_token (JWT).
POST /upload/document accepts multipart/form-data file and saves the file to backend/uploads with a deterministic unique name.
Endpoints return appropriate HTTP status codes (201 for create, 400 for validation/auth errors).
Use environment variable JWT_SECRET (fallback to dev secret only if not set).
Minimal README documenting how to run the backend and example curl requests.
[ ] Create backend/app/main.py with the endpoints.
[ ] Add user model (SQLAlchemy) and simple SQLite DB.
