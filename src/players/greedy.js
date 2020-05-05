import utils from '../lib/utils'
import _ from 'lodash'
import debug from 'debug'
const log = debug('clashjs:player:greedy')

function compareDistance(start) {
  return (value) => utils.getDistance(start, value.position)
}

function closest(items, myPos) {
  if (_.isEmpty(items)) return;
  const closest = _.sortBy(items, [compareDistance(myPos)])
  log('&g closest', closest)
  if (_.isEmpty(closest)) return;
  const dist = utils.getDistance(closest[0].position, myPos)
  log('&g dist', dist)
  return closest[0]
}

function smartMove(playerState, gridSize) {
  // avoid danger, don't go off board
  const rand = utils.randomMove()
  if (playerState.direction === 'east' && playerState.position[1] === gridSize - 1) {
    return _.sample(['north', 'west', 'south'])
  }
  if (playerState.direction === 'west' && playerState.position[1] === 0) {
    return _.sample(['north', 'east', 'south'])
  }
  if (playerState.direction === 'north' && playerState.position[0] === 0) {
    return _.sample(['east', 'west', 'south'])
  }
  if (playerState.direction === 'south' && playerState.position[0] === gridSize - 1) {
    return _.sample(['north', 'west', 'east'])
  }
  return rand
}

function canSee(items, myPos, direction) {
  let visible
  if (direction === 'north') {
    visible = items.filter(item => item.position[0] === myPos[0] && item.position[1] < myPos[1])
  }
  if (direction === 'south') {
    visible = items.filter(item => item.position[0] === myPos[0] && item.position[1] > myPos[1])
  }
  if (direction === 'east') {
    visible = items.filter(item => item.position[1] === myPos[1] && item.position[0] > myPos[1])
  }
  if (direction === 'west') {
    visible = items.filter(item => item.position[1] === myPos[1] && item.position[1] < myPos[1])
  }
  return visible
}

function canShoot(enemiesStates, myPos, direction, ammo) {
  if (!ammo) return false
  const visibleEnemies = canSee(enemiesStates, myPos, direction)
  return visibleEnemies.length
}

export default {
  info: {
    name: "🤑Greedy 🤑",
    style: 110,
  },
  ai: function (playerState, enemiesStates, gameEnvironment) {
    log('&g ------ starting turn ----------', this.turns, this)
    this.turns = (this.turns === undefined) ? 0 : this.turns++
    log('&g state', playerState, gameEnvironment, enemiesStates)
    if (utils.isOnAsteroid(playerState.position, gameEnvironment.asteroids)) {
      log('&&& greedy avoided asteroid', gameEnvironment.asteroids, playerState)
      return 'move'
    }
    const myPos = playerState.position
    if (canShoot(enemiesStates, myPos, playerState.direction, playerState.ammo)) {
      return 'shoot'
    }
    if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
      return 'shoot';
    }

    // find closest or best cargo
    const valuable = _.sortBy(gameEnvironment.cargos, 'value')
    log('&g valuablecargo', valuable)
    const closestAmmo = closest(gameEnvironment.ammoPosition.map(ammo => ({ position: ammo })), myPos)
    const closestCargo = closest(gameEnvironment.cargos, myPos)
    log('&g closest ammo & cargo', closestAmmo, closestCargo)
    const best = _.sortBy(gameEnvironment.cargos, [compareDistance(myPos), 'value'])
    // log('&g bestcargo', best)
    // const closestAmmo = closest(gameEnvironment.ammos, myPos)
    // log('&g closestAmmo', closestAmmo)

    if (best && best.length) {
      const direction = utils.fastGetDirection(myPos, best[0].position)
      const dir2 = utils.fastGetDirection(myPos, best[0].position)
      if (direction) {
        log('&g dir', direction, playerState.direction, dir2)
        if (direction === playerState.direction) {
          return 'move'
        } else {
          return direction
        }
      }
    }

    let directionToAmmo
    log('&g done, default move')
    if (gameEnvironment.ammoPosition.length) {
      directionToAmmo = utils.fastGetDirection(playerState.position, gameEnvironment.ammoPosition[0]);

      if (directionToAmmo !== playerState.direction) return directionToAmmo;
      return utils.safeRandomMove();
    }

    return utils.randomMove()
    // return smartMove(playerState, gameEnvironment.gridSize);
  },
}
