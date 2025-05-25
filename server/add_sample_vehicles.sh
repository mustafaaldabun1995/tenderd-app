#!/bin/bash

echo "Adding sample vehicles to the database..."

curl -X POST http://localhost:5001/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"model": "Chevrolet Silverado", "type": "Truck", "registrationNumber": "CHV005", "location": "Loading Dock", "status": "active"}' \
  && echo ""

curl -X POST http://localhost:5001/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"model": "Audi A4", "type": "Sedan", "registrationNumber": "AUD006", "location": "Warehouse C", "status": "active"}' \
  && echo ""

curl -X POST http://localhost:5001/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"model": "Nissan Altima", "type": "Sedan", "registrationNumber": "NIS007", "location": "Main Depot", "status": "inactive"}' \
  && echo ""

curl -X POST http://localhost:5001/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"model": "Jeep Wrangler", "type": "SUV", "registrationNumber": "JEE008", "location": "Off-site", "status": "active"}' \
  && echo ""

curl -X POST http://localhost:5001/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"model": "Hyundai Elantra", "type": "Sedan", "registrationNumber": "HYU009", "location": "Warehouse A", "status": "maintenance"}' \
  && echo ""

curl -X POST http://localhost:5001/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"model": "Mercedes-Benz Sprinter", "type": "Van", "registrationNumber": "MB010", "location": "Service Center", "status": "active"}' \
  && echo ""

echo "Sample vehicles added successfully!" 