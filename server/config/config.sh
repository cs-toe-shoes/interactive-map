#!/usr/bin/env bash

echo "Configuring database"

export PGPASSWORD='node_password'

#
# Should grab your username
#

dropdb -U $USER goblin-shark
createdb -U $USER goblin-shark;
psql -U $USER goblin-shark < ./server/config/db_setup.sql

echo "Goblin_shark was configered";

node ./server/config/insertFakeData.js

echo "I am done I think!! :)";