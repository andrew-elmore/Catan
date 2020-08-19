const grid = require("./grid");
import { renderRoad, renderSettlement, renderCity, renderBoard } from "./board"
const players = require("./playersObject")
import { addResources } from "./playerActions"


class Game {
    constructor() {
        renderBoard()
        let currentPlayer = players[2]
        this.currentPlayer = currentPlayer
        let button = document.getElementById('roll')
        button.addEventListener('click', () => this.roll())

    }



    createCity(settlement, player) {
        renderCity(settlement, player)
    }
    
    createSettlement(settlement, player) {
        if (settlement.adj.every(settlement => settlement.type === null)) {
            if (settlement.type === null) {
                renderSettlement(settlement, player)
            } else if (settlement.type === 'settlement') {
                this.createCity(settlement, player)
            }
        }
    }
    
    createRoad(road, player) {
        renderRoad(road, player)
    }

    roll() {
        let res = Math.round(Math.random() * 6) + Math.round(Math.random() * 6)
        console.log(res)
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
        console.log(players)
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const game = new Game();
})