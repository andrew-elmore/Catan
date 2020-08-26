import { renderBoard } from "./board"

const players = require("./playersObject")


function findPlayer(){
    let player = null
    let allPlayers = Object.values(players)
    allPlayers.forEach(playerObject => {
        if (playerObject.currentPlayer) { player = playerObject }
    })
    return player
}

export function addResources(type, player){
    if (type != "desert"){
        player.resources[type] += 1
        updateView()
    }
}


export function constructCity(player){
    if (player.resources.ore >= 3 && player.resources.grain >= 2 ){
        player.victoryPoints += 1
        player.resources.ore -= 3
        player.resources.grain -= 2
        updateView()
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
            player.resources.lumber -= 2
            updateView()
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
            updateView()
            return true
        } else {
            renderPlayerMessages("Not enough resources to build a settlement")
            return false
        }
    } else if (player.startSettlements > 0){
        player.startSettlements -= 1
        player.victoryPoints += 1
        updateView()
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


export function updateView(){
    let player = findPlayer()
    updateTradePannel()
    
    document.getElementById("player-name").innerHTML = player.color.charAt(0).toUpperCase() + player.color.slice(1)
    document.getElementById("victory-points").innerHTML = `Victory Points: ${player.victoryPoints}`
    document.getElementById("knights").innerHTML = `Knights: ${player.knights}`
}

export function renderPlayerMessages(message){
    let ele = document.getElementById("user-pannel")
    ele.innerHTML = message
    setInterval(() => ele.innerHTML = "",5000)
}

export function renderTradePannel() { 
    let player = findPlayer()

    let tradePannel = document.getElementById("trade-pannel")
    Object.entries(player.resources).forEach(([fromResourceName, fromAmount]) => {
        let tradeAway = document.createElement('div')
        tradeAway.id = `trade-away-${fromResourceName}`
        tradeAway.className = `resource-trade-container`
        tradePannel.appendChild(tradeAway)
        
        let awayDispaly = document.createElement('div')
        awayDispaly.id = `trade-display-${fromResourceName}`
        tradeAway.appendChild(awayDispaly)
        awayDispaly.innerHTML = `${fromResourceName}: ${fromAmount}`


        Object.entries(player.resources).forEach(([toResourceName, toAmount]) => {
        let tradeTo = document.createElement('button')
        tradeTo.id = `${fromResourceName}-to-${toResourceName}`
        tradeTo.className = `resource-trade-button`
        tradeAway.appendChild(tradeTo)
        tradeTo.innerHTML = `Trade 3:1 for ${toResourceName}`
        tradeTo.addEventListener('click', () => { finishTrade(fromResourceName, toResourceName) })
        })
    })
}

function updateTradePannel(){
    debugger
    let player = findPlayer()
    

    Object.entries(player.resources).forEach(([fromResourceName, fromAmount]) => {
        let awayDispaly = document.getElementById(`trade-display-${fromResourceName}`)
        awayDispaly.innerHTML = `${fromResourceName}: ${fromAmount}`
    })
}

function finishTrade(fromResourceName, toResourceName) {
    
    let player = findPlayer()

    if (player.resources[fromResourceName] >=3 ){
        player.resources[fromResourceName] -= 3
        player.resources[toResourceName] += 1
    } else {
        renderPlayerMessages(`Not enough ${fromResourceName}`)
    }
    updateTradePannel()
} 

export function buyDevCard() {
    let player = findPlayer()
    if (player.resources.ore >= 1 && player.resources.grain >= 1 && player.resources.wool >= 1){
        player.resources.ore -= 1
        player.resources.grain -= 1 
        player.resources.wool -= 1
        let res = Math.random()
        if (res > .5){
            renderPlayerMessages(`You have drawn a victory card!`)
            player.victoryPoints += 1
        } else {
            renderPlayerMessages(`You have drawn a knight!`)
            player.knights += 1
        }
    } else {
        renderPlayerMessages(`Not enough resources to buy a development card`)
    }
    updateView()
}
