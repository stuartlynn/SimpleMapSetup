#!/bin/bash

#ogr2ogr -f "PostgreSQL" PG:"dbname=carto user=carto host=postgis password=password" "data/NewYork.geojson" -nln newyork

#ogr2ogr -f PostgreSQL PG:"dbname=carto user=carto host=postgis password=password" /app/data/15076cda-a509-489d-9726-9be081e23a2f.geojson -nln boots_2
ogr2ogr -f PostgreSQL PG:"dbname=carto user=carto host=postgis password=password" /app/data/ce3ac4c4-376c-4fc6-85d0-41c101e29a17.geojson -nln tracts
