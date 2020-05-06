import {
  makeRandomMove,
  sameColumn,
  sameRow,
  calculateDistance,
  calculateHeading,
  isTargetVisible,
  enemiesInRange,
  threats,
  threatsFacingMe,
  canMoveForward,
  findClosestAmmo,
  isActionSafe,
  oppositeDirection,
} from './helpers'

const game = {
  gridSize: 9,
  ammoPosition: [
    [2, 5],
    [7, 7],
    [4, 6],
  ],
}

const player = {
  id: 'testbot',
  name: 'testbot',
  direction: 'north',
  position: [6, 8],
  isAlive: true,
}

const enemies = [
  {
    id: 'enemy1',
    name: 'enemy1',
    direction: 'south',
    position: [6, 8],
    isAlive: true,
  },
  {
    id: 'enemy2',
    name: 'enemy2',
    direction: 'north',
    position: [2, 1],
    isAlive: true,
  },
  {
    id: 'enemy3',
    name: 'enemy3',
    direction: 'east',
    position: [0, 8],
    isAlive: true,
  },
  {
    id: 'enemy4',
    name: 'enemy4',
    direction: 'east',
    position: [0, 8],
    isAlive: false,
  },
  {
    id: 'enemy5',
    name: 'enemy5',
    direction: 'west',
    position: [7, 8],
    isAlive: true,
  },
  {
    id: 'enemy6',
    name: 'enemy6',
    direction: 'south',
    position: [2, 4],
    isAlive: false,
  },
]

const moreEnemies = [
  {
    position: [5, 7],
    direction: 'south',
    ammo: 1,
    isAlive: true,
  },
  {
    position: [0, 0],
    direction: 'south',
    ammo: 1,
    isAlive: true,
  },
  {
    position: [1, 3],
    direction: 'east',
    ammo: 1,
    isAlive: true,
  },
  {
    position: [6, 0],
    direction: 'north',
    ammo: 1,
    isAlive: true,
  },
  {
    position: [6, 7],
    direction: 'south',
    ammo: 1,
    isAlive: true,
  },
  {
    position: [6, 2],
    direction: 'east',
    ammo: 1,
    isAlive: true,
  },
  {
    position: [6, 8],
    direction: 'west',
    ammo: 1,
    isAlive: true,
  },
  {
    position: [5, 8],
    direction: 'south',
    ammo: 1,
    isAlive: true,
  },
  {
    position: [4, 8],
    direction: 'south',
    ammo: 0,
    isAlive: true,
  },
  {
    position: [3, 8],
    direction: 'south',
    ammo: 1,
    isAlive: false,
  },
]

describe('helpers', () => {
  it('makeRandomMove returns something', () => {
    expect(makeRandomMove()).toMatch(/(north|east|south|west|shoot|move)/)
  })

  it('canMoveForward works', () => {
    expect(canMoveForward(player, game)).toEqual(true)
    expect(
      canMoveForward({ position: [0, 1], direction: 'north' }, game)
    ).toEqual(false)
    expect(
      canMoveForward({ position: [8, 1], direction: 'south' }, game)
    ).toEqual(false)
    expect(
      canMoveForward({ position: [1, 8], direction: 'east' }, game)
    ).toEqual(false)
    expect(
      canMoveForward({ position: [1, 0], direction: 'west' }, game)
    ).toEqual(false)
    expect(
      canMoveForward({ position: [1, 0], direction: 'north' }, game)
    ).toEqual(true)
    expect(
      canMoveForward({ position: [7, 0], direction: 'south' }, game)
    ).toEqual(true)
    expect(
      canMoveForward({ position: [0, 7], direction: 'east' }, game)
    ).toEqual(true)
    expect(
      canMoveForward({ position: [0, 1], direction: 'west' }, game)
    ).toEqual(true)
  })

  it('should find closest ammo', () => {
    expect(findClosestAmmo(player, game)).toEqual([7, 7])
    expect(
      findClosestAmmo({ position: [0, 0] }, { ammoPosition: [[0, 1]] })
    ).toEqual([0, 1])
    expect(findClosestAmmo({ position: [0, 0] }, { ammoPosition: [] })).toEqual(
      null
    )
    expect(
      findClosestAmmo(
        { position: [5, 5] },
        {
          ammoPosition: [
            [1, 1],
            [2, 5],
            [9, 9],
          ],
        }
      )
    ).toEqual([2, 5])
    expect(
      findClosestAmmo(
        { position: [6, 2] },
        {
          ammoPosition: [
            [1, 1],
            [2, 5],
            [9, 9],
          ],
        }
      )
    ).toEqual([1, 1])
  })

  it('should calculate heading', () => {
    expect(calculateHeading([0, 0], [0, 4])).toEqual('east')
    expect(calculateHeading([0, 5], [0, 4])).toEqual('west')
    expect(calculateHeading([3, 5], [0, 4])).toEqual('north')
    expect(calculateHeading([3, 5], [8, 4])).toEqual('south')
    expect(calculateHeading([3, 0], [8, 8])).toEqual('east')
    expect(calculateHeading([3, 9], [8, 2])).toEqual('west')
    expect(calculateHeading([1, 1], [8, 2])).toEqual('south')
  })

  it('should calculateDistance', () => {
    expect(calculateDistance([0, 0], [0, 0])).toEqual(0)
    expect(calculateDistance([0, 1], [0, 0])).toEqual(1)
    expect(calculateDistance([0, 0], [0, 1])).toEqual(1)
    expect(calculateDistance([0, 0], [0, 0])).toEqual(0)
    expect(calculateDistance([0, 0], [5, 5])).toEqual(10)
  })
  it('should sameColumn', () => {
    expect(sameColumn([0, 0], [0, 0])).toEqual(true)
    expect(sameColumn([0, 1], [1, 1])).toEqual(true)
    expect(sameColumn([5, 1], [0, 1])).toEqual(true)
    expect(sameColumn([0, 0], [1, 0])).toEqual(true)
    expect(sameColumn([2, 2], [3, 2])).toEqual(true)

    expect(sameColumn([0, 0], [0, 1])).toEqual(false)
    expect(sameColumn([1, 1], [0, 0])).toEqual(false)
    expect(sameColumn([5, 0], [5, 1])).toEqual(false)
    expect(sameColumn([2, 3], [3, 2])).toEqual(false)
    expect(sameColumn([0, 5], [5, 0])).toEqual(false)
  })
  it('should sameRow', () => {
    expect(sameRow([0, 0], [0, 0])).toEqual(true)
    expect(sameRow([1, 1], [1, 0])).toEqual(true)
    expect(sameRow([2, 0], [2, 1])).toEqual(true)
    expect(sameRow([5, 0], [5, 1])).toEqual(true)
    expect(sameRow([7, 0], [7, 1])).toEqual(true)

    expect(sameRow([8, 0], [0, 0])).toEqual(false)
    expect(sameRow([0, 0], [5, 5])).toEqual(false)
    expect(sameRow([2, 0], [5, 5])).toEqual(false)
    expect(sameRow([6, 0], [5, 5])).toEqual(false)
    expect(sameRow([9, 0], [5, 5])).toEqual(false)
  })
  it('oppositeDirection should return opposite direction', () => {
    expect(oppositeDirection('north')).toEqual('south')
    expect(oppositeDirection('south')).toEqual('north')
    expect(oppositeDirection('east')).toEqual('west')
    expect(oppositeDirection('west')).toEqual('east')
    expect(oppositeDirection('bogus')).toBeUndefined()
  })
  it('isTargetVisible should work', () => {
    expect(isTargetVisible([0, 0], 'east', [0, 1])).toEqual(true)
    expect(isTargetVisible([0, 0], 'east', [0, 2])).toEqual(true)
    expect(isTargetVisible([0, 0], 'east', [0, 3])).toEqual(true)
    expect(isTargetVisible([0, 0], 'east', [0, 4])).toEqual(true)
    expect(isTargetVisible([0, 0], 'east', [0, 5])).toEqual(true)
    expect(isTargetVisible([0, 0], 'east', [0, 6])).toEqual(true)
    expect(isTargetVisible([0, 0], 'east', [0, 7])).toEqual(true)
    expect(isTargetVisible([0, 0], 'east', [0, 8])).toEqual(true)

    expect(isTargetVisible([0, 0], 'west', [0, 8])).toEqual(false)
    expect(isTargetVisible([0, 0], 'west', [0, 7])).toEqual(false)
    expect(isTargetVisible([0, 0], 'west', [0, 6])).toEqual(false)
    expect(isTargetVisible([0, 0], 'west', [0, 5])).toEqual(false)
    expect(isTargetVisible([0, 0], 'west', [0, 4])).toEqual(false)
    expect(isTargetVisible([0, 0], 'west', [0, 3])).toEqual(false)
    expect(isTargetVisible([0, 0], 'west', [0, 2])).toEqual(false)
    expect(isTargetVisible([0, 0], 'west', [0, 1])).toEqual(false)
    expect(isTargetVisible([0, 0], 'west', [0, 0])).toEqual(false)
    expect(isTargetVisible([0, 0], 'east', [0, 0])).toEqual(false)
    expect(isTargetVisible([0, 0], 'east', [-1, -1])).toEqual(false)

    expect(isTargetVisible([4, 4], 'south', [5, 4])).toEqual(true)
    expect(isTargetVisible([4, 4], 'south', [6, 4])).toEqual(true)
    expect(isTargetVisible([4, 4], 'south', [7, 4])).toEqual(true)
    expect(isTargetVisible([4, 4], 'south', [8, 4])).toEqual(true)
    expect(isTargetVisible([4, 4], 'south', [4, 4])).toEqual(false)
    expect(isTargetVisible([4, 4], 'south', [3, 4])).toEqual(false)
    expect(isTargetVisible([4, 4], 'south', [2, 4])).toEqual(false)
    expect(isTargetVisible([4, 4], 'south', [1, 4])).toEqual(false)
    expect(isTargetVisible([4, 4], 'south', [0, 4])).toEqual(false)

    expect(isTargetVisible([4, 4], 'north', [5, 4])).toEqual(false)
    expect(isTargetVisible([4, 4], 'north', [6, 4])).toEqual(false)
    expect(isTargetVisible([4, 4], 'north', [7, 4])).toEqual(false)
    expect(isTargetVisible([4, 4], 'north', [8, 4])).toEqual(false)
    expect(isTargetVisible([4, 4], 'north', [4, 4])).toEqual(false)
    expect(isTargetVisible([4, 4], 'north', [3, 4])).toEqual(true)
    expect(isTargetVisible([4, 4], 'north', [2, 4])).toEqual(true)
    expect(isTargetVisible([4, 4], 'north', [1, 4])).toEqual(true)
    expect(isTargetVisible([4, 4], 'north', [0, 4])).toEqual(true)
  })

  it('enemiesInRange', () => {
    const enemies = [
      { position: [3, 4], isAlive: true },
      { position: [3, 5], isAlive: true },
      { position: [3, 2], isAlive: true },
      { position: [3, 6], isAlive: false },
      { position: [3, 1], isAlive: false },
      { position: [6, 6], isAlive: false },
      { position: [4, 6], isAlive: true },
      { position: [9, 6], isAlive: true },
      { position: [0, 2], isAlive: true },
      { position: [3, 9], isAlive: true },
    ]
    expect(
      enemiesInRange({ position: [3, 3], direction: 'east' }, [
        { position: [3, 4], isAlive: true },
      ])[0].position
    ).toEqual([3, 4])

    let inRange = enemiesInRange(
      { position: [3, 3], direction: 'east' },
      enemies
    )

    expect(inRange.length).toEqual(3)

    inRange = enemiesInRange({ position: [4, 6], direction: 'south' }, enemies)

    expect(inRange.length).toEqual(1)
  })

  it('isActionSafe should work', () => {
    const enemies = [
      { position: [2, 1], direction: 'west', ammo: 1, isAlive: true },
      { position: [4, 5], direction: 'west', ammo: 1, isAlive: true },
      { position: [6, 4], direction: 'north', ammo: 1, isAlive: true },
      { position: [1, 8], direction: 'north', ammo: 0, isAlive: true },
    ]

    let isSafe = isActionSafe(
      { position: [3, 3], direction: 'south' },
      'move',
      enemies,
      game
    )

    expect(isSafe).toBe(false)

    isSafe = isActionSafe(
      { position: [3, 3], direction: 'north' },
      'move',
      enemies,
      game
    )

    expect(isSafe).toBe(true)

    isSafe = isActionSafe(
      { position: [3, 3], direction: 'east' },
      'move',
      enemies,
      game
    )

    expect(isSafe).toBe(false)

    isSafe = isActionSafe(
      { position: [3, 3], direction: 'west' },
      'move',
      enemies,
      game
    )

    expect(isSafe).toBe(true)

    isSafe = isActionSafe(
      { position: [1, 4], direction: 'north' },
      'move',
      enemies,
      game
    )

    expect(isSafe).toBe(false)
  })

  it('calculateNewPosition should work', () => { })

  it('threats should work', () => {
    expect(threats(player, enemies)).toEqual([])
    expect(threats(player, [])).toEqual([])
    expect(threats(player, moreEnemies)).toEqual([
      moreEnemies[3],
      moreEnemies[4],
      moreEnemies[5],
      moreEnemies[6],
      moreEnemies[7],
    ])
  })

  it('threatsFacingMe should work', () => {
    expect(threatsFacingMe(player, enemies)).toEqual([])
    expect(threatsFacingMe(player, [])).toEqual([])
    expect(threatsFacingMe(player, moreEnemies)).toEqual([
      moreEnemies[5],
      moreEnemies[7],
    ])
  })
})
