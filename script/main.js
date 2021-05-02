let canvas, rows, cols;
let xstep, ystep;
let grid = [];
let defaultRows = 20;
let defaultCols = 20;

function setup(){
    let cw = document.getElementById('canvas').offsetWidth;
    let ch = document.getElementById('canvas').offsetHeight;
    canvas = createCanvas(cw, ch);
    canvas.parent('canvas');
    rows = defaultRows;
    cols = defaultCols;
    grid = initGrid();
    xstep = width / cols;
    ystep = height / rows
}

function draw(){
    background(0);
    drawGrid();
    drawNodes();
}

function windowResized(){
    let cw = document.getElementById('canvas').offsetWidth;
    let ch = document.getElementById('canvas').offsetHeight;
    canvas = resizeCanvas(cw, ch);
    xstep = width / cols;
    ystep = height / rows
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
    newGrid = [];
    for(let i = 0; i < rows; i++){
        newGrid.push([]);
        for(let j = 0; j < cols; j++){
            newGrid[i].push(new Node(0));
        }
    }

    // TODO remove these
    // console.log(`Rows = ${rows}`);
    // console.log(`Cols = ${cols}`);
    // console.log(grid);

    return newGrid;
}

function drawGrid(){
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            push();
            fill(255);

            //empty node
            if(grid[i][j] == 0){
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


            rect(j * xstep, i * ystep, xstep, ystep);
            pop();
        }
    }
}

function drawNodes(){
    //mouse is not pressed
    if(!mouseIsPressed)
        return

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
        console.log('Clearing node under cursor...')

        //set the node under the cursor to blank
        grid[y][x].value = 0;
        return;
    }

    //get the radio buttons
    let radios = document.getElementsByName('node-type');
    console.log(radios);
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

    console.log(`value = ${value}`);
    grid[y][x].value = value;
}
