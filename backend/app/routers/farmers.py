import logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.database import get_db
from app.dependencies import get_current_active_user
from app.schemas.farmers import FarmerCreate, FarmerResponse, FarmerUpdate
from app.services import farmers as farmer_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/farmers", tags=["Farmers"])


@router.post("/", response_model=FarmerResponse, status_code=status.HTTP_201_CREATED)
async def create_farmer(
    payload: FarmerCreate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db),
):
    """Create a new farmer with duplicate validation."""
    existing = await farmer_service.find_farmer_by_number(payload.number, db)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A farmer with phone number '{payload.number}' already exists.",
        )

    now = datetime.now(timezone.utc)
    data = {
        **payload.model_dump(),
        "name": payload.name.strip(),
        "number": payload.number.strip(),
        "created_at": now,
        "updated_at": now,
        "created_by": str(current_user["_id"]),
    }
    inserted_id = await farmer_service.create_farmer(data, db)
    record = await farmer_service.get_farmer_by_id(inserted_id, db)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve created farmer",
        )
    logger.info("User %s created farmer %s (phone: %s, ID: %s)", current_user["_id"], payload.name, payload.number, inserted_id)
    return record


@router.get("/", response_model=list[FarmerResponse])
async def list_farmers(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    search: Optional[str] = Query(None),
    _: dict = Depends(get_current_active_user),
    db=Depends(get_db),
):
    """List all farmers with optional search query."""
    return await farmer_service.get_all_farmers(db, skip=skip, limit=limit, search=search)


@router.get("/{farmer_id}", response_model=FarmerResponse)
async def get_farmer(
    farmer_id: str,
    _: dict = Depends(get_current_active_user),
    db=Depends(get_db),
):
    """Get a farmer by ID."""
    farmer = await farmer_service.get_farmer_by_id(farmer_id, db)
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Farmer not found"
        )
    return farmer


@router.put("/{farmer_id}", response_model=dict)
async def update_farmer(
    farmer_id: str,
    payload: FarmerUpdate,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db),
):
    """Update a farmer record."""
    farmer = await farmer_service.get_farmer_by_id(farmer_id, db)
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Farmer not found"
        )

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided to update",
        )

    check_number = update_data.get("number")
    if check_number:
        existing = await farmer_service.find_farmer_by_number(
            check_number, db, exclude_id=farmer_id
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Another farmer with phone number '{check_number}' already exists.",
            )

    update_data["updated_at"] = datetime.now(timezone.utc)
    success = await farmer_service.update_farmer(farmer_id, update_data, db)
    logger.info("User %s updated farmer %s with fields %s", current_user["_id"], farmer_id, list(update_data.keys()))
    return {"message": "Farmer updated successfully"}


@router.delete("/{farmer_id}", response_model=dict)
async def delete_farmer(
    farmer_id: str,
    current_user: dict = Depends(get_current_active_user),
    db=Depends(get_db),
):
    """Delete a farmer record."""
    farmer = await farmer_service.get_farmer_by_id(farmer_id, db)
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Farmer not found"
        )
    await farmer_service.delete_farmer(farmer_id, db)
    logger.info("User %s deleted farmer %s (%s)", current_user["_id"], farmer_id, farmer.get("name"))
    return {"message": "Farmer deleted successfully"}
