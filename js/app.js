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
const CANVAS_X_LIMIT = 550;
const HORIZONTAL_MOVE_INTV = 101;
const VERTICAL_MOVE_INTV = 83;
const GEM_SPRITES = ["images/gem-blue.png", "images/gem-green.png", "images/gem-orange.png"];
/* Constants for DOM elements */
const scoreSpan = document.querySelector("#score");
const startMessageModal = document.querySelector("#message-game-start");
const selectCharModal = document.querySelector("#character-select");
const okButtonGameStart = document.querySelector("#button-ok-game-start");
const okButtonSelectCharModal = document.querySelector("#button-ok-select-char");
const charNameSpan = document.querySelector("#char-name");

let allEnemies;
let player;
let gem;
let rock;
let charSprite = "images/char-boy.png"; /* Default value is char-boy.png */
let gemCell;
let rockCell;
let score = 0;

class Cell {
  constructor(row, col, occupied) {
    this.row = row;
    this.col = col;
    this.occupied = occupied;
  }
}
// Cells that a rock or a gem can be inserted randomly
const SPECIAL_CELLS = [new Cell(-101, 55, false), new Cell(0, 55, false), new Cell(101, 55, false), new Cell(202, 55, false),
                       new Cell(303, 55, false), new Cell(404, 55, false), new Cell(505, 55, false), new Cell(-101, 140, false),
                       new Cell(0, 140, false), new Cell(101, 140, false), new Cell(202, 140, false), new Cell(303, 140, false),
                       new Cell(404, 140, false), new Cell(505, 140, false), new Cell(-101, 220, false), new Cell(0 , 220, false),
                       new Cell(101, 220, false),new Cell(202, 220, false), new Cell(303, 220, false), new Cell(404, 220, false),
                       new Cell(505, 220, false)];

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
  constructor(x = PLAYER_INIT_X, y = PLAYER_INIT_Y, sprite = charSprite) {
    super(x, y, sprite);
  }

  // Respawns player at start position and update score
  update(dt) {
    if(this.y <= 0) {
      this.resetPosition();
      score++;
      updateScore();
      Gem.resetCellStatus(gemCell);
      gem = Gem.getRandomGem();
      Rock.resetCellStatus(rockCell);
      rock = Rock.getRandomRock();
    } else if(Math.abs(this.x - gem.x) <= 50 && Math.abs(this.y - gem.y) <= 50) {
        switch (gem.sprite) {
          // Blue gem
          case GEM_SPRITES[0]:
            score += 1;
            updateScore();
            break;
          // Green gem
          case GEM_SPRITES[1]:
            score += 2;
            updateScore();
            break;
          // Orange gem
          case GEM_SPRITES[2]:
            score += 3;
            updateScore();
            break;
          }
      Gem.resetCellStatus(gemCell);
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
      let moveLeft = this.x - HORIZONTAL_MOVE_INTV;
      if(Math.abs(moveLeft - rock.x) > 50 || Math.abs(player.y - rock.y) > 50) {
          this.x -= HORIZONTAL_MOVE_INTV;
      }
    } else if (input === 'right' && this.x < PLAYER_MAX_POS_LIMIT) {
      let moveRight = this.x + HORIZONTAL_MOVE_INTV;
      if(Math.abs(moveRight - rock.x) > 50 || Math.abs(player.y - rock.y) > 50) {
          this.x += HORIZONTAL_MOVE_INTV;
      }
    } else if (input === 'up' && this.y > PLAYER_MIN_POS_LIMIT) {
      let moveUp = this.y - VERTICAL_MOVE_INTV;
      if(Math.abs(moveUp - rock.y) > 50 || Math.abs(player.x - rock.x) > 50) {
          this.y -= VERTICAL_MOVE_INTV;
      }
    } else if (input === 'down' && this.y < PLAYER_MAX_POS_LIMIT) {
      let moveDown = this.y + VERTICAL_MOVE_INTV;
      if(Math.abs(moveDown - rock.y) > 50 || Math.abs(player.x - rock.x) > 50) {
          this.y += VERTICAL_MOVE_INTV;
      }
    }
  }
}

class Gem extends Entity {
  constructor(x, y, sprite = "images/gem-blue.png") {
    super(x, y, sprite);
  }

  // Static method that creates a gem at random location
  static getRandomGem() {
    gemCell = Entity.getRandomCell();
    while(gemCell.occupied) {
      gemCell = Entity.getRandomCell();
    }
    gemCell.occupied = true;
    return new Gem(gemCell.row, gemCell.col, Entity.getRandomGemSprite());
  }

  // Static method that resets cell status to not occupied
  static resetCellStatus(cell) {
    gemCell.occupied = false;
  }
}

class Rock extends Entity {
  constructor(x, y, sprite = "images/rock.png") {
    super(x, y, sprite);
  }

  // Static method that creates a rock at random location
  static getRandomRock() {
    rockCell = Entity.getRandomCell();
    while(rockCell.occupied) {
      rockCell = Entity.getRandomCell();
    }
    rockCell.occupied = true;
    return new Rock(rockCell.row, rockCell.col);
  }

  // Static method that resets cell status to not occupied
  static resetCellStatus(cell) {
    rockCell.occupied = false;
  }
}

// Checks for collisions between player and enemy
function checkCollisions() {
  for(let i = 0; i < allEnemies.length; i++) {
      // Any distance less than 30 within any horizontal direction and
      // 10 within vertical direction considered as a collision
      if(Math.abs(player.x - allEnemies[i].x) <= 30 && Math.abs(player.y - allEnemies[i].y) <= 10) {
        swal({
          text: "You've been bugged! Click OK to restart the game.",
          title: "Game Over"
        });
        player.resetPosition();
        score = 0;
        initializeGame();
        updateScore();
      }
  }
}

// Updates score
function updateScore() {
  scoreSpan.textContent = score.toString();
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

// Prevents page scroll when using arrows keys and space
window.addEventListener("keydown", function(e) {
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

// Click listener for OK button in Select Character Modal
okButtonSelectCharModal.addEventListener("click", function() {
  selectCharModal.classList.toggle("closeModal");
});

// Click listener for OK button in Start Message Modal
okButtonGameStart.addEventListener("click", function() {
  startMessageModal.classList.toggle("closeModal");
});

// Replaces player's avatar with selected sprite
function onRadioButtonClicked(radioButton) {
  charSprite = radioButton.value;
  player.sprite = charSprite;
  switch(charSprite) {
    case "images/char-cat-girl.png":
      charNameSpan.textContent = "Cat Girl";
      break;
    case "images/char-horn-girl.png":
      charNameSpan.textContent = "Horn Girl";
      break;
    case "images/char-pink-girl.png":
      charNameSpan.textContent = "Pink Girl";
      break;
    case "images/char-princess-girl.png":
      charNameSpan.textContent = "Princess Girl";
      break;
    default:
      charNameSpan.textContent = "Beach Boy";
      break;
  }
}

// Initializes game elements on game board
function initializeGame() {
  // Now instantiate your objects.
  // Place all enemy objects in an array called allEnemies
  // Place the player object in a variable called player
  allEnemies = [new Enemy(Entity.getRandomPos(ENEMY_RANDOM_X, ENEMY_RANDOM_X.length), Entity.getRandomPos(ENEMY_RANDOM_Y, ENEMY_RANDOM_Y.length)),
                    new Enemy(Entity.getRandomPos(ENEMY_RANDOM_X, ENEMY_RANDOM_X.length), Entity.getRandomPos(ENEMY_RANDOM_Y, ENEMY_RANDOM_Y.length)),
                    new Enemy(Entity.getRandomPos(ENEMY_RANDOM_X, ENEMY_RANDOM_X.length), Entity.getRandomPos(ENEMY_RANDOM_Y, ENEMY_RANDOM_Y.length))];
  player = new Player();
  gem = Gem.getRandomGem();
  rock = Rock.getRandomRock();
}

// Initialize game
initializeGame();
updateScore();
