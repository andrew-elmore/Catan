const grid = require("./grid");


document.addEventListener("DOMContentLoaded", function () {
    



    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')

    function createSettlement(settlement) {
        settlement.owner = 'red'
        ctx.beginPath()
        ctx.arc(settlement.pos.x, settlement.pos.y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = '#ff0000'
        ctx.fill()
        ctx.stroke()
        console.log(grid)
    }
    function createRoad(road) {
        road.owner = 'red'
        ctx.beginPath()
        ctx.moveTo(road.settlements[0].pos.x, road.settlements[0].pos.y)
        ctx.lineTo(road.settlements[1].pos.x, road.settlements[1].pos.y)
        ctx.strokeStyle = '#ff0000'
        ctx.lineWidth = 3
        ctx.stroke()
        console.log(grid)
    }
    
    const settlements = Object.values(grid.settlements)
    const roads = Object.values(grid.roads)

    settlements.forEach(settlement => {
        ele = document.getElementById(settlement.name)
        ele.addEventListener('click', () => { createSettlement(settlement)})
    });
    roads.forEach(road => {
        ele = document.getElementById(road.name)
        ele.addEventListener('click', () => { createRoad(road)})
    });

    let colors = {
        'brick': '#a85032',
        'grain': '#f2b749',
        'lumber': '#044203',
        'wool': '#ededed',
        'ore': '#696969',
        'desert': '#feffd9'
    }


    let tiles = Object.values(grid.tiles)
    tiles.forEach(tile =>{
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

    })
});
