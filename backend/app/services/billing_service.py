# Actuall worker (this connects with database)!
from typing import Optional, Dict, Any
from bson import ObjectId

from app.models.billing_model import get_billing_collection

def billing_collection(db):
    return get_billing_collection(db) 

async def create_billing(data: Dict[str, Any], db):
    """Insert a billing document and return inserted id as string."""
    coll = billing_collection(db)
    result = await coll.insert_one(data)
    return str(result.inserted_id)

async def get_billing_by_id(billing_id: str, db):
    coll = billing_collection(db)
    doc = await coll.find_one({"_id": ObjectId(billing_id)})
    return doc

async def get_all_billings(db, skip: int = 0, limit: int = 100, filters: Optional[Dict[str, Any]] = None):
    coll = billing_collection(db)
    query: Dict[str, Any] = filters or {}
    cursor = coll.find(query).skip(skip).limit(limit).sort("created_at", -1)
    billings = await cursor.to_list(length=limit)
    return billings

async def update_billing(billing_id: str, data: Dict[str, Any], db):
    coll = billing_collection(db)
    # remove None values
    update_data = {k: v for k, v in data.items() if v is not None}
    if not update_data:
        return False
    result = await coll.update_one({"_id": ObjectId(billing_id)}, {"$set": update_data})
    return result.modified_count > 0

async def delete_billing(billing_id: str, db):
    coll = billing_collection(db)
    result = await coll.delete_one({"_id": ObjectId(billing_id)})
    return result.deleted_count > 0
