from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from config.database import get_db
from models.schemas import SubscriptionCreate, SubscriptionResponse
from services.authenticationService import get_current_user, require_admin
from services.subscriptionService import SubscriptionService

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])


@router.post("/", response_model=SubscriptionResponse, status_code=status.HTTP_201_CREATED)
def create_subscription(
    payload: SubscriptionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
) -> SubscriptionResponse:
    return SubscriptionService(db).create_subscription(current_user.id, payload)


@router.get("/me", response_model=List[SubscriptionResponse])
def list_my_subscriptions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
) -> List[SubscriptionResponse]:
    return SubscriptionService(db).list_user_subscriptions(current_user.id)


@router.patch("/{subscription_id}/cancel", response_model=SubscriptionResponse)
def cancel_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
) -> SubscriptionResponse:
    return SubscriptionService(db).cancel_subscription(subscription_id, current_user)


@router.get("/", response_model=List[SubscriptionResponse])
def list_subscriptions(
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
) -> List[SubscriptionResponse]:
    return SubscriptionService(db).list_all_subscriptions()
