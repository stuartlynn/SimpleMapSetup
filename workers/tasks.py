import os
import time
from celery import Celery
from sklearn.datasets import make_gaussian_quantiles
import numpy as np
import pandas as pd
import psycopg2

DATABASE_HOST = os.environ.get('PGHOST', 'postgis')
DATABASE_PORT= os.environ.get('PGPORT', 5432)
DATABASE_USER= os.environ.get('PGUSER', 5432)
DATABASE_PASSWORD= os.environ.get('PGPASSWORD', 'password')

CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379'),
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379')

celery = Celery('tasks', broker=CELERY_BROKER_URL, backend=CELERY_RESULT_BACKEND)

conn = psycopg2.connect(database=DATABASE_USER, user=DATABASE_USER, password=DATABASE_PASSWORD, host=DATABASE_HOST, port=DATABASE_PORT)

@celery.task(name='tasks.add')
def add(x, y):
    time.sleep(5)
    return x + y

@celery.task(name='tasks.make_gaussian')
def gauss():
    return pd.DataFrame({'x3': np.random.normal(0, 0.1, 1000), 'y':np.random.normal(0, 0.1, 1000)}).to_csv()

@celery.task(name='tasks.umap')
def umap(table):
    data = pd.read_sql('select * from {} t '.format(table), con=conn)
    data.drop(['geometry'])
    id_col = data.pop('id')
    embedding = umap.UMAP(n_neighbors=5,
              min_dist=0.3,
              metric='correlation')
    embedding.fit_transform(data)
    return data.to_csv()
