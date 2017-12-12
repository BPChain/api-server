cd database || exit 1
docker-compose rm -fv mongodb
docker-compose up
