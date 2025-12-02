# MongoDB Schema Documentation

## Collections Overview

The application uses MongoDB with the following collections:

1. **roles** - User role definitions
2. **users** - User accounts and authentication
3. **drone_details** - Drone inventory and specifications
4. **farmers** - Farmer contact information
5. **billing** - Billing and transaction records
6. **password_resets** - Password reset tokens (temporary)

---

## Collection Schemas

### 1. roles
Stores user role definitions (Admin, Operator, Viewer, etc.)

```javascript
{
  _id: ObjectId,
  name: String (unique),
  created_at: DateTime,
  updated_at: DateTime,
  created_by: String (user_id),
  updated_by: String (user_id)
}
```

**Indexes:**
- `name` (unique)

---

### 2. users
User accounts with authentication and role assignment

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role_id: Number,
  is_active: Boolean,
  created_at: DateTime,
  updated_at: DateTime,
  created_by: String (user_id),
  updated_by: String (user_id)
}
```

**Indexes:**
- `email` (unique)

**Role IDs:**
- `1` = Admin
- `2` = Operator
- `3` = Viewer

---

### 3. drone_details
Drone inventory with specifications and pricing

```javascript
{
  _id: ObjectId,
  name: String,
  model: String,
  serial_number: String (unique),
  per_hour_rate: Number (decimal),
  created_at: DateTime,
  updated_at: DateTime,
  created_by: String (user_id),
  updated_by: String (user_id)
}
```

**Indexes:**
- `serial_number` (unique)

---

### 4. farmers
Farmer contact information

```javascript
{
  _id: ObjectId,
  name: String,
  number: String,
  created_at: DateTime,
  updated_at: DateTime,
  created_by: String (user_id),
  updated_by: String (user_id)
}
```

---

### 5. billing
Billing and transaction records

```javascript
{
  _id: ObjectId,
  farmer_id: String (ObjectId reference),
  operator_id: String (ObjectId reference),
  drone_id: String (ObjectId reference),
  acres: Number (decimal),
  time: Number (decimal, hours),
  amount: Number (decimal),
  mode_type: String (enum: "cash", "upi"),
  created_at: DateTime,
  updated_at: DateTime,
  created_by: String (user_id),
  updated_by: String (user_id)
}
```

**Payment Modes:**
- `cash` - Cash payment
- `upi` - UPI/Digital payment

---

### 6. password_resets
Temporary password reset tokens (auto-expires after 1 hour)

```javascript
{
  _id: ObjectId,
  email: String,
  token: String,
  expires_at: DateTime,
  used: Boolean
}
```

**Indexes:**
- `token`
- `expires_at` (TTL index, auto-delete expired documents)

---

## Audit Fields

All main collections include audit fields for tracking:

- `created_at` - Timestamp when record was created
- `updated_at` - Timestamp when record was last updated
- `created_by` - User ID who created the record
- `updated_by` - User ID who last updated the record

---

## Seeding the Database

### Run Seed Script
```bash
python3 scripts/seed_data.py
```

This will create:
- 3 roles (Admin, Operator, Viewer)
- 1 admin user + 3 operators
- 4 sample drones
- 5 sample farmers
- 5 sample billing records

### Default Credentials

**Admin Account:**
- Email: `admin@shamuga.com`
- Password: `admin123`

**Operator Accounts:**
- Email: `drone1@shamuga.com` / Password: `password123`
- Email: `drone2@shamuga.com` / Password: `password123`
- Email: `drone3@shamuga.com` / Password: `password123`

---

## Clean Database

To remove all data from the database:

```bash
python3 scripts/clean_database.py
```

⚠️ **WARNING:** This will delete ALL data! You'll need to type `DELETE ALL` to confirm.

---

## Sample Data

### Sample Drones
- DJI Agras T30 (₹1500/hour)
- DJI Agras T40 (₹2000/hour)
- XAG P100 (₹1800/hour)
- DJI Agras T20 (₹1200/hour)

### Sample Farmers
- Rajesh Kumar (+91 9876543210)
- Suresh Patel (+91 9876543211)
- Mahesh Singh (+91 9876543212)
- Ramesh Reddy (+91 9876543213)
- Ganesh Rao (+91 9876543214)

### Sample Billing Records
Various billing records with different:
- Acreage (8-20 acres)
- Time (2-5 hours)
- Payment modes (cash/UPI)
- Amounts (₹3600-₹7500)

---

## Migration from PostgreSQL

The schema has been converted from PostgreSQL to MongoDB with the following changes:

1. **Primary Keys**: `SERIAL` → `ObjectId` (MongoDB's default `_id`)
2. **Foreign Keys**: References stored as strings (ObjectId as string)
3. **Constraints**: 
   - `UNIQUE` → MongoDB unique indexes
   - `CHECK` → Pydantic model validation
   - `REFERENCES` → Application-level validation
4. **Timestamps**: `TIMESTAMP` → Python `datetime` objects
5. **Decimals**: `DECIMAL(10,2)` → Python `float`

---

## Best Practices

1. **Always use indexes** for frequently queried fields
2. **Store ObjectIds as strings** when referencing other documents
3. **Use TTL indexes** for temporary data (like password reset tokens)
4. **Validate data** at the application level using Pydantic models
5. **Maintain audit trails** using created_at/updated_at fields
