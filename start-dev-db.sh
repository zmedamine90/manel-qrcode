#!/bin/bash
set -e


docker volume create --name manel_db_data -d local

docker-compose -f docker-compose.yml up -d --remove-orphans
