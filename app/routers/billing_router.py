# Billing requests and response manager!
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.db import get_db
from app.schemas.billing import BillingCreate, BillingUpdate, BillingResponse

from app.services.billing_service import (
    create_billing,
    get_billing_by_id,
    get_all_billings,
    update_billing,
    delete_billing,
)

from app.dependencies import get_current_active_user, admin_required

router = APIRouter(prefix="/billing", tags=["Billing"])


def serialize_billing(doc: dict) -> BillingResponse:
    """Convert MongoDB document to BillingResponse schema."""
    return BillingResponse(
        id=str(doc["_id"]),
        farmer_id=doc["farmer_id"],
        operator_id=doc["operator_id"],
        drone_id=doc["drone_id"],
        acres=doc["acres"],
        time=doc["time"],
        amount=doc["amount"],
        mode_type=doc["mode_type"],
        created_at=doc.get("created_at"),
        updated_at=doc.get("updated_at"),
        created_by=doc.get("created_by"),
        updated_by=doc.get("updated_by"),
    )


@router.post("/", response_model=BillingResponse, status_code=status.HTTP_201_CREATED)
async def create_billing_endpoint(
    payload: BillingCreate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db),
):
    """Create a new billing entry (invoice)."""
    now = datetime.utcnow()

    billing_data = {
        "farmer_id": payload.farmer_id,
        "operator_id": payload.operator_id,
        "drone_id": payload.drone_id,
        "acres": payload.acres,
        "time": payload.time,
        "amount": payload.amount,
        "mode_type": payload.mode_type,
        "created_at": now,
        "updated_at": None,
        "created_by": str(current_user["_id"]),
        "updated_by": None,
    }

    inserted_id = await create_billing(billing_data, db)
    created = await get_billing_by_id(inserted_id, db)
    if not created:
        raise HTTPException(status_code=500, detail="Failed to create billing record")

    return serialize_billing(created)


@router.get("/", response_model=List[BillingResponse])
async def list_billings_endpoint(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    farmer_id: Optional[str] = Query(None),
    operator_id: Optional[str] = Query(None),
    drone_id: Optional[str] = Query(None),
    current_user: dict = Depends(admin_required),
    db=Depends(get_db),
):
    """
    List billing records.

    - Admin only (for now)
    - Supports filtering by farmer_id, operator_id, drone_id
    - Supports pagination with skip & limit
    """
    filters = {}
    if farmer_id:
        filters["farmer_id"] = farmer_id
    if operator_id:
        filters["operator_id"] = operator_id
    if drone_id:
        filters["drone_id"] = drone_id

    billings = await get_all_billings(db, skip=skip, limit=limit, filters=filters or None)
    return [serialize_billing(doc) for doc in billings]


@router.get("/{billing_id}", response_model=BillingResponse)
async def get_billing_endpoint(
    billing_id: str,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db),
):
    """Get a single billing record by its ID."""
    doc = await get_billing_by_id(billing_id, db)
    if not doc:
        raise HTTPException(status_code=404, detail="Billing record not found")

    return serialize_billing(doc)


@router.put("/{billing_id}", response_model=dict)
async def update_billing_endpoint(
    billing_id: str,
    payload: BillingUpdate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db),
):
    """Update a billing record."""
    existing = await get_billing_by_id(billing_id, db)
    if not existing:
        raise HTTPException(status_code=404, detail="Billing record not found")

    update_data = payload.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    update_data["updated_at"] = datetime.utcnow()
    update_data["updated_by"] = str(current_user["_id"])

    success = await update_billing(billing_id, update_data, db)
    if not success:
        raise HTTPException(status_code=400, detail="Update failed")

    return {"message": "Billing record updated successfully"}


@router.delete("/{billing_id}", response_model=dict)
async def delete_billing_endpoint(
    billing_id: str,
    current_user: dict = Depends(admin_required),
    db=Depends(get_db),
):
    """Delete a billing record (admin only)."""
    existing = await get_billing_by_id(billing_id, db)
    if not existing:
        raise HTTPException(status_code=404, detail="Billing record not found")

    success = await delete_billing(billing_id, db)
    if not success:
        raise HTTPException(status_code=400, detail="Delete failed")

    return {"message": "Billing record deleted successfully"}
