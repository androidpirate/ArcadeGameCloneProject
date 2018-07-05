/* jshint esversion: 6*/
const enemyInitX = 100;
const enemyInitY = 100;
const enemyInitSpeed = 100;
const enemyRandomX = [-250, -200, -150, -100, -50];
const enemyRandomY = [60, 150, 230];
const enemySprite = "images/enemy-bug.png";
const playerInitX = 200;
const playerInitY = 400;
const playerMinPosLimit = 0;
const playerMaxPosLimit = 400;
const charBoySprite = "images/char-boy.png";
const canvasXLimit = 550;
const horizontalMoveIntv = 101;
const verticalMoveIntv = 93;

// Base class for all entities used in the game
class Entity {
  constructor(initX, initY, sprite) {
    this.x = initX;
    this.y = initY;
    this.sprite = sprite;
  }

  // Draw entities on the screen
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  // Static method that returns a random position for entities
  static getRandomPos(positionArray, arrayLength) {
    let index = Math.floor(Math.random() * Math.floor(arrayLength));
    return positionArray[index];
  }
}

class Enemy extends Entity {
  constructor(x = enemyInitX, y = enemyInitY, sprite = enemySprite) {
    super(x, y, sprite);
    this.speed = 100;
  }

  // Updates enemy position and respawn location
  update(dt) {
    this.x += this.speed + dt;
    // If the enemy passes canvas limit respawn at random location
    if(this,x >= canvasXLimit) {
      this.x = Entity.getRandomPos(enemyRandomX, enemyRandomX.length);
      this.y = Entity.getRandomPos(enemyRandomY, enemyRandomY.length);
    }
  }
}

class Player extends Entity {
  constructor(x = playerInitX, y = playerInitY, sprite = charBoySprite) {
    super(x, y, sprite);
  }

  update(dt) {

  }

  // Handles keyboard input and moves player on game board
  handleInput(input) {
    if (input === 'left' && this.x > playerMinPosLimit) {
      this.x -= horizontalMoveIntv;
    } else if (input === 'right' && this.x < playerMaxPosLimit) {
      this.x += horizontalMoveIntv;
    } else if (input === 'up' && this.y > playerMinPosLimit) {
      this.y -= verticalMoveIntv;
    } else if (input === 'down' && this.y < playerMaxPosLimit) {
      this.y += verticalMoveIntv;
    }
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
