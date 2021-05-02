let canvas, rows, cols;
let xstep, ystep;
let grid = [];
let defaultRows = 20;
let defaultCols = 20;

let pathRenderQueue = [];
let speed = 2;

function setup(){
    let cw = document.getElementById('canvas').offsetWidth;
    let ch = document.getElementById('canvas').offsetHeight;
    canvas = createCanvas(cw, ch);
    canvas.parent('canvas');
    rows = defaultRows;
    cols = defaultCols;
    initGrid();
    xstep = width / cols;
    ystep = height / rows
}

function draw(){
    background(0);
    drawGrid();
    drawNodes();
    if(pathRenderQueue.length > 0 && frameCount % speed == 0){
        let current = pathRenderQueue.pop();
        current.value = 4;
    }
}

function windowResized(){
    let cw = document.getElementById('canvas').offsetWidth;
    let ch = document.getElementById('canvas').offsetHeight;
    canvas = resizeCanvas(cw, ch);
    xstep = width / cols;
    ystep = height / rows
    initGrid();
}

function initGrid(){
    //read in the input from the user. If the number give > 0 use it, otherwise use the default values
    let rowInput = document.getElementById('rows').value;
    rows = rowInput > 0 ? rowInput : defaultRows;
    let colInput = document.getElementById('cols').value;
    cols = colInput > 0 ? colInput : defaultCols;

    //update the size of the blocks/nodes
    xstep = width / cols;
    ystep = height / rows

    //init a new grid
    grid = [];
    for(let i = 0; i < rows; i++){
        grid.push([]);
        for(let j = 0; j < cols; j++){
            grid[i].push(new Node(j, i, 0));
        }
    }

    // TODO remove these
    // console.log(`Rows = ${rows}`);
    // console.log(`Cols = ${cols}`);
    // console.log(grid);
}

function drawGrid(){
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            push();
            fill(255);

            //empty node
            if(grid[i][j].value == 0){
                fill(255);
            }

            //start node
            else if(grid[i][j].value == 1){
                fill(158, 182, 150)
            }

            //finish node
            else if(grid[i][j].value == 2){
                fill(216, 108, 112);
            }

            //wall node
            else if(grid[i][j].value == 3){
                fill(0);
            }

            //path node
            if(grid[i][j].value == 4){
                fill(252,252,159);
            }

            rect(j * xstep, i * ystep, xstep, ystep);
            pop();
        }
    }
}

function drawNodes(){
    //mouse is not pressed
    if(!mouseIsPressed)
        return

    //clear any path nodes and empty the render queue
    pathRenderQueue = [];
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            if(grid[i][j].value == 4)
                grid[i][j].value = 0;
        }
    }

    let x = Math.floor(mouseX / xstep);
    let y = Math.floor(mouseY / ystep);

    //not inside the canvas
    if(x < 0 || x > cols || y < 0 || y > rows)
        return

    // TODO Remove this
    // console.log(`x = ${x}\ny = ${y}`)

    //if the shift key is down, it clears any node underneath the cursor
    if(keyIsDown(16)){
        // TODO remove this
        // console.log('Clearing node under cursor...')

        //set the node under the cursor to blank
        grid[y][x].value = 0;
        return;
    }

    //get the radio buttons
    let radios = document.getElementsByName('node-type');
    // console.log(radios);
    let value = 0;

    for(let i = 0; i < radios.length; i++) {
        if(radios[i].checked){
            // console.log('found the checkeditem')
            value = radios[i].value;
        }
    }

    //if they are choosing a new start/finish node, reset the previous start/finish node
    if(value == 1 || value == 2){
        // console.log('unchecking previous start/finish node...');
        for(let i = 0; i < grid.length; i++){
            for(let j = 0; j < grid[i].length; j++){
                if(grid[i][j].value == value)
                    grid[i][j].value = 0;
            }
        }
    }

    // console.log(`value = ${value}`);
    grid[y][x].value = value;
}

function startSearch(){
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            grid[i][j].parent = null;
            grid[i][j].visited = false;
            if(grid[i][j].value == 4)
                grid[i][j].value = 0;
        }
    }
    //get which algorithm is selected by the user
    let radios = document.getElementsByName('algorithm-choice');
    let algorithm = 0;

    for(let i = 0; i < radios.length; i++) {
        if(radios[i].checked){
            // console.log('found the checkeditem')
            algorithm = radios[i].value;
        }
    }

    //0 == BFS, 1 == DFS, 2 == Dijkstra
    // console.log(`algorithm = ${algorithm}`);

    //bfs
    if(algorithm == 1){
        bfs();
    }

    //dfs
    else if(algorithm == 2){
    }

    //dijkstra
    else if(algorithm == 3){
    }
    
}

//returns the location of the starting node
function getStartNode(){
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            if(grid[i][j].value == 1)
                return grid[i][j];
        }
    }

    alert('Please place a start node before starting!');
    window.location.reload();
}

//returns the location of the finish node
function getFinishNode(){
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            if(grid[i][j].value == 2)
                return grid[i][j];
        }
    }

    alert('Please place a finish node before starting!');
    window.location.reload();
}

function bfs(){
    let queue = [];
    let startNode = getStartNode();
    startNode.visited = true;
    queue.push(startNode);

    let current = null;
    while(queue.length > 0){
        current = queue.shift();

        if(current.equals(getFinishNode())){
            break;
        }

        //north
        if(current.y > 0 && !grid[current.y-1][current.x].visited && grid[current.y-1][current.x].value != 3){
            let neighbor = grid[current.y-1][current.x];
            neighbor.visited = true;
            neighbor.parent = current;
            queue.push(neighbor);
        }

        //south
        if(current.y < rows-1 && !grid[current.y+1][current.x].visited && grid[current.y+1][current.x].value != 3){
            let neighbor = grid[current.y+1][current.x];
            neighbor.visited = true;
            neighbor.parent = current;
            queue.push(neighbor);
        }

        //east
        if(current.x < cols-1 && !grid[current.y][current.x+1].visited && grid[current.y][current.x+1].value != 3){
            let neighbor = grid[current.y][current.x+1];
            neighbor.visited = true;
            neighbor.parent = current;
            queue.push(neighbor);
        }

        //west
        if(current.x > 0 && !grid[current.y][current.x-1].visited && grid[current.y][current.x-1].value != 3){
            let neighbor = grid[current.y][current.x-1];
            neighbor.visited = true;
            neighbor.parent = current;
            queue.push(neighbor);
        }
    }

    pathRenderQueue = [];
    if(!current.equals(getFinishNode())){
        alert('No path found!');
        return;
    }
    current = current.parent;
    while(current.parent != null){
        pathRenderQueue.push(current);
        current = current.parent;
    }
}
