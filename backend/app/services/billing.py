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
    limit: int = 10,
    filters: Optional[dict] = None,
) -> tuple[list[dict], int]:
    """Return a paginated, newest-first list of enriched billing documents and the total count."""
    query = filters or {}
    total = await _col(db).count_documents(query)
    cursor = _col(db).find(query).sort("created_at", -1).skip(skip).limit(limit)
    records = await cursor.to_list(length=limit)

    # Bulk fetch farmers and users to enrich efficiently
    farmer_ids = set()
    farmer_names = set()
    operator_ids = set()

    for r in records:
        f_id = r.get("farmer_id")
        if f_id:
            try:
                farmer_ids.add(ObjectId(f_id))
            except Exception:
                farmer_names.add(str(f_id))
        op_id = r.get("operator_id")
        if op_id:
            try:
                operator_ids.add(ObjectId(op_id))
            except Exception:
                pass

    farmers_map = {}
    if farmer_ids or farmer_names:
        or_clauses = []
        if farmer_ids:
            or_clauses.append({"_id": {"$in": list(farmer_ids)}})
        if farmer_names:
            or_clauses.append({"name": {"$in": list(farmer_names)}})
        f_docs = await db["farmers"].find({"$or": or_clauses}).to_list(length=len(farmer_ids) + len(farmer_names))
        for f in f_docs:
            farmers_map[str(f["_id"])] = f
            if "name" in f:
                farmers_map[f["name"]] = f

    users_map = {}
    if operator_ids:
        u_docs = await db["users"].find({"_id": {"$in": list(operator_ids)}}).to_list(length=len(operator_ids))
        for u in u_docs:
            users_map[str(u["_id"])] = u

    for r in records:
        f_id = r.get("farmer_id")
        f_key = str(f_id)
        if f_key in farmers_map:
            r["farmer_name"] = farmers_map[f_key].get("name")
            r["farmer_number"] = farmers_map[f_key].get("number")
        elif f_id in farmers_map:
            r["farmer_name"] = farmers_map[f_id].get("name")
            r["farmer_number"] = farmers_map[f_id].get("number")
        else:
            r["farmer_name"] = f_id

        op_id = r.get("operator_id")
        op_key = str(op_id)
        if op_key in users_map:
            r["operator_name"] = users_map[op_key].get("name")
        elif op_id in users_map:
            r["operator_name"] = users_map[op_id].get("name")
        else:
            r["operator_name"] = op_id

    return records, total


async def get_billing_stats(db, operator_id: Optional[str] = None) -> dict:
    """Return aggregate statistics across billing records (totals & monthly)."""
    match_stage = {}
    if operator_id:
        match_stage["operator_id"] = operator_id

    now = datetime.now(timezone.utc)
    start_of_month = datetime(now.year, now.month, 1, tzinfo=timezone.utc)

    pipeline = [
        {"$match": match_stage},
        {
            "$facet": {
                "total": [
                    {
                        "$group": {
                            "_id": None,
                            "total_bills": {"$sum": 1},
                            "total_revenue": {"$sum": "$amount"},
                            "total_acres": {"$sum": "$acres"},
                            "total_time": {"$sum": "$time"},
                        }
                    }
                ],
                "monthly": [
                    {
                        "$match": {
                            "created_at": {"$gte": start_of_month}
                        }
                    },
                    {
                        "$group": {
                            "_id": None,
                            "monthly_bills": {"$sum": 1},
                            "monthly_revenue": {"$sum": "$amount"},
                        }
                    }
                ],
            }
        },
    ]
    cursor = _col(db).aggregate(pipeline)
    result = await cursor.to_list(length=1)

    total_bills = 0
    total_revenue = 0.0
    total_acres = 0.0
    total_time = 0.0
    monthly_bills = 0
    monthly_revenue = 0.0

    if result:
        res = result[0]
        total_list = res.get("total", [])
        if total_list:
            t = total_list[0]
            total_bills = int(t.get("total_bills", 0))
            total_revenue = float(t.get("total_revenue", 0.0))
            total_acres = round(float(t.get("total_acres", 0.0)), 2)
            total_time = round(float(t.get("total_time", 0.0)), 2)

        monthly_list = res.get("monthly", [])
        if monthly_list:
            m = monthly_list[0]
            monthly_bills = int(m.get("monthly_bills", 0))
            monthly_revenue = float(m.get("monthly_revenue", 0.0))

    avg_bill_amount = round(total_revenue / total_bills, 2) if total_bills > 0 else 0.0

    return {
        "total_bills": total_bills,
        "total_revenue": total_revenue,
        "total_acres": total_acres,
        "total_time": total_time,
        "avg_bill_amount": avg_bill_amount,
        "monthly_bills": monthly_bills,
        "monthly_revenue": monthly_revenue,
    }


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
