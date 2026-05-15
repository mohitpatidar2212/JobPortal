from fastapi import FastAPI
from routes import users, jobs, admin, chatbot
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import db

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Creating indexes...")

    try:
        await db.users.create_index([("email", 1), ("role", 1)])
        await db.applications.create_index([("job_id", 1)])
        await db.jobs.create_index([("created_by", 1)])

        print("Indexes ready")

    except Exception as e:
        print("Index creation failed:", str(e))

    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://job-portal-frontend-beta-hazel.vercel.app"],  # React URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(jobs.router)
app.include_router(admin.admin_router)
app.include_router(chatbot.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
