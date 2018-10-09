from flask import Flask
from flask import url_for
from worker import celery
import celery.states as states

app = Flask(__name__)


@app.route('/')
def home():
    return 'hey its me mario'

@app.route('/add/<int:param1>/<int:param2>')
def add(param1, param2):
    task = celery.send_task('tasks.add', args=[param1, param2], kwargs={})
    response = "<a href='{url}'>check status of {id} </a>".format(id=task.id,
                                                                  url=url_for('check_task', task_id=task.id, external=True))
    return response

@app.route('/gauss')
def gauss():
    task = celery.send_task('tasks.make_gaussian',args=[],kwargs={})
    response = "<a href='{url}'>check status of {id} </a>".format(id=task.id,
                                                                  url=url_for('check_task', task_id=task.id, external=True))
    return response

@app.route('/check/<string:task_id>')
def check_task(task_id):
    res = celery.AsyncResult(task_id)
    if res.state == states.PENDING:
        return res.state
    else:
        return str(res.result)

