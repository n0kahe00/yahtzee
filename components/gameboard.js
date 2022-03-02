import React, { useState, useEffect } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Text, View, Pressable } from 'react-native'
import styles from '../style/style'
import { Col, Row, Grid } from 'react-native-easy-grid'

let board = []
const NBR_OF_DICES = 5
const NBR_OF_THROWS = 3
const NUMBERS = [
  { value: 1, icon: 'numeric-1-circle' },
  { value: 2, icon: 'numeric-2-circle' },
  { value: 3, icon: 'numeric-3-circle' },
  { value: 4, icon: 'numeric-4-circle' },
  { value: 5, icon: 'numeric-5-circle' },
  { value: 6, icon: 'numeric-6-circle' }
]

export default function GameBoard () {
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS)
  const [status, setStatus] = useState('')
  const [bonusMessage, setBonusMessage] = useState(
    'You are 63 points from bonus'
  )
  const [buttonText, setButtonText] = useState('Throw dices')
  const [selectedDices, setSelectedDices] = useState(
    new Array(NBR_OF_DICES).fill(false)
  )
  const [values, setValues] = useState([])
  const [selectedPoints, setSelectedPoints] = useState(new Array(6).fill(false))
  const [sumOfDices, setSumofDices] = useState(new Array(6).fill(0))
  const [totalPoints, setTotalPoints] = useState(0)
  const [bonusPoints, setBonusPoints] = useState(63)

  function getDiceColor (i) {
    return selectedDices[i] ? 'black' : 'steelblue'
  }
  function getPointColor (i) {
    return selectedPoints[i] ? 'black' : 'steelblue'
  }
  function selectDice (i) {
    if (nbrOfThrowsLeft === NBR_OF_THROWS) {
      setStatus('You have to throw dices first')
      return
    }
    let dices = [...selectedDices]
    dices[i] = selectedDices[i] ? false : true
    setSelectedDices(dices)
  }
  function selectPoints (i) {
    if (nbrOfThrowsLeft > 0) {
      setStatus('Throw 3 times before setting points')
      return
    }
    if (selectedPoints[i] === true) {
      setStatus('You already selected points for ' + (i + 1))
      return
    }
    let points = [...selectedPoints]
    let dicepoints = [...sumOfDices]
    points[i] = selectedPoints[i] ? false : true
    let sum = 0
    for (let j = 0; j < values.length; j++) {
      if (NUMBERS[i].value == values[j]) {
        sum = sum + values[j]
      }
    }

    dicepoints[i] = sum
    setSelectedPoints(points)
    setSumofDices(dicepoints)
    let value = dicepoints.reduce((partialSum, a) => partialSum + a, 0)
    setTotalPoints(value)
    setBonusPoints(63 - value)
    setSelectedDices(new Array(6).fill(false))
    setNbrOfThrowsLeft(3)
  }

  function throwDices () {
    let dices = [...values]
    if (selectedPoints.every(value => value === true)) {
      resetGame()
      return
    }
    if (nbrOfThrowsLeft === 0) {
      setStatus('Select your points before your next throw')
      return
    }
    for (let i = 0; i < NBR_OF_DICES; i++) {
      if (!selectedDices[i]) {
        let randomNumber = Math.floor(Math.random() * 6 + 1)
        board[i] = 'dice-' + randomNumber
        dices[i] = randomNumber
      }
    }
    setNbrOfThrowsLeft(nbrOfThrowsLeft - 1)
    setValues(dices)
  }
  function checkBonusPoints () {
    setBonusMessage('You are ' + bonusPoints + ' points from bonus')
    if (selectedPoints.every(value => value === true)) {
      setStatus('Game over. All points selected')
      setNbrOfThrowsLeft(0)
      setButtonText('Reset game')
    }
    if (totalPoints >= 63) {
      setBonusMessage('You got the bonus!')
    }
  }
  useEffect(() => {
    if (nbrOfThrowsLeft === NBR_OF_THROWS) {
      setStatus('Throw dices')
    }
    if (nbrOfThrowsLeft > 0 && nbrOfThrowsLeft < NBR_OF_THROWS) {
      setStatus('Select and throw dices again')
    }
    if (nbrOfThrowsLeft === 0) {
      setStatus('Select your points')
    }
    checkBonusPoints()
  }, [nbrOfThrowsLeft, totalPoints])
  function resetGame () {
    setNbrOfThrowsLeft(NBR_OF_THROWS)
    setStatus('')
    setBonusMessage('You are 63 points from bonus')
    setSelectedDices(new Array(NBR_OF_DICES).fill(false))
    setValues([])
    setSelectedPoints(new Array(6).fill(false))
    setSumofDices(new Array(6).fill(0))
    setTotalPoints(0)
    setBonusPoints(63)
    setButtonText('Throw dices')
    board = []
  }
  const row = []
  for (let i = 0; i < NBR_OF_DICES; i++) {
    row.push(
      <Pressable key={'row1' + i} onPress={() => selectDice(i)}>
        <MaterialCommunityIcons
          name={board[i]}
          key={'row1' + i}
          size={50}
          color={getDiceColor(i)}
        ></MaterialCommunityIcons>
      </Pressable>
    )
  }
  const row2 = []
  for (let i = 0; i < NUMBERS.length; i++) {
    row2.push(
      <View key={'rowPoints' + i} style={styles.grid}>
                <Text>{sumOfDices[i]}</Text>
                <Grid style={styles.grid}>
                    <Col size={80}>
                        <Pressable
                            key={'row2' + i}
                            onPress={() => selectPoints(i)}>
                            <MaterialCommunityIcons
                                name={NUMBERS[i].icon}
                                key={"row2" + i}
                                size={45}
                                color={getPointColor(i)}>
                            </MaterialCommunityIcons>
                        </Pressable>
                    </Col>
                </Grid>
      </View>
    )
  }

  return (
    <View style={styles.gameboard}>
      <View style={styles.flex}>{row}</View>
      <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
      <Text style={styles.gameinfo}>{status}</Text>
      <Pressable style={styles.button} onPress={() => throwDices()}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Pressable>

      <Text style={styles.total}>Total: {totalPoints}</Text>
      <Text style={styles.bonus}>{bonusMessage}</Text>
      <View><Text>{row2}</Text></View>
    </View>
  )
}
