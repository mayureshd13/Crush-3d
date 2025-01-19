
function autoplayAudio() {
    // Create a new audio element
    const audio = new Audio();
    
    // Set the source of the audio
    audio.src = 'Dunki.mp3'; // Replace with your audio file path
    
    // Enable looping if needed
    audio.loop = true;

    // Try to play the audio
    audio.play().catch(error => {
      console.log("Autoplay blocked. Interaction may be required:", error);
    });
  }

  // Call the function on page load
  window.onload = autoplayAudio;


var radius = 240; 
var autoRotate = true; 
var rotateSpeed = -60; 
var imgWidth = 120; 
var imgHeight = 170; 


setTimeout(init, 1000);

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid]; // combine 2 arrays

// Size of images
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

// Size of ground - depend on radius
var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

function applyTranform(obj) {
  // Constrain the angle of camera (between 0 and 180)
  if(tY > 180) tY = 180;
  if(tY < 0) tY = 0;

  // Apply the angle
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = (yes?'running':'paused');
}

var sX, sY, nX, nY, desX = 0,
    desY = 0,
    tX = 0,
    tY = 10;

// auto spin
if (autoRotate) {
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}


// setup events
document.onpointerdown = function (e) {
  clearInterval(odrag.timer);
  e = e || window.event;
  var sX = e.clientX,
      sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    var nX = e.clientX,
        nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function (e) {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

document.onmousewheel = function(e) {
  e = e || window.event;
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};
function applyTranform(obj) {
    // Constrain the angle of the camera (between 0 and 180)
    if (tY > 180) tY = 180;
    if (tY < 0) tY = 0;
  
    // Apply the angle
    obj.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
  
    // Dynamically scale the image at the front
    aEle.forEach((ele) => {
      const rect = ele.getBoundingClientRect(); // Get element position
      const centerX = window.innerWidth / 2; // Center of viewport (X-axis)
      const centerY = window.innerHeight / 2; // Center of viewport (Y-axis)
      const eleCenterX = rect.left + rect.width / 2;
      const eleCenterY = rect.top + rect.height / 2;
  
      const distance = Math.sqrt(
        Math.pow(eleCenterX - centerX, 2) + Math.pow(eleCenterY - centerY, 2)
      );
  
      // Calculate scale based on distance
      const scale = Math.max(1, 2 - distance / radius / 2);
      ele.style.transform = `scale(${scale})`;
      ele.style.zIndex = Math.round(scale * 100); // Bring front element on top
    });
  }
  