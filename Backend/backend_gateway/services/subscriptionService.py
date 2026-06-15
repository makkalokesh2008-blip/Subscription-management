from datetime import datetime, timedelta, timezone
from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models.schemas import Plan, Subscription, SubscriptionCreate, SubscriptionStatus, User, UserRole


class SubscriptionService:
    def __init__(self, db: Session):
        self.db = db

    def create_subscription(self, user_id: int, payload: SubscriptionCreate) -> Subscription:
        plan = self.db.query(Plan).filter(Plan.id == payload.plan_id, Plan.is_active.is_(True)).first()
        if not plan:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Active plan not found")

        starts_at = datetime.now(timezone.utc)
        subscription = Subscription(
            user_id=user_id,
            plan_id=plan.id,
            status=SubscriptionStatus.ACTIVE.value,
            start_date=starts_at,
            end_date=starts_at + timedelta(days=plan.duration_days),
        )
        self.db.add(subscription)
        self.db.commit()
        self.db.refresh(subscription)
        return subscription

    def list_user_subscriptions(self, user_id: int) -> List[Subscription]:
        return (
            self.db.query(Subscription)
            .filter(Subscription.user_id == user_id)
            .order_by(Subscription.id.desc())
            .all()
        )

    def list_all_subscriptions(self) -> List[Subscription]:
        return self.db.query(Subscription).order_by(Subscription.id.desc()).all()

    def cancel_subscription(self, subscription_id: int, current_user: User) -> Subscription:
        query = self.db.query(Subscription).filter(Subscription.id == subscription_id)
        if current_user.role != UserRole.ADMIN.value:
            query = query.filter(Subscription.user_id == current_user.id)

        subscription = query.first()
        if not subscription:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")

        subscription.status = SubscriptionStatus.CANCELLED.value
        self.db.commit()
        self.db.refresh(subscription)
        return subscription
