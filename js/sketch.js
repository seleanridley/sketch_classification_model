var img, save_s, p;
let classifier;
let confidence = "";
var save_s = 0;
let label = "";
let imageModelURL = "https://teachablemachine.withgoogle.com/models/eofyaIwDh/";
var eraser_on = 0;
let e_color;
let t_color;
let sel;
let selected_weight;

function preload() {
  // Load the Customized Image Classification model
  classifier = ml5.imageClassifier(imageModelURL + 'model.json', modelReady);
  status = 'loading...'
}

function setup() {
  /* Sets default values*/
  createCanvas(windowWidth, windowHeight)
  background('#FFC360'); //Sets background color to zero

  /* Drawing Section */
  fill(255);
  strokeWeight(2);
  rect(50, 50, windowWidth * .6, windowHeight * .8, 20);
  stroke(0);

  /* Stroke Size Selector */
  sel = createSelect();
  sel.position(80,  60);
  sel.size(150, 25, 20);
  sel.style('font-size', '16px');
  sel.option('5px');
  sel.option('10px');
  sel.option('15px');
  sel.selected('10px');
  sel.changed(drawSize);

}

const modelReady = () => {
  status = 'loaded model!';
  //classifier.predict(img);
}

function draw() {

  /* Title and Description */
  textSize(36);
  strokeWeight(0);
  fill(0);
  textFont('Georgia');

  text("Sketch and We'll Guess!", windowWidth-500, 100);
  textSize(20);
  text("Sketch any common animal you can think of and",  windowWidth-500, 140);
  text("this machine learning model will guess which", windowWidth-500, 170);
  text("animal you've sketched!", windowWidth-500, 200);
  text("Click 'Finished' to start the model.", windowWidth-500, 260);
  text("Click 'Clear' to start a new sketch.", windowWidth-500, 320);

  strokeWeight(10);
  textSize(24);

  //Drawing Section
  //noFill();
  
  /* Eraser Button */
  button = createButton('Turn on Eraser');
  button.position(windowWidth * .50, 60);
  button.style('font-size', '20px');
  button.style('background-color', e_color);
  button.style('color', t_color);
  button.style('font-family', 'Georgia');
  button.size(150, 25, 20);
  button.mousePressed(eraser);

  
  /* Switches */
  if(eraser_on == 0) {
    stroke(0);
  } else {
    stroke(255);
    strokeWeight(30);
  }

  if(selected_weight == 5) {
    strokeWeight(5);
  } else if(selected_weight == 10) {
    strokeWeight(10);
  } else {
    strokeWeight(15);
  }

  /* Draw functionality */
  if (mouseIsPressed == true) {
    if( (mouseX > 50) && 
    (mouseX < windowWidth * .6) && 
    (mouseY > 50) && 
    (mouseY < windowHeight * .8) ) {
      line(mouseX, mouseY, pmouseX, pmouseY);
    }
  }

  /* Clear and Finish buttons */
  button = createButton('Finished!');
  button.position(100, windowHeight-100);
  button.style('font-size', '20px');
  button.style('color', 'white');
  button.style('font-family', 'Georgia');
  button.style('background-color', 'blue');
  button.size(150, 25, 20);
  button.mousePressed(runModel);

  button = createButton('Clear');
  button.position(400, windowHeight-100);
  button.style('font-size', '20px');
  button.style('color', 'white');
  button.style('font-family', 'Georgia');
  button.style('background-color', 'red');
  button.size(150, 25, 20);
  button.mousePressed(clrScreen);



  displayBox(); //Calls function that draws the results box

  textSize(45);
  fill(255);
  strokeWeight(4);

  /* Prints latest results */
  text(label, windowWidth-455, windowHeight-340);
  text(confidence, windowWidth-455, windowHeight-220);

}

function eraser() {
  //Keeps track of whether the eraser is on or off
  switch(eraser_on) {
    case 0:
      eraser_on = 1; //Switches on
      e_color = "green";
      t_color = "white"
      break;
    case 1:
      eraser_on = 0; //Switches off
      e_color = "#CFCFCF";
      t_color = "black";
      break;
  } 
}

function drawSize() {
  /* Toggles the stroke size */
  switch(sel.value()) {
    case '5px':
      selected_weight = 5;
      break;
    case '10px':
      selected_weight = 10;
      break;
    case '15px':
      selected_weight = 15;
      break;
  } 
}

function clearResults() {
  /* Clears results from the screen */
  label = "";
  confidence = "";
  displayBox();
}

function runModel() {
  /* Takes the drawing as an input and inputs into the classification model */
  clearResults();
  img = get(50, 50, windowWidth * .6, windowHeight * .8);
  p = classifier.classify(img, gotResult);

}

function clrScreen() {
  /*Clears the whole screen */
  background('#FFC360');
  label = "";
  confidence = "";
  fill(255);
  strokeWeight(2);
  rect(50, 50, windowWidth * .6, windowHeight * .8, 20);
}


// A function to run when we get any errors and the results
function gotResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  console.log(results.sort());
  // Show the first label and confidence
  label = results[0].label;
  confidence = nf(results[0].confidence, 0, 2) * 100 + "%";
}

function displayBox(results="") {
  /*Sets up the box where the results are displayed */
   noErase();
   strokeWeight(5);
   stroke(0);
   fill('#FFC360');
   rect(windowWidth-500, windowHeight-450, 400, 300, 20);
   textSize(20);
   fill(0);
   strokeWeight(0);
   text("Our guess!: ", windowWidth-485, windowHeight-400)
   text("How Confident we are: ", windowWidth-485, windowHeight-270);

  }