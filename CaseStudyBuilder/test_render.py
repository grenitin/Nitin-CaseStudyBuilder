import json
from flask import Flask, render_template
import os

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route('/')
def test():
    with open('data/tasks/c57ca5fd-aa69-418a-ad4d-586b55ddc221_result.json', 'r') as f:
        data = json.load(f)
    return render_template('case_study_render.html', **data)

if __name__ == '__main__':
    with app.test_request_context('/'):
        try:
            res = test()
            print("SUCCESS! Render length:", len(res))
        except Exception as e:
            import traceback
            traceback.print_exc()
