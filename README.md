# Catan

## Background
Catan is a multiplayer board game in which a player builds settlements and cities connected by roads. Resources are gathered from the tiles which players have placed a settlement or city on and these resources are used for further development. 

## Construction
By clicking on an intersion between three tiles a player builds a settlement, and by clicking on an edge between two tiles the player builds a road, this occors in three phases.

![build](/README_images/build.gif)

***Validation***
Through the createSettlement function the settlement is checked to ensure that no adjacent settlements are owned, and that the current settlement is not owned.

```
export function createSettlement(settlement, player) {
    if (settlement.adj.every(settlement => settlement.type === null)) {
        if (settlement.type === null) {
            if (constructSettlement(player, settlement)) {
                player.settlements.push(settlement)
                renderSettlement(settlement, player)
            }
        } else {
            renderPlayerMessages('You cannot build a settlement right next to another settlement.')
        }
    }
}
```
Through the constructSettlement function the player's resoucres are checked to ensure that the player has sufficient resources to construct the settlement.

```
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
        renderPlayerMessages("cannot create settlement here, there are no roads nearby")
    }
}
```

***Creation and View Update***
If a settlement is valid, the constructSettlement function deducts the resources needed for construction from the player and pushes the created settlement into the player object's settlements array. The player's view is then updated, reflecting the change in the player's resource count.

```
export function updateView(){
    let player = findPlayer()
    updateTradePannel()
    
    document.getElementById("player-name").innerHTML = player.color.charAt(0).toUpperCase() + player.color.slice(1)
    document.getElementById("victory-points").innerHTML = `Victory Points: ${player.victoryPoints}`
    document.getElementById("knights").innerHTML = `Knights: ${player.knights}`
}
```
```
function updateTradePannel(){
    let player = findPlayer()
    

    Object.entries(player.resources).forEach(([fromResourceName, fromAmount]) => {
        let awayDispaly = document.getElementById(`trade-display-${fromResourceName}`)
        awayDispaly.innerHTML = `${fromResourceName}: ${fromAmount}`
    })
}
```

***Render*** 
Once the settlement is validated, resources are deducted, and the view updated the settlement is drawn on the canvas. Each settlement object has a a set of coordinates as part of the settlement object. These coordinates form the center of a circle which has a fill color of the player's color. 

```
export function renderSettlement(settlement, player) {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    settlement.owner = player
    settlement.type = 'settlement'
    ctx.beginPath()
    ctx.arc(settlement.pos.x, settlement.pos.y, 5, 0, 2 * Math.PI)
    ctx.strokeStyle = '#000000'
    ctx.fillStyle = player.color
    ctx.fill()
    ctx.stroke()
}
```

## Opponents
Only the red player one is played by the user, the other three players are computer players. When the current player is not the red player, the npcMove function is called, which forms the basis for the computer player's logic.

```
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
```
```
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
```
The npcMove function attempts to build settlements and roads first, if that is not possible it will buy a development card. Each canBuild/Buy function checks current resources, if the computer player can do the chosen action with the current the current resources it will do so, otherwise it will check to see if it can trade for those resources. 

```
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
```
the canTradeFor function tracks the number of trades required to trade for the missing resources and then sees how many trades are possible without loosing any required resource. If the required trades (tracked as requiredTradeTokens) is less than or equal to the number of possible trades (tracked as tradeTokens) the trades will be made and the purchase will be made. 

