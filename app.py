from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)
DATABASE = 'database.db'

def init_db():
    with sqlite3.connect(DATABASE) as conn:
        with open('schema.sql') as f:
            conn.executescript(f.read())

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/issues', methods=['GET'])
def get_issues():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, description, priority FROM issues ORDER BY id DESC")
    issues = [dict(id=row[0], title=row[1], description=row[2], priority=row[3]) for row in cursor.fetchall()]
    conn.close()
    return jsonify(issues)

@app.route('/api/issues', methods=['POST'])
def create_issue():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    priority = data.get('priority')

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO issues (title, description, priority) VALUES (?, ?, ?)",
                   (title, description, priority))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Issue created successfully'}), 201

@app.route('/api/issues/<int:issue_id>', methods=['DELETE'])
def delete_issue(issue_id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM issues WHERE id = ?", (issue_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Issue deleted successfully'})

@app.route('/api/issues/<int:issue_id>', methods=['PUT'])
def update_issue(issue_id):
    data = request.json
    title = data.get('title')
    description = data.get('description')
    priority = data.get('priority')

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE issues
        SET title = ?, description = ?, priority = ?
        WHERE id = ?
    """, (title, description, priority, issue_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Issue updated successfully'})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
