import {
  makeRandomMove,
  calculateHeading,
  findClosestAmmo,
  threatsFacingMe,
  canMoveForward,
  enemiesInRange,
  isActionSafe
} from "../lib/helpers";

/*
Improvements:
how fast bullets move? 
  Entire row instantly at players position
Better determine when to shoot people? 
  Can we track position of other players?
    Enemies have direction, position, and ammo
Does shooting take up a movement turn? [5]
Can we turn the ship without moving it? [5]
Is action safe? [1][x]
*/


/*
  Enemies object

  [
   {
      "style":103,
      "position":[
         0,
         4
      ],
      "direction":"east",
      "ammo":0,
      "isAlive":true,
      "id":"PCD0UV32",
      "name":"random"
   },
   {
      "style":25,
      "position":[
         2,
         6
      ],
      "direction":"west",
      "ammo":0,
      "isAlive":true,
      "id":"9PZZ1S52",
      "name":"TestBot"
   }
]
*/

import debug from "debug";
const log = debug("clashjs:bot:starterbot");
var futureAction;

export default {
  info: {
    name: "fuzzypuppy",
    style: 110,
    team: 1,
  },
  ai: function (player, enemies, game) {
    log("Executing my AI function", player, enemies, game);

    function checkForDanger(){
      if(isActionSafe(player, futureAction, enemies, game)){
        return futureAction;
      }else{
        futureAction = "";
      }
    }

    // Check if we are in immediate danger, if so try to move
    // check up down left right
    if (threatsFacingMe(player, enemies).length > 0) {
      log("In danger! Lets try to move");
      // move where? calculate up down left right best position
      if (canMoveForward(player, game)&&(isActionSafe(player, "move", enemies, game))) {
        return "move";
      }else{
        //I cannot escape danger try to shoot instead
        const targets = enemiesInRange(player, enemies);
        if (player.ammo > 0 && targets.length > 0) {
          log("Found someone to shoot", targets);
          return "shoot";
        }else{
          //I cannot shoot anyone, time to pray
          return makeRandomMove();
        }
      }
    }

    // calculate safe zone and hang out in it
    

    // Move to edges and corners to minimize vulnerable angles
    

    // Not in danger, so lets see if we can shoot somebody
    const targets = enemiesInRange(player, enemies);
    if (player.ammo > 0 && targets.length > 0) {
      log("Found someone to shoot", targets);
      futureAction = "shoot";
      checkForDanger();
    }

    // Not in danger, nobody to shoot, lets go collect more ammo
    const closestAmmo = findClosestAmmo(player, game);

    if (closestAmmo) {
      log("Found some ammo", closestAmmo);
      const ammoDir = calculateHeading(player.position, closestAmmo);

      log("Heading towards ammo", ammoDir);
      if (ammoDir === player.direction) {
        futureAction = "move";
        checkForDanger();
      } else {
        return ammoDir;
      }
    }
      
    // Nothing else to do ... lets just make a random move
    log("Bummer, found nothing interesting to do ... making random move");
    return makeRandomMove();
  },
};
