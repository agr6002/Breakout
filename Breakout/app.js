let can, con, timePrior = 0, angle = 0, gameOver = false;
const puck = {
  pos : {
    x : 0.5,
    y : 0.5
  },
  dim : {
    x : 0.02,
    y : 0.03
  },
  vel : {
    x : -0.0002,
    y : -0.0002
  },
  color : "white"
}
const base = {
  pos : {
    x : 0.5,
    y : 0.85
  },
  dim : {
    x : 0.2,
    y : 0.03
  },
  vel : {
    x : 0.00045,
    y : 0
  },
  color : "white"
}

let boxesLength = 6, boxesHeight = 5, boxes = [], colors = ["blue","green", "red", "orange", "purple"]

class Box {
  constructor(color, posX, posY, dimX, dimY) {
    this.color = color,
    this.dim = { x : dimX, y : dimY },
    this.pos = { x : posX, y : posY }
  }
  draw(){    
    con.fillStyle = this.color;
    con.fillRect((this.pos.x - (this.dim.x / 2)) * can.width,
      (this.pos.y - (this.dim.y / 2)) * can.height, 
      this.dim.x * can.width, this.dim.y * can.height);
  }
  collide(timeChange) {
    const puckBottom = puck.pos.y + (puck.dim.y / 2);
    const puckTop = puck.pos.y - (puck.dim.y / 2);
    const puckLeft = puck.pos.x - (puck.dim.x / 2);
    const puckRight = puck.pos.x + (puck.dim.x / 2);
    const boxBottom = this.pos.y + (this.dim.y / 2);
    const boxTop= this.pos.y - (this.dim.y / 2);
    const boxLeft = this.pos.x - (this.dim.x / 2);
    const boxRight = this.pos.x + (this.dim.x / 2);
    if (
      puckTop < boxBottom &&
      puckBottom > boxTop &&
      puckRight > boxLeft &&
      puckLeft < boxRight &&
      this.color !== 'black'
    ) {
      const m13 = (boxTop - boxBottom) / (puckLeft - puckRight);
      const m24 = (boxTop - boxBottom) / (puckRight - puckLeft);
      let hit = "wrong"
    
      if (puckTop < boxTop && puckLeft < boxLeft) {  
        hit = "topLeft";
        if (boxTop - puckTop < m13 * (boxLeft - puckLeft)) {
          puck.vel.x *= -1;
          console.log("x");
        } else {
          puck.vel.y *= -1;
          console.log("y");
        }
      } else if (puckBottom > boxBottom && puckLeft < boxLeft) {  
        hit = "bottomLeft";
        if (boxBottom - puckBottom >  m24 * (boxLeft - puckLeft)) {
          puck.vel.x *= -1;
          console.log("x");
        } else {
          puck.vel.y *= -1;
          console.log("y");
        }
      } else if (puckTop < boxTop && puckRight > boxRight) {  
        hit = "topRight";
        if (boxTop - puckTop > m13 * (boxRight - puckRight)) {
          puck.vel.x *= -1;
          console.log("x")
        } else {
          puck.vel.y *= -1;
          console.log("y")
        }
      } else if (puckBottom > boxBottom && puckRight > boxRight) {  
        hit = "bottomLeft";
        if (boxBottom - puckBottom > m24 * (boxRight - puckRight)) {
          puck.vel.x *= -1;
          console.log("x")
        } else {
          puck.vel.y *= -1;
          console.log("y")
        }
      } else if (puckTop < boxTop) {
        hit = "top";
        puck.vel.y *= -1;
      } else if (puckBottom > boxBottom) {
        hit = "bottom";
        puck.vel.y *= -1;
      } else if (puckLeft < boxLeft) {
        hit = "left";
        puck.vel.x *= -1;
      } else if (puckRight > boxRight) {
        hit = "right";
        puck.vel.x *= -1;
      } else {
        hit = "wrong"
      }
      console.log(hit)
      this.color = 'black'
      return true
    }
    else {
     return false
    }
  }
}

window.onload = init;

function init() {
  can = document.getElementById("can");
  con = can.getContext("2d");
  window.onresize = resize;
  can.addEventListener("mousemove", handleMove);
  resize()
  for (l = 0; l < boxesLength; l++) {
    for (h = 0; h < boxesHeight; h++) {
      boxes.push(new Box(colors[h], 0.164 * l + 0.089, 0.1 * h + 0.05, 0.155, 0.08))
    }
  }
  requestAnimationFrame(animate);
}

function resize() {
  const bcr = document.body.getBoundingClientRect()
  can.width = bcr.width
  can.height = bcr.height
}

function animate(timeNow) {
  const timeChange = timeNow - timePrior;
  update(timeChange);
  draw();
  timePrior = timeNow;
  if (gameOver == false) {
    requestAnimationFrame(animate);
  } else {
    con.font = "50px Arial";
    con.fillText("Game Over", 0.4 * can.width, 0.5 * can.height);
  }
}

function update(timeChange) {  
  puck.pos.x += puck.vel.x * timeChange;
  puck.pos.y += puck.vel.y * timeChange;
  //base.pos.x += base.vel.x * timeChange * angle;
  //base.pos.x = mouseX;
  if (base.pos.x + (base.dim.x / 2) > 1) {
    base.pos.x = 1 - (base.dim.x / 2);
  } else if (base.pos.x - (base.dim.x / 2) < 0) {
    base.pos.x = base.dim.x / 2;
  }

  if (puck.pos.x + (puck.dim.x / 2) > 1) {
    puck.pos.x = 1 - (puck.dim.x / 2);
    puck.vel.x *= -1;
  } else if (puck.pos.x - (puck.dim.x / 2) < 0) {
    puck.pos.x = puck.dim.x / 2;
    puck.vel.x *= -1;
  }
  if (puck.pos.y + (puck.dim.y / 2) > 1) {
    //puck.pos.y = 1 - (puck.dim.y / 2);
    //puck.vel.y *= -1;
    gameOver = true;
  } else if (puck.pos.y - (puck.dim.y / 2) < 0) {
    puck.pos.y = puck.dim.y / 2;
    puck.vel.y *= -1;
  }

  if (
    // puck's right edge > base's left edge &&
    puck.pos.x  + (puck.dim.x / 2) > base.pos.x - (base.dim.x / 2)&&
    // puck's left edge < base's right edge &&
    puck.pos.x - (puck.dim.x / 2) < base.pos.x + (base.dim.x / 2) &&
    // puck's bottom edge > base's top edge &&
    puck.pos.y + (puck.dim.y / 2) > base.pos.y - (base.dim.y / 2) &&
    // puck's top edge < base's bottom edge
      puck.pos.y - (puck.dim.y / 2) < base.pos.y + (base.dim.y / 2)) {
      // puck.pos.x = base.pos.x + (base.dim.x / 2);
      puck.pos.y = base.pos.y - ((base.dim.y + puck.dim.y) / 2);
      //puck.vel.x *= -1;
      puck.vel.y *= -1;
 }

 let b = -1;
 for (i = 0; i < boxes.length; i++) {
    b += 1;
    if (boxes[b].collide(timeChange) === true) {
      //console.log('b')
      //boxes[i].splice(b)
      b -= 1;
    }
  }
}

function draw() {
  con.clearRect(0, 0, can.width, can.height);
  for(i = 0; i < boxes.length; i++) {
    boxes[i].draw()
  }
  con.fillStyle = base.color;
  con.fillRect((base.pos.x - base.dim.x / 2) * can.width, 
    (base.pos.y - base.dim.y / 2) * can.height,
    base.dim.x * can.width, base.dim.y * can.height);
  con.fillStyle = puck.color;
  con.fillRect((puck.pos.x - puck.dim.x / 2) * can.width,
    (puck.pos.y - puck.dim.y / 2) * can.height, 
    puck.dim.x * can.width, puck.dim.y * can.height);
}

function handleMove(e) {
  base.pos.x = e.clientX / can.width;   
  //mouseY = e.clientY; 
  //angle = (mouseX - (base.pos.x * can.width)) / can.width
  //console.log(angle) 
}
