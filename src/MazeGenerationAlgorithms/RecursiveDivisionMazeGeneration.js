export function recursiveDivsionUtil(grid, startRow, endRow, startCol, endCol, direction, boundaryWalls){
    const wallsToAnimate = []    
    recursiveDivsion(grid, startRow, endRow, startCol, endCol, direction, boundaryWalls, wallsToAnimate);
    console.log(wallsToAnimate);
    console.log(grid)
    return wallsToAnimate;
}

function recursiveDivsion(grid, startRow, endRow, startCol, endCol, direction, boundaryWalls, wallsToAnimate){
    if(startRow > endRow || startCol > endCol){
        return;
    }

    if(boundaryWalls){

        for(let row = 0; row < grid.length; row++){
            for(let col = 0; col < grid[0].length; col++){
                if(row === 0 || col === 0 || row === grid.length - 1 || col === grid[0].length - 1){
                    const node = grid[row][col];
                    if(node.isStart || node.isFinish){
                        continue;
                    }
                    node.isWall = true;
                    wallsToAnimate.push(node);
                }
            }
        }
        boundaryWalls = false;
    }

    if(direction==="horizontal"){

        let possibleRows = []
        for(let i = startRow; i <= endRow; i += 2){
            possibleRows.push(i);
        }

        let possibleColumns = []
        for(let i = startCol - 1; i <= endCol + 1; i += 2){
            possibleColumns.push(i);
        }

        let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
        let randomColumnIndex = Math.floor(Math.random() * possibleColumns.length);

        let selectedRowPartition = possibleRows[randomRowIndex];
        let selectedColumnPartition = possibleColumns[randomColumnIndex];

        for(let row = 0; row < grid.length; row++){
            for(let col = 0; col < grid[0].length; col++){
                if(row === selectedRowPartition && col !== selectedColumnPartition && col >= startCol - 1 && col <= endCol + 1){
                    const node = grid[row][col];
                    if(node.isStart || node.isFinish){
                        continue;
                    }
                    node.isWall = true;
                    wallsToAnimate.push(node);
                }
            } 
        }

        if(selectedRowPartition - 2 - startRow > endCol - startCol){
            recursiveDivsion(grid, startRow, selectedRowPartition - 2, startCol , endCol, direction, boundaryWalls, wallsToAnimate);
        } else {
            recursiveDivsion(grid, startRow, selectedRowPartition - 2, startCol , endCol, "vertical", boundaryWalls, wallsToAnimate);
        }

        if(endRow -(selectedRowPartition + 2) > endCol - startCol){
            recursiveDivsion(grid, selectedRowPartition + 2, endRow, startCol , endCol, direction, boundaryWalls, wallsToAnimate);
        }else{
            recursiveDivsion(grid, selectedRowPartition + 2, endRow, startCol , endCol, "vertical", boundaryWalls, wallsToAnimate);
        }

    }else{

        let possibleColumns = []
        for(let i = startCol; i <= endCol; i += 2){
            possibleColumns.push(i);
        }

        let possibleRows = []
        for(let i = startRow - 1; i <= endRow + 1; i += 2){
            possibleRows.push(i);
        }

        let randomColumnIndex = Math.floor(Math.random() * possibleColumns.length);
        let randomRowIndex = Math.floor(Math.random() * possibleRows.length);

        let selectedColumnPartition = possibleColumns[randomColumnIndex];
        let selectedRowPartition = possibleRows[randomRowIndex];

        for(let row = 0; row < grid.length; row++){
            for(let col = 0; col < grid[0].length; col++){
                if(col === selectedColumnPartition && row !== selectedRowPartition && row >= startRow - 1 && row <= endRow + 1){
                    const node = grid[row][col];
                    if(node.isStart || node.isFinish){
                        continue;
                    }
                    node.isWall = true;
                    wallsToAnimate.push(node);
                }
            } 
        }

        if(endRow - startRow > selectedColumnPartition - 2- startCol){
            recursiveDivsion(grid, startRow, endRow, startCol , selectedColumnPartition - 2, "horizontal", boundaryWalls, wallsToAnimate);
        }else{
            recursiveDivsion(grid, startRow, endRow, startCol , selectedColumnPartition - 2, direction, boundaryWalls, wallsToAnimate);
        }

        if(endRow - startRow > endCol - (selectedColumnPartition + 2)){
            recursiveDivsion(grid, startRow, endRow, selectedColumnPartition + 2, endCol, "horizontal", boundaryWalls, wallsToAnimate);
        }else{
            recursiveDivsion(grid, startRow, endRow, selectedColumnPartition + 2, endCol, direction, boundaryWalls, wallsToAnimate);       
        }

    }

}