import os
import time
from celery import Celery
from sklearn.datasets import make_gaussian_quantiles
import numpy as np
import pandas as pd

CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379'),
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379')

celery = Celery('tasks', broker=CELERY_BROKER_URL, backend=CELERY_RESULT_BACKEND)


@celery.task(name='tasks.add')
def add(x, y):
    time.sleep(5)
    return x + y

@celery.task(name='tasks.make_gaussian')
def gauss():
    return pd.DataFrame({'x3': np.random.normal(0, 0.1, 1000), 'y':np.random.normal(0, 0.1, 1000)}).to_csv()
