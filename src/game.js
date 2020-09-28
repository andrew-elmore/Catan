const grid = require("./grid");
import { renderRoad, renderSettlement, renderCity, renderBoard } from "./board"
const players = require("./playersObject")
import { 
    addResources, 
    updateView, 
    renderPlayerMessages, 
    renderTradePannel,
    buyDevCard
} from "./playerActions"

import {
    createSettlement,
    createRoad
} from "./boardActions.js"

import{
    showInstructions
} from "./tutorial.js"

import{
    npcMove
} from "./npcObject.js"


class Game {
    constructor() {
        renderBoard()
        let currentPlayer = players[0]
        players[0].currentPlayer = true
        this.currentPlayer = currentPlayer
        renderTradePannel(currentPlayer)
        let rollButton = document.getElementById('roll')
        rollButton.addEventListener('click', () => this.endTurn())

        let instructions = document.getElementById('instructions-button')
        instructions.addEventListener('click', () => showInstructions())

        let devCardButton = document.getElementById('dev-card')
        devCardButton.addEventListener('click', () => buyDevCard())

        let demoSetupButton = document.getElementById('demo-setup')
        demoSetupButton.addEventListener('click', () => this.npcMoves())

        // let demoSetupButton = document.getElementById('demo-setup')
        // demoSetupButton.addEventListener('click', () => this.demoStart())

        Object.values(grid.settlements).forEach(settlement => {
            let ele = document.getElementById(settlement.name)
            ele.addEventListener('click', () => { createSettlement(settlement, this.currentPlayer) })
        })
        
        Object.values(grid.roads).forEach(road => {
            let ele = document.getElementById(road.name)
            ele.addEventListener('click', () => { createRoad(road, this.currentPlayer) })
        })
        
        // showInstructions()
        updateView(this.currentPlayer)
        renderPlayerMessages('Please place Two Roads and Two Settlements')
    }


    roll() {
        let res = Math.round(Math.random() * 6) + Math.round(Math.random() * 6)
        renderPlayerMessages(`You Rolled a ${res}`)
        Object.values(grid.tiles).forEach(tile =>{
            if (tile.number === res && res != 7){
                Object.values(tile.settlements).forEach(settlement => {
                    if (settlement.owner != null){
                        addResources(tile.type, settlement.owner)
                        if (settlement.type === "city" ){
                            addResources(tile.type, settlement.owner)
                        }
                    }
                })
            }
        })
    }

    endTurn(){
        Object.values(players).forEach((player) => {
            if(player.victoryPoints === 10){
                let ele = document.getElementById("user-pannel")
                ele.innerHTML = `${player.color} has WON!`
                showInstructions()
                return true
            }
        })
        if (!this.firstTurn() || this.currentPlayer.id === 0){
            this.roll()
        }
    }

    changePlayer(){
        if (this.currentPlayer.id < 3){
            let id = this.currentPlayer.id
            this.currentPlayer = players[id + 1]
            players[id].currentPlayer = false
            players[id+1].currentPlayer = true
            npcMove();
            this.endTurn()
        } else {
            this.currentPlayer = players[0]
            players[3].currentPlayer = false
            players[0].currentPlayer = true
        }
        updateView(this.currentPlayer)
        if (this.currentPlayer.firstTurn === true){
            renderPlayerMessages('Please place Two Roads and Two Settlements')
        }

    }

    firstTurn(){

        let allPlayers = Object.values(players)
        if (allPlayers.some(player => player.firstTurn === true)) {
            if (this.currentPlayer.startSettlements === 0 && this.currentPlayer.startRoads === 0){
                Object.values(grid.tiles).forEach(tile =>{
                    Object.values(tile.settlements).forEach(settlement =>{
                        if (settlement.owner === this.currentPlayer){
                            addResources(tile.type, settlement.owner)
                        }
                    })
                })
                this.currentPlayer.firstTurn = false
                this.changePlayer()
            }
            return true
        } else {
            this.changePlayer()
            return false
        }
    }



}



document.addEventListener("DOMContentLoaded", function () {
    const game = new Game();
})

