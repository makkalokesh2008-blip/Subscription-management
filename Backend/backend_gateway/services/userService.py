from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models.schemas import User, UserUpdate
from services.authenticationService import hash_password


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def list_all_users(self) -> List[User]:
        return self.db.query(User).filter(User.is_active.is_(True)).order_by(User.id.desc()).all()

    def update_profile(self, user_id: int, payload: UserUpdate) -> User:
        user = self._get_user(user_id)
        updates = payload.model_dump(exclude_unset=True)

        if "password" in updates:
            updates["hashed_password"] = hash_password(updates.pop("password"))

        for field, value in updates.items():
            setattr(user, field, value)

        self.db.commit()
        self.db.refresh(user)
        return user

    def delete_user(self, user_id: int) -> None:
        user = self._get_user(user_id)
        user.is_active = False
        self.db.commit()

    def _get_user(self, user_id: int) -> User:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user
