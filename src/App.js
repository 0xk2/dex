import './App.css';
import { useState } from 'react';
import CustomerNumberFormat from './components/CustomNumerFormat';
import CustomChart from './components/CustomChart';
import { Container, Row, Col } from 'react-bootstrap';
import Transaction from './components/Transaction';

const defaultTxn = {
  type: "get_eth",
  value: 0
}
const poolFormat = {
  eth: 0,
  usdt: 0,
}
function num(val){
  return <CustomerNumberFormat value={val} displayType={'text'} thousandSeparator={true} decimalScale={5} highlight={1} />
}
function App() {
  const [initPool, setInitPool] = useState({
    eth: 1000,
    usdt: 1000000
  })
  const [newPoolChange, setNewPoolChange] = useState({...poolFormat})
  
  const [txns, setTxns] = useState([])
  const [newTxn, setNewTxn] = useState({...defaultTxn})
  const [fee, setFee] = useState(0.0025)
  // const [currentEth, setCurrentEth] = useState(1)
  const [started, setStarted] = useState(false)
  function cal(type, value) {
    let prevPool = null, nextPool = {}, swap_result = null, eth_price = null
    if(txns.length === 0){
      prevPool = {eth: initPool.eth, usdt: initPool.usdt }
    }else{
      prevPool = {...txns[txns.length - 1].nextPool}
    }
    if(type === 'get_eth'){
      // val is USDT
      nextPool.usdt = prevPool.usdt + value
      nextPool.eth = (prevPool.eth * prevPool.usdt)/nextPool.usdt
      swap_result = prevPool.eth - nextPool.eth
      eth_price =  value / swap_result
    }else{
      nextPool.eth = prevPool.eth + value
      nextPool.usdt = (prevPool.eth * prevPool.usdt)/nextPool.eth
      swap_result = prevPool.usdt - nextPool.usdt
      eth_price = swap_result / value
    }
    return {value, type, swap_result, eth_price, nextPool};
  }
  function swap(){
    if(newTxn.value > 0){
      setTxns([...txns, newTxn])
      setNewTxn({...defaultTxn})
    }else{
      alert('invalid value!')
    }
  }
  let eth_fee = 0;
  let usdt_fee = 0;
  for(var i=0;i<txns.length;i++){
    if(txns[i].type === 'get_eth'){
      eth_fee += txns[i].swap_result * fee
    }else{
      usdt_fee += txns[i].swap_result * fee
    }
  }
  const labels = Array.from({length: txns.length}, (_, i) => i)
  
  const priceDataSet = [
    {
      label: 'ETH - USDT price',
      data: txns.map((txn) => {return txn.eth_price}),
      borderColor: 'yellow',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ];
  const lpDataSet = [
    {
      label: 'ETH',
      data: txns.map((txn) => {return txn.nextPool.eth}),
      yAxisID: 'eth',
      borderColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'USDT',
      data: txns.map((txn) => {return txn.nextPool.usdt}),
      yAxisID: 'usdt',
      borderColor: 'rgba(53, 162, 235, 0.5)',
    }
  ]
  const rfvDataSet = [
    {
      label: 'Risk Free Value 2*sqrt(K)',
      data: txns.map((txn) => {return 2*Math.sqrt(txn.nextPool.eth*txn.nextPool.usdt)}),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      borderColor: 'rgba(53, 162, 235, 0.5)',
      fill: true
    }
  ]
  return (
    <div className="App">
      <Container>
        <Row>
          <Col lg={9}>
            <h1>AMM demo, a sample DEX</h1>
            <h4>Pair eth - usdt</h4>
            {CustomChart.PriceChart({title: 'Eth price after transactions', labels, datasets: priceDataSet})}
            {CustomChart.LPChart({title: 'Liquidity pool after a txn', labels, datasets: lpDataSet})}
            {CustomChart.RFVChart({title: 'Risk Free Value', labels, datasets: rfvDataSet})}
            <div style={{marginTop: "10px"}}>
              Init pool: ({started === false ? <>
                <CustomerNumberFormat type="input" value={initPool.eth} onValueChange={(values) => {
                  const { value } = values;
                  setInitPool({...initPool, eth: value})
                }} thousandSeparator={true} decimalScale={3} suffix="eth" />, 
                <CustomerNumberFormat type="input" value={initPool.usdt} onValueChange={(values) => {
                  const { value } = values;
                  setInitPool({...initPool, usdt: value})
                }} thousandSeparator={true} decimalScale={3} suffix="usdt" />); with K={num(initPool.eth * initPool.usdt)}, 
                {initPool.eth > 0 ? <span>1 ETH={num(initPool.usdt / initPool.eth)} USDT</span> : null}
              </>: <>
                {num(initPool.eth)} ETH, {num(initPool.usdt)} USDT, 
                K={num(initPool.eth * initPool.usdt)}, 1 ETH={num(initPool.usdt / initPool.eth)} USDT
              </>}
            </div>
            <div>
              Fee: {started === false? <><CustomerNumberFormat type="input" value={fee} onValueChange={(values) => {
                const {value} = values
                setFee(parseFloat(value))
              }} /> aka</> : null} {fee*100}% {started === true ? <> - Total fee: {num(eth_fee)} ETH, {num(usdt_fee)} USDT</>:null}
            </div>
            <div>
              {started === false? <button onClick={() => {
                setStarted(true)
              }}>Start!</button> : <button onClick={() => {
                setStarted(false)
                setTxns([])
              }}>Restart!</button>}
            </div>
            {started === true ? 
            <div style={{marginTop: "10px", border: "1px solid #ccc", padding: "15px"}}>
              <div>
                New txn, type: 
                <select value={newTxn.type} onChange={(e) => {
                  const value = newTxn.value
                  const type = e.target.value
                  setNewTxn({...cal(type, value)})
                }}>
                  <option value="get_eth">Swap USDT for ETH</option>
                  <option value="get_usdt">Swap ETH for USDT</option>
                </select>; swap <CustomerNumberFormat type="input" value={newTxn.value} onValueChange={(values) => {
                  const value = parseFloat(values.value)
                  const type = newTxn.type
                  setNewTxn({...cal(type, value)})
                }} thousandSeparator={true} decimalScale={3} onKeyDown={(e) => {
                  if(e.code === 'Enter'){
                    swap()
                  }
                }} /> 
                {newTxn.type === "get_eth" ? "USDT" : "ETH"} for {num(newTxn.swap_result)} {newTxn.type !== "get_eth" ? "USDT" : "ETH"} 
                - price: 1 ETH = {num(newTxn.eth_price)} USDT 
                &nbsp; <button onClick={swap}>Swap now</button>
              </div>
              <div>
                <div>Provide or extract liquidity from the dex 
                  {txns.length > 0 ? 
                    <span>{num(txns[txns.length - 1].nextPool.eth)} ETH, {num(txns[txns.length - 1].nextPool.usdt)} USDT</span>
                  : <span>{num(initPool.eth)} ETH, {num(initPool.usdt)} USDT</span>}
                </div>
                <div>
                  <CustomerNumberFormat type="input" value={newPoolChange.eth} onValueChange={(values) => {
                    const value = parseFloat(values.value)
                    const currentPool = txns[txns.length - 1].nextPool
                    setNewPoolChange({
                      eth: value,
                      usdt: currentPool.usdt/currentPool.eth * value
                    })
                  }} thousandSeparator={true} decimalScale={3} suffix="eth" /> - 
                  <CustomerNumberFormat type="input" value={newPoolChange.usdt} onValueChange={(values) => {
                    const value = parseFloat(values.value)
                    const currentPool = txns[txns.length - 1].nextPool
                    setNewPoolChange({
                      usdt: value,
                      eth: currentPool.eth/currentPool.usdt * value
                    })
                  }} thousandSeparator={true} decimalScale={3} suffix="usdt" />
                  &nbsp;<button onClick={() => {
                    const currentPool = txns[txns.length - 1].nextPool
                    const nextPool = {
                      eth: currentPool.eth + newPoolChange.eth,
                      usdt: currentPool.usdt + newPoolChange.usdt
                    }
                    const _newTxn = {value:0, type:'liquidity_change', swap_result: 0, 
                      eth_price: nextPool.usdt/ nextPool.eth, 
                      nextPool}
                    setTxns([...txns, _newTxn])
                    setNewPoolChange({...poolFormat})
                  }}>Commit the change</button>
                </div>
              </div>
            </div>: null }
          </Col>
          <Col lg={3} className="fullheight">
            {txns.map((txn, k) => {
              return <div key={k}><Transaction {...txn} k={k} fee={fee} /></div>
            }).reverse()}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default App;
