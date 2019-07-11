#!/usr/bin/env bash

echo "Configuring database"

export PGPASSWORD='node_password'

#
# Should grab your username
#
dropdb -U joshuakim goblin-shark
createdb -U joshuakim goblin-shark;
psql -U joshuakim goblin-shark < ./server/config/db_setup.sql

echo "Goblin_shark was configered";

node ./server/config/insertFakeData.js

echo "I am done I think!! :)";