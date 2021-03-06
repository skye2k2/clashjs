import React from "react";
import _ from "lodash";

var DIRECTIONS = ["north", "east", "south", "west"];

class Players extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerDirections: props.playerStates.map(el => DIRECTIONS.indexOf(el.direction))
    };
  }

  componentWillReceiveProps(nextProps) {
    var playerDirections = this.state.playerDirections;
    var newPlayerDirections = nextProps.playerStates.map(el => DIRECTIONS.indexOf(el.direction));

    this.setState({
      playerDirections: newPlayerDirections.map((el, index) => {
        var diff = ((el + 4) % 4) - ((playerDirections[index] + 4) % 4);
        if (diff === 3) diff = -1;
        if (diff === -3) diff = 1;

        return playerDirections[index] + diff;
      })
    });
  }

  render() {
    var { playerDirections } = this.state;
    var { gridSize, playerStates, playerInstances, debug } = this.props;

    var tileSize = 96 / gridSize;

    var playerRender = _.map(playerStates, (playerData, playerIndex) => {
      if (!playerData.isAlive) return null;

      var playerInfo = playerInstances[playerIndex].getInfo();

      return (
        <div
          key={playerIndex}
          className="clash-player-container"
          style={{
            width: tileSize + "vmin",
            height: tileSize + "vmin",
            transform:
              "translateY(" +
              tileSize * playerData.position[0] +
              "vmin) " +
              "translateX(" +
              tileSize * playerData.position[1] +
              "vmin)"
          }}>
          <div
            className="clash-player"
            style={{
              width: tileSize + "vmin",
              height: tileSize + "vmin",
              backgroundImage: "url(static/rockets/rocket" + (playerData.style || 0) + ".png)",
              transform: "scale(1) rotate(" + 90 * playerDirections[playerIndex] + "deg) "
            }}
          />
          {debug ? (
            <div className="clash-player-name" style={{ color: playerData.ammo ? 'red' : 'inherit' }}>{playerInfo.name} {playerData.ammo ? `[${playerData.ammo}]` : ''}</div>
          ) : (
              <div className="clash-player-name">{playerInfo.name}</div>
            )
          }
        </div>
      );
    });

    return <div className="clash-layer">{playerRender}</div>;
  }
}

export default Players;
