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
const GEM_SPRITES = ["images/gem-blue.png", "images/gem-green.png", "images/gem-orange.png"];
const GEM_RANDOM_X = [-150, -100, 18, 119, 220, 321, 422, 550, 600];
const GEM_RANDOM_Y = [-200, - 150, 100, 183, 266, 650, 700];
const SPECIAL_CELLS = [[0, 55], [101, 55], [202, 55], [303, 55], [404, 55],
                       [0, 140], [101, 140], [202, 140], [303, 140], [404, 140],
                       [0, 220], [101, 220], [202, 220], [303, 220], [404, 220]];
const scoreSpanElement = document.querySelector("#score");
const gameStartMessage = document.querySelector(".modal");
const okButton = document.querySelector(".button");
let score = 0;
let isGemVisible = false;

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

  // Static method that returns random special special cell
  static getRandomCell() {
    let index = Math.floor(Math.random() * Math.floor(SPECIAL_CELLS.length));
    return SPECIAL_CELLS[index];
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

  // Respawn player at start position and update score
  update(dt) {
    if(this.y <= 0) {
      this.resetPosition();
      score++;
      updateScore();
      gem = Gem.getRandomGem();
    } else if(Math.abs(this.x - gem.x) <= 50 && Math.abs(this.y - gem.y) <= 50) {
      switch (gem.sprite) {
        case GEM_SPRITES[0]:
          score += 1;
          updateScore();
          break;
        case GEM_SPRITES[1]:
          score += 2;
          updateScore();
          break;
        case GEM_SPRITES[2]:
          score += 3;
          updateScore();
          break;
      }
      gem = Gem.getRandomGem();
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

// Checks for collisions between player and enemy
function checkCollisions() {
  for(let i = 0; i < allEnemies.length; i++) {
      // Any distance less than 30 within any horizontal direction and
      // 10 within vertical direction considered as a collision
      if(Math.abs(player.x - allEnemies[i].x) <= 30 && Math.abs(player.y - allEnemies[i].y) <= 10) {
        alert("Opps, you have been bugged!");
        player.resetPosition();
        score = 0;
        updateScore();
      }
  }
}

// Updates score
function updateScore() {
  scoreSpanElement.textContent = score.toString();
}

class Gem extends Entity {
  // GEM scale is 65 to 110
  constructor(x, y, sprite = "images/gem-blue.png") {
    super(x, y, sprite);
  }

  static getRandomGem() {
    return new Gem(Entity.getRandomPos(GEM_RANDOM_X, GEM_RANDOM_X.length), Entity.getRandomPos(GEM_RANDOM_Y, GEM_RANDOM_Y.length),
                  Entity.getRandomGemSprite());
  }
}

okButton.addEventListener("click", function() {
  gameStartMessage.classList.toggle("close");
});

class Rock extends Entity {
  constructor(x, y, sprite = "images/rock.png") {
    super(x, y, sprite);
  }

  static getRandomRock() {
    let randomCell = Entity.getRandomCell();
    return new Rock(randomCell[0], randomCell[1]);
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [new Enemy(Entity.getRandomPos(ENEMY_RANDOM_X, ENEMY_RANDOM_X.length), Entity.getRandomPos(ENEMY_RANDOM_Y, ENEMY_RANDOM_Y.length)),
                  new Enemy(Entity.getRandomPos(ENEMY_RANDOM_X, ENEMY_RANDOM_X.length), Entity.getRandomPos(ENEMY_RANDOM_Y, ENEMY_RANDOM_Y.length)),
                  new Enemy(Entity.getRandomPos(ENEMY_RANDOM_X, ENEMY_RANDOM_X.length), Entity.getRandomPos(ENEMY_RANDOM_Y, ENEMY_RANDOM_Y.length))];
let player = new Player();
let gem = Gem.getRandomGem();
let rock = Rock.getRandomRock();
updateScore();
