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


async def get_all_users(db, skip: int = 0, limit: int = 100) -> list[dict]:
    """Return a paginated list of users, never including their passwords."""
    cursor = _col(db).find({}, {"password": 0}).skip(skip).limit(limit)
    return await cursor.to_list(length=limit)


async def update_user(user_id: str, data: dict, db) -> bool:
    """Apply *data* as a $set update. Returns True when a document was modified."""
    if not data:
        return True  # Nothing to do — not an error
    result = await _col(db).update_one(
        {"_id": _safe_object_id(user_id)},
        {"$set": data},
    )
    return result.modified_count > 0


async def delete_user(user_id: str, db) -> bool:
    """Hard-delete the user. Returns True when a document was removed."""
    result = await _col(db).delete_one({"_id": _safe_object_id(user_id)})
    return result.deleted_count > 0
