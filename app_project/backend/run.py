import uvicorn
import sys
import os
from app.core.config import settings

sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
