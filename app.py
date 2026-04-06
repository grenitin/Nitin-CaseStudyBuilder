from flask import Flask, request, jsonify, render_template
import os
import subprocess
import pandas as pd
from urllib.parse import urlparse
import time

app = Flask(__name__)
AUDIT_FOLDER = 'UX Audit'

@app.route('/')
def index():
    audits = []
    if os.path.exists(AUDIT_FOLDER):
        for f in os.listdir(AUDIT_FOLDER):
            if f.endswith('.csv'):
                brand = f.split('_')[0]
                audits.append({'brand': brand, 'file': f})
                
    # Sort them alphabetically
    audits = sorted(audits, key=lambda d: d['brand'])
    return render_template('index.html', audits=audits)

@app.route('/evaluate', methods=['POST'])
def evaluate():
    data = request.json
    url = data.get('url')
    api_key = data.get('api_key')
    
    if not url: return jsonify({'error': 'URL is required'}), 400
    if not api_key: return jsonify({'error': 'Gemini API Key is required'}), 400
    
    from ai_evaluator import run_ux_audit_worker, TASKS
    import threading
    import uuid
    
    task_id = str(uuid.uuid4())
    TASKS[task_id] = {"status": "Starting up...", "complete": False, "error": None}
    
    thread = threading.Thread(target=run_ux_audit_worker, args=(task_id, url, api_key))
    thread.daemon = True
    thread.start()
    
    return jsonify({'success': True, 'task_id': task_id})

@app.route('/status/<task_id>')
def get_status(task_id):
    from ai_evaluator import TASKS
    if task_id not in TASKS:
        return jsonify({'error': 'Task not found'}), 404
    return jsonify(TASKS[task_id])

@app.route('/view/<brand>')
def view(brand):
    # Find matching file
    filename = None
    if os.path.exists(AUDIT_FOLDER):
        for f in os.listdir(AUDIT_FOLDER):
            if f.startswith(brand) and f.endswith('.csv'):
                filename = f
                break
                
    if not filename:
        return "Audit not found", 404
        
    filepath = os.path.join(AUDIT_FOLDER, filename)
    df = pd.read_csv(filepath)
    df = df.fillna('')
    data = df.to_dict('records')
    
    return render_template('view.html', brand=brand, data=data)

if __name__ == '__main__':
    app.run(debug=True, port=8080)
