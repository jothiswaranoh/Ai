# Database Scripts

This directory contains scripts for managing the MongoDB database.

## Scripts

### seed_data.py
Populates the database with sample data for development and testing.

**Usage:**
```bash
python3 scripts/seed_data.py
```

**What it creates:**
- 3 roles (Admin, Operator, Viewer)
- 4 users (1 admin + 3 operators)
- 4 drones with different models and rates
- 5 farmers with contact information
- 5 billing records

**Login Credentials:**
- Admin: `admin@shamuga.com` / `admin123`
- Operators: `drone1@shamuga.com` / `password123`
- Operators: `drone2@shamuga.com` / `password123`
- Operators: `drone3@shamuga.com` / `password123`

---

### clean_database.py
Removes all data from the database.

**Usage:**
```bash
python3 scripts/clean_database.py
```

⚠️ **WARNING:** This will delete ALL data! You must type `DELETE ALL` to confirm.

---

## Quick Start

1. **Clean the database** (optional):
   ```bash
   python3 scripts/clean_database.py
   ```

2. **Seed with sample data**:
   ```bash
   python3 scripts/seed_data.py
   ```

3. **Test login**:
   ```bash
   curl -X POST "http://127.0.0.1:8000/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@shamuga.com", "password": "admin123"}'
   ```

---

## See Also

- [MongoDB Schema Documentation](../docs/MONGODB_SCHEMA.md)
- [API Documentation](http://127.0.0.1:8000/docs)
