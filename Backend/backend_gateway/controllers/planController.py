from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from config.database import get_db
from models.schemas import PlanCreate, PlanResponse, PlanUpdate
from services.authenticationService import require_admin
from services.planService import PlanService

router = APIRouter(prefix="/plans", tags=["Plans"])


@router.post("/", response_model=PlanResponse, status_code=status.HTTP_201_CREATED)
def create_plan(
    payload: PlanCreate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
) -> PlanResponse:
    return PlanService(db).create_plan(payload)


@router.get("/", response_model=List[PlanResponse])
def list_plans(db: Session = Depends(get_db)) -> List[PlanResponse]:
    return PlanService(db).list_plans()


@router.get("/{plan_id}", response_model=PlanResponse)
def get_plan(plan_id: int, db: Session = Depends(get_db)) -> PlanResponse:
    return PlanService(db).get_plan(plan_id)


@router.put("/{plan_id}", response_model=PlanResponse)
def update_plan(
    plan_id: int,
    payload: PlanUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
) -> PlanResponse:
    return PlanService(db).update_plan(plan_id, payload)


@router.delete("/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
) -> None:
    PlanService(db).delete_plan(plan_id)
