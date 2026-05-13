import heapq

def dijkstra_shortest_path(graph, start, end):
    pq = [(0, start, [])]
    visited = set()

    while pq:
        cost, node, path = heapq.heappop(pq)

        if node in visited:
            continue

        visited.add(node)
        path = path + [node]

        if node == end:
            return path, cost

        for neighbor, weight in graph[node].items():
            if neighbor not in visited:
                heapq.heappush(pq, (cost + weight, neighbor, path))

    return [], float("inf")
