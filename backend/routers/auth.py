from fastapi import APIRouter, Depends, HTTPException, status, Response
from pydantic import BaseModel

from config import settings
from utils.auth import create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
async def login(req: LoginRequest, response: Response):
    if req.username != settings.ADMIN_USERNAME or req.password != settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
        
    access_token = create_access_token(data={"sub": req.username})
    
    # Set JWT in httpOnly cookie
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_HOURS * 3600,
        samesite="lax",
        secure=False  # Set to True in production
    )
    
    return {"success": True, "data": None, "error": None}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"success": True, "data": None, "error": None}
