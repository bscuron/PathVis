class Node{
    constructor(x, y, value){
        this.x = x;
        this.y = y;
        this.value = value;
        this.visited = false;
        this.mazeVisited = false;
        this.parent = null;
    }

    equals(n){
        if(this.x == n.x && this.y == n.y && this.value == n.value)
            return true;
        return false;
    }
}
