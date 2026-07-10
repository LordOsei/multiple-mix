from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from routers.products import router as products_router
import os

app = FastAPI(title="Lydia's Store API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(products_router)

FRONTEND = os.path.join(os.path.dirname(__file__), "..", "frontend")
app.mount("/css", StaticFiles(directory=os.path.join(FRONTEND, "css")), name="css")
app.mount("/js",  StaticFiles(directory=os.path.join(FRONTEND, "js")),  name="js")

@app.get("/")
def index():
    return FileResponse(os.path.join(FRONTEND, "index.html"))
