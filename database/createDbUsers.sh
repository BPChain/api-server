#!/usr/bin/env bash
echo "Creating mongo users..."
export $(grep -v ^# .env | xargs)
docker exec mongodb mongo admin --host localhost -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --eval \
  "db.createUser({user: '$MONGO_ADD_CHAINBOARDDBUSER_USERNAME', pwd: '$MONGO_ADD_CHAINBOARDDBUSER_PASSWORD', \
  roles: [{role: 'readWrite', db: 'chainboarddb'}]}); \
  db.createUser({user: '$MONGO_ADD_USERADMIN_USERNAME', pwd: '$MONGO_ADD_USERADMIN_PASSWORD', \
  roles: [{role: 'userAdminAnyDatabase', db: 'admin'}]});"
echo "Mongo users created."
