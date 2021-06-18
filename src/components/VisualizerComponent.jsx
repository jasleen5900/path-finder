import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getShortestPath } from "../Algorithms/dijkstra";
import { depthFirstSearch, getDFSPath } from "../Algorithms/depthFirstSearch";
import {
  breadthFristSearch,
  getBFSPath
} from "../Algorithms/breadthFirstSearch";
import { bestFirstSearch, getGBFSPath } from "../Algorithms/bestFirstSearch";
import { aStarSearch, getAStarPath } from "../Algorithms/aStarSearch";
import {
  bidirectionalSearch,
  getBidirectionalShortestPath
} from "../Algorithms/bidirectionalSearch";
import { recursiveDivsionUtil } from "../MazeGenerationAlgorithms/RecursiveDivisionMazeGeneration";
import { randomeMaze } from "../MazeGenerationAlgorithms/RandomMaze";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import "./VisualizerComponent.css";
import "bootstrap/dist/css/bootstrap.min.css";

const START_POS_ROW = 10;
const START_POS_COL = 7;
const FINISH_POS_ROW = 11;
const FINISH_POS_COL = 45;
const SLOW_SPEED = 60;
const MEDIUM_SPEED = 30;
const FAST_SPEED = 15;

export class VisualizerComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grid: [],
      mousePressed: false,
      mousePointerEvents: "auto",
      selectedAlgorithm: "",
      speed: "fast",
      animationSpeed: 15,
      description: "Select any path finding algorithm and play!!!"
    };

    //Refs for all the nodes
    this.nodeRef = [];
  }

  handleMouseClick = (row, col) => {
    if (!this.state.grid[row][col].isWall) {
      const newGrid = this.buildWall(row, col);
      this.setState({ grid: newGrid });
    } else {
      const newGrid = this.removeWall(row, col);
      this.setState({ grid: newGrid });
    }
  };

  handleMouseDown = (row, col) => {
    console.log("mouse down");
    //if(this.state.algorithmRunning) return
    if (this.state.grid[row][col].isStart || this.state.grid[row][col].isFinish)
      return;
    if (!this.state.grid[row][col].isWall) {
      const newGrid = this.buildWall(row, col);
      this.tempGrid = newGrid;
      this.mousePressed = true;
      this.nodeRef[row][col].current.toggleWall();
      //this.setState({/*grid : newGrid,*/ mousePressed : true})
    } else {
      const newGrid = this.removeWall(row, col);
      this.tempGrid = newGrid;
      this.nodeRef[row][col].current.toggleReset();
      //this.setState({grid : newGrid})
    }
  };

  handleMouseEnter = (row, col) => {
    console.log("mouse enter");
    //if(this.state.algorithmRunning) return
    if (this.state.grid[row][col].isStart || this.state.grid[row][col].isFinish)
      return;
    if (this.mousePressed) {
      if (!this.state.grid[row][col].isWall) {
        const newGrid = this.buildWall(row, col);
        this.tempGrid = newGrid;
        this.nodeRef[row][col].current.toggleWall();
        //this.setState({grid : newGrid})
      } else {
        /*const newGrid = this.removeWall(row, col)
            this.tempGrid = newGrid
            this.nodeRef[row][col].current.toggleReset()*/
        //this.setState({grid : newGrid})
      }
    }
  };

  handleMouseUp = () => {
    console.log("mouse up");
    this.mousePressed = false;
    this.setState({ grid: this.tempGrid /*, mousePressed : false*/ });
  };

  buildWall = (row, col) => {
    const newGrid = this.state.grid;
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: true
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  removeWall = (row, col) => {
    const newGrid = this.state.grid;
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: false
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  componentDidMount() {
    const grid = [];

    for (let row = 0; row < 21; row++) {
      const columnRow = [];
      const rowRef = [];
      for (let column = 0; column < 51; column++) {
        columnRow.push(this.createNode(row, column));
        rowRef.push(React.createRef());
      }
      this.nodeRef.push(rowRef);
      grid.push(columnRow);
    }
    this.setState({ grid: grid });
    //console.log(grid)
  }

  createNode = (row, col) => {
    const newNode = {
      row,
      col,
      isStart: row === START_POS_ROW && col === START_POS_COL,
      isFinish: row === FINISH_POS_ROW && col === FINISH_POS_COL,
      distance: Infinity,
      hCost: null,
      gCost: null,
      fCost: null,
      previousNode: null,
      nextNode: null,
      isVisited: false,
      isVisitedFromOther: false,
      isWall: false,
      isPath: false
    };
    return newNode;
  };

  clearVisitedNode = removeWall => {
    const newGrid = this.state.grid;
    for (const row of newGrid) {
      for (const node of row) {
        const { row, col } = node;
        if (node.isStart) {
          this.resetStartNode(row, col, newGrid, node);
        } else if (node.isFinish) {
          this.resetFinishNode(row, col, newGrid, node);
        } else if (node.isWall) {
          this.resetWallNode(row, col, newGrid, node, removeWall);
        } else {
          this.resetVisitedNode(row, col, newGrid, node);
        }
      }
    }
    this.setState({ grid: newGrid });
    //console.log(this.state.grid)
  };

  resetStartNode = (row, col, grid, node) => {
    const newNode = {
      ...node,
      isPath: false,
      isVisited: false,
      isVisitedFromOther: false,
      previousNode: null,
      nextNode: null,
      distance: Infinity,
      hCost: null,
      gCost: null,
      fCost: null
    };
    grid[row][col] = newNode;
    this.nodeRef[node.row][node.col].current.toggleStart();
  };

  resetFinishNode = (row, col, grid, node) => {
    const newNode = {
      ...node,
      isPath: false,
      isVisited: false,
      isVisitedFromOther: false,
      previousNode: null,
      nextNode: null,
      distance: Infinity,
      hCost: null,
      gCost: null,
      fCost: null
    };
    grid[row][col] = newNode;
    this.nodeRef[node.row][node.col].current.toggleFinish();
  };

  resetWallNode = (row, col, grid, node, removeWall) => {
    if (removeWall) {
      this.resetVisitedNode(row, col, grid, node);
    } else {
      const newNode = {
        ...node,
        isPath: false,
        isVisited: false,
        isVisitedFromOther: false,
        previousNode: null,
        nextNode: null,
        isWall: true,
        distance: Infinity,
        hCost: null,
        gCost: null,
        fCost: null
      };
      grid[row][col] = newNode;
    }
  };

  resetVisitedNode = (row, col, grid, node) => {
    const newNode = {
      ...node,
      isPath: false,
      isVisited: false,
      isVisitedFromOther: false,
      previousNode: null,
      nextNode: null,
      isWall: false,
      distance: Infinity,
      hCost: null,
      gCost: null,
      fCost: null
    };

    grid[row][col] = newNode;
    this.nodeRef[node.row][node.col].current.toggleReset();
  };

  animateDijkstra = (visitedNodeInOrder, shortestPath) => {
    const grid = this.state.grid;
    const { animationSpeed } = this.state;
    for (let i = 0; i < visitedNodeInOrder.length; i++) {
      grid[visitedNodeInOrder[i].row][visitedNodeInOrder[i].col] =
        visitedNodeInOrder[i];
      if (i === visitedNodeInOrder.length - 1) {
        setTimeout(() => {
          this.printShortestPath(shortestPath, grid);
        }, animationSpeed * i);
      }
      setTimeout(() => {
        const node = visitedNodeInOrder[i];
        this.nodeRef[node.row][node.col].current.toggleVisited();
      }, animationSpeed * i);
    }
  };

  printShortestPath = (shortestPath, grid) => {
    const { animationSpeed } = this.state;
    if (shortestPath.length === 0) {
      setTimeout(() => {
        this.setState({ mousePointerEvents: "auto" });
      }, animationSpeed);
      return;
    }
    for (let i = 0; i < shortestPath.length; i++) {
      setTimeout(() => {
        const node = shortestPath[i];
        //console.log(grid[node.row][node.col])
        grid[node.row][node.col] = node;
        this.nodeRef[node.row][node.col].current.togglePath();
        if (i === shortestPath.length - 1) {
          this.setState({ grid: grid });
          setTimeout(() => {
            this.setState({ mousePointerEvents: "auto" });
          }, animationSpeed * i + 1);
        }
      }, animationSpeed * i);
    }
    //console.log(this.state.algorithmRunning)
  };

  visualizeDijkstra = () => {
    //console.log(this.state.algorithmRunning)
    this.setState({ mousePointerEvents: "none" });
    //console.log(this.state.algorithmRunning)
    this.clearVisitedNode(false);

    setTimeout(() => {
      const { grid } = this.state;
      const startNode = grid[START_POS_ROW][START_POS_COL];
      const finishNode = grid[FINISH_POS_ROW][FINISH_POS_COL];
      const visitedNodeInOrder = dijkstra(grid.slice(), startNode, finishNode);
      if (!visitedNodeInOrder) return;
      const shortestPath = getShortestPath(finishNode);
      this.animateDijkstra(visitedNodeInOrder, shortestPath);
    }, 100);
  };

  animateDepthFirstSearch = (visitedNodeInOrder, DFSPath) => {
    const grid = this.state.grid;
    const { animationSpeed } = this.state;
    for (let i = 0; i < visitedNodeInOrder.length; i++) {
      grid[visitedNodeInOrder[i].row][visitedNodeInOrder[i].col] =
        visitedNodeInOrder[i];
      if (i === visitedNodeInOrder.length - 1) {
        setTimeout(() => {
          this.printShortestPath(DFSPath, grid);
        }, i * animationSpeed);
      }
      setTimeout(() => {
        const node = visitedNodeInOrder[i];
        this.nodeRef[node.row][node.col].current.toggleVisited();
      }, i * animationSpeed);
    }
  };

  visualizeDepthFirstSearch = () => {
    this.setState({ mousePointerEvents: "none" });
    this.clearVisitedNode(false);

    setTimeout(() => {
      const { grid } = this.state;
      //console.log(grid)
      const startNode = grid[START_POS_ROW][START_POS_COL];
      const finishNode = grid[FINISH_POS_ROW][FINISH_POS_COL];
      //console.log(JSON.stringify(startNode)+" "+JSON.stringify(finishNode))
      const visitedNodeInOrder = depthFirstSearch(
        grid.slice(),
        startNode,
        finishNode
      );
      if (!visitedNodeInOrder) return;
      const DFSPath = getDFSPath(finishNode);
      this.animateDepthFirstSearch(visitedNodeInOrder, DFSPath);
    }, 100);
  };

  animateBreadthFirstSearch = (visitedNodeInOrder, DFSPath) => {
    const grid = this.state.grid;
    const { animationSpeed } = this.state;
    for (let i = 0; i < visitedNodeInOrder.length; i++) {
      grid[visitedNodeInOrder[i].row][visitedNodeInOrder[i].col] =
        visitedNodeInOrder[i];
      if (i === visitedNodeInOrder.length - 1) {
        setTimeout(() => {
          this.printShortestPath(DFSPath, grid);
        }, i * animationSpeed);
      }
      setTimeout(() => {
        const node = visitedNodeInOrder[i];
        this.nodeRef[node.row][node.col].current.toggleVisited();
      }, i * animationSpeed);
    }
  };

  visualizeBreadthFirstSearch = () => {
    this.setState({ mousePointerEvents: "none" });
    this.clearVisitedNode(false);

    setTimeout(() => {
      const { grid } = this.state;
      const startNode = grid[START_POS_ROW][START_POS_COL];
      const finishNode = grid[FINISH_POS_ROW][FINISH_POS_COL];
      console.log(grid);
      const visitedNodeInOrder = breadthFristSearch(
        grid.slice(),
        startNode,
        finishNode
      );
      if (!visitedNodeInOrder) return;
      //console.log(visitedNodeInOrder)
      const BFSPath = getBFSPath(finishNode);
      this.animateBreadthFirstSearch(visitedNodeInOrder, BFSPath);
    }, 100);
  };

  animateBestFirstSearch = (visitedNodeInOrder, GBFSPath) => {
    const grid = this.state.grid;
    const { animationSpeed } = this.state;
    for (let i = 0; i < visitedNodeInOrder.length; i++) {
      grid[visitedNodeInOrder[i].row][visitedNodeInOrder[i].col] =
        visitedNodeInOrder[i];
      if (i === visitedNodeInOrder.length - 1) {
        setTimeout(() => {
          this.printShortestPath(GBFSPath, grid);
        }, i * animationSpeed);
      }
      setTimeout(() => {
        const node = visitedNodeInOrder[i];
        this.nodeRef[node.row][node.col].current.toggleVisited();
      }, i * animationSpeed);
    }
  };

  visualizeBestFirstSearch = () => {
    this.setState({ mousePointerEvents: "none" });
    this.clearVisitedNode(false);
    setTimeout(() => {
      const { grid } = this.state;
      const startNode = grid[START_POS_ROW][START_POS_COL];
      const finishNode = grid[FINISH_POS_ROW][FINISH_POS_COL];
      //console.log(grid)
      const visitedNodeInOrder = bestFirstSearch(
        grid.slice(),
        startNode,
        finishNode
      );
      if (!visitedNodeInOrder) return;
      //console.log(visitedNodeInOrder)
      const GBFSPath = getGBFSPath(finishNode);
      //console.log(GBFSPath)
      this.animateBestFirstSearch(visitedNodeInOrder, GBFSPath);
    }, 100);
  };

  animateAStarSearch = (visitedNodeInOrder, AStarPath) => {
    const grid = this.state.grid;
    const { animationSpeed } = this.state;
    for (let i = 0; i < visitedNodeInOrder.length; i++) {
      grid[visitedNodeInOrder[i].row][visitedNodeInOrder[i].col] =
        visitedNodeInOrder[i];
      if (i === visitedNodeInOrder.length - 1) {
        setTimeout(() => {
          this.printShortestPath(AStarPath, grid);
        }, (i * animationSpeed) / 1.5);
      }
      setTimeout(() => {
        const node = visitedNodeInOrder[i];
        this.nodeRef[node.row][node.col].current.toggleVisited();
      }, (i * animationSpeed) / 1.5);
    }
  };

  visualizeAStarSearch = () => {
    this.setState({ mousePointerEvents: "none" });
    this.clearVisitedNode(false);
    setTimeout(() => {
      const { grid } = this.state;
      console.log(grid);
      const startNode = grid[START_POS_ROW][START_POS_COL];
      const finishNode = grid[FINISH_POS_ROW][FINISH_POS_COL];
      //console.log(grid)
      const visitedNodeInOrder = aStarSearch(
        grid.slice(),
        startNode,
        finishNode
      );
      if (!visitedNodeInOrder) return;
      console.log(visitedNodeInOrder);
      const AStarPath = getAStarPath(finishNode);
      //console.log(GBFSPath)
      this.animateAStarSearch(visitedNodeInOrder, AStarPath);
    }, 100);
  };

  animateBidirectionalSearch = (visitedNodeInOrder, GBFSPath) => {
    const grid = this.state.grid;
    const { animationSpeed } = this.state;
    for (let i = 0; i < visitedNodeInOrder.length; i++) {
      grid[visitedNodeInOrder[i].row][visitedNodeInOrder[i].col] =
        visitedNodeInOrder[i];
      if (i === visitedNodeInOrder.length - 1) {
        setTimeout(() => {
          this.printShortestPath(GBFSPath, grid);
        }, (i * animationSpeed) / 1.5);
      }
      setTimeout(() => {
        const node = visitedNodeInOrder[i];
        this.nodeRef[node.row][node.col].current.toggleVisited();
      }, (i * animationSpeed) / 1.5);
    }
  };

  visualizeBidirectionalSearch = () => {
    this.setState({ mousePointerEvents: "none" });
    this.clearVisitedNode(false);
    setTimeout(() => {
      const { grid } = this.state;
      const startNode = grid[START_POS_ROW][START_POS_COL];
      const finishNode = grid[FINISH_POS_ROW][FINISH_POS_COL];
      //console.log(grid)
      const visitedNodeInOrder = bidirectionalSearch(
        grid.slice(),
        startNode,
        finishNode
      );
      //console.log(visitedNodeInOrder.pop())
      if (!visitedNodeInOrder) return;
      console.log(visitedNodeInOrder.length);
      const middle1 = visitedNodeInOrder[visitedNodeInOrder.length - 1];
      const path = getBidirectionalShortestPath(middle1, finishNode);
      //console.log(middle1)
      console.log(path);
      this.animateBidirectionalSearch(visitedNodeInOrder, path);
    }, 100);
  };

  visualizeSelectedAlgorithm = () => {
    const { selectedAlgorithm } = this.state;
    console.log(selectedAlgorithm);
    switch (selectedAlgorithm) {
      case "Dijkstra Algorithm":
        this.visualizeDijkstra();
        break;
      case "Depth first search":
        this.visualizeDepthFirstSearch();
        break;
      case "Breadth frist search":
        this.visualizeBreadthFirstSearch();
        break;
      case "Greedy Best first search":
        this.visualizeBestFirstSearch();
        break;
      case "A* search":
        this.visualizeAStarSearch();
        break;
      case "Bidirectional BFS":
        this.visualizeBidirectionalSearch();
        break;
      default:
        window.alert("select an algorithm!");
    }
  };

  selectAlgorithm = algorithm => {
    //console.log(algorithm)
    let description = "";
    switch (algorithm) {
      case "Dijkstra Algorithm":
        description =
          "Dijkstra's algorithm is a weighted graph search algorithm used to find the sortest path between nodes in a graph";
        break;
      case "Depth first search":
        description =
          "Depth First Search is an unweighted graph search algorithm used for traversing or searching in a graph. It does not guarantee the shortest path";
        break;
      case "Breadth frist search":
        description =
          "Breadth First Search is an unweighted graph search algorithm used for traversing or searching in a graph. It guarantees the shortest path";
        break;
      case "Greedy Best first search":
        description =
          "Greedy Best first search is weighted and informed graph search algorithm, It does not guarantee the shortest path";
        break;
      case "A* search":
        description =
          "A* search is a weighted and informed grapth search algorithm which arguably the best graph search algorithm. It guarantees the shortest path and mush faster than Dijkstra's";
        break;
      case "Bidirectional BFS":
        description =
          "Bidirectional BFS is an unweighted graph search algorithm which gives the shortest path between the two nodes";
        break;
    }
    this.setState({ selectedAlgorithm: algorithm, description: description });
    //console.log(this.state.selectedAlgorithm)
  };

  selectSpeed = speed => {
    switch (speed) {
      case "slow":
        this.setState({ animationSpeed: SLOW_SPEED, speed: speed });
        break;
      case "medium":
        this.setState({ animationSpeed: MEDIUM_SPEED, speed: speed });
        break;
      case "fast":
        this.setState({ animationSpeed: FAST_SPEED, speed: speed });
        break;
    }
  };

  generateWalls = algorithm => {
    this.setState({ mousePointerEvents: "none" });
    this.clearVisitedNode(true);
    setTimeout(() => {
      const { grid } = this.state;
      let wallsToAnimate = [];
      switch (algorithm) {
        case "recursive_division_horizontal":
          wallsToAnimate = recursiveDivsionUtil(
            grid,
            2,
            grid.length - 3,
            2,
            grid[0].length - 3,
            "horizontal",
            true
          );
          break;
        case "recursive_division_vertical":
          wallsToAnimate = recursiveDivsionUtil(
            grid,
            2,
            grid.length - 3,
            2,
            grid[0].length - 3,
            "vertical",
            true
          );
          break;
        case "random":
          wallsToAnimate = randomeMaze(grid);
      }
      //console.log(wallsToAnimate)
      this.animateWalls(wallsToAnimate);
    }, 500);
  };

  animateWalls = wallsToAnimate => {
    const { grid } = this.state;
    for (let i = 0; i < wallsToAnimate.length; i++) {
      setTimeout(() => {
      const node = wallsToAnimate[i];
      const { row, col } = node;
      this.nodeRef[row][col].current.toggleWall();
      grid[row][col].isWall = true;
      //console.log("i="+i+" len="+wallsToAnimate.length)  
      if (i === wallsToAnimate.length - 1) {
          setTimeout(() => {
            console.log("last")  
            this.setState({ mousePointerEvents: "auto", grid:grid});
          },10 );
        }
      }, 10 * i);
    }
  }

  render() {
    const grid = this.state.grid;
    //console.log(grid)
    //Building the grid with table and table data as Node component

    return (
      <div className="container-fluid">
        <div>
          <Navbar bg="light">
            <Navbar.Brand href="#">Algorithm Visualizer</Navbar.Brand>
            <NavDropdown
              title="Select Algorithm"
              id="basic-nav-dropdown"
              style={{ pointerEvents: this.state.mousePointerEvents }}
            >
              <NavDropdown.Item
                href=""
                onClick={() => this.selectAlgorithm("Dijkstra Algorithm")}
              >
                Dijkstra
              </NavDropdown.Item>
              <NavDropdown.Item
                href=""
                onClick={() => this.selectAlgorithm("Depth first search")}
              >
                Depth First Search
              </NavDropdown.Item>
              <NavDropdown.Item
                href=""
                onClick={() => this.selectAlgorithm("Breadth frist search")}
              >
                Breadth First Search
              </NavDropdown.Item>
              
              <NavDropdown.Item
                href=""
                onClick={() => this.selectAlgorithm("A* search")}
              >
                A* Search
              </NavDropdown.Item>
             
            </NavDropdown>
            <NavDropdown
              title="Generate Maze"
              style={{ pointerEvents: this.state.mousePointerEvents }}
            >
              <NavDropdown.Item
                onClick={() =>
                  this.generateWalls("recursive_division_horizontal")
                }
              >
                Horizontal Recursive Division
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() =>
                  this.generateWalls("recursive_division_vertical")
                }
              >
                Vertical Recursive Division
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => this.generateWalls("random")}>
                Random Maze
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              onClick={() => this.clearVisitedNode(true)}
              style={{ pointerEvents: this.state.mousePointerEvents }}
            >
              Clear Board
            </Nav.Link>
            <Nav.Link
              className="btn btn-danger"
              onClick={() => this.visualizeSelectedAlgorithm()}
              style={{ pointerEvents: this.state.mousePointerEvents }}
            >
              Visualize {this.state.selectedAlgorithm}
            </Nav.Link>
            
          </Navbar>
        </div>
        <div>
          <p className="container description">{this.state.description}</p>
        </div>
        <div
          className="grid"
          style={{ pointerEvents: this.state.mousePointerEvents }}
        >
          <table>
            <tbody>
              {grid.map((row, rowId) => {
                return (
                  <tr className="tr-height" key={rowId}>
                    {row.map((column, columnId) => (
                      <td key={columnId}>
                        <Node
                          row={column.row}
                          col={column.col}
                          isStart={column.isStart}
                          isFinish={column.isFinish}
                          isWall={column.isWall}
                          isPath={column.isPath}
                          isVisited={column.isVisited}
                          onMouseDown={(row, col) =>
                            this.handleMouseDown(row, col)
                          }
                          onMouseEnter={(row, col) =>
                            this.handleMouseEnter(row, col)
                          }
                          onMouseUp={() => this.handleMouseUp()}
                          ref={this.nodeRef[column.row][column.col]}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default VisualizerComponent;
