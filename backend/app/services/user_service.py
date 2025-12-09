from bson import ObjectId
from typing import Optional

def user_collection(db):
    return db["users"]

async def create_user(data, db):
    result = await user_collection(db).insert_one(data)
    return str(result.inserted_id)

async def get_user_by_id(user_id, db, exclude_password=True):
    """Get user by ID, optionally excluding password"""
    user = await user_collection(db).find_one({"_id": ObjectId(user_id)})
    if user and exclude_password:
        user.pop("password", None)
    return user

async def get_user_by_email(email: str, db):
    """Get user by email"""
    return await user_collection(db).find_one({"email": email})

async def get_all_users(db, skip: int = 0, limit: int = 100, exclude_password=True):
    """Get all users with pagination"""
    cursor = user_collection(db).find({}).skip(skip).limit(limit)
    users = await cursor.to_list(length=limit)
    
    if exclude_password:
        for user in users:
            user.pop("password", None)
    
    return users

async def update_user(user_id, data, db):
    """Update user data"""
    # Remove None values
    update_data = {k: v for k, v in data.items() if v is not None}
    
    if not update_data:
        return True
    
    result = await user_collection(db).update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    return result.modified_count > 0

async def delete_user(user_id, db):
    """Delete user (hard delete)"""
    result = await user_collection(db).delete_one({"_id": ObjectId(user_id)})
    return result.deleted_count > 0

async def soft_delete_user(user_id, db):
    """Soft delete user by setting is_active to False"""
    result = await user_collection(db).update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_active": False}}
    )
    return result.modified_count > 0
