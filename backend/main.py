from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check API
@app.get("/api/health")
def health_check():
    return {"status": "ok"}


# Serve React App
# Assuming the frontend build is located in 'static' directory in the container
if os.path.exists("static"):
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")

    # Catch-all for SPA to serve index.html
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api"):
            return {"error": "API endpoint not found"}

        # Check if file exists in static (e.g. favicon.ico)
        file_path = os.path.join("static", full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)

        return FileResponse("static/index.html")
else:

    @app.get("/")
    def read_root():
        return {"message": "Development API Mode. Frontend not built/mounted."}
