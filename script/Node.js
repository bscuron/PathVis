class Node{
    constructor(x, y, value){
        this.x = x;
        this.y = y;
        this.value = value;

        //used in search every search algorithm
        this.visited = false;

        //maze visited (for maze generation purposes)
        this.mv = false;
        this.parent = null;

        //used for A* algo
        this.dist = Number.MAX_SAFE_INTEGER;
    }

    equals(n){
        if(this.x == n.x && this.y == n.y && this.value == n.value)
            return true;
        return false;
    }

    unvisitedNeighbors(){
        let unvisited = [];
        if(this.y > 0 && !grid[this.y-1][this.x].mazeVisited)
            unvisited.push(grid[this.y-1][this.x]);
        if(this.x > 0 && !grid[this.y][this.x-1].mazeVisited)
            unvisited.push(grid[this.y][this.x-1]);
        if(this.y < rows-1 && !grid[this.y+1][this.x].mazeVisited)
            unvisited.push(grid[this.y+1][this.x]);
        if(this.x < cols-1 && !grid[this.y-1][this.x].mazeVisited)
            unvisited.push(grid[this.y][this.x+1]);
        return unvisited;
    }
}
