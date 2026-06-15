from models.schemas import Payment, PaymentDetailResponse, PaymentPlanBrief, PaymentUserBrief


def to_payment_detail(payment: Payment) -> PaymentDetailResponse:
    user = payment.user
    plan = payment.subscription.plan if payment.subscription else None

    return PaymentDetailResponse(
        id=payment.id,
        user_id=payment.user_id,
        subscription_id=payment.subscription_id,
        amount=payment.amount,
        provider=payment.provider,
        transaction_id=payment.transaction_id,
        status=payment.status,
        paid_at=payment.paid_at,
        created_at=payment.created_at,
        user=PaymentUserBrief(
            id=user.id,
            name=user.name,
            email=user.email,
        ),
        plan=PaymentPlanBrief(
            id=plan.id if plan else 0,
            name=plan.name if plan else "Unknown Plan",
        ),
    )
