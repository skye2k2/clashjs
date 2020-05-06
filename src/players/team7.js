import {
  makeRandomMove,
  sameColumn,
  sameRow,
  calculateDistance,
  calculateHeading,
  calculateNewPosition,
  isTargetVisible,
  enemiesInRange,
  threats,
  threatsFacingMe,
  canMoveForward,
  findClosestAmmo,
  isActionSafe,
  oppositeDirection,
} from "../lib/helpers";


import debug from "debug";
const log = debug("clashjs:bot:starterbot");


export default {
  info: {
    name: "team7",
    style: 86,
    team: 7,
  },
  ai: function (player, enemies, game) {
    log("Executing my AI function", player, enemies, game);

    // Not in danger, so lets see if we can shoot somebody
    const targets = enemiesInRange(player, enemies);
    if (player.ammo > 0 && targets.length > 0) {
      log("Found someone to shoot", targets);
      return "shoot";
    }

    // Check if we are in immediate danger, if so try to move
    if (threatsFacingMe(player, enemies).length > 0) {
      log("In danger! Lets try to move");
      if (canMoveForward(player, game)) {
        return "move";
      }
    }    
    if (player.ammo < 2) {
      // Not in danger, nobody to shoot, lets go collect more ammo
      const closestAmmo = findClosestAmmo(player, game);

      if (closestAmmo) {
        log("Found some ammo", closestAmmo);
        const ammoDir = calculateHeading(player.position, closestAmmo);

        log("Heading towards ammo", ammoDir);
        if (ammoDir === player.direction) {
          return "move";
        } else {
          return ammoDir;
        }
      }
    }

     if (isActionSafe(player, "move", enemies, game) && (canMoveForward(player, game)) {
         return "move";
     } else {
       

     }
    // Nothing else to do ... lets just make a random move
    log("Bummer, found nothing interesting to do ... making random move");
    return makeRandomMove();
  },
};
