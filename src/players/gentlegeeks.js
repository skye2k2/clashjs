var utils = require("../lib/utils.js");

var randombot = {
  info: {
    name: "gentlegeeks"
  },
  ai: function (playerState, enemiesStates, gameEnvironment) {
    // Are we in danger?  If so move to a safe place
    const possibleThreats = enemiesStates.filter(
      enemy => enemy.isAlive && enemy.ammo > 0
    );

    let danger = false;

    for (let i = 0; i < possibleThreats.length; i++) {
      const enemy = possibleThreats[i];

      danger = utils.isVisible(
        enemy.position,
        playerState.position,
        enemy.direction
      );
      if (danger) break;
    }

    if (danger) {
      return utils.safeRandomMove();
    } else {
      // If not in danger, and we have no ammo .... go get some ammo

      if (playerState.ammo <= 0) {
        const ammo = getClosestAmmoPosition(gameEnvironment, playerState);
        var heading = utils.getDirection(playerState.position, ammo);
        if (playerState.direction === heading) return "move";
        return heading;
      } else {
        // If not in danger, and we have ammo ... look for kill

        if (utils.canKill(playerState, enemiesStates)) {
          return "shoot";
        } else {
          return utils.safeRandomMove();
        }
      }

      // If nothing else ... random

      // return utils.randomMove();
    }
  }
};

var getClosestAmmoPosition = (gameEnvironment, playerState) => {
  var currentPosition = playerState.position;

  if (!gameEnvironment.ammoPosition.length) return;

  var closestPosition = gameEnvironment.ammoPosition[0];

  for (var i = 0; i < gameEnvironment.ammoPosition.length; i++) {
    if (
      calcDistance(currentPosition, gameEnvironment.ammoPosition[i]) <
      calcDistance(currentPosition, closestPosition)
    ) {
      closestPosition = gameEnvironment.ammoPosition[i];
    }
  }

  return closestPosition;
};

const calcDistance = (pos1, pos2) => {
  const horizontalDistance = Math.abs(pos1[1] - pos2[1]);
  const verticalDistance = Math.abs(pos1[0] - pos2[0]);
  return horizontalDistance + verticalDistance;
};

module.exports = randombot;
