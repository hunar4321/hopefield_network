
function Con(id, weight){

  this.id = id;
  this.weight = weight;
  this.nodes = null

}

function Node(id){
  this. id = id
  this.activity  = -1
  this.thresh = 0
  this.cons = []
}

function Connect(cons, snode, tnode, weight){
  id = cons.length
  con = new Con(id, weight)
  con.nodes = [snode, tnode] // connected nodes (undirectional)
  snode.cons.push(con)
  tnode.cons.push(con)
  cons.push(con)
}

function CreateNodes(num){
  nodes = []
  for(let i=0; i<num; i++){
    nodes.push(new Node(i))
  }
  return nodes;
}

function FullyConnect(nodes){
  cons = [];
  for(let i=0; i<nodes.length; i++){
    for (let j=0; j<nodes.length; j++){
      if(j < i){
        w=0;
        Connect(cons, nodes[i], nodes[j], w)        
      }
    }
  }
  return cons
}

function Info(){
  console.log("con weights")
  for(let i=0; i<cons.length; i++){
    console.log(cons[i].weight)
  }
  console.log("node activity")
  for(let i=0; i<nodes.length; i++){
    console.log(nodes[i].activity)
  }
  console.log("grid activity")
  for(let i=0; i<grid.length; i++){
    for(let j=0; j<grid[i].length; j++){
      console.log(grid[i][j].reveal)
    }
  }

}

function SetActivity(nodes, pat){
  if(nodes.length < pat.length){
    console.log("pat length must not be more than nodes")
  }else{
    for(let i=0; i<pat.length; i++){
      nodes[i].activity = pat[i]
    }
  }
}

function Train(cons){
  for(let i=0; i<cons.length; i++){
   dw = cons[i].nodes[0].activity * cons[i].nodes[1].activity;
   cons[i].weight += dw;
  }
}

function Forward(nodes, cons){
  for(let i=0; i<nodes.length; i++){
    act = 0;
    for (let j=0; j<nodes[i].cons.length; j++){
      crCon = nodes[i].cons[j]
      if(crCon.nodes[0].id == nodes[i].id ){
        act += crCon.nodes[1].activity * crCon.weight;
      }else if(crCon.nodes[1].id == nodes[i].id){
        act += crCon.nodes[0].activity * crCon.weight;
      }
    }

    if(act > nodes[i].thresh){
      nodes[i].activity = 1
    }else{
      nodes[i].activity = -1
    }
  }

}

function make2DArray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

function Cell(i, j, w) {
  this.i = i;
  this.j = j;
  this.x = i * w;
  this.y = j * w;
  this.w = w;
  this.reveal = -1;
}

Cell.prototype.show = function() {
  stroke(0);
  noFill();
  rect(this.x, this.y, this.w, this.w);
  if (this.reveal == 1) {
    fill(50);
    rect(this.x, this.y, this.w, this.w);
  }else{
    fill(200);
    rect(this.x, this.y, this.w, this.w);
  }
};

Cell.prototype.contains = function(x, y) {
  return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w;
};


function GridToPattern(cols, rows, grid){
  let pat = [];
  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      if(grid[i][j].reveal == 1){
        pat.push(1)
      }else{
        pat.push(-1)
      }
    }
  }
  return pat
}

function PatternToGrid(cols, rows, grid, pat){
  x=0;
  y=0;
  for(let i=0; i<pat.length; i++){
    if(pat[i]==1){
        grid[y][x].reveal = 1
    }else{
        grid[y][x].reveal = -1
    }
    x +=1
    if(x == cols){
      y +=1
      x = 0
    }
  }
}

function ResetActivity() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].reveal = -1;
    }
  }

  for(var i=0; i< nodes.length; i++){
    nodes[i].activity = -1;
  }
}


function NodeToPat(){
  pat = [];
  for(let i=0; i<nodes.length; i++){
      pat.push(nodes[i].activity)
  }
  return pat;
}


var grid;
var cols;
var rows;
var node_num; //cols*rows;
var nodes;
var cons;


function setup() {
  createCanvas(301, 301);
  cols = 5;
  rows = 5;

  node_num = cols*rows
  nodes = CreateNodes(node_num)
  cons = FullyConnect(nodes)

  grid = make2DArray(cols, rows);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j, 40);
    }
  }
  createDiv('')

  pat_to_grid = createButton('PatToGrid');
  pat_to_grid.mousePressed(PatToGrid)

  grid_pat = createButton('GridToPat');
  grid_pat.mousePressed(GridToPat)

  createDiv('')

  learn_pat = createButton('LearnPat');
  learn_pat.mousePressed(LearnPat)

  clear_grid = createButton('ClearGrid');
  clear_grid.mousePressed(ClearGrid)

  retrieve_pat = createButton('RetrievePat');
  retrieve_pat.mousePressed(RetrievePat)

}


function mouseDragged() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      if (grid[i][j].contains(mouseX, mouseY)) {
        grid[i][j].reveal = 1
      }
    }
  }   
}


function LearnPat(){
  pat = GridToPattern(cols, rows, grid)
  console.log("learning...", pat)
  SetActivity(nodes, pat)
  Train(cons)
  console.log("learning finsihed")
}

function ClearGrid(){
  ResetActivity()
  console.log("grid cleared")
}

function RetrievePat(){
  Forward(nodes, cons)
  pat = NodeToPat()
  console.log(pat)
  PatternToGrid(cols, rows, grid, pat)
  console.log("retrieveing pat...")
}

function PatToGrid(){
  pat1 = [ 1, 1, 1, -1, -1, -1, 1,1,1]
  pat2 = [ 1, -1, 1, -1, 1, -1,1,-1,1]
  PatternToGrid(cols, rows, grid, pat1)
  console.log("pattern to grid", pat1)
}

function GridToPat(){
  pat = GridToPattern(cols, rows, grid)
  //PatToNode(pat)
  SetActivity(nodes, pat)
  console.log(pat)
}

function draw() {
  background(255);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
}






// // This is the graph object
// function Graph() {

//   // It has an object to store all nodes by label
//   this.graph = {};
//   // It has a redundant array to iterate through all the nodes
//   this.nodes = [];

//   this.source = undefined;
//   this.target = undefined;
// }

// // Add a node
// Graph.prototype.addNode = function(_id, _posX, _posY, _thresh, _vote_time, _fire_time) {
//   // Create the node
//   var n = new Node(_id);
//   n.x = _posX;
//   n.y = _posY;
//   n.thresh = _thresh;
//   n.vote_time = _vote_time;
//   n.fire_time = _fire_time;
//   this.graph[_id] = n;
//   this.nodes.push(n);
// //  return n;
// }


// function Node(_id) {
//   // Nodes get random location (not a great solution)
//   this.x = 0;
//   this.y = 0;
//   this.radius = 30;
//   this.vote = 0;
//   this.id = _id;
//   this.thresh = 1;
//   this.firecount = 0;
//   this.edges = [];
//   this.weights = [];
//   this.clickOn = false;
//   this.ltime = 0;
//   this.vote_time = 1; // time period between vote summations
//   this.fire_time = 1; // time period between subsequent fires
//   this.min_vote = -2; // minum voting baseline
//   this.parent = undefined;
//   this.parent_ind = undefined;
//   this.already_fired = false;
// }

// // Connect any neighbors
// Node.prototype.connect = function(neighbor, uweight) {
//     this.edges.push(neighbor);
//     this.weights.push(uweight);
// }

// Node.prototype.dbclicked = function (_x, _y){
//   let d = dist(_x, _y, this.x, this.y);
//   if( d < this.radius/2){
//     this.clickOn = !this.clickOn;
//   }
// }

// Node.prototype.edgeIdto = function(node2){
//   let edgeId = undefined;
//   for(let i=0; i<this.edges.length; i++){
//     if(this.edges[i].id == node2.id){
//       edgeId = i;
//       break;
//     }
//   }
//   return edgeId;
// }

// var graph;
// graph = new Graph();

// //// tunable params /////
// colorMag =20; // color magunitude
// //seq = [0,1,2,3,4,5,8,10];
// seq = [0,1,2,1];

// weight_range = 1; 
// vote_time = 3;
// fire_time = 3;
// num_generated_nodes = 10;
// starting_seed = 1;
// max_thresh = 3;
// min_thresh = 3;
// max_mem = 2;

// WIDTH = 700;
// HEIGHT = 400;
// Id=0;
// function setup() {
//   createCanvas(WIDTH, HEIGHT);

//   /// UI interface ////
//   createP('')
//   next_button = createButton('next');
//   createSpan('steps:'); jump = createInput(1); 

//   xmarg =10;
//   xspace = 125;
//   yspace = 160;
//   next_button.mousePressed(next)
//   node_creation = createCheckbox('create_nodes', false);
//   node_creation.position((xmarg+xspace*0), HEIGHT + yspace);
//   fired_check = createCheckbox("show_fired", true);
//   fired_check.position((xmarg+xspace*1), HEIGHT + yspace);
//   vote_check = createCheckbox("show_votes", true);
//   vote_check.position((xmarg+xspace*2), HEIGHT + yspace);
//   edge_check = createCheckbox("edge_num", false);
//   edge_check.position((xmarg+xspace*3), HEIGHT + yspace);
//   current_check = createCheckbox("show_current", true);
//   current_check.position((xmarg+xspace*4), HEIGHT + yspace);
//   pred_check = createCheckbox("show_pred", true);
//   pred_check.position((xmarg+xspace*5),HEIGHT + yspace)
//   type = createSelect();
//   type.option('advance1');
//   type.option('advance2');
//   type.option('basic');

//   //slider = createSlider(1,60, 30)
//   createDiv('')
//   createSpan('thresh:'); threshold = createInput(1); 
//   createSpan(' initWeights:'); iweight = createInput(1); 
//   createSpan(' voteTime:'); voteTime = createInput(vote_time); 
//   createSpan(' fireTime:'); fireTime = createInput(fire_time); 
//   createDiv('');
//   createSpan(' nodeId:'); nodeId = createInput(); 
//   createSpan(' conId:'); conId = createInput(); 
//   createSpan(' amount:'); updateAmount = createInput(1); 
//   update_button = createButton(' update_weights');
//   update_button.mousePressed(updateWeight)
//   createDiv('');
//   generate_button = createButton('generateGraph');
//   generate_button.mousePressed(generateGraph);
//   createSpan('num node:'); num_node = createInput(num_generated_nodes); 
//   createDiv('');
//   seq_button = createButton('generate_seq');
//   seq_button.mousePressed(generateSequence);
//   createSpan('seed:'); seed_num = createInput(starting_seed); 

//   // sel = createSelect();
//   // sel.option('set1');
//   // sel.option('set2');
//   //generate_button = createButton('save_graph');
//   //generate_button.mousePressed(saveGraph);
//   //generate_button = createButton('load_graph');
//   //generate_button.mousePressed(loadGraph);
// }

// // function saveGraph(){
// //   localStorage.setItem(sel.value(), JSON.stringify(graph));
// // }

// // function loadGraph(){
// //   graph = JSON.parse(localStorage.getItem(sel.value()));
// // }

// //// global functions /////
// current = 0;
// pred_ind = 0;
// iter = 0;
// gtime = 0; //intial global time

// function next(){// update time
//  for(let i=0; i<jump.value(); i++){
// //  console.log('iteration: ' + iter +' gtime: '+ gtime)
//     gtime +=1;
//     if(iter > seq.length-1){
//       iter = 0
//     }
//     current = seq[iter];
//     //graph.nodes[current].vote +=1 // update vote by one
//     fired(graph.nodes[current], gtime, type.value());

//     // if(graph.nodes[current].already_fired == false){
//     //   fired(graph.nodes[current], gtime, type.value());
//     // }else{
//     //   graph.nodes[current].already_fired = false;
//     //   console.log('seonsor:' + graph.nodes[current].id + ' already fired')
//     // }
//     iter = iter + 1;
//   }
// }

// function updateWeight(){ 
//   graph.nodes[parseInt(nodeId.value())].weights[parseInt(conId.value())] += parseFloat(updateAmount.value());
// }

// function generateGraph(){
//   graph = new Graph;
//   let num= parseInt(num_node.value());
//   let margin =10;
//   for(let i=0; i<num; i++){
//     rposX = Math.round(random(margin, width-margin));
//     rposY = Math.round(random(margin, height-margin));
//     rthresh = Math.round(random(min_thresh,max_thresh)); // the max threshold should be more than num of nodes otherwise endless loop happens
//     rvoteTime = voteTime.value();
//     rfireTime = fireTime.value();
//     graph.addNode(i, rposX, rposY, rthresh, rvoteTime,rfireTime);
//   }
//   //// setting full connections
//   for(let i=0; i< num; i++){
//     for(let j=0; j< num; j++){
//       if(i != j){
//          graph.nodes[i].connect(graph.nodes[j], Math.round(random(1,weight_range)) );
//       }
//     }
//   }
// }

// ////// UI Controls /////
// function withinBounds(){
//   let within_bounds = false;
//   if(mouseX >0 && mouseX< WIDTH && mouseY>0 && mouseY< HEIGHT){
//     within_bounds = true;
//   }
//   return within_bounds
// }

// function mousePressed(){
//   if(node_creation.checked() && withinBounds()){
//     graph.addNode(Id, mouseX, mouseY, parseFloat(threshold.value()), parseFloat(voteTime.value()), parseFloat(fireTime.value()) );
//     Id +=1;    
//   }else
//     {
//       for(var i=0; i< graph.nodes.length; i++){
//       let d = dist(mouseX, mouseY, graph.nodes[i].x, graph.nodes[i].y);
//       if( d < graph.nodes[i].radius/2){
//         graph.source = graph.nodes[i];
//       }    
//     } 
//   }
// }

// function mouseReleased(){
//   for(var i=0; i< graph.nodes.length; i++){
//     let d = dist(mouseX, mouseY, graph.nodes[i].x, graph.nodes[i].y);
//     if( d < graph.nodes[i].radius/2){
//       graph.target = graph.nodes[i];
//     }    
//   } 
// }

// function doubleClicked(){
//   for(var i=0; i< graph.nodes.length; i++){
//     graph.nodes[i].dbclicked(mouseX, mouseY);
//   } 
// }

// function keyPressed(){
//   var val = 1;
//   if(keyCode == UP_ARROW){
//     for(var i=0; i< graph.nodes.length; i++){
//       if(graph.nodes[i].clickOn == true){ 
//         graph.nodes[i].vote +=val;
//       }
//     }
//   }

//   if(keyCode == DOWN_ARROW){
//     for(var i=0; i< graph.nodes.length; i++){
//       if(graph.nodes[i].clickOn == true){ graph.nodes[i].vote -=val;}
//     }    
//   }
//   // SPACE Key is pressed
//   if(keyCode == 32){
//     if(graph.source != undefined && graph.target !=undefined){
//       graph.source.connect(graph.target, parseFloat(iweight.value()));
//       graph.source = undefined;
//       graph.target = undefined;
//     }
//   }
// }

// ///// visualizations //////
// function draw() {
//   background(0);
//   for (var i = 0; i < graph.nodes.length; i++) {
  
//     var r = graph.nodes[i].radius;
//     noFill();
//     stroke(255);
//     for (var j = 0; j < graph.nodes[i].edges.length; j++) {

//       rad = graph.nodes[i].radius;
//       offset = r/3;
//       sx = graph.nodes[i].x;
//       sy = graph.nodes[i].y;
//       dx = graph.nodes[i].edges[j].x;
//       dy = graph.nodes[i].edges[j].y;
//       sc = graph.nodes[i].weights[j];
//       // arrow head
//       push(); //start new drawing state

//       dify = (sy-dy);
//       difx = (sx-dx);
//       var angle = atan2(dify, difx); //gets the angle of the line

//       drx2 = rad/2 * cos(angle);
//       dry2 = rad/2 * sin(angle);

//       rx2=dx + drx2;
//       ry2=dy + dry2;

//       rx1=sx - drx2;
//       ry1=sy - dry2;

//       //rotate(angle - HALF_PI); //rotates the arrow point
//       if(sc != undefined){
//         if(sc > 250){
//           msc = 250;
//         }else{
//           msc = sc *50;
//         }

//       }else{
//         msc = 50;
//       }

//       fill(msc);       
//       stroke(msc);
//       strokeWeight(msc/20)
//       line(rx1, ry1, rx2 , ry2);
//       ellipse(rx2,ry2 , offset, offset);

//       if(edge_check.checked()){
//         midx = (rx1+rx2)/2;
//         midy = (ry2+ry1)/2;
//         fill(0,250,50)
//         noStroke()
//         text(j, midx, midy);
//       }
//       pop();
//     } // end of edge loop
//   } // end of node loop

//   for (var i = 0; i < graph.nodes.length; i++) {

//     textAlign(CENTER);
//     stroke(255);

//     if(current_check.checked() && i == current){
//       if(current == pred_ind){
//         fill(0,250,250)
//       }else{fill(0,250,0)}  
//     }else if(pred_check.checked() && i == pred_ind){
//       if(current == pred_ind){
//         fill(0,250,250)
//       }else{fill(0,0,250)}  
//     }else{
//       rr = graph.nodes[i].vote*colorMag;
//       gg = 0;
//       bb = 0;
//       fill(rr, gg, bb);
//     }
//     ellipse(graph.nodes[i].x, graph.nodes[i].y, r, r);
     
//     if(graph.nodes[i].clickOn == false){
//       fill(255,255,255);
//     }else { 
//       fill(255, 50, 0);
//     }
//     noStroke();
//     text(graph.nodes[i].id, graph.nodes[i].x, graph.nodes[i].y);
//     // //// show threshold too
//     // //text(graph.nodes[i].thresh, graph.nodes[i].x+r/2, graph.nodes[i].y+r/2);
//     fill(250,250,0)
//     if(fired_check.checked()){
//       text(graph.nodes[i].firecount, graph.nodes[i].x+r/2, graph.nodes[i].y+r/2);
//     }
//     if(vote_check.checked()){
//       text(graph.nodes[i].vote, graph.nodes[i].x+r/1.5, graph.nodes[i].y);
//     }
//   }
// }// end of draw()


// function fired(cnode, gtime, type){
// let breakpoint = 5; //breakpoint = depth
//   if(type == 'basic'){
//     basicFire(cnode, gtime, breakpoint)
//   }else if(type == 'advance1'){
//     advanceFire1(cnode, gtime, breakpoint)
//   }else{
//     advanceFire1(cnode, gtime, breakpoint)
//   }
// }

// function generateSequence(){
//   fired_preds = [];
//   resetVotes();
//   depth = 6;
//   seed = seed_num.value();
//   initial_node = graph.nodes[seed];
//   initial_node.vote = 10; // high inital vote to cause this node to fire...
//   loopfire(initial_node, depth);

//   filtered_lst = filterList(fired_preds);
//   console.log('unfilterd:', fired_preds);
//   console.log('filtered: ', filtered_lst);
// }

// function filterList(lst){
//   new_lst = [];
//   for(let i =0; i<lst.length; i++){
//     for(let j=0; j<seq.length; j++){
//       if(lst[i]==seq[j]){
//         new_lst.push(lst[i]);
//       }
//     }
//   }
//   return new_lst;
// }

// function resetVotes(){
//   // reset all votes to zero
//   for(let i=0; i< graph.nodes.length; i++){
//     graph.nodes[i].vote = 0;
//     graph.nodes[i].firecount = 0;
//   }
// }

// /// add ltime again
// function loopfire(cnode, safebreak){
//   if(safebreak>0){
//     fired_preds.push(cnode.id);
//     cnode.vote = 0;
//     cnode.firecount +=1
//     for(let i=0; i<cnode.edges.length; i++){
//       cnode.edges[i].vote = cnode.edges[i].vote + parseFloat(cnode.weights[i]);
//       if(cnode.edges[i].vote > cnode.edges[i].thresh){
//         loopfire(cnode.edges[i], safebreak - 1); 
//       }
//     }// end of loop
//   }else{
//     console.log('safebreak happend')
//   }
// }

// // main one
// function advanceFire1(cnode, gtime, safebreak){
 
//   if(safebreak>0){
//     console.log("node "+ cnode.id +" fired" )
//     let learning_rate = 0.1;
//     cnode.vote = 0;
//     cnode.firecount +=1
//     if(cnode.parent != undefined){
//       // strengthen parent connection
//       cnode.parent.weights[cnode.parent_ind] += learning_rate;
//     }

//     for(let i=0; i<cnode.edges.length; i++){

//       if(cnode.edges[i].already_fired == true){
//         cnode.weights[i] -=learning_rate;
//         cnode.edges[i].already_fired = false;
//       }

//       let period = gtime - cnode.edges[i].ltime;
//       if( period > 0 && period < cnode.vote_time){ // if neuron to already depolarised to ground level     
//         cnode.edges[i].vote = cnode.edges[i].vote + parseFloat(cnode.weights[i]);
//         cnode.edges[i].parent = cnode;
//         cnode.edges[i].parent_ind = i;

//         cnode.edges[i].already_fired = true;

//         //console.log('vote updated')
//         if(cnode.edges[i].vote > cnode.edges[i].thresh){
//           console.log('next= ' + cnode.edges[i].id);
//           pred_ind = cnode.edges[i].id;
//           advanceFire1(cnode.edges[i], gtime, safebreak - 1); 
//         }

//         if(cnode.edges[i].vote < cnode.edges[i].min_vote){
//           cnode.edges[i].vote = cnode.edges[i].min_vote; }
//       //  cnode.weights[i] = cnode.weights[i] + 0.1;
//       }else{
//         cnode.edges[i].vote = 1; 
//        // console.log('vote reseted. ' + 'period= ' + period + ' vote_time =' + cnode.vote_time)
//       }
//       cnode.edges[i].ltime = gtime;
//     }// end of loop
//     cnode.ltime = gtime;
//   }else{
//     console.log('safebreak happend')
//   }
// }

// // most primitive use for exploration
// function basicFire(cnode, gtime, safebreak){
//   cnode.vote = 0;
//   cnode.firecount +=1
//   console.log("node"+ cnode.id +" has fired " + cnode.firecount + " times")
//   for(let i=0; i<cnode.edges.length; i++){
//     cnode.edges[i].vote = cnode.edges[i].vote + cnode.weights[i];
//     // putting a minimum voting baseline
//       if(safebreak>0){
//         if(cnode.edges[i].vote > cnode.edges[i].thresh){
//             console.log('next= ' + cnode.edges[i].id)
//             basicFire(cnode.edges[i], gtime, safebreak-1); }
//       }else{
//         console.log('safebreak happend')
//       }

//     if(cnode.edges[i].vote < cnode.edges[i].min_vote){
//       cnode.edges[i].vote = cnode.edges[i].min_vote; 
//     }
//   }
//   console.log('from basic')
// }

// // function advanceFire1(cnode,gtime, safebreak)
// // {
// //   console.log("node "+ cnode.id +" fired" )
// //   let learning_rate = 0.1;
// //   cnode.vote = 0;
// //   cnode.firecount +=1
// //   if(cnode.parent != undefined){

// //     // strengthen parent connection
// //     cnode.parent.weights[cnode.parent_ind] += learning_rate;
// //   // weaken child connection
// //     cid = cnode.edgeIdto(cnode.parent);
// //     cnode.weights[cid] -= learning_rate;
// //   }
// //   for(let i=0; i<cnode.edges.length; i++)
// //   {
// //     let period = gtime - cnode.edges[i].ltime;
// // //     if( period < this.vote_time){ // if neuron to already depolarised to ground level
// //     if( period > 0 && period < cnode.vote_time){ // if neuron to already depolarised to ground level     
// //       cnode.edges[i].vote = cnode.edges[i].vote + parseFloat(cnode.weights[i]);
// //       cnode.edges[i].parent = cnode;
// //       cnode.edges[i].parent_ind = i;

// //       //console.log('vote updated')
// //       if(safebreak>0){
// //         if(cnode.edges[i].vote > cnode.edges[i].thresh){
// //             console.log('next= ' + cnode.edges[i].id);
// //             pred_ind = cnode.edges[i].id;
// //             advanceFire1(cnode.edges[i], gtime, safebreak - 1); 
// //           }
// //       }else{
// //         console.log('safebreak happend')
// //       }

// //       if(cnode.edges[i].vote < cnode.edges[i].min_vote){
// //         cnode.edges[i].vote = cnode.edges[i].min_vote; }
// //     //  cnode.weights[i] = cnode.weights[i] + 0.1;

// //     }else{
// //       cnode.edges[i].vote = 1; 
// //      // console.log('vote reseted. ' + 'period= ' + period + ' vote_time =' + cnode.vote_time)
// //     }
    
// //     cnode.edges[i].ltime = gtime;
// //   }// end of loop
// //   cnode.ltime = gtime;
// // }


// // // main one
// // function advanceFire1(cnode,gtime, safebreak)
// // {
// //   cnode.vote = 0;
// //   cnode.firecount +=1
// //   console.log("node "+ cnode.id +" fired" )
// //   for(let i=0; i<cnode.edges.length; i++)
// //   {
// //     let period = gtime - cnode.edges[i].ltime;
// // //     if( period < this.vote_time){ // if neuron to already depolarised to ground level
// //     if( period > 0 && period < cnode.vote_time){ // if neuron to already depolarised to ground level     
// //       cnode.edges[i].vote = cnode.edges[i].vote + cnode.weights[i];
// //       console.log('vote updated')

// //       if(safebreak>0){
// //         if(cnode.edges[i].vote > cnode.edges[i].thresh){
// //             advanceFire1(cnode.edges[i], gtime, safebreak - 1); }
// //       }else{
// //         console.log('safebreak happend')
// //       }

// //       if(cnode.edges[i].vote < cnode.edges[i].min_vote){
// //         cnode.edges[i].vote = cnode.edges[i].min_vote; }
    
// //       cnode.weights[i] = cnode.weights[i] + 0.1;

// //     }else{
// //       cnode.edges[i].vote = 1; 
// //       cnode.weights[i] = cnode.weights[i] - 0.1;

// //       console.log('vote reseted. ' + 'period= ' + period + ' vote_time =' + cnode.vote_time)
// //     }
    

// //     cnode.edges[i].ltime = gtime;
// //   }// end of loop
// //   cnode.ltime = gtime;
// //   console.log('..from advanced1')
// // }