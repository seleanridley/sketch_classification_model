var img, save_s, p;
let classifier;
let confidence = "";
var save_s = 0;
let label = "";
let imageModelURL = "https://teachablemachine.withgoogle.com/models/Gd93sQe9W/";
var eraser_on = 0;
let e_color;
let t_color;
let sel;
let sel2;
let sel3;
let back_img;
let selected_weight;
let selected_color;
let pg;
let myFont;
let c;
var mode = 1;


function preload() {
  // Load the Customized Image Classification model
  classifier = ml5.imageClassifier(imageModelURL + 'model.json', modelReady);
  //status = 'loading...'
  //url = "https://thewallpaper.co//wp-content/uploads/2017/09preview/ferns-mist-wallpapers-plants-forest-hd-nature-wallpapers-rainforest-landscape-moss-jungle-path-android-nature-trees.jpg"
  //back_img = loadImage(url, ".jpg");
  //myFont = loadFont('AmaticSC-Bold.ttf');
  

}

function setup() {

  /* Sets default values*/
  createCanvas(windowWidth, windowHeight);
  background('rgba(0, 0, 0, 1)');

  /* Drawing Section */
  fill(255);
  //noFill();
  //strokeWeight(300);
  strokeWeight(2);
  stroke(255);
  rect(windowWidth * .1, windowHeight * .1, windowWidth * .65, windowHeight * .8, 20);

  /* Stroke Size Selector */
  sel = createSlider(5, 40, 10, 1);
  sel.position(windowWidth * .1,  windowHeight * .05);
  sel.size(150, 25, 20);
  sel.changed(drawSize);

  if( mode == 2 ) {
    sel2 = createColorPicker('#ff0000');
    sel2.size(150, 25, 20);
    sel2.position(windowWidth * .3,  windowHeight * .05);
  } 

   /* Coloring Page Selector */
  sel3 = createSelect();
  sel3.position(windowWidth * .4,  windowHeight * .05);
  sel3.size(150, 25, 20);
  sel3.style('font-size', '16px');
  sel3.option('');
  sel3.option('cat');
  sel3.option('dog');
  sel3.option('turtle');
  sel3.selected('');
  sel3.changed(pickPage);

  /* Load images */
  cat = loadImage('img/cat.png');
  dog = loadImage('img/dog.png');
  turtle = loadImage('img/turtle.png');
} 

const modelReady = () => {
  status = 'loaded model!';
  //classifier.predict(img);
}



function draw() {

  

  //textFont(myFont, 12);
  //clear();
 
  /* Title and Description */
  textSize(24);
  strokeWeight(0);
  //fill('rgba(0, 0, 0, 0.1)');

  fill(color(0, 50, 240));
  if( mode == 1) {
    text("Sketch and We'll Guess!", windowWidth * .8, windowHeight * .15);
    textSize(18);
    fill(255);
    textAlign(CENTER);
    text("Sketch any common animal you can think of and this machine \
  learning model will guess which animal you've sketched. Click \
  'Finished' to start the model and click 'Clear' to start a new sketch. \n\n  Mode '1' sketch model, Mode '2' coloring book", 
      windowWidth * .8, windowHeight * .18, windowWidth * .15, windowHeight * .4);

    displayResults();
  } else {
    text("Animal Coloring Book", windowWidth * .8, windowHeight * .15);
    textSize(18);
    fill(255);
    textAlign(CENTER);
    text("Pick any animal to color! Click 'Save' to download your final image' and click 'Clear' to start a new sketch. . \n\n  Mode '1' sketch model, Mode '2' coloring book", 
      windowWidth * .8, windowHeight * .18, windowWidth * .15, windowHeight * .4);
  }
  textAlign(LEFT);
  strokeWeight(10);
  textSize(24);
  


  /* Eraser Button */
  button = createButton('Turn on Eraser');
  button.position(windowWidth * .2, windowHeight * .05);
  button.style('font-size', '20px');
  button.style('background-color', e_color);
  button.style('color', t_color);
  button.style('font-family', 'Georgia');
  button.size(150, 25, 20);
  button.mousePressed(eraser);


  /* Draw functionality */
  if (mouseIsPressed == true) {
    if( (mouseX > windowWidth * 0.1) && 
    (mouseX < windowWidth * .1 + windowWidth * .65) && 
    (mouseY > windowHeight * 0.1) && 
    (mouseY < windowHeight * .8) ) {
      if( mode == 1 && eraser_on == 0) { 
        stroke(0);
      } else if(mode == 2 && eraser_on == 0) {
        stroke( sel2.value() ); 
      } else if(eraser_on == 1 ) {
        stroke(255);
      }
      strokeWeight(sel.value())
      line(mouseX, mouseY, pmouseX, pmouseY);
    }
  }

  /* Clear and Finish buttons */
  button = createButton('Finished!');
  button.position(windowWidth * .2, windowHeight * .92);
  button.style('font-size', '20px');
  button.style('color', 'white');
  button.style('font-family', 'Georgia');
  button.style('background-color', color(25, 23, 200));
  button.size(150, 25, 20);
  button.mousePressed(runModel);


  button = createButton('Clear');
  button.position(windowWidth * .3, windowHeight * .92);
  button.style('font-size', '20px');
  button.style('color', 'white');
  button.style('font-family', 'Georgia');
  button.style('background-color', 'red');
  button.size(150, 25, 20);
  button.mousePressed(clrScreen); 

  /* Mode buttons */

  button = createButton('1');
  button.position(windowWidth * .80, windowHeight * .5);
  button.style('font-size', '20px');
  button.style('color', 'white');
  button.style('font-family', 'Georgia');
  button.style('background-color', 'blue');
  button.size(100, 30, 30);
  button.mousePressed(switchMode1);

  button = createButton('2');
  button.position(windowWidth * .8 + 150, windowHeight * .5);
  button.style('font-size', '20px');
  button.style('color', 'black');
  button.style('font-family', 'ArmaticSC-Bold');
  button.style('background-color', 'yellow');
  button.size(100, 30, 30);
  button.mousePressed(switchMode2);

  displayBox(); /* Calls function that draws the results box */

  textSize(32);
  //fill(255);
  //strokeWeight(4);

  /* Prints latest results */
  text(label, windowWidth * .79, windowHeight * .75);
  text(confidence, windowWidth * .79, windowHeight * .85);

  pickPage();
}

function windowResized() {
  //resizeCanvas(windowWidth, windowHeight);
  remove();
  let myp5 = new p5();
  setup();
  draw();

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

function changeColor() {
  /* Toggles stoke color */
  fill(sel2.value());
}

function switchMode1() {
  clrScreen();
  mode = 1;
  setup();
}

function switchMode2() {
  mode = 2;
  clrScreen();
  setup();
}

function pickPage() {
/* Allows user to pick which coloring page */
  if(mode != 1){
    switch( sel3.value() ) {
      case 'cat':
        image(cat, windowWidth * .2, windowHeight * .1, windowWidth * .45, windowHeight * .8);
        break;
    case 'dog':
        image(dog, windowWidth * .2, windowHeight * .1, windowWidth * .45, windowHeight * .8);
        break;
    case 'turtle':
        image(turtle, windowWidth * .2, windowHeight * .1, windowWidth * .45, windowHeight * .8);
        break;
    }
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
  blendMode(SCREEN);
  img = get(windowWidth * .1, windowHeight * .1, (windowWidth * .75 - windowWidth * .1), (windowHeight * .9 - windowHeight * .1));
  img.loadPixels();
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      var index = (x + (y * img.width)) * 4;
/*
      if(img.pixels[index] == 255) {
        img.set(x, y, color(0));
      } else {
        img.set(x, y, color(255));
      }  */
    }
  }
  img.updatePixels();
  //save(img, 'test.jpg');
  //image(img, 0, 0, windowWidth, windowHeight);
  p = classifier.classify(img, gotResult);

}

function clrScreen() {
  /*Clears the whole screen */
  //background();
  clear();
  //background();
  label = "";
  confidence = "";
  fill(255);
  rect(windowWidth * .1, windowHeight * .1, windowWidth * .65, windowHeight * .8, 20);
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

function displayBox() {
  /*Sets up the box where the results are displayed */
   noErase();
   strokeWeight(1);
   stroke(255);
   noFill();
   rect(windowWidth * .78, windowHeight * .1, windowWidth * .2, windowHeight * .8, 20);
  
  }

  function displayResults(results="") {
   textSize(20);
   fill(255);
   strokeWeight(0);
   textAlign(LEFT);
   text("Our guess!: ", windowWidth * .79, windowHeight * .7)
   text("How Confident we are: ", windowWidth * .79, windowHeight * .8);
  }
