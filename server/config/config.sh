#!/usr/bin/env bash

echo "Configuring database"

export PGPASSWORD='node_password'

#
# Should grab your username
#
dropdb -U jake goblin-shark
createdb -U jake goblin-shark;
psql -U jake goblin-shark < ./server/config/db_setup.sql

echo "Goblin_shark was configered";

node ./server/config/insertFakeData.js


echo "I am done I think!! :)";