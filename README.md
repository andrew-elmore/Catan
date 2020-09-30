# Catan

## Background
Catan is a multiplayer board game in which player build settlements and cities connected by roads. Resources are gathered from the tiles which players have placed a settlement or city on and these resources are used for further development. 

## MVPs
* Renders a game board.
* Players can create roads, settlements and cities if they have enough resources.
* Players can trade during their turn.
* Game will roll dice at the start of each player's turn and switch off from one player to the next on their turn.

## Technologies
This project will use vanilla JS, HTML, CSS, and Canvas. The major challenge will be allowing a player to click on a canvas element, this will require empty HTML elements to act as a base for the event listeners.

In addition to the entry file there will be [X] scripts:
* A board.js file to form the associations between the tiles, roads, settlements and cities. It will also render the canvas elements.
* A player.js file that will track each player's resources (including victory points), pass information on the player's actions to the game.js file, and handle trading logic.
* A game.js file that will check victory conditions, make dice rolls, and switch between players.

## Wireframe
![wireframe](/README_images/wireframe.png)

## Timeline

### Day 1: Setup
Get webpack running, create entry file, create the board.js file including the grid object and render the canvas. 

### Day 2: Road, Settlement and City Construction
Allow the player to create roads, settlements and cities if they have enough resources. Allow players to trade three of one resource for one of another resouce.

### Day 3: Interface
Adds event listners to HTML elements above the canvas to allow players to interact by clicking the elements, add on screen counters for resources and victory points, style with CSS.


webpack --watch --mode=development

about me details