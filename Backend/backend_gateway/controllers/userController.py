from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from config.database import get_db
from models.schemas import UserResponse, UserUpdate
from services.authenticationService import get_current_user, require_admin
from services.userService import UserService

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=List[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
) -> List[UserResponse]:
    return UserService(db).list_all_users()


@router.get("/me", response_model=UserResponse)
def get_profile(current_user=Depends(get_current_user)) -> UserResponse:
    return current_user


@router.put("/me", response_model=UserResponse)
def update_profile(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
) -> UserResponse:
    return UserService(db).update_profile(current_user.id, payload)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
) -> None:
    UserService(db).delete_user(current_user.id)
