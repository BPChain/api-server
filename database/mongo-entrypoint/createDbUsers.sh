#!/usr/bin/env bash
echo "Creating mongo users..."
mongo admin --host localhost -u 'root' -p 'test' --eval \
  "db.createUser({user: 'chainboardUser', pwd: 'password', \
  roles: [{role: 'readWrite', db: 'chainboarddb'}]}); \
  db.createUser({user: 'admin', pwd: 'PASS', \
  roles: [{role: 'userAdminAnyDatabase', db: 'admin'}]});"
echo "Mongo users created."
