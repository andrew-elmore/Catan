const grid = require("./grid");
import { renderRoad, renderSettlement, renderCity, renderBoard } from "./board"
const players = require("./playersObject")
import { addResources, constructCity, constructSettlement, constructRoad, updateView, renderPlayerMessages, renderTradePannel} from "./playerActions"


class Game {
    constructor() {
        renderBoard()
        let currentPlayer = players[0]
        players[0].currentPlayer = true
        this.currentPlayer = currentPlayer
        renderTradePannel(currentPlayer)
        let button = document.getElementById('roll')
        button.addEventListener('click', () => this.endTurn())

        Object.values(grid.settlements).forEach(settlement => {
            let ele = document.getElementById(settlement.name)
            ele.addEventListener('click', () => { this.createSettlement(settlement, this.currentPlayer) })
        })
        
        Object.values(grid.roads).forEach(road => {
            let ele = document.getElementById(road.name)
            ele.addEventListener('click', () => { this.createRoad(road, this.currentPlayer) })
        })
        updateView(this.currentPlayer)
    }



    createCity(settlement, player) {
        if (constructCity(player)){
            renderCity(settlement, player)
        }
    }
    
    createSettlement(settlement, player) {
        if (settlement.adj.every(settlement => settlement.type === null)) {
            if (settlement.type === null) {
                if (constructSettlement(player, settlement)) {
                    renderSettlement(settlement, player)
                }
            } else if (settlement.type === 'settlement') {
                this.createCity(settlement, player)
            }
        }
    }
    
    createRoad(road, player) {
        if (road.owner === null){
            if (constructRoad(player, road)){
                renderRoad(road, player)
            }
        }
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
                return true
            }
        })
        if (!this.firstTurn()){
            this.roll()
        }
    }

    changePlayer(){
        
        if (this.currentPlayer.id < 3){
            let id = this.currentPlayer.id
            this.currentPlayer = players[id + 1]
            players[id].currentPlayer = false
            players[id+1].currentPlayer = true
        } else {
            this.currentPlayer = players[0]
            players[3].currentPlayer = false
            players[0].currentPlayer = true
        }
        updateView(this.currentPlayer)
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
            roll()
            return false
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const game = new Game();
})