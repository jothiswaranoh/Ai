import logging
import math
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.database import get_db
from app.dependencies import admin_required, get_current_active_user, is_admin_user
from app.enums import UserRole
from app.schemas.billing import BillingCreate, BillingResponse, BillingUpdate
from app.schemas.common import PaginatedResponse
from app.services import billing as billing_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/billing", tags=["Billing"])


@router.post("/", response_model=BillingResponse, status_code=status.HTTP_201_CREATED)
async def create_billing(
    payload: BillingCreate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db),
):
    """Create a new billing record."""
    now = datetime.now(timezone.utc)
    operator_id = payload.operator_id or str(current_user["_id"])
    data = {
        **payload.model_dump(),
        "operator_id": operator_id,
        "created_at": now,
        "updated_at": None,
        "created_by": str(current_user["_id"]),
        "updated_by": None,
    }
    inserted_id = await billing_service.create_billing(data, db)
    logger.info("User %s created billing record %s for farmer %s, amount %s", current_user["_id"], inserted_id, payload.farmer_id, payload.amount)
    record = await billing_service.get_billing_by_id(inserted_id, db)
    if not record:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve created record")
    return record


@router.get("/stats", response_model=dict)
async def get_billing_stats(
    operator_id: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db),
):
    """
    Get aggregate billing metrics.
    - Admins can get overall stats or filter by operator.
    - Operators only get their own stats.
    """
    is_admin = is_admin_user(current_user)
    scoped_operator_id = operator_id if is_admin else str(current_user["_id"])
    return await billing_service.get_billing_stats(db, operator_id=scoped_operator_id)


@router.get("/", response_model=PaginatedResponse[BillingResponse])
async def list_billings(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1),
    skip: Optional[int] = Query(None, ge=0),
    farmer_id: Optional[str] = Query(None),
    operator_id: Optional[str] = Query(None),
    drone_id: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db),
):
    """
    List billing records with pagination (default 10 per page, max 10 per page).
    - **Admins** see all records and may filter by farmer, operator, or drone.
    - **Operators** see only their own records.
    """
    # Enforce maximum 10 items per page
    limit = min(limit, 10)

    is_admin = is_admin_user(current_user)
    filters: dict = {}

    if not is_admin:
        # Operators are always scoped to their own records
        filters["operator_id"] = str(current_user["_id"])
    else:
        if operator_id:
            filters["operator_id"] = operator_id

    if farmer_id:
        filters["farmer_id"] = farmer_id
    if drone_id:
        filters["drone_id"] = drone_id

    if skip is not None:
        actual_page = (skip // limit) + 1
        actual_skip = skip
    else:
        actual_page = page
        actual_skip = (page - 1) * limit

    records, total = await billing_service.get_all_billings(
        db, skip=actual_skip, limit=limit, filters=filters or None
    )
    total_pages = math.ceil(total / limit) if total > 0 else 0

    return {
        "items": records,
        "total": total,
        "page": actual_page,
        "limit": limit,
        "total_pages": total_pages,
    }


@router.get("/{billing_id}", response_model=BillingResponse)
async def get_billing(
    billing_id: str,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db),
):
    """Get a billing record by ID. Accessible by admins or the record's operator."""
    record = await billing_service.get_billing_by_id(billing_id, db)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Billing record not found")

    is_admin = is_admin_user(current_user)
    is_owner = record.get("operator_id") == str(current_user["_id"])

    if not (is_admin or is_owner):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return record


@router.put("/{billing_id}", response_model=dict)
async def update_billing(
    billing_id: str,
    payload: BillingUpdate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db),
):
    """Update a billing record. Accessible by admins or the record's operator."""
    record = await billing_service.get_billing_by_id(billing_id, db)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Billing record not found")

    is_admin = is_admin_user(current_user)
    is_owner = record.get("operator_id") == str(current_user["_id"])

    if not (is_admin or is_owner):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided to update")

    update_data["updated_at"] = datetime.now(timezone.utc)
    update_data["updated_by"] = str(current_user["_id"])

    await billing_service.update_billing(billing_id, update_data, db)
    return {"message": "Billing record updated successfully"}


@router.delete("/{billing_id}", response_model=dict)
async def delete_billing(
    billing_id: str,
    current_user: dict = Depends(admin_required),
    db=Depends(get_db),
):
    """Delete a billing record (admin only)."""
    record = await billing_service.get_billing_by_id(billing_id, db)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Billing record not found")

    await billing_service.delete_billing(billing_id, db)
    logger.info("Admin %s deleted bill record %s", current_user["_id"], billing_id)
    return {"message": "Billing record deleted successfully"}
