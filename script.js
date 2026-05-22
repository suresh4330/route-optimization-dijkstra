const API_URL = "https://route-optimizer-backend.onrender.com/optimize"; // Replace with your actual Render backend URL

// --- Vis.js Network Setup ---
let nodes = new vis.DataSet([
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' },
    { id: 'C', label: 'C' },
    { id: 'D', label: 'D' },
    { id: 'E', label: 'E' }
]);

let edges = new vis.DataSet([
    { id: 'e1', from: 'A', to: 'B', label: '4', weight: 4 },
    { id: 'e2', from: 'A', to: 'C', label: '2', weight: 2 },
    { id: 'e3', from: 'B', to: 'C', label: '1', weight: 1 },
    { id: 'e4', from: 'B', to: 'D', label: '5', weight: 5 },
    { id: 'e5', from: 'C', to: 'D', label: '8', weight: 8 },
    { id: 'e6', from: 'C', to: 'E', label: '10', weight: 10 },
    { id: 'e7', from: 'D', to: 'E', label: '2', weight: 2 }
]);

let container = document.getElementById('network');
let data = { nodes: nodes, edges: edges };
let options = {
    nodes: {
        shape: 'dot',
        size: 25,
        font: { size: 18, color: '#ffffff', face: 'Inter', bold: true },
        borderWidth: 2,
        color: {
            background: '#3b82f6',
            border: '#2563eb',
            highlight: { background: '#10b981', border: '#059669' }
        },
        shadow: true
    },
    edges: {
        width: 3,
        font: { size: 16, color: '#ffffff', strokeWidth: 3, strokeColor: '#0f172a', align: 'top' },
        color: { color: '#94a3b8', highlight: '#10b981' },
        arrows: { to: { enabled: true, scaleFactor: 0.5 } },
        smooth: { type: 'dynamic' }
    },
    manipulation: {
        enabled: true,
        addNode: function (data, callback) {
            let label = prompt("Enter Node Name (e.g., F):", "F");
            if (label) {
                data.id = label;
                data.label = label;
                callback(data);
                updateDropdowns();
            }
        },
        addEdge: function (data, callback) {
            if (data.from !== data.to) {
                let weight = prompt("Enter distance/weight for this route:", "5");
                if (weight && !isNaN(weight)) {
                    data.label = weight;
                    data.weight = parseInt(weight);
                    callback(data);
                }
            }
        },
        editEdge: {
            editWithoutDrag: function(data, callback) {
                let weight = prompt("Enter new distance/weight:", data.label || "5");
                if (weight && !isNaN(weight)) {
                    data.label = weight;
                    data.weight = parseInt(weight);
                    callback(data);
                } else {
                    callback(null); // Cancel
                }
            }
        },
        editNode: function (data, callback) {
            let label = prompt("Enter new Node Name:", data.label);
            if (label) {
                data.label = label;
                callback(data);
                setTimeout(updateDropdowns, 100);
            } else {
                callback(null);
            }
        },
        deleteNode: function(data, callback) {
            callback(data);
            setTimeout(updateDropdowns, 100);
        }
    },
    physics: {
        barnesHut: { gravitationalConstant: -3000, springLength: 150 }
    }
};

let network = new vis.Network(container, data, options);

// Double click to edit seamlessly
network.on("doubleClick", function (params) {
    if (params.nodes.length > 0) {
        let nodeId = params.nodes[0];
        let node = nodes.get(nodeId);
        let newLabel = prompt("Enter new Node Name:", node.label);
        if (newLabel) {
            nodes.update({id: nodeId, label: newLabel});
            updateDropdowns();
        }
    } else if (params.edges.length > 0) {
        let edgeId = params.edges[0];
        let edge = edges.get(edgeId);
        let newWeight = prompt("Enter new distance/weight:", edge.label);
        if (newWeight && !isNaN(newWeight)) {
            edges.update({id: edgeId, label: newWeight, weight: parseInt(newWeight)});
        }
    }
});

// --- UI Logic ---
function updateDropdowns() {
    const startSelect = document.getElementById('startNode');
    const endSelect = document.getElementById('endNode');
    
    // Save current selections
    const currentStart = startSelect.value;
    const currentEnd = endSelect.value;
    
    startSelect.innerHTML = '';
    endSelect.innerHTML = '';
    
    const allNodes = nodes.get();
    allNodes.forEach(node => {
        let opt1 = document.createElement('option');
        opt1.value = node.id;
        opt1.textContent = `Node ${node.id}`;
        startSelect.appendChild(opt1);
        
        let opt2 = document.createElement('option');
        opt2.value = node.id;
        opt2.textContent = `Node ${node.id}`;
        endSelect.appendChild(opt2);
    });
    
    // Restore selections if they still exist
    if (allNodes.find(n => n.id === currentStart)) startSelect.value = currentStart;
    if (allNodes.find(n => n.id === currentEnd)) endSelect.value = currentEnd;
    
    // Default fallback if empty
    if (!startSelect.value && allNodes.length > 0) startSelect.value = allNodes[0].id;
    if (!endSelect.value && allNodes.length > 1) endSelect.value = allNodes[allNodes.length-1].id;
}

// Initial population
updateDropdowns();

function extractGraph() {
    let graph = {};
    
    // Initialize empty object for every node
    nodes.get().forEach(node => {
        graph[node.id] = {};
    });
    
    // Populate edges
    edges.get().forEach(edge => {
        // Directed graph based on arrows
        graph[edge.from][edge.to] = parseInt(edge.weight || edge.label);
    });
    
    return graph;
}

function resetHighlighting() {
    let allEdges = edges.get();
    let allNodes = nodes.get();
    
    let updatedEdges = allEdges.map(e => ({...e, color: {color: '#94a3b8'}, width: 3}));
    let updatedNodes = allNodes.map(n => ({...n, color: {background: '#3b82f6', border: '#2563eb'}}));
    
    edges.update(updatedEdges);
    nodes.update(updatedNodes);
}

async function optimize() {
    const startNode = document.getElementById('startNode').value;
    const endNode = document.getElementById('endNode').value;
    const btn = document.getElementById('optimizeBtn');
    const spinner = btn.querySelector('.spinner');
    const btnText = btn.querySelector('.btn-text');
    const resultContainer = document.getElementById('resultContainer');
    const errorContainer = document.getElementById('errorContainer');
    const routeDisplay = document.getElementById('routeDisplay');
    const distanceValue = document.getElementById('distanceValue');
    const errorMsg = document.getElementById('errorMsg');

    if (!startNode || !endNode) {
        alert("Please add nodes to the canvas first.");
        return;
    }

    // Reset UI
    resultContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
    btn.disabled = true;
    btnText.textContent = "Calculating...";
    spinner.classList.remove('hidden');
    resetHighlighting();

    try {
        const dynamicGraph = extractGraph();
        
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                start: startNode,
                end: endNode,
                graph: dynamicGraph
            })
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();
        await new Promise(r => setTimeout(r, 600));

        if (data.shortest_path && data.shortest_path.length > 0) {
            // Render route visual in sidebar
            routeDisplay.innerHTML = '';
            data.shortest_path.forEach((node, index) => {
                const nodeEl = document.createElement('div');
                nodeEl.className = 'node';
                nodeEl.style.animationDelay = `${index * 0.15}s`;
                nodeEl.textContent = node;
                routeDisplay.appendChild(nodeEl);

                if (index < data.shortest_path.length - 1) {
                    const arrowEl = document.createElement('div');
                    arrowEl.className = 'arrow';
                    arrowEl.style.animationDelay = `${(index * 0.15) + 0.07}s`;
                    arrowEl.textContent = '→';
                    routeDisplay.appendChild(arrowEl);
                }
            });

            distanceValue.textContent = data.total_distance;
            resultContainer.classList.remove('hidden');

            // --- Highlight Path on the Vis.js Canvas ---
            let pathNodes = data.shortest_path;
            
            // Highlight nodes
            let updatedNodes = pathNodes.map(nodeId => ({
                id: nodeId,
                color: { background: '#10b981', border: '#059669' } // Accent color
            }));
            nodes.update(updatedNodes);

            // Highlight edges
            let updatedEdges = [];
            let allEdges = edges.get();
            
            for (let i = 0; i < pathNodes.length - 1; i++) {
                let from = pathNodes[i];
                let to = pathNodes[i+1];
                
                // Find the edge connecting these two nodes
                let edge = allEdges.find(e => e.from === from && e.to === to);
                if (edge) {
                    updatedEdges.push({
                        id: edge.id,
                        color: { color: '#10b981' },
                        width: 6
                    });
                }
            }
            edges.update(updatedEdges);

        } else {
            throw new Error("No path found between these nodes in the current network.");
        }

    } catch (error) {
        errorMsg.textContent = `Error: ${error.message}`;
        errorContainer.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btnText.textContent = "Find Optimal Route";
        spinner.classList.add('hidden');
    }
}
