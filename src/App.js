import './App.css';
import React from 'react';
import { Container } from 'react-bootstrap';
import Dex from './pages/dex/Dex'

class DexApp extends React.Component{
  constructor(){
    super()
    this.state = {
      txns: [],
      pairName: {eth:'OHM', usdt: 'DAI'},
      initPool: {eth: 100, usdt: 400}
    }
  }

  render(){
    return <Dex 
      pairName={this.state.pairName} 
      initPool={this.state.initPool} 
      txns={this.state.txns}
      setTxns={({txns}) => {
        this.setState({
          txns
        });
      }} />
  }
}

export default function App(){
  return <Container>
    <DexApp />
  </Container>
}