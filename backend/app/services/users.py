from typing import Optional
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status


def _col(db):
    return db["users"]


def _safe_object_id(value: str) -> ObjectId:
    """Convert a string to ObjectId, raising HTTP 422 on invalid format."""
    try:
        return ObjectId(value)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"'{value}' is not a valid ID",
        )


async def get_user_by_id(user_id: str, db) -> dict | None:
    """Return the user document (without password) or None."""
    user = await _col(db).find_one({"_id": _safe_object_id(user_id)})
    if user:
        user.pop("password", None)
    return user


async def get_user_by_email(email: str, db) -> dict | None:
    """Return the user document matching *email* or None."""
    return await _col(db).find_one({"email": email})


async def get_all_users(
    db,
    skip: int = 0,
    limit: int = 10,
    role_id: Optional[int] = None,
    search: Optional[str] = None,
) -> tuple[list[dict], int]:
    """Return a paginated list of users and total count, never including their passwords."""
    query = {}
    if role_id is not None:
        try:
            r_int = int(role_id)
            if r_int == 1:
                query["$or"] = [
                    {"role_id": 1},
                    {"role_id": "1"},
                    {"role_id": "admin"},
                    {"role": "admin"},
                ]
            elif r_int == 2:
                query["$or"] = [
                    {"role_id": 2},
                    {"role_id": "2"},
                    {"role_id": "operator"},
                    {"role": "operator"},
                ]
            else:
                query["role_id"] = r_int
        except (ValueError, TypeError):
            query["role_id"] = role_id

    if search:
        import re
        escaped = re.escape(search.strip())
        search_or = [
            {"name": {"$regex": escaped, "$options": "i"}},
            {"full_name": {"$regex": escaped, "$options": "i"}},
            {"email": {"$regex": escaped, "$options": "i"}},
        ]
        if "$or" in query:
            query = {"$and": [{"$or": query["$or"]}, {"$or": search_or}]}
        else:
            query["$or"] = search_or

    total = await _col(db).count_documents(query)
    cursor = _col(db).find(query, {"password": 0}).sort("created_at", -1).skip(skip).limit(limit)
    records = await cursor.to_list(length=limit)

    for r in records:
        if not r.get("name") and r.get("full_name"):
            r["name"] = r["full_name"]
        elif not r.get("name"):
            r["name"] = (r.get("email") or "").split("@")[0]

        r_val = r.get("role_id")
        r_str = str(r_val).strip().lower() if r_val is not None else ""
        role_str = str(r.get("role", "")).strip().lower()
        if r_val == 1 or r_str in ("1", "admin", "administrator") or role_str in ("admin", "administrator"):
            r["role_id"] = 1
        else:
            r["role_id"] = 2

        if "is_active" not in r or r["is_active"] is None:
            r["is_active"] = True

    return records, total


async def update_user(user_id: str, data: dict, db) -> bool:
    """Apply *data* as a $set update. Returns True when a matching document was found."""
    if not data:
        return True  # Nothing to do — not an error
    from datetime import datetime, timezone
    # Always touch updated_at so modified_count > 0 for any valid user
    data.setdefault("updated_at", datetime.now(timezone.utc))
    result = await _col(db).update_one(
        {"_id": _safe_object_id(user_id)},
        {"$set": data},
    )
    # matched_count > 0 means the user exists — success even if data was identical
    return result.matched_count > 0


async def delete_user(user_id: str, db) -> bool:
    """Hard-delete the user. Returns True when a document was removed."""
    result = await _col(db).delete_one({"_id": _safe_object_id(user_id)})
    return result.deleted_count > 0
