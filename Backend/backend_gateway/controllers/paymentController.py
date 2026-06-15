from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from config.database import get_db
from models.schemas import PaymentCreate, PaymentDetailResponse, PaymentResponse
from utils.paymentMapper import to_payment_detail
from services.authenticationService import get_current_user, require_admin
from services.paymentService import PaymentService

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(
    payload: PaymentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
) -> PaymentResponse:
    return PaymentService(db).create_payment(current_user.id, payload)


@router.get("/me", response_model=List[PaymentDetailResponse])
def list_my_payments(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
) -> List[PaymentDetailResponse]:
    payments = PaymentService(db).list_user_payments(current_user.id)
    return [to_payment_detail(payment) for payment in payments]


@router.get("/", response_model=List[PaymentDetailResponse])
def list_payments(
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
) -> List[PaymentDetailResponse]:
    payments = PaymentService(db).list_all_payments()
    return [to_payment_detail(payment) for payment in payments]
