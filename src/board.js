const grid = require("./grid");

export function renderBoard(){
    const settlements = Object.values(grid.settlements)
    const roads = Object.values(grid.roads)
    const tiles = Object.values(grid.tiles)

    settlements.forEach(settlement => {
        let ele = document.createElement("div")
        ele.id = settlement.name

        ele.style.top = `${settlement.pos.y - 5}px`
        ele.style.left = `${settlement.pos.x - 5}px`

        let grid = document.getElementsByClassName("grid")
        grid[0].appendChild(ele)
    });

    roads.forEach(road => {
        let adjY = Math.max(road.settlements[0].pos.y, road.settlements[1].pos.y) - Math.min(road.settlements[0].pos.y, road.settlements[1].pos.y)
        let adjX = Math.max(road.settlements[0].pos.x, road.settlements[1].pos.x) - Math.min(road.settlements[0].pos.x, road.settlements[1].pos.x)

        let ele = document.createElement("span")
        ele.id = road.name


        ele.style.top = `${Math.min(road.settlements[0].pos.y, road.settlements[1].pos.y) + (adjY / 2) - 10}px`
        ele.style.left = `${Math.min(road.settlements[0].pos.x, road.settlements[1].pos.x) + (adjX / 2) - 10}px`

        let grid = document.getElementsByClassName("grid")
        grid[0].appendChild(ele)
    });

    tiles.forEach(tile => {
        let midpointX = tile.settlements[0].pos.x + (tile.settlements[5].pos.x - tile.settlements[0].pos.x) / 2
        let midpointY = tile.settlements[0].pos.y + (tile.settlements[5].pos.y - tile.settlements[0].pos.y) / 2

        let ele = document.createElement("p")
        ele.innerHTML = tile.number


        ele.style.top = `${midpointY - 10}px`
        ele.style.left = `${midpointX - 10}px`

        let grid = document.getElementsByClassName("grid")
        grid[0].appendChild(ele)
    });

    let colors = {
        'brick': '#a85032',
        'grain': '#f2b749',
        'lumber': '#044203',
        'wool': '#ededed',
        'ore': '#696969',
        'desert': '#feffd9'
    };


    tiles.forEach(tile => {
        const canvas = document.querySelector('canvas')
        const ctx = canvas.getContext('2d')
        let settlements = Object.values(tile.settlements)
        ctx.beginPath();
        ctx.moveTo(tile.settlements[0].pos.x, tile.settlements[0].pos.y);
        ctx.lineTo(settlements[1].pos.x, settlements[1].pos.y);
        ctx.lineTo(settlements[2].pos.x, settlements[2].pos.y);
        ctx.lineTo(settlements[5].pos.x, settlements[5].pos.y);
        ctx.lineTo(settlements[4].pos.x, settlements[4].pos.y);
        ctx.lineTo(settlements[3].pos.x, settlements[3].pos.y);
        ctx.lineTo(settlements[0].pos.x, settlements[0].pos.y);
        ctx.closePath();
        ctx.fillStyle = colors[tile.type]
        ctx.fill()
        ctx.stroke();

        let midpointX = settlements[0].pos.x + (settlements[5].pos.x - settlements[0].pos.x) / 2
        let midpointY = settlements[0].pos.y + (settlements[5].pos.y - settlements[0].pos.y) / 2
        ctx.beginPath()
        ctx.arc(midpointX, midpointY, 15, 0, 2 * Math.PI)
        ctx.fillStyle = '#f0ce56'
        ctx.fill()
        ctx.stroke()
    });

}

export function  renderCity(settlement, player) {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    settlement.owner = player
    settlement.type = 'city'
    ctx.beginPath()
    ctx.arc(settlement.pos.x, settlement.pos.y, 6, 0, 2 * Math.PI)
    ctx.strokeStyle = '#000000'
    ctx.fillStyle = player.color
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(settlement.pos.x, settlement.pos.y, 2, 0, 2 * Math.PI)
    ctx.strokeStyle = '#000000'
    ctx.fillStyle = '#000000'
    ctx.fill()
    ctx.stroke()
}

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



export function renderRoad(road, player) {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    road.owner = player
    ctx.beginPath()
    ctx.moveTo(road.settlements[0].pos.x, road.settlements[0].pos.y)
    ctx.lineTo(road.settlements[1].pos.x, road.settlements[1].pos.y)
    ctx.strokeStyle = player.color
    ctx.lineWidth = 3
    ctx.stroke()
}