from typing import Optional
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status


def _col(db):
    return db["billing"]


def _safe_object_id(value: str) -> ObjectId:
    """Convert a string to ObjectId, raising HTTP 422 on invalid format."""
    try:
        return ObjectId(value)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"'{value}' is not a valid ID",
        )


async def _enrich_billing(record: dict, db) -> dict:
    """Attach farmer_name, farmer_number, and operator_name to the bill record."""
    if not record:
        return record

    # Resolve Farmer
    farmer_id = record.get("farmer_id")
    if farmer_id:
        farmer_doc = None
        try:
            farmer_doc = await db["farmers"].find_one({"_id": ObjectId(farmer_id)})
        except Exception:
            pass

        if not farmer_doc:
            farmer_doc = await db["farmers"].find_one({"name": farmer_id})

        if farmer_doc:
            record["farmer_name"] = farmer_doc.get("name")
            record["farmer_number"] = farmer_doc.get("number")
        else:
            record["farmer_name"] = farmer_id

    # Resolve Operator
    operator_id = record.get("operator_id")
    if operator_id:
        user_doc = None
        try:
            user_doc = await db["users"].find_one({"_id": ObjectId(operator_id)})
        except Exception:
            pass

        if user_doc:
            record["operator_name"] = user_doc.get("name")
        else:
            record["operator_name"] = operator_id

    return record


async def create_billing(data: dict, db) -> str:
    """Insert a billing document and return its inserted ID as a string."""
    result = await _col(db).insert_one(data)
    return str(result.inserted_id)


async def get_billing_by_id(billing_id: str, db) -> dict | None:
    """Return the enriched billing document or None."""
    record = await _col(db).find_one({"_id": _safe_object_id(billing_id)})
    if record:
        record = await _enrich_billing(record, db)
    return record


async def get_all_billings(
    db,
    skip: int = 0,
    limit: int = 100,
    filters: Optional[dict] = None,
) -> list[dict]:
    """Return a paginated, newest-first list of enriched billing documents."""
    cursor = _col(db).find(filters or {}).sort("created_at", -1).skip(skip).limit(limit)
    records = await cursor.to_list(length=limit)

    # Bulk fetch farmers and users to enrich efficiently
    farmer_ids = set()
    operator_ids = set()

    for r in records:
        f_id = r.get("farmer_id")
        if f_id:
            try:
                farmer_ids.add(ObjectId(f_id))
            except Exception:
                pass
        op_id = r.get("operator_id")
        if op_id:
            try:
                operator_ids.add(ObjectId(op_id))
            except Exception:
                pass

    farmers_map = {}
    if farmer_ids:
        f_docs = await db["farmers"].find({"_id": {"$in": list(farmer_ids)}}).to_list(length=len(farmer_ids))
        for f in f_docs:
            farmers_map[str(f["_id"])] = f

    users_map = {}
    if operator_ids:
        u_docs = await db["users"].find({"_id": {"$in": list(operator_ids)}}).to_list(length=len(operator_ids))
        for u in u_docs:
            users_map[str(u["_id"])] = u

    for r in records:
        f_id = r.get("farmer_id")
        if f_id in farmers_map:
            r["farmer_name"] = farmers_map[f_id].get("name")
            r["farmer_number"] = farmers_map[f_id].get("number")
        else:
            r["farmer_name"] = f_id

        op_id = r.get("operator_id")
        if op_id in users_map:
            r["operator_name"] = users_map[op_id].get("name")
        else:
            r["operator_name"] = op_id

    return records


async def update_billing(billing_id: str, data: dict, db) -> bool:
    """Apply *data* as a $set update. Returns True when a document was modified."""
    result = await _col(db).update_one(
        {"_id": _safe_object_id(billing_id)},
        {"$set": data},
    )
    return result.modified_count > 0


async def delete_billing(billing_id: str, db) -> bool:
    """Hard-delete the billing record. Returns True when a document was removed."""
    result = await _col(db).delete_one({"_id": _safe_object_id(billing_id)})
    return result.deleted_count > 0
