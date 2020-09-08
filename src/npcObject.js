const players = require("./playersObject")
const grid = require("./grid");
import {
    createSettlement,
    createRoad
} from "./boardActions.js"
import { 
    buyDevCard,
    finishTrade
} from "./playerActions.js";

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
        firstMove(player)
    } else if(canBuyDevCard(player)){
        
    }
}

function firstMove(player){
    let settlements = Object.values(grid.settlements) 
    let settlement = firstMoveSelectSettlement(settlements)
    createSettlement(settlement, player)
    let roads = settlement.roads
    let road = firstMoveSelectRoad(roads)
    createRoad(road, player)
}

function firstMoveSelectSettlement(settlements){
    let res = Math.round(Math.random() * (settlements.length - 2))
    let settlement = settlements[res]
    while (settlement.owner || settlement.adj.some((adjSett) => adjSett.owner)){
        let res = Math.round(Math.random() * (settlements.length - 2))
        settlement = settlements[res]
    } 
    return settlement
}

function firstMoveSelectRoad(roads){
    let road = roads[Math.round(Math.random() * (roads.length - 1))]
    if (road.owner){
        firstMoveSelectRoad(roads)
    } else {
        return road
    }
}

function canBuyDevCard(player){
    let target = { brick: 0, lumber: 0, ore: 1, grain: 1, wool: 1 }
    let resources = Object.keys(target)
    if (resources.every((resource) => {player.resources[resource] > target[resource]}) || canTradeFor(player, target)){
        buyDevCard()
        return true
    } else {
        return false
    }
}

function canBuildSettlement(player){
    let target = { brick: 1, lumber: 1, ore: 0, grain: 1, wool: 1 }
    let resources = Object.keys(target)
    if (resources.every((resource) => { player.resources[resource] > target[resource] }) || canTradeFor(player, target)) {
        let settlement = findViableSettlement(player)
        return true
    } else {
        return false
    }
}

function findViableSettlement(player){
    let settlements = Object.values(grid.settlements)
}

function canTradeFor(player, target){
    let resources = Object.keys(target)
    let tradeTokens = 0
    let requiredTradeTokens = 0
    resources.forEach((resource) => {
        if(target[resource] > player.resources[resource]){
            requiredTradeTokens += 1
        }
        if (player.resources[resource] - target[resource] > 3){
            tradeTokens += Math.floor((player.resources[resource] - target[resource]) / 3)
        }
    })

    if(requiredTradeTokens <= tradeTokens){
        while (requiredTradeTokens > 0){
            let fromResourceName = null
            let toResourceName = null
            resources.forEach((resource) => {
                if (target[resource] > player.resources[resource]) {
                    toResourceName = resource
                }
            })
            resources.forEach((resource) => {
                if (player.resources[resource] - target[resource] > 3) {
                    fromResourceName = resource
                }
            })
            finishTrade(fromResourceName, toResourceName)
            requiredTradeTokens -= 1
        }
        return true
    } else {
        return false
    }
}