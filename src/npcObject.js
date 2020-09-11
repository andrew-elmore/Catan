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
    } else if (canBuildSettlement(player)) {
    } else if (canBuildRoad(player)) {
    } else if(canBuyDevCard(player)){
        buyDevCard()
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
    let res = Math.floor(Math.random() * (settlements.length - 1))
    let settlement = settlements[res]
    while (settlement.owner || settlement.adj.some((adjSett) => adjSett.owner)){
        let res = Math.round(Math.random() * (settlements.length - 2))
        settlement = settlements[res]
    } 
    return settlement
}

function firstMoveSelectRoad(roads){
    let road = roads[Math.floor(Math.random() * (roads.length - 1))]
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
        return true
    } else {
        return false
    }
}

function canBuildSettlement(player){
    let target = { brick: 1, lumber: 1, ore: 0, grain: 1, wool: 1 }
    let resources = Object.keys(target)
    if (resources.every((resource) => { player.resources[resource] > target[resource] }) || canTradeFor(player, target)) {
        let settlements = findViableSettlements(player)
        if (settlements.length > 0){
            let res = Math.floor(Math.random() * (settlements.length - 1))
            let settlement = settlements[res]
            createSettlement(settlement, player)
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

function findViableSettlements(player){
    let potentialSettlements = []
    let currentRoads = Object.values(player.roads)
    currentRoads.forEach((road) => {
        Object.values(road.settlements).forEach((settlement) => {
            let setts = Object.values(settlement.adj)
            let adjOccupied = setts.every( sett => sett.owner === null )
            if (settlement.owner === null && adjOccupied)
            potentialSettlements.push(settlement)
        })
    })
    return potentialSettlements
}

function canBuildRoad(player){
    debugger
    let target = { brick: 1, lumber: 1, ore: 0, grain: 0, wool: 0 }
    let resources = Object.keys(target)
    if (resources.every((resource) => { player.resources[resource] > target[resource] }) || canTradeFor(player, target)) {
        let roads = findViableRoad(player)
        if (roads.length > 0){
            let res = Math.floor(Math.random() * (roads.length - 1))
            let road = roads[res]
            createRoad(road, player)
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

function findViableRoad(player){
    let potentialRoads = []
    let currentRoads = Object.values(player.roads)
    currentRoads.forEach((road) => {
        Object.values(road.settlements).forEach((settlement) => {
            let rds = Object.values(settlement.roads)
            rds.forEach((rd) =>{
                if (rd.owner === null){
                    potentialRoads.push(rd)
                }
            })
        })
    })
    return potentialRoads
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