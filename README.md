# Arcade Game Clone Project

The game is an adaptation of the classical arcade game **Frogger** developed by Konami in 1981. The main goal of the game is to get the player character to the beach safely, without getting caught by giant bugs and collect precious gems on the way.

<p align="center">
  <img src="\img\game_screen_cap.png">
</p>

## Table of Contents

* [Instructions](#instructions)
* [Contributing](#contributing)

## Instructions for App Design

### Gameplay instructions

Game starts with selecting one of the five available characters. None of the characters has any advantage over another. The purpose of the game is to score highest before getting caught by any of the bugs.

Every time the player reaches the beach (**water tiles**), the score increases 1 point and the player position will reset, along with the collectable and obstructions on the road (**stone tiles**).

Another way of scoring is to collect gems along the way. There are three types of gems available, blue, green, orange. Every blue gem collected is an additional 1 point, every green gem collected is an additional 2 points and every orange gem collected is an additional 3 points.

If you caught by a bug, an alert dialog will pop and the game will be over. The score will reset to 0 and the player will be positioned back to starting point.

#### Game Functions

|  CRITERIA| MEETS SPECIFICATIONS   |
|---|---|
| Error Free |  The game functions correctly and runs error free <br><br> <li> Player can not move off screen <br> <li> Vehicles cross the screen <li> Vehicle-player collisions happen logically (not too early or too late) <li> Vehicle-player collision resets the game <li> Something happens when player wins |

#### Object Oriented Code

|  CRITERIA| MEETS SPECIFICATIONS   |
|---|---|
| Object Oriented Code |  Game objects (player and vehicles) are implemented using JavaScript object-oriented programming features. |

#### Documentation

|  CRITERIA| MEETS SPECIFICATIONS   |
|---|---|
| README  |  A README file is included detailing the game and all dependencies. |
| Comments  |  Comments are present and effectively explain longer code procedure when necessary. |
| Code Quality  |  Code is formatted with consistent, logical, and easy-to-read formatting as described in the [**Udacity JavaScript Style Guide**](http://udacity.github.io/frontend-nanodegree-styleguide/javascript.html).  |
| Star Rating  |  The game displays a star rating (from 1 to at least 3) that reflects the player's performance. At the beginning of a game, it should display at least 3 stars. After some number of moves, it should change to a lower star rating. After a few more moves, it should change to a even lower star rating (down to 1).<br><br> If the player could able to match all cards within 20 stars it is rated as 3 stars, any number of moves between 20 and 40 rated as 2 and anything over 40 moves rated as 1 star. |
| Timer  | When the player starts a game, a displayed timer should also start. Once the player wins the game, the timer stops.  |
| Move Counter  | 	Game displays the current number of moves a user has made. |

## Contributing

This repository is a project for Udacity's Front End Nano Degree program. Therefore, any pull requests will be ignored.


## Dependencies

1. [**Sweet Alert**](https://sweetalert.js.org/guides/)
