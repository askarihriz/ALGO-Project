let input = document.querySelector('input');

let string = [];
input.addEventListener('change', () => {
  let files = input.files;
  if(files.length==0) return;
  const file = files[0];
  let reader = new FileReader();
  reader.onload = (e) => {
    const file = e.target.result;
    const lines = file.split(/\r\n|\n|\t/);
    string = lines.slice();
    console.log(string);
    let positionCounter = 5;
    let size = parseInt(string[2],10);
    for(let i=0 ; i<size; i++) {
        cy.add({
          group: 'nodes',
          data: { id:`${i}` },
          position: { x: parseFloat(string[positionCounter],10)* 1000, y: parseFloat(string[positionCounter+1],10)* 1000 }
        });
        positionCounter+=3;
    }
    positionCounter--;
    let currentVert = 0;
    let toVert = 0;
    let val = 0;
    let id = 0;
    while(true) {
      if(string[positionCounter] === '' && string[positionCounter+1] === '' && string[positionCounter+2] === '1'){
        break;
      }
      if(string[positionCounter] === '') {
        positionCounter++;
        currentVert = parseFloat(string[positionCounter]);
        positionCounter++;
        console.log(' ');
      }
      if(string[positionCounter] !== '') {
        toVert = parseFloat(string[positionCounter]);
        val = parseFloat(string[positionCounter+2]);
      }
      cy.add({
        group: 'edges',
        data: { id:`e${id}`, weight: val, source:`${currentVert}`, target:`${toVert}`}
      });
      console.log(currentVert + ' ---> ' + toVert + '(' + val + ')');
      positionCounter+=4;
      id++;
    }
    console.log(' ');
    console.log("Dijktras Algorithm");
    console.log(' ');
    for(let i=0 ; i<size ; i++) {
      for(let j=0 ; j<size ; j++) {
        var dijkstra = cy.elements().dijkstra(`#${i}`, function(edge){
          return edge.data('weight');
        },true);
        
        var pathToJ = dijkstra.pathTo( cy.$(`#${j}`) );
        var distToJ = dijkstra.distanceTo( cy.$(`#${j}`) );
      
        console.log(`Shortest path weight from ${i} to ${j} = ` + distToJ);
        console.log(`Path from ${i} to ${j}:`);
        let tempSize = pathToJ.select().length;
        for(let i=0 ; i<tempSize ; i++) {
          console.log(pathToJ.select()[i].data());
        }
      }
    }
    console.log(' ');
    console.log("BellmanFord Algorithm");
    console.log(' ');
    for(let i=0 ; i<size ; i++) {
      for(let j=0 ; j<size ; j++) {
        var bf = cy.elements().bellmanFord({ root: `#${i}`, weight: function(edge) { return edge.data('weight'); }, directed: true});
        console.log(`Shortest path weight from ${i} to ${j} = ` + bf.distanceTo(`#${j}`));
        console.log(`Path from ${i} to ${j}:`);
        console.log(`Has negative edges = ` + bf.hasNegativeWeightCycle);
        let tempSize = bf.pathTo(`#${j}`).select().length;
        for(let i=0 ; i<tempSize ; i++) {
          console.log(bf.pathTo(`#${j}`).select()[i].data());
        }
      }
    }
    console.log(' ');
    console.log("Kruskal's Algorithm");
    console.log(' ');
    var kru = cy.elements().kruskal(function(edge){ return edge.data('weight') });
    let tempSize = kru.select().length;
    console.log("MST:");
    for(let i=0 ; i<tempSize ; i++) {
      console.log(kru.select()[i].data());
    }
    console.log(' ');
    console.log("FloydWarshall Algorithm");
    console.log(' ');
    var fw = cy.elements().floydWarshall({ weight: function(edge){ return edge.data('weight')}, directed: true});
    for(let i=0; i<size ; i++) {
      for(let j=0 ; j<size ; j++) {
        console.log(`Shortest path weight from ${i} to ${j} = ` + fw.distance(`#${i}`,`#${j}`));
        let tempSize = fw.path(`#${i}`, `#${j}`).select().length;
        for(let k=0 ; k<tempSize ; k++) {
          console.log(fw.path(`#${i}`,`#${j}`).select()[k].data());
        }
      }
    }
  }
  reader.onerror = (e) => alert(e.target.error.name);
  reader.readAsText(file);
});

var cy = cytoscape({

    container: document.getElementById('cy'), // container to render in
  
    elements: [ // list of graph elements to start with
        
    ],
  
    style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'background-color': '#666',
          'label': 'data(id)'
        }
      },
  
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier'
        }
      }
    ],
  
    layout: {
    }
  
  });



