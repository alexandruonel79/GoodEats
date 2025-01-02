import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Set up the Gemini API Key
GEMINI_API_KEY = "AIzaSyDTG6s_HsdCJ4WiSDGCpOizWVVxJSkvkTI"  # Replace with your API key

# Configure the Generative AI API
genai.configure(api_key=GEMINI_API_KEY)

# Initialize the model (Gemini model)
model = genai.GenerativeModel("gemini-1.5-flash")

# System message to establish context
SYSTEM_PROMPT = (
    "You are an intelligent assistant for the GoodEats application. "
        "GoodEats is an interactive platform designed for food enthusiasts, tourists, and individuals passionate about exploring new restaurants. "
        "The application allows users to search for restaurants by type and distance, rate them, and propose new restaurants. "
        "Restaurants are displayed on an interactive ArcGIS map of Bucharest, and users can apply advanced filters based on cuisine, rating, and distance. "
        "Users can also publish posts to promote their favorite restaurants and interact socially by sharing comments and images. "
        "Admins must approve restaurants before they appear on the map to ensure quality and relevance. "
        "The platform features advanced functionalities such as user authentication, secure data handling, and interactive notifications. "
        "GoodEats distinguishes itself from platforms like TripAdvisor, Yelp, and Zomato by enabling social interactions, custom posts, and detailed filtering on a map. "
        "Your role is to assist users with tasks related to managing restaurants, reviewing cuisines, exploring the interactive map, and engaging with the community. "
        "When answering questions, always prioritize providing clear, accurate, and helpful responses specific to GoodEats functionality."
)

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get("message", "")
    if not user_input:
        return jsonify({"error": "Message is required"}), 400

    try:
        # Combine the system prompt with the user's input
        full_prompt = f"{SYSTEM_PROMPT}\nUser: {user_input}"

        # Generate content using the Gemini API
        response = model.generate_content(full_prompt)

        # Return the reply text
        return jsonify({"reply": response.text})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=8000, debug=True)












import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Set up the Gemini API Key
GEMINI_API_KEY = "AIzaSyDTG6s_HsdCJ4WiSDGCpOizWVVxJSkvkTI"  # Replace with your API key
genai.configure(api_key=GEMINI_API_KEY)

# Mock database for restaurants
restaurants = []  # Stores restaurant data
pending_approval = []  # Stores restaurants waiting for admin approval

# Helper function to inject context into user input
def add_context_to_prompt(user_input):
    context = (
        "You are an assistant for a restaurant application. "
        "The application lets users add restaurants and rate them. "
        "Restaurants are categorized by cuisine and appear on an ArcGIS map of Bucharest. "
        "Admins must approve restaurants before they appear on the map. "
        "Assist users in tasks related to restaurants, cuisines, and map integration."
    )
    return f"{context}\nUser: {user_input}"

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get("message", "")
    if not user_input:
        return jsonify({"error": "Message is required"}), 400

    try:
        # Prepend context to the user input
        prompt = add_context_to_prompt(user_input)

        # Generate content using the Gemini API
        response = genai.generate_text(prompt, max_output_tokens=200)
        reply = response["text"]

        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/add_restaurant', methods=['POST'])
def add_restaurant():
    data = request.json
    name = data.get("name")
    cuisine = data.get("cuisine")
    rating = data.get("rating")

    if not all([name, cuisine]):
        return jsonify({"error": "Name and cuisine are required"}), 400

    # Add the restaurant to the pending approval list
    pending_approval.append({
        "name": name,
        "cuisine": cuisine,
        "rating": rating or None
    })

    return jsonify({"message": "Restaurant submitted for approval."}), 200

@app.route('/approve_restaurant', methods=['POST'])
def approve_restaurant():
    data = request.json
    name = data.get("name")

    # Check if the restaurant is in the pending approval list
    for restaurant in pending_approval:
        if restaurant["name"] == name:
            restaurants.append(restaurant)
            pending_approval.remove(restaurant)
            return jsonify({"message": f"Restaurant '{name}' approved and added to the map."}), 200

    return jsonify({"error": "Restaurant not found in pending approvals."}), 404

@app.route('/list_restaurants', methods=['GET'])
def list_restaurants():
    return jsonify({"restaurants": restaurants}), 200

@app.route('/list_pending', methods=['GET'])
def list_pending():
    return jsonify({"pending_approval": pending_approval}), 200

if __name__ == '__main__':
    app.run(port=8000, debug=True)
