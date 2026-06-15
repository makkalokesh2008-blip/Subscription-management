from datetime import datetime, timezone
from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from models.schemas import Payment, PaymentCreate, PaymentStatus, Subscription, User


class PaymentService:
    def __init__(self, db: Session):
        self.db = db

    def create_payment(self, user_id: int, payload: PaymentCreate) -> Payment:
        subscription = (
            self.db.query(Subscription)
            .filter(Subscription.id == payload.subscription_id, Subscription.user_id == user_id)
            .first()
        )
        if not subscription:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")

        payment = Payment(
            user_id=user_id,
            subscription_id=payload.subscription_id,
            amount=payload.amount,
            provider=payload.provider,
            transaction_id=payload.transaction_id,
            status=payload.status.value,
            paid_at=datetime.now(timezone.utc) if payload.status == PaymentStatus.COMPLETED else None,
        )
        self.db.add(payment)
        self.db.commit()
        self.db.refresh(payment)
        return payment

    def _payment_query(self):
        return self.db.query(Payment).options(
            joinedload(Payment.user),
            joinedload(Payment.subscription).joinedload(Subscription.plan),
        )

    def list_user_payments(self, user_id: int) -> List[Payment]:
        return (
            self._payment_query()
            .filter(Payment.user_id == user_id)
            .order_by(Payment.id.desc())
            .all()
        )

    def list_all_payments(self) -> List[Payment]:
        return self._payment_query().order_by(Payment.id.desc()).all()
