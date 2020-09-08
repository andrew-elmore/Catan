const grid = require("./grid");
import { renderRoad, renderSettlement, renderCity, renderBoard } from "./board"
const players = require("./playersObject")
import {
    constructCity,
    constructSettlement,
    constructRoad,
    renderPlayerMessages,
} from "./playerActions"

export function createCity(settlement, player) {
    if (constructCity(player)) {
        renderCity(settlement, player)
    }
}

export function createSettlement(settlement, player) {
    if (settlement.adj.every(settlement => settlement.type === null)) {
        if (settlement.type === null) {
            if (constructSettlement(player, settlement)) {
                player.settlements.push(settlement)
                renderSettlement(settlement, player)
            }
        } else if (settlement.type === 'settlement') {
            this.createCity(settlement, player)
        } else {
            renderPlayerMessages('You cannot build a settlement right next to another settlement.')
        }
    }
}

export function createRoad(road, player) {
    if (road.owner === null) {
        if (constructRoad(player, road)) {
            player.roads.push(road)
            renderRoad(road, player)
        }
    }
}