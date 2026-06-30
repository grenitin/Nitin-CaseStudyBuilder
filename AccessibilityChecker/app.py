from flask import Flask, render_template, request, jsonify
from scripts.checker import analyze_url

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    url = data.get('url')
    
    api_key = data.get('apiKey')
    provider = data.get('provider')
    
    if not url:
        return jsonify({"error": "No URL provided"}), 400
        
    # Execute the objective rule checks with Visual Engine
    result = analyze_url(url, api_key=api_key, provider=provider)
    
    if result.get("status") == "error":
        return jsonify({
            "error": result.get("error"), 
            "screenshot": result.get("screenshot")
        }), 400
        
    # Note: Subjective rules using the LLM (api_key, provider) will be integrated here next.
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
