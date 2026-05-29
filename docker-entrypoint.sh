#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy --schema=db/schema.prisma

echo "Starting app..."
exec npm start
