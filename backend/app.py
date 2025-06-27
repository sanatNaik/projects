from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import T5Tokenizer, T5ForConditionalGeneration
import os
import requests
from dotenv import load_dotenv
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("Loaded API key:", GEMINI_API_KEY is not None)

app = Flask(__name__)
CORS(app)

# Summarization function
def get_summary(text, system_prompt):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": system_prompt},
                    {"text": text}
                ]
            }
        ]
    }
    response = requests.post(url, headers=headers, json=payload)
    result = response.json()
    summary = result["candidates"][0]["content"]["parts"][0]["text"]
    return summary

# Endpoint to receive text and return summary
@app.route('/summarize', methods=['POST'])
def summarize_api():
    data = request.get_json()
    text = data.get("text", "")
    summary_type = data.get("summary_type", "")
    print(text)

    if summary_type == "Short":
        system_prompt = "You are a helpful ai model used to summarize the given text in a well structured manner\
                        The user has asked for a short summary so make sure only the most useful information is added in your response \
                        No external information should be used and the response should not contain any supporting text other than the summary required. \
                        Keep your reponse short and simple highlighting important phrases."
        
    elif summary_type == "Detailed":
        system_prompt = "You are a helpful ai model used to summarize the given text in a well structured manner \
                        The user has asked for a detailed summary so make sure that all relevent information is included in your response with well defined terms. \
                        No external information should be used and the response should not contain any supporting text other than the summary required. \
                        Make your response detailed and well defined."
        
    if not text.strip():
        return jsonify({"error": "Text is required"}), 400

    try:
        summary = get_summary(text, system_prompt)
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run locally
if __name__ == '__main__':
    app.run(debug=True)