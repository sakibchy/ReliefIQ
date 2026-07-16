import os
import uuid
import base64
from pathlib import Path
from PIL import Image
from fastapi import UploadFile, HTTPException, status

from config import settings

ALLOWED_TYPES = ["image/jpeg", "image/png"]

async def validate_image(file: UploadFile) -> bytes:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {file.content_type}. Allowed: {ALLOWED_TYPES}"
        )
        
    content = await file.read()
    max_bytes = settings.MAX_IMAGE_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max allowed is {settings.MAX_IMAGE_SIZE_MB}MB."
        )
        
    await file.seek(0)
    return content

async def save_upload(file: UploadFile, content: bytes) -> str:
    ext = ".png" if file.content_type == "image/png" else ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    file_path = upload_dir / filename
    with open(file_path, "wb") as f:
        f.write(content)
        
    return str(file_path)

def encode_image_base64(image_path: str) -> str:
    path = Path(image_path)
    if not path.exists():
        return ""
    with open(path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
