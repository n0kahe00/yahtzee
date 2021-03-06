import React from 'react';
import {View} from 'react-native';
import Header from './components/header'
import Footer from './components/footer'
import GameBoard from './components/gameboard'
import styles from './style/style'

export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <GameBoard />
      <Footer />
    </View>
  )
}
