from fastapi import APIRouter, HTTPException, status, Response
from pydantic import BaseModel

from config import settings
from utils.auth import create_access_token, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(req: LoginRequest, response: Response):
    # Compare username plainly; verify password via bcrypt hash
    username_ok = req.username == settings.ADMIN_USERNAME
    password_ok = verify_password(req.password, settings.ADMIN_PASSWORD_HASH)

    if not username_ok or not password_ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    access_token = create_access_token(data={"sub": req.username})

    is_production = settings.ENVIRONMENT == "production"

    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_HOURS * 3600,
        samesite="lax",
        secure=is_production,  # HTTPS-only in production
    )

    return {"success": True, "data": None, "error": None}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"success": True, "data": None, "error": None}
