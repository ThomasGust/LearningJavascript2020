var classifier;
var img;


function preload(){
  classifier = ml5.imageClassifier('MobileNet');
  img = loadImage('images/jigsaw.jpg');
}

function setup(){
  createCanvas(600, 600);
  classifier.classify(img, gotResult);
  image(img, 0, 0);
}

function gotResult(error, results){
  if (error){
    console.error(error);
  }
  else{
    console.log(results);
    createDiv('Label: ' + results[0].label + ", " + results[1].label + ", " + results[2].label);
    createDiv('Confidence: ' + nf(results[0].confidence, 0, 2));
  }
}