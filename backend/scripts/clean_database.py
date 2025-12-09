"""
Clean database script - removes all data from MongoDB collections
WARNING: This will delete ALL data from the database!
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

async def clean_database():
    """Remove all data from all collections"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DB_NAME]
    
    print("⚠️  WARNING: This will delete ALL data from the database!")
    print(f"Database: {settings.DB_NAME}")
    
    # Ask for confirmation
    confirmation = input("\nType 'DELETE ALL' to confirm: ")
    
    if confirmation != "DELETE ALL":
        print("❌ Operation cancelled")
        client.close()
        return
    
    print("\n🗑️  Cleaning database...")
    
    # Delete all documents from each collection
    collections = [
        "roles",
        "users",
        "drone_details",
        "farmers",
        "billing",
        "password_resets"
    ]
    
    for collection_name in collections:
        result = await db[collection_name].delete_many({})
        print(f"   ✅ Deleted {result.deleted_count} documents from {collection_name}")
    
    print("\n✨ Database cleaned successfully!")
    print("\n💡 Tip: Run 'python3 scripts/seed_data.py' to populate with sample data")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(clean_database())
