import re
from typing import Optional
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status


def _col(db):
    return db["farmers"]


def _safe_object_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"'{value}' is not a valid ID",
        )


async def find_farmer_by_name_or_number(
    name: str, number: str, db, exclude_id: Optional[str] = None
) -> dict | None:
    """Find farmer matching exact number or case-insensitive name."""
    escaped_name = re.escape(name.strip())
    clean_number = number.strip()

    query = {
        "$or": [
            {"name": {"$regex": f"^{escaped_name}$", "$options": "i"}},
            {"number": clean_number},
        ]
    }
    if exclude_id:
        try:
            query["_id"] = {"$ne": ObjectId(exclude_id)}
        except Exception:
            pass

    return await _col(db).find_one(query)


async def create_farmer(data: dict, db) -> str:
    result = await _col(db).insert_one(data)
    return str(result.inserted_id)


async def get_farmer_by_id(farmer_id: str, db) -> dict | None:
    return await _col(db).find_one({"_id": _safe_object_id(farmer_id)})


async def get_all_farmers(
    db,
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
) -> list[dict]:
    query = {}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"number": {"$regex": search, "$options": "i"}},
        ]
    cursor = _col(db).find(query).sort("created_at", -1).skip(skip).limit(limit)
    return await cursor.to_list(length=limit)


async def update_farmer(farmer_id: str, data: dict, db) -> bool:
    result = await _col(db).update_one(
        {"_id": _safe_object_id(farmer_id)},
        {"$set": data},
    )
    return result.modified_count > 0


async def delete_farmer(farmer_id: str, db) -> bool:
    result = await _col(db).delete_one({"_id": _safe_object_id(farmer_id)})
    return result.deleted_count > 0
