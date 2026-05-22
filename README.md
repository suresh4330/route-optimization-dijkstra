# Route Optimizer Pro — Dijkstra Route Optimization System

![Python](https://img.shields.io/badge/Python-3.9-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-Backend-lightgrey?logo=flask)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)
![License](https://img.shields.io/badge/License-Educational-green)

**Route Optimizer Pro** is a full-stack web application that computes the shortest path between nodes in a user-built graph using Dijkstra's algorithm. Users interactively construct a weighted graph on a visual canvas, select start and end nodes, and receive the optimal route and total distance in real time.

Repository: [https://github.com/suresh4330/route-optimization-dijkstra](https://github.com/suresh4330/route-optimization-dijkstra)

---

## Table of Contents

- [Overview](#overview)
- [Feature Highlights](#feature-highlights)
- [Resume Highlights](#resume-highlights)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Architecture Diagram](#architecture-diagram)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Input Schema](#input-schema)
- [Run Locally](#run-locally)
- [Run with Docker](#run-with-docker)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [Author](#author)
- [License](#license)

---

## Overview

Route Optimizer Pro helps users visualize and solve shortest-path problems using an interactive graph builder. Nodes and weighted edges are created directly on a canvas. Dijkstra's algorithm is executed on the backend and the shortest path is highlighted in the UI, together with the calculated total distance.

The system is containerized with Docker for reproducible deployment and separation of concerns between the frontend and backend services.

---

## Feature Highlights

- Interactive graph builder with add, edit, and delete support for nodes and edges.
- Real-time shortest-path computation using Dijkstra's algorithm.
- Visual path highlighting on the canvas after optimization.
- Weighted edge input with distance labeling.
- Separate Docker containers for frontend (Nginx) and backend (Flask).
- Flask-CORS enabled backend for cross-origin request support.
- Clean REST API for graph optimization queries.

---

## Resume Highlights

- Built and containerized a full-stack route optimization application using Flask, Python, and Docker.
- Implemented Dijkstra's algorithm with a min-heap priority queue for efficient shortest-path computation.
- Designed an interactive graph visualization frontend using the `vis-network` library and vanilla JavaScript.
- Delivered two-service Docker Compose architecture separating frontend (Nginx) and backend (Flask) concerns.
- Added a clean REST API for graph optimization queries with JSON request/response format.

**Resume-ready one-liner:**

> Developed and deployed a full-stack Route Optimization platform using Flask and Dijkstra's algorithm to compute and visualize shortest paths across user-defined weighted graphs, containerized with Docker Compose.

---

## Screenshots

Add screenshots to:

```
docs/screenshots/
```

Suggested file names:

```
docs/screenshots/home.png
docs/screenshots/graph_builder.png
docs/screenshots/path_result.png
```

Markdown snippet:

### Home
![Home](docs/screenshots/home.png)

### Graph Builder
![Graph Builder](docs/screenshots/graph_builder.png)

### Path Result
![Path Result](docs/screenshots/path_result.png)

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 (Vanilla) | Glassmorphism styling and layout |
| JavaScript | Graph interaction and API integration |
| vis-network | Interactive graph canvas rendering |
| Google Fonts (Inter) | Typography |

### Backend

| Technology | Purpose |
|---|---|
| Python 3.9 | Core language |
| Flask | REST API server |
| Flask-CORS | Cross-origin request support |

### Infrastructure

| Technology | Purpose |
|---|---|
| Docker | Container runtime |
| Docker Compose | Multi-service orchestration |
| Nginx | Frontend static file serving |

---

## Architecture

1. User builds a weighted graph on the interactive canvas (nodes + edges).
2. User selects a start node and an end node from dropdowns.
3. Frontend sends a POST request with the graph, start, and end to the Flask backend.
4. Backend runs Dijkstra's algorithm and returns the shortest path and total distance.
5. Frontend highlights the path on the canvas and displays the result.

---

## Architecture Diagram

```
┌─────────────────────────────┐
│         Frontend            │
│   HTML + CSS + JavaScript   │
│   vis-network canvas        │
│   Served by Nginx (:8080)   │
└────────────┬────────────────┘
             │ POST /optimize
             ▼
┌─────────────────────────────┐
│         Backend             │
│   Flask REST API (:5000)    │
│   dijkstra_algo.py          │
│   Returns path + distance   │
└─────────────────────────────┘
```

---

## How It Works

### Graph Building
- Click **Add Node** and then click on the canvas to place a node.
- Click **Add Edge**, then drag from one node to another; enter the edge weight (distance).
- Use **Edit** and **Delete** buttons to modify or remove nodes and edges.

### Route Optimization
- Select **Start Location** and **Destination** from the sidebar dropdowns.
- Click **Find Optimal Route**.
- The backend executes Dijkstra's algorithm using a min-heap priority queue.
- The shortest path and total distance are returned and displayed.

### Algorithm Details
- Uses `heapq` (min-heap) for efficient next-node selection.
- Tracks visited nodes to prevent reprocessing.
- Reconstructs full path by accumulating node list during traversal.
- Returns `([], inf)` if no path exists between the selected nodes.

---

## Project Structure

```
route-optimization-dijkstra/
├── app.py                  # Flask backend and /optimize endpoint
├── dijkstra_algo.py        # Core Dijkstra shortest-path implementation
├── index.html              # Frontend: graph builder UI
├── script.js               # Frontend logic and API integration
├── styles.css              # Glassmorphism UI styling
├── requirements.txt        # Python dependencies (flask, flask-cors)
├── Dockerfile              # Combined Dockerfile (optional)
├── Dockerfile.backend      # Backend container: Python + Flask
├── Dockerfile.frontend     # Frontend container: Nginx static serving
├── docker-compose.yml      # Multi-service orchestration
├── .gitignore
└── README.md
```

---

## API Reference

### `POST /optimize`

Computes the shortest path between two nodes in a weighted graph.

**Request example:**

```json
{
  "graph": {
    "A": { "B": 4, "C": 2 },
    "B": { "A": 4, "D": 5 },
    "C": { "A": 2, "B": 1, "D": 8 },
    "D": { "B": 5, "C": 8 }
  },
  "start": "A",
  "end": "D"
}
```

**Response example:**

```json
{
  "shortest_path": ["A", "C", "B", "D"],
  "total_distance": 10
}
```

**Response when no path exists:**

```json
{
  "shortest_path": [],
  "total_distance": "Infinity"
}
```

---

## Input Schema

### `graph`

An adjacency object where each key is a node name and its value is a map of neighboring nodes with their edge weights.

```
{
  "<node>": {
    "<neighbor>": <weight (number)>,
    ...
  },
  ...
}
```

### `start`

String. The label of the starting node.

### `end`

String. The label of the destination node.

---

## Run Locally

### Without Docker

```bash
# Clone the repository
git clone https://github.com/suresh4330/route-optimization-dijkstra
cd route-optimization-dijkstra

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start the backend
python app.py
```

Open the frontend by serving `index.html` from a local static server or directly in your browser:

```
http://127.0.0.1:5000       # Backend API
```

> **Note:** If the backend is running on port 5000, open `index.html` directly in the browser. The `script.js` is configured to call `http://localhost:5000/optimize`.

---

## Run with Docker

```bash
# Build and start both services
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:5000/optimize |

To stop and remove containers:

```bash
docker-compose down
```

---

## Troubleshooting

**Frontend cannot reach backend:**
- Ensure the backend container is running on port `5000`.
- Check that `script.js` targets `http://localhost:5000/optimize`.
- Verify Flask-CORS is installed and active in `app.py`.

**`docker-compose up` fails:**
- Confirm Docker Desktop is running.
- Check that ports `5000` and `8080` are not in use by other processes.
- Try `docker-compose down` before re-running `--build`.

**Dijkstra returns no path:**
- Ensure the graph has a valid connection between the start and end nodes.
- An isolated node or missing edge will cause the algorithm to return `([], inf)`.

**Graph resets unexpectedly:**
- The graph is held in frontend state only. Refreshing the page clears all nodes and edges.

---

## FAQ

**Why use Dijkstra's algorithm?**
Dijkstra's algorithm is optimal for graphs with non-negative edge weights and provides guaranteed shortest-path results efficiently using a min-heap (O((V + E) log V)).

**Can the graph have cycles?**
Yes. Dijkstra's algorithm handles cycles correctly by tracking visited nodes and skipping already-settled nodes.

**Is negative edge weight supported?**
No. Dijkstra's algorithm requires non-negative weights. For graphs with negative weights, use the Bellman-Ford algorithm instead.

**Why are frontend and backend in separate containers?**
Separation of concerns: the Nginx container efficiently serves static files while the Flask container handles computation, making each independently scalable and replaceable.

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "Add your feature"`.
4. Push to your branch: `git push origin feature/your-feature`.
5. Open a pull request against `main`.

---

## Roadmap

- [ ] Support for directed graphs (one-way edges).
- [ ] Add Bellman-Ford algorithm for negative-weight edge support.
- [ ] Save and load graph configurations (JSON export/import).
- [ ] Multi-stop route optimization (Traveling Salesman Problem approximation).
- [ ] Animated step-by-step visualization of the Dijkstra traversal.
- [ ] Mobile-responsive UI refinement.

---

## Author

**Suresh**
GitHub: [suresh4330](https://github.com/suresh4330)

---

## License

This project is intended for educational and academic use.
