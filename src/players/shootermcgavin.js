import {
  makeRandomMove,
  calculateHeading,
  findClosestAmmo,
  threatsFacingMe,
  canMoveForward,
  enemiesInRange,
  oppositeDirection,
  isActionSafe,
} from '../lib/helpers'

import debug from 'debug'
const log = debug('clashjs:bot:starterbot')

export default {
  info: {
    name: 'shooter mcgavin',
    style: 49,
    team: 6,
  },
  ai: function (player, enemies, game) {
     
    // Check if we are in immediate danger, if so try to move
    if (threatsFacingMe(player, enemies).length > 0) {
      log('In danger! Lets try to move')
      if (canMoveForward(player, game)) {
        if (isActionSafe(player, 'move', enemies, game)) {
          return 'move'
        } else {
          return oppositeDirection
        }
      }
    }

    // Not in danger, so lets see if we can shoot somebody
    const targets = enemiesInRange(player, enemies)
    if (player.ammo > 0 && targets.length > 0) {
      log('Found someone to shoot', targets)
      return 'shoot'
    }

    // Not in danger, nobody to shoot, lets go collect more ammo
    const closestAmmo = findClosestAmmo(player, game)

    if (closestAmmo) {
      log('Found some ammo', closestAmmo)
      const ammoDir = calculateHeading(player.position, closestAmmo)

      log('Heading towards ammo', ammoDir)
      if (ammoDir === player.direction) {
        return 'move'
      } else {
        return ammoDir
      }
    }
    return makeRandomMove()
  },
}