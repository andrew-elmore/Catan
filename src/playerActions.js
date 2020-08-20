import { renderBoard } from "./board"

const players = require("./playersObject")

export function addResources(type, player){
    if (type != "desert"){
        player.resources[type] += 1
        updateView(player)
    }
}

export function constructCity(player){
    if (player.resources.ore >= 3 && player.resources.grain >= 2 ){
        player.victoryPoints += 1
        player.resources.ore -= 3
        player.resources.grain -= 2
        updateView(player)
        return true
    } else {
        renderPlayerMessages("Not enough resources to build a city")
        return false
    }
}
export function constructRoad(player, road){
    if (player.startRoads > 0 && road.settlements.some(settlement => settlement.owner === player)){
        player.startRoads -= 1
        return true
    } else if (hasAdjRoads(road, player)) {
        if (player.resources.brick >= 1 && player.resources.lumber >= 1) {
            player.resources.brick -= 1
            player.resources.wood -= 2
            updateView(player)
            return true
        } else {
            renderPlayerMessages("Not enough resources to build a road")
            return false
        }
    }
}
export function constructSettlement(player, settlement){
    if (settlement.roads.some(road => road.owner === player)){
        if (player.resources.brick >= 1 && player.resources.grain >= 1 && player.resources.wool >= 1 && player.resources.lumber >= 1) {
            player.victoryPoints += 1
            player.resources.brick -= 1
            player.resources.grain -= 1
            player.resources.wool -= 1
            player.resources.lumber -= 1
            updateView(player)
            return true
        } else {
            renderPlayerMessages("Not enough resources to build a settlement")
            return false
        }
    } else if (player.startSettlements > 0){
        player.startSettlements -= 1
        player.victoryPoints += 1
        updateView(player)
        return true
    } else {
        renderPlayerMessages("cannot create road here, there are no roads nearby")
    }
}



function hasAdjRoads(road, player){
    let adjRoads = Object.values(road.settlements[0].roads.concat(road.settlements[1].roads))
    if (adjRoads.some(road => road.owner === player)) {
        return true
    } else {
        renderPlayerMessages("cannot create settlement here, there are no roads nearby")
        return false
    }
}

export function updateView(player){
    updateResources(player)
    renderTradePannel(player)
}

function updateResources(player) {
    Object.entries(player.resources).forEach(([resourceName, amount] )=>{
        let ele = document.getElementById(resourceName)
        ele.innerHTML = `${resourceName}: ${amount}`
    })
    document.getElementById("player-name").innerHTML = player.color
    document.getElementById("victory-points").innerHTML = player.victoryPoints
    renderTradePannel(player)
}

export function renderPlayerMessages(message){
    // debugger
    let ele = document.getElementById("user-pannel")
    ele.innerHTML = message
    setInterval(() => ele.innerHTML = "",5000)
}

function renderTradePannel(player) {
    let tradePannel = document.getElementById("trade-pannel")
    while (tradePannel.firstChild) {
        tradePannel.removeChild(tradePannel.firstChild);
    }
    Object.entries(player.resources).forEach(([resourceName, amount]) => {
        if (amount >= 3){
            let tradeAway = document.createElement('div')
            tradeAway.id = `trade-away-${resourceName}`
            
            tradePannel.appendChild(tradeAway)
            tradeAway.innerHTML = `Trade 3 ${resourceName}`
            tradeAway.addEventListener('click', () => { startTrade(player, resourceName) })
        }
    })
}

function startTrade(player, awayResourceName){
    // debugger
    // let tradeAway = document.getElementById(`trade-away-${awayResourceName}`)
    Object.entries(player.resources).forEach(([toResourceName, amount]) => {
        let tradeTo = document.createElement('div')
        tradeTo.id = `trade-to-${toResourceName}`
        let tradeAway = document.getElementById(`trade-away-${awayResourceName}`)
        tradeAway.appendChild(tradeTo)
        tradeTo.innerHTML = `For 1 ${toResourceName}`
        tradeTo.addEventListener('click', () => { finishTrade(player, awayResourceName, toResourceName) })
    })
}

function finishTrade(player, awayResourceName, toResourceName){
    // debugger
    let tradeAway = document.getElementById(`trade-away-${awayResourceName}`)
    while (tradeAway.firstChild) {
        tradeAway.removeChild(tradeAway.firstChild);
    }
    tradeAway.remove()
    player.resources[awayResourceName] -= 3
    player.resources[toResourceName] += 1
    updateResources(player)
}