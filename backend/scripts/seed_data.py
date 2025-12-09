"""
Seed data script for MongoDB collections
Run this script to populate the database with initial data
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app.security.hash import hash_password
from datetime import datetime

async def seed_database():
    """Seed the database with initial data"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DB_NAME]
    
    print("🌱 Starting database seeding...")
    
    # Clear existing data (optional - comment out if you want to keep existing data)
    print("🗑️  Clearing existing data...")
    await db.roles.delete_many({})
    await db.users.delete_many({})
    await db.drone_details.delete_many({})
    await db.farmers.delete_many({})
    await db.billing.delete_many({})
    await db.password_resets.delete_many({})
    
    # 1. Seed Roles
    print("📋 Seeding roles...")
    roles_data = [
        {
            "name": "Admin",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Operator",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Viewer",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    roles_result = await db.roles.insert_many(roles_data)
    admin_role_id = roles_result.inserted_ids[0]
    operator_role_id = roles_result.inserted_ids[1]
    print(f"✅ Created {len(roles_result.inserted_ids)} roles")
    
    # 2. Seed Users
    print("👥 Seeding users...")
    
    # Admin user
    admin_user = {
        "name": "Admin User",
        "email": "admin@shamuga.com",
        "password": hash_password("admin123"),
        "role_id": 1,  # Admin role
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    admin_result = await db.users.insert_one(admin_user)
    admin_user_id = admin_result.inserted_id
    print(f"✅ Created admin user: admin@shamuga.com")
    
    # Drone operators
    operators_data = [
        {
            "name": "Drone Operator 1",
            "email": "drone1@shamuga.com",
            "password": hash_password("password123"),
            "role_id": 2,  # Operator role
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(admin_user_id)
        },
        {
            "name": "Drone Operator 2",
            "email": "drone2@shamuga.com",
            "password": hash_password("password123"),
            "role_id": 2,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(admin_user_id)
        },
        {
            "name": "Drone Operator 3",
            "email": "drone3@shamuga.com",
            "password": hash_password("password123"),
            "role_id": 2,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(admin_user_id)
        }
    ]
    operators_result = await db.users.insert_many(operators_data)
    operator_ids = operators_result.inserted_ids
    print(f"✅ Created {len(operator_ids)} drone operators")
    
    # 3. Seed Drone Details
    print("🚁 Seeding drone details...")
    drones_data = [
        {
            "name": "DJI Agras T30",
            "model": "T30",
            "serial_number": "DJI-T30-001",
            "per_hour_rate": 1500.00,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(admin_user_id)
        },
        {
            "name": "DJI Agras T40",
            "model": "T40",
            "serial_number": "DJI-T40-001",
            "per_hour_rate": 2000.00,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(admin_user_id)
        },
        {
            "name": "XAG P100",
            "model": "P100",
            "serial_number": "XAG-P100-001",
            "per_hour_rate": 1800.00,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(admin_user_id)
        },
        {
            "name": "DJI Agras T20",
            "model": "T20",
            "serial_number": "DJI-T20-001",
            "per_hour_rate": 1200.00,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(admin_user_id)
        }
    ]
    drones_result = await db.drone_details.insert_many(drones_data)
    drone_ids = drones_result.inserted_ids
    print(f"✅ Created {len(drone_ids)} drones")
    
    # 4. Seed Farmers
    print("🌾 Seeding farmers...")
    farmers_data = [
        {
            "name": "Rajesh Kumar",
            "number": "+91 9876543210",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(admin_user_id)
        },
        {
            "name": "Suresh Patel",
            "number": "+91 9876543211",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(admin_user_id)
        },
        {
            "name": "Mahesh Singh",
            "number": "+91 9876543212",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(admin_user_id)
        },
        {
            "name": "Ramesh Reddy",
            "number": "+91 9876543213",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(admin_user_id)
        },
        {
            "name": "Ganesh Rao",
            "number": "+91 9876543214",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(admin_user_id)
        }
    ]
    farmers_result = await db.farmers.insert_many(farmers_data)
    farmer_ids = farmers_result.inserted_ids
    print(f"✅ Created {len(farmer_ids)} farmers")
    
    # 5. Seed Billing Records
    print("💰 Seeding billing records...")
    billing_data = [
        {
            "farmer_id": str(farmer_ids[0]),
            "operator_id": str(operator_ids[0]),
            "drone_id": str(drone_ids[0]),
            "acres": 10.5,
            "time": 2.5,
            "amount": 3750.00,
            "mode_type": "upi",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(admin_user_id)
        },
        {
            "farmer_id": str(farmer_ids[1]),
            "operator_id": str(operator_ids[1]),
            "drone_id": str(drone_ids[1]),
            "acres": 15.0,
            "time": 3.0,
            "amount": 6000.00,
            "mode_type": "cash",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(admin_user_id)
        },
        {
            "farmer_id": str(farmer_ids[2]),
            "operator_id": str(operator_ids[2]),
            "drone_id": str(drone_ids[2]),
            "acres": 8.0,
            "time": 2.0,
            "amount": 3600.00,
            "mode_type": "upi",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(admin_user_id)
        },
        {
            "farmer_id": str(farmer_ids[3]),
            "operator_id": str(operator_ids[0]),
            "drone_id": str(drone_ids[3]),
            "acres": 12.0,
            "time": 3.5,
            "amount": 4200.00,
            "mode_type": "cash",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(admin_user_id)
        },
        {
            "farmer_id": str(farmer_ids[4]),
            "operator_id": str(operator_ids[1]),
            "drone_id": str(drone_ids[0]),
            "acres": 20.0,
            "time": 5.0,
            "amount": 7500.00,
            "mode_type": "upi",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(admin_user_id)
        }
    ]
    billing_result = await db.billing.insert_many(billing_data)
    print(f"✅ Created {len(billing_result.inserted_ids)} billing records")
    
    # Create indexes for better performance
    print("🔍 Creating indexes...")
    await db.users.create_index("email", unique=True)
    await db.drone_details.create_index("serial_number", unique=True)
    await db.roles.create_index("name", unique=True)
    await db.password_resets.create_index("token")
    await db.password_resets.create_index("expires_at", expireAfterSeconds=0)
    print("✅ Created indexes")
    
    print("\n" + "="*50)
    print("🎉 Database seeding completed successfully!")
    print("="*50)
    print("\n📊 Summary:")
    print(f"   • Roles: 3")
    print(f"   • Users: 4 (1 admin + 3 operators)")
    print(f"   • Drones: 4")
    print(f"   • Farmers: 5")
    print(f"   • Billing Records: 5")
    print("\n🔐 Login Credentials:")
    print(f"   Admin: admin@shamuga.com / admin123")
    print(f"   Operators: drone1@shamuga.com / password123")
    print(f"              drone2@shamuga.com / password123")
    print(f"              drone3@shamuga.com / password123")
    print("="*50 + "\n")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
