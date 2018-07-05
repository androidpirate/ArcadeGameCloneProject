/* jshint esversion: 6*/
const ENEMY_INIT_X = 100;
const ENEMY_INIT_Y = 100;
const ENEMY_INIT_SPEED = 100;
const ENEMY_RANDOM_X = [-250, -200, -150, -100, -50];
const ENEMY_RANDOM_Y = [60, 150, 230];
const ENEMY_RANDOM_SPEED = [100, 150, 200, 250, 300];
const ENEMY_SPRITE = "images/enemy-bug.png";
const PLAYER_INIT_X = 200;
const PLAYER_INIT_Y = 400;
const PLAYER_MIN_POS_LIMIT = 0;
const PLAYER_MAX_POS_LIMIT = 400;
const CHAR_BOY_SPRITE = "images/char-boy.png";
const CANVAS_X_LIMIT = 550;
const HORIZONTAL_MOVE_INTV = 101;
const VERTICAL_MOVE_INTV = 83;
const GEM_SPRITES = ["images/gem-blue.png", "images/gem-orange.png", "images/gem-green.png"];
const GEM_RANDOM_X = [18, 119, 220, 321, 422];
const GEM_RANDOM_Y = [100, 183, 266];
const scoreSpanElement = document.querySelector("#score");
let score = 0;

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

  // Static method that returns a random movement speed
  static getRandomSpeed(speedArray, arrayLength) {
    let index = Math.floor(Math.random() * Math.floor(arrayLength));
    return speedArray[index];
  }

  // Static method that returns a random gem stripe
  static getRandomGemSprite() {
    let index = Math.floor(Math.random() * Math.floor(GEM_SPRITES.length));
    return GEM_SPRITES[index];
  }
}

class Enemy extends Entity {
  constructor(x = ENEMY_INIT_X, y = ENEMY_INIT_Y, speed = ENEMY_INIT_SPEED, sprite = ENEMY_SPRITE) {
    super(x, y, sprite);
    this.speed = Entity.getRandomSpeed(ENEMY_RANDOM_SPEED, ENEMY_RANDOM_SPEED.length);
  }

  // Updates enemy position and respawn location
  update(dt) {
    this.x += this.speed * dt;
    // If the enemy passes canvas limit respawn at random location
    if(this.x >= CANVAS_X_LIMIT) {
      this.x = Entity.getRandomPos(ENEMY_RANDOM_X, ENEMY_RANDOM_X.length);
      this.y = Entity.getRandomPos(ENEMY_RANDOM_Y, ENEMY_RANDOM_Y.length);
    }
  }
}

class Player extends Entity {
  constructor(x = PLAYER_INIT_X, y = PLAYER_INIT_Y, sprite = CHAR_BOY_SPRITE) {
    super(x, y, sprite);
  }

  update(dt) {
    if(this.y <= 0) {
      this.resetPosition();
      score++;
      updateScore();
    }
  }

  // Resets player position
  resetPosition() {
    this.x = PLAYER_INIT_X;
    this.y = PLAYER_INIT_Y;
  }

  // Handles keyboard input and moves player on game board
  handleInput(input) {
    if (input === 'left' && this.x > PLAYER_MIN_POS_LIMIT) {
      this.x -= HORIZONTAL_MOVE_INTV;
    } else if (input === 'right' && this.x < PLAYER_MAX_POS_LIMIT) {
      this.x += HORIZONTAL_MOVE_INTV;
    } else if (input === 'up' && this.y > PLAYER_MIN_POS_LIMIT) {
      this.y -= VERTICAL_MOVE_INTV;
    } else if (input === 'down' && this.y < PLAYER_MAX_POS_LIMIT) {
      this.y += VERTICAL_MOVE_INTV;
    }
  }
}

class Gem extends Entity {
  // GEM scale is 65 to 110
  constructor(x, y, sprite = "images/gem-blue.png") {
    super(x, y, sprite);
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [new Enemy(Entity.getRandomPos(ENEMY_RANDOM_X, ENEMY_RANDOM_X.length), Entity.getRandomPos(ENEMY_RANDOM_Y, ENEMY_RANDOM_Y.length)),
                  new Enemy(Entity.getRandomPos(ENEMY_RANDOM_X, ENEMY_RANDOM_X.length), Entity.getRandomPos(ENEMY_RANDOM_Y, ENEMY_RANDOM_Y.length)),
                  new Enemy(Entity.getRandomPos(ENEMY_RANDOM_X, ENEMY_RANDOM_X.length), Entity.getRandomPos(ENEMY_RANDOM_Y, ENEMY_RANDOM_Y.length))];
let player = new Player();
let gem = new Gem(Entity.getRandomPos(GEM_RANDOM_X, GEM_RANDOM_X.length), Entity.getRandomPos(GEM_RANDOM_Y, GEM_RANDOM_Y.length),
                  Entity.getRandomGemSprite());
updateScore();

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

// Updates score
function updateScore() {
  scoreSpanElement.textContent = score.toString();
}

function checkCollisions() {
  for(let i = 0; i < allEnemies.length; i++) {
      if(Math.abs(player.x - allEnemies[i].x) <= 30 && Math.abs(player.y - allEnemies[i].y) <= 10) {
        alert("Opps, you have been bugged!");
        player.resetPosition();
        score = 0;
        updateScore();
      }
  }
}
