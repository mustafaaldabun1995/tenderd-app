# Migration from MongoDB to Drizzle ORM with SQLite

## Overview
Successfully migrated the Express backend from MongoDB/Mongoose to Drizzle ORM with SQLite database.

## Changes Made

### 1. Dependencies
**Removed:**
- `mongoose`
- `@types/mongoose`

**Added:**
- `drizzle-orm`
- `better-sqlite3`
- `@types/better-sqlite3`
- `drizzle-kit`
- `drizzle-zod`
- `zod`

### 2. Database Configuration
**Created:**
- `drizzle.config.ts` - Drizzle configuration file
- `src/db/schema.ts` - Database schema definition with Drizzle
- `src/db/index.ts` - Database connection setup

### 3. Schema Changes
**Vehicles Table:**
- `id`: Auto-incrementing primary key (was MongoDB ObjectId)
- `model`: Text field (required)
- `type`: Text field (required)
- `status`: Enum field with values ['active', 'maintenance', 'inactive']
- `registrationNumber`: Unique text field (required)
- `location`: Text field (required)
- `lastMaintenance`: Timestamp with Unix epoch default
- `createdAt`: Timestamp with Unix epoch default
- `updatedAt`: Timestamp with Unix epoch default

**New Maintenance Records Table:**
- `id`: Auto-incrementing primary key
- `vehicleId`: Foreign key referencing vehicles.id (cascade delete)
- `description`: Text field for maintenance description
- `cost`: Integer field for cost in cents
- `performedAt`: Timestamp with Unix epoch default
- `createdAt`: Timestamp with Unix epoch default

### 4. API Changes
**Enhanced Endpoints:**
- `GET /api/vehicles` - List all vehicles
- `GET /api/vehicles/:id` - Get specific vehicle
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle
- `POST /api/vehicles/:id/maintenance` - Add maintenance record
- `GET /api/vehicles/:id/maintenance` - **NEW**: Get maintenance history

### 5. Controller Updates
- Replaced Mongoose operations with Drizzle ORM queries
- Added proper TypeScript types from schema
- Enhanced error handling for SQLite constraints
- Added maintenance history functionality

### 6. Database Migration
- Automatic migration on server startup
- SQLite database file: `fleet-management.db`
- Migration files stored in `drizzle/` directory

## New Scripts
Added to `package.json`:
- `db:generate` - Generate new migrations
- `db:migrate` - Run migrations manually  
- `db:studio` - Open Drizzle Studio (database GUI)

## Testing
All endpoints tested and working:
- ✅ Vehicle CRUD operations
- ✅ Maintenance record creation
- ✅ Maintenance history retrieval
- ✅ Unique constraint enforcement
- ✅ Foreign key relationships

## Benefits of Migration
1. **Type Safety**: Full TypeScript support with schema inference
2. **Performance**: SQLite is faster for local development
3. **Simplicity**: No external database server required
4. **Relations**: Proper foreign key relationships
5. **Migrations**: Version-controlled schema changes
6. **Validation**: Built-in Zod schema validation

## Database File Location
- Development: `./fleet-management.db`
- Production: Can be configured via environment variables

## Running the Server
```bash
# Development (port 3001 recommended due to macOS AirTunes on 5000)
PORT=3001 npm run dev

# Production
npm run build
npm start
``` 