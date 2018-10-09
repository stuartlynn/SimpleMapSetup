# Simple Map Setup

This is a really simple setup to bring together

- A Postgis database
- A React based frontend
- A Python API server
- Cellery workers
- A MVT Tiler
- A Jupyter notebook server

To enable rapid development of Geospatial applications that need to quickly be
able to show data and run complex analysis on that data.

## How to run ?

```bash
git clone git@github.com:stuartlynn/SimpleMapSetup.git
cd SimpleMapSetup/
docker-compose up
```

## What does this give you?

This runs a bunch of servers:

- A postgresql server accesable on port 5432
- A frontend server at [http://localhost:8884/](http://localhost:8884/)
- A pyhton API at [http://localhost:8885](http://localhost:8885)
- A celery job monitor at [http://localhost:5555](http://localhost:5555)
- A notebook server at [http://localhost:8882](http://localhost:8882)
- A MVT tiler at [http://localhost:8886](http://localhost:8886)


## The tiler

The tiler has two endpoints that are worth calling out

### Query

```
/query?q='select * from some table'
```

which will execute the requested query and return the results

### Tiles

```
/tiles/:z/:x/:y.mvt?q=select * from sometable
```

where x,y and z are the standard tile coordinates and the q param is the query

## The API server

The API server is where you can create endpoints to work on the data or perform
other tasks. Short jobs can be run in a route but create worker tasks for long
running jobs.

## Worker tasks

Define worker tasks in `workers/tasks.py` these can then be called from an API endpoint


## To Do

- [ ] Create an example frontend react app
- [ ] Make a data upload service to make it easy to pull data in to the system
- [ ] Slim down the docker images


