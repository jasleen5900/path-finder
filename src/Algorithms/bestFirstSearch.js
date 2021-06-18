import {MinHeap} from './Helper/minHeap'

export function bestFirstSearch(grid, startNode, finishNode){

    if(!startNode || !finishNode || startNode === finishNode)
        return false
    
    UpdateDistance(grid, finishNode)
    //finishNode = grid[finishNode.row][finishNode.col]
    //console.log(grid)

    const visitedNodesInOrder = []
    //startNode.distance = 0
    const minHeap = new MinHeap([])
    minHeap.insert(startNode)
    while(!minHeap.isEmpty()){
        const currentNode = minHeap.extractMin()
        if(currentNode.isWall) continue
        if(currentNode.isVisited) continue
        currentNode.isVisited = true
        visitedNodesInOrder.push(currentNode)
        if(currentNode === finishNode)
            return visitedNodesInOrder
        updateNeighbours(grid, currentNode, minHeap)
    }
    /*const priorityQueue = [startNode]
    while(priorityQueue.length !== 0){
        sortUnvistedNodesByDistance(priorityQueue)
        const currentNode = priorityQueue.shift()
        console.log(priorityQueue.length)
        if(currentNode.isVisited) continue
        currentNode.isVisited = true
        visitedNodesInOrder.push(currentNode)
        if(currentNode.row === finishNode.row && currentNode.col === finishNode.col){
            console.log(currentNode)
            console.log(finishNode)
            return visitedNodesInOrder
        }

        const neighbours = getUnvisitedNeighbours(grid, currentNode)
        for(const neighbour of neighbours){
            neighbour.previousNode = currentNode
            priorityQueue.push(neighbour)
        }
    }*/
    return visitedNodesInOrder
}

function sortUnvistedNodesByDistance(unvisitedNodes){
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
}

function updateNeighbours(grid, node, minHeap){
    const unvisitedNeighbours = getUnvisitedNeighbours(grid, node)
    for(let neighbour of unvisitedNeighbours){
        //neighbour.distance = node.distance + 1
        neighbour.previousNode = node
        minHeap.insert(neighbour)
    }
}

function getUnvisitedNeighbours(grid, node){
    const neighbours = []
    const {row, col} = node

    if(row > 0) neighbours.push(grid[row - 1][col])
    if(row < grid.length - 1) neighbours.push(grid[row + 1][col])
    if(col > 0) neighbours.push(grid[row][col - 1])
    if(col < grid[0].length - 1) neighbours.push(grid[row][col + 1])
   
    return neighbours.filter(neighbour => !neighbour.isVisited)
}

function UpdateDistance (grid, finishNode){
    const {row, col} = finishNode
    for(let gridRow of grid){
        for(let node of gridRow){
            const distanceFromTarget = Math.abs(node.row - row) + Math.abs(node.col - col)
            /*const newNode = {
                ...node,
                distance : distanceFromTarget
            }*/
            grid[node.row][node.col].distance = distanceFromTarget
        }
    }
    return grid
}

function getAllNodes(grid){
    const nodes = []
    for(let row of grid){
        for(let node of row){
            nodes.push(node)
        }
    }
    return nodes
}

export function getGBFSPath(finishNode){
    const GBFSPath = []
    
    //if there is no path
    if(finishNode.previousNode === null)
        return GBFSPath

    var currentNode = finishNode
    while(currentNode !== null){
        currentNode = { ...currentNode, isPath : true}
        GBFSPath.unshift(currentNode)
        currentNode = currentNode.previousNode
    }
    return GBFSPath
}
