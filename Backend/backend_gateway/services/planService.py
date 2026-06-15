from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models.schemas import Plan, PlanCreate, PlanUpdate


class PlanService:
    def __init__(self, db: Session):
        self.db = db

    def create_plan(self, payload: PlanCreate) -> Plan:
        existing_plan = self.db.query(Plan).filter(Plan.name == payload.name).first()
        if existing_plan:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Plan name already exists")

        plan = Plan(**payload.model_dump())
        self.db.add(plan)
        self.db.commit()
        self.db.refresh(plan)
        return plan

    def list_plans(self) -> List[Plan]:
        return self.db.query(Plan).order_by(Plan.id.asc()).all()

    def get_plan(self, plan_id: int) -> Plan:
        plan = self.db.query(Plan).filter(Plan.id == plan_id).first()
        if not plan:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")
        return plan

    def update_plan(self, plan_id: int, payload: PlanUpdate) -> Plan:
        plan = self.get_plan(plan_id)
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(plan, field, value)

        self.db.commit()
        self.db.refresh(plan)
        return plan

    def delete_plan(self, plan_id: int) -> None:
        plan = self.get_plan(plan_id)
        self.db.delete(plan)
        self.db.commit()
