from bson import ObjectId

def user_collection(db):
    return db["users"]

async def create_user(data, db):
    result = await user_collection(db).insert_one(data)
    return str(result.inserted_id)

async def get_user_by_id(user_id, db):
    return await user_collection(db).find_one({"_id": ObjectId(user_id)})

async def get_all_users(db):
    cursor = user_collection(db).find({})
    return await cursor.to_list(length=None)

async def update_user(user_id, data, db):
    await user_collection(db).update_one(
        {"_id": ObjectId(user_id)},
        {"$set": data}
    )
    return True

async def delete_user(user_id, db):
    await user_collection(db).delete_one({"_id": ObjectId(user_id)})
    return True
