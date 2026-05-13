from flask import Flask, request, jsonify
from flask_cors import CORS
from dijkstra_algo import dijkstra_shortest_path

app = Flask(__name__)
CORS(app)

@app.route("/optimize", methods=["POST"])
def optimize():
    data = request.json
    graph = data.get("graph")
    start = data.get("start")
    end = data.get("end")

    path, distance = dijkstra_shortest_path(graph, start, end)
    return jsonify({
        "shortest_path": path,
        "total_distance": distance
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
