const grid = require("./grid");
import { renderRoad, renderSettlement, renderCity, renderBoard } from "./board"
const players = require("./playersObject")
import { 
    addResources, 
    constructCity, 
    constructSettlement, 
    constructRoad, 
    updateView, 
    renderPlayerMessages, 
    renderTradePannel,
    buyDevCard
} from "./playerActions"


class Game {
    constructor() {
        renderBoard()
        let currentPlayer = players[0]
        players[0].currentPlayer = true
        this.currentPlayer = currentPlayer
        renderTradePannel(currentPlayer)
        let rollButton = document.getElementById('roll')
        rollButton.addEventListener('click', () => this.endTurn())

        let devCardButton = document.getElementById('dev-card')
        devCardButton.addEventListener('click', () => buyDevCard())

        let demoSetupButton = document.getElementById('demo-setup')
        demoSetupButton.addEventListener('click', () => this.demoStart())

        Object.values(grid.settlements).forEach(settlement => {
            let ele = document.getElementById(settlement.name)
            ele.addEventListener('click', () => { this.createSettlement(settlement, this.currentPlayer) })
        })
        
        Object.values(grid.roads).forEach(road => {
            let ele = document.getElementById(road.name)
            ele.addEventListener('click', () => { this.createRoad(road, this.currentPlayer) })
        })
        

        updateView(this.currentPlayer)
        renderPlayerMessages('Please place Two Roads and Two Settlements')
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
            } else {
                renderPlayerMessages('You cannot build a settlement right next to another settlement.')
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
            // this.roll()
            return false
        }
    }

    demoStart(){
        debugger
        this.createSettlement(grid.settlements[19], this.currentPlayer);
        debugger
        this.createRoad(grid.roads[26], this.currentPlayer);
        this.createSettlement(grid.settlements[36], this.currentPlayer);
        this.createRoad(grid.roads[47], this.currentPlayer);
        this.endTurn()
        this.createSettlement(grid.settlements[42], this.currentPlayer);
        this.createRoad(grid.roads[58], this.currentPlayer);
        this.createSettlement(grid.settlements[49], this.currentPlayer);
        this.createRoad(grid.roads[63], this.currentPlayer);
        this.endTurn()
        this.createSettlement(grid.settlements[30], this.currentPlayer);
        this.createRoad(grid.roads[42], this.currentPlayer);
        this.createSettlement(grid.settlements[28], this.currentPlayer);
        this.createRoad(grid.roads[40], this.currentPlayer);
        this.endTurn()
        this.createSettlement(grid.settlements[8], this.currentPlayer);
        this.createRoad(grid.roads[11], this.currentPlayer);
        this.createSettlement(grid.settlements[12], this.currentPlayer);
        this.createRoad(grid.roads[14], this.currentPlayer);
        this.endTurn()
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const game = new Game();
})