const _ = require("lodash");

const DIRECTIONS = {
  NORTH: "north",
  EAST: "east",
  SOUTH: "south",
  WEST: "west",
  ALL: ["north", "east", "south", "west"],
};

const VERTICAL = 0;
const HORIZONTAL = 1;
const MOVE = "move";
const SHOOT = "shoot";

const makeRandomMove = (includeShoot = false) => {
  const randomMove = (possibleMoves) =>
    Math.random() > 0.33 ? MOVE : _.sample(possibleMoves);

  return includeShoot
    ? randomMove(_.concat(DIRECTIONS.ALL, SHOOT))
    : randomMove(DIRECTIONS.ALL);
};

const rotate = (currentDirection, howManyTurns = 1) =>
  DIRECTIONS.ALL[
    DIRECTIONS.ALL.indexOf(currentDirection) +
      (howManyTurns % DIRECTIONS.ALL.length)
  ];

const calculateHeading = (startPos, endPos) => {
  const [startY, startX] = startPos;
  const [endY, endX] = endPos;
  const diffY = Math.abs(startY - endY);
  const diffX = Math.abs(startX - endX);

  const northOrSouth = (y1, y2) =>
    y1 - y2 > 0 ? DIRECTIONS.NORTH : DIRECTIONS.SOUTH;
  const eastOrWest = (x1, x2) =>
    x1 - x2 > 0 ? DIRECTIONS.WEST : DIRECTIONS.EAST;
  return diffY > diffX ? northOrSouth(startY, endY) : eastOrWest(startX, endX);
};

const calculateDistance = ([startY = 0, startX = 0], [endY = 0, endX = 0]) =>
  Math.abs(startY - endY) + Math.abs(startX - endX);

const sameColumn = (pos1, pos2) => pos1[VERTICAL] === pos2[VERTICAL];

const sameRow = (pos1, pos2) => pos1[HORIZONTAL] === pos2[HORIZONTAL];

const isTargetVisible = (playerPosition, playerDirection, targetPosition) => {
  switch (playerDirection) {
    case DIRECTIONS.NORTH:
      return (
        sameColumn(playerPosition, targetPosition) &&
        playerPosition[VERTICAL] > targetPosition[VERTICAL]
      );
    case DIRECTIONS.EAST:
      return (
        sameRow(playerPosition, targetPosition) &&
        playerPosition[HORIZONTAL] < targetPosition[HORIZONTAL]
      );
    case DIRECTIONS.SOUTH:
      return (
        sameColumn(playerPosition, targetPosition) &&
        playerPosition[VERTICAL] < targetPosition[VERTICAL]
      );
    case DIRECTIONS.WEST:
      return (
        sameRow(playerPosition, targetPosition) &&
        playerPosition[HORIZONTAL] > targetPosition[HORIZONTAL]
      );
    default:
      return false;
  }
};

const enemiesInRange = (currentPlayerState, enemyStates) => {
  return enemyStates.filter(
    (enemy) =>
      enemy.isAlive &&
      isTargetVisible(
        currentPlayerState.position,
        currentPlayerState.direction,
        enemy.position
      )
  );
};

module.exports = {
  makeRandomMove,
  rotate,
  calculateDistance,
  calculateHeading,
  isTargetVisible,
  enemiesInRange,
};
