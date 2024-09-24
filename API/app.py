from flask import Flask, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This allows cross-origin requests from your React app

# Function to connect to your SQLite3 database
def get_db_connection():
    conn = sqlite3.connect('elo2024Clean.db')  # Replace with your actual database path
    conn.row_factory = sqlite3.Row  # This lets you access rows as dictionaries
    return conn

# Route to get teams data
@app.route('/api/teams', methods=['GET'])
def get_teams():
    conn = get_db_connection()
    teams = conn.execute('SELECT ID, TeamName, Elo, Region FROM Teams').fetchall()
    conn.close()

    teams_list = [dict(team) for team in teams]  # Convert the data to a list of dictionaries

    return jsonify(teams=teams_list)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
