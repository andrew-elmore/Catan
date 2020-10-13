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

##Opponents
Only the red player one is played by the user, the other three players are computer players. 
