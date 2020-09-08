const players = require("./playersObject")
const grid = require("./grid");
import {
    createSettlement,
    createRoad
} from "./boardActions.js"

function findPlayer() {
    let player = null
    let allPlayers = Object.values(players)
    allPlayers.forEach(playerObject => {
        if (playerObject.currentPlayer) { player = playerObject }
    })
    return player
}

export function npcMove(){
    let player = findPlayer()
    if (player.firstTurn === true){
        firstMove(player)
    }
}

function firstMove(player){
    let settlements = Object.values(grid.settlements) 
    let settlement = firstMoveSelectSettlement(settlements)
    console.log(settlement)
    createSettlement(settlement, player)
    let roads = settlement.roads
    let road = firstMoveSelectRoad(roads)
    createRoad(road, player)
}

function firstMoveSelectSettlement(settlements){
    let res = Math.round(Math.random() * (settlements.length - 1))
    let settlement = settlements[res]
    if (settlement.owner || settlement.adj.some((adjSett) => adjSett.owner)){
        firstMoveSelectSettlement(settlements)
    } else {
        return settlement
    }
}

function firstMoveSelectRoad(roads){
    let road = roads[Math.round(Math.random() * (roads.length - 1))]
    if (road.owner){
        debugger
        firstMoveSelectRoad(roads)
    } else {
        return road
    }
}