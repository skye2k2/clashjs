import React from "react";
import _ from "lodash";
import { Grid, Cell } from "styled-css-grid";
import styled from 'styled-components'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";

import Modal from './Modal';

const Title = styled.header`
  text-align: center;
  margin-top: -1.5em;
`

const Winner = styled.span`
  padding: 0 2em;
  font-size: 2em;
`

export default function StatsModal({ open, onClose, rounds,
  total,
  playerStates,
  stats,
  gameState,
}) {
  stats = _.map(stats, playerStats => playerStats);
  stats = _.sortBy(stats, playerStats => playerStats.kills * -1);
  stats = _.sortBy(stats, playerStats => playerStats.wins * -1);
  const duration = ((gameState.endTime || Date.now()) - gameState.startTime) / 1000
  return (
    < Modal open={open} onClose={onClose} center>
      <Title><h3>Stats</h3></Title>
      <div className="stats-modal">
        Duration: {duration.toFixed(1)}s
        {gameState.finished && <Winner><FontAwesomeIcon icon={faTrophy} color="#d4af37" />&nbsp;The winner is {stats[0].name}</Winner>}
        <table>
          <thead>
            <tr>
              <th>
                Round {rounds}/{total}
              </th>
              <th>Wins</th>
              <th>Rate</th>
              <th>Kills</th>
              <th>Deaths</th>
              <th>K/D Rate</th>
              <th>Cargo</th>
              <th>Ammo</th>
              <th>Turns</th>
              <th>Moves</th>
              <th>Waits</th>
              <th>Shots</th>
              <th>Calc Time</th>
              <th>Streak</th>
            </tr>
          </thead>
          <tbody>
            {_.map(stats, (playerStats, index) => {
              // console.log('playerStats', playerStats)
              return (
                <tr key={playerStats.name}>
                  <td className='player-name'>{playerStats.name}</td>
                  <td className='stats-results'>{playerStats.wins}</td>
                  <td className='stats-results'>{playerStats.winrate}%</td>
                  <td className='stats-results'>{playerStats.kills}</td>
                  <td className='stats-results'>{playerStats.deaths}</td>
                  <td className='stats-results'>{playerStats.kdr.toFixed(1)}</td>
                  <td className='stats-results'>{playerStats.cargo}</td>
                  <td className='stats-results'>{playerStats.ammo}</td>
                  <td className='stats-results'>{playerStats.actions.turn}</td>
                  <td className='stats-results'>{playerStats.actions.move}</td>
                  <td className='stats-results'>{playerStats.actions.wait}</td>
                  <td className='stats-results'>{playerStats.actions.shoot}</td>
                  <td className='stats-results'>{Number(playerStats.calcTime).toFixed(2)}</td>
                  <td className='stats-results'>{playerStats.killStreak}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
      <Grid
        columns={"100px 1fr 100px"}
        rows={"45px 1fr 45px"}
        areas={[
          "header header  header",
          "menu   content ads   ",
          "footer footer  footer"
        ]}>
        <Cell area="header">Header</Cell>
        <Cell area="content">Content</Cell>
        <Cell area="menu">Menu</Cell>
        <Cell area="ads">Ads</Cell>
        <Cell area="footer">Footer</Cell>
      </Grid>
    </Modal>
  );
}