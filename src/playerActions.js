const players = require("./playersObject")

export function addResources(type, player){
    player.resources[type] += 1
}