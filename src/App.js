import './App.css';
import { useState } from 'react';
import CustomerNumberFormat from './components/CustomNumerFormat';
const defaultTxn = {
  type: "get_eth",
  value: 0
}
function num(val){
  return <CustomerNumberFormat value={val} displayType={'text'} thousandSeparator={true} decimalScale={5} highlight={true} />
}
function App() {
  const [txns, setTxns] = useState([])
  const [newTxn, setNewTxn] = useState({...defaultTxn})
  const [k, setK] = useState(1000)
  const [initEth, setInitEth] = useState(1)
  // const [currentEth, setCurrentEth] = useState(1)
  const [started, setStarted] = useState(false)
  function cal(type, value) {
    let prevPool = null, nextPool = {}, swap_result = null, eth_price = null
    if(txns.length === 0){
      prevPool = {eth: initEth, usdt: k/initEth }
    }else{
      prevPool = {...txns[txns.length - 1].nextPool}
    }
    if(type === 'get_eth'){
      // val is USDT
      nextPool.usdt = prevPool.usdt + value
      nextPool.eth = k/nextPool.usdt
      swap_result = prevPool.eth - nextPool.eth
      eth_price =  value / swap_result
    }else{
      nextPool.eth = prevPool.eth + value
      nextPool.usdt = k/nextPool.eth
      swap_result = prevPool.usdt - nextPool.usdt
      eth_price = swap_result / value
    }
    return {value, type, swap_result, eth_price, nextPool};
  }
  return (
    <div className="App">
      <h1>AMM demo, a sample DEX</h1>
      <h4>Pair eth - usdt</h4>
      <div>
        K is {started === false ? <CustomerNumberFormat type="input" value={k} onValueChange={(values) => {
          const { value } = values;
          setK(value)
        }} thousandSeparator={true} decimalScale={3} /> : num(k) }
      </div>
      <div style={{marginTop: "10px"}}>
        Init pool: ({started === false ? <CustomerNumberFormat type="input" value={initEth} onValueChange={(values) => {
          const { value } = values;
          setInitEth(value)
        }} thousandSeparator={true} decimalScale={3} /> : num(initEth)} ETH, 
        {num(k/initEth)} USDT), init price: 
        1 ETH = {num(k/(initEth*initEth))} USDT &nbsp;
        {started === false? <button onClick={() => {
          setStarted(true)
        }}>Start!</button> : <button onClick={() => {
          setStarted(false)
          setTxns([])
        }}>Restart!</button>}
      </div>
      {started === true ? 
      <div style={{marginTop: "10px", border: "1px solid #ccc", padding: "15px"}}>
        New txn, type: 
        <select value={newTxn.type} onChange={(e) => {
          const value = newTxn.value
          const type = e.target.value
          setNewTxn({...cal(type, value)})
        }}>
          <option value="get_eth">Swap USDT for ETH</option>
          <option value="get_usdt">Swap ETH for USDT</option>
        </select>; swap <CustomerNumberFormat type="input" value={newTxn.value} onValueChange={(values) => {
          const value = parseInt(values.value)
          const type = newTxn.type
          setNewTxn({...cal(type, value)})
        }} thousandSeparator={true} decimalScale={3} /> 
        {newTxn.type === "get_eth" ? "USDT" : "ETH"} for {num(newTxn.swap_result)} {newTxn.type !== "get_eth" ? "USDT" : "ETH"} - price: 1 ETH = {num(newTxn.eth_price)} USDT 
        &nbsp; <button onClick={() => {
          if(newTxn.value > 0){
            setTxns([...txns, newTxn])
            setNewTxn({...defaultTxn})
          }else{
            alert('invalid value!')
          }
        }}>Swap now</button>
      </div> : null }
      <div style={{marginTop: "10px"}}>
        {txns.map((txn, k) => {
          const {type, value, swap_result, eth_price, nextPool} = txn
          return <div key={k} style={{marginTop: "5px"}}>
            Transaction {k}: Exchange {num(value)} 
            &nbsp;{type === 'get_eth' ? "USDT" : "ETH"} for 
            &nbsp; {num(swap_result)} &nbsp;{type !== 'get_eth' ? "USDT" : "ETH"}
            &nbsp; with 1 ETH = {num(eth_price)} USDT &nbsp;
            next pool: ({num(nextPool.eth)} ETH
            , {num(nextPool.usdt)} USDT)
          </div>  
        })}
      </div>
    </div>
  );
}

export default App;
