import './App.css';
import { useState } from 'react';
import CustomerNumberFormat from './components/CustomNumerFormat';
import CustomChart from './components/CustomChart';
import { Container, Row, Col } from 'react-bootstrap';
import Transaction from './components/Transaction';
import Epoch from './components/Epoch';
import { calNextTotalSupply,getApy,calRunway } from './utils';

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
  const [pairName, setPairName] = useState({
    eth: 'OHM',
    usdt: 'DAI'
  })
  const [txns, setTxns] = useState([])
  const [newTxn, setNewTxn] = useState({...defaultTxn})
  const [fee, setFee] = useState(0.0025)
  const [started, setStarted] = useState(false)
  const [ui, setUI] = useState('treasury') // dex, treasury
  const [treasuryEvents, setTreasuryEvents] = useState({
    epoch: 3,
    init: {
      totalSupply: 3,
      rewardRate: 0.003058,
      stakedOverTotalSupply: 1,
      bondDiscountDexLP: 0.003,
      bondDiscountDirect: 0.005,
    },
    events: []
  })

  function getRFV(){
    let reserveBondBought = 0;
    for(var i=0;i<treasuryEvents.events.length;i++){
      reserveBondBought += treasuryEvents.events[i].reserveBondBought
    }
    if(txns.length > 0){
      return reserveBondBought+2*Math.sqrt(txns[txns.length-1].nextPool.eth * txns[txns.length-1].nextPool.usdt) // * ownership
    }
    return reserveBondBought;
  }
  
  function cal(type, value) {
    let prevPool = null, nextPool = {}, swap_result = null, eth_price = null
    if(txns.length === 0){
      prevPool = {eth: initPool.eth, usdt: initPool.usdt }
    }else{
      prevPool = {...txns[txns.length - 1].nextPool}
    }
    if(type === 'get_eth'){
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
    return {value, type, swap_result, eth_price, nextPool, eth_label: pairName.eth, usdt_label: pairName.usdt};
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
  const epochLabels = Array.from({length: treasuryEvents.events.length}, (_, i) => i)
  
  const priceDataSet = [
    {
      label: `${pairName.eth} - ${pairName.usdt} price`,
      data: txns.map((txn) => {return txn.eth_price}),
      borderColor: 'yellow',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ];
  const lpDataSet = [
    {
      label: pairName.eth,
      data: txns.map((txn) => {return txn.nextPool.eth}),
      yAxisID: 'eth',
      borderColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: pairName.usdt,
      data: txns.map((txn) => {return txn.nextPool.usdt}),
      yAxisID: 'usdt',
      borderColor: 'rgba(53, 162, 235, 0.5)',
    }
  ]
  const epochDataSet = [
    {
      label: 'Total Supply',
      data: treasuryEvents.events.map((event) => {return event.totalSupply}),
      borderColor: 'rgba(255, 99, 132, 0.5)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      fill: true
    },
    {
      label: 'Staked Supply',
      data: treasuryEvents.events.map((event) => {return event.totalSupply*event.stakedOverTotalSupply}),
      borderColor: 'rgba(53, 162, 235, 0.5)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      fill: true
    }
  ]
  const marketCap = [
    {
      label: 'Market cap',
      data: treasuryEvents.events.map((event) => {return event.totalSupply * event.eth_price}),
      borderColor: 'rgba(255, 99, 132, 0.5)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      fill: true
    },
  ]
  const runWayDataSet = [
    {
      label: 'RunWay',
      data: treasuryEvents.events.map((event) => {return event.runway}),
      borderColor: 'rgba(255, 99, 132, 0.5)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      fill: true
    },
  ]
  let lastEpoch = treasuryEvents.init
  const {epoch, events} = treasuryEvents
  if(events.length > 0){
    lastEpoch = events[events.length - 1]
  }
  lastEpoch.epoch = epoch
  let bondsOutstanding = 0
  for(i=0;i<treasuryEvents.events.length;i++){
    const lastBonderGrowth = treasuryEvents.events[i].bonderGrowth !== null ? treasuryEvents.events[i].bonderGrowth : 0
    bondsOutstanding += lastBonderGrowth
  }
  return (
    <div className="App">
      <Container>
        <Row className="header">
          <Col>
            <div>
              Select UI 
              <select value={ui} onChange={(e) => {setUI(e.target.value)}}>
                <option value='dex'>AMM Exchange</option>
                <option value='treasury'>Treasury</option>
              </select>
            </div>
            <div>
              Pair name: 
              {started === false ? 
              <>
                <input value={pairName.eth} onChange={(e) => {setPairName({...pairName, eth: e.target.value})}} />,
                back by: <input value={pairName.usdt} onChange={(e) => {setPairName({...pairName, usdt: e.target.value})}} />
              </>: <>{pairName.eth}, back by: {pairName.usdt}</>}
            </div>
          </Col>
        </Row>
        {ui==='dex'?
        <Row className="main">
          <Col lg={9}>
            <h1>AMM demo, a sample DEX</h1>
            <h4>Pair {pairName.eth} - {pairName.usdt}</h4>
            {CustomChart.PriceChart({title: `${pairName.eth} price after transactions`, labels, datasets: priceDataSet})}
            {CustomChart.LPChart({title: 'Liquidity pool after a txn', labels, datasets: lpDataSet})}
            <div style={{marginTop: "10px"}}>
              Init pool: ({started === false ? <>
                <CustomerNumberFormat type="input" value={initPool.eth} onValueChange={(values) => {
                  const value = parseFloat(values.value);
                  setInitPool({...initPool, eth: value})
                }} thousandSeparator={true} decimalScale={3} suffix={pairName.eth} />, 
                <CustomerNumberFormat type="input" value={initPool.usdt} onValueChange={(values) => {
                  const value = parseFloat(values.value);
                  setInitPool({...initPool, usdt: value})
                }} thousandSeparator={true} decimalScale={3} suffix={pairName.usdt} />); with K={num(initPool.eth * initPool.usdt)}, 
                {initPool.eth > 0 ? <span>1 {pairName.eth}={num(initPool.usdt / initPool.eth)} {pairName.usdt}</span> : null}
              </>: <>
                {num(initPool.eth)} {pairName.eth}, {num(initPool.usdt)} {pairName.usdt}, 
                K={num(initPool.eth * initPool.usdt)}, 1 {pairName.eth}={num(initPool.usdt / initPool.eth)} {pairName.usdt}
              </>}
            </div>
            <div>
              Fee: {started === false? <><CustomerNumberFormat type="input" value={fee} onValueChange={(values) => {
                const {value} = values
                setFee(parseFloat(value))
              }} /> aka</> : null} {fee*100}% {started === true ? <> - Total fee: {num(eth_fee)} {pairName.eth}, {num(usdt_fee)} {pairName.usdt}</>:null}
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
                  <option value="get_eth">Swap {pairName.usdt} for {pairName.eth}</option>
                  <option value="get_usdt">Swap {pairName.eth} for {pairName.usdt}</option>
                </select>; swap <CustomerNumberFormat type="input" value={newTxn.value} onValueChange={(values) => {
                  const value = parseFloat(values.value)
                  const type = newTxn.type
                  setNewTxn({...cal(type, value)})
                }} thousandSeparator={true} decimalScale={3} onKeyDown={(e) => {
                  if(e.code === 'Enter'){
                    swap()
                  }
                }} /> 
                {newTxn.type === "get_eth" ? pairName.usdt : pairName.eth} for {num(newTxn.swap_result)} 
                {newTxn.type !== "get_eth" ? pairName.usdt : pairName.eth} 
                - price: 1 {pairName.eth} = {num(newTxn.eth_price)} {pairName.usdt} 
                &nbsp; <button onClick={swap}>Swap now</button>
              </div>
              <div>
                <div>Provide or extract liquidity from the dex 
                  {txns.length > 0 ? 
                    <span>{num(txns[txns.length - 1].nextPool.eth)} {pairName.eth}, {num(txns[txns.length - 1].nextPool.usdt)} {pairName.usdt}</span>
                  : <span>{num(initPool.eth)} {pairName.eth}, {num(initPool.usdt)} {pairName.usdt}</span>}
                </div>
                <div>
                  <CustomerNumberFormat type="input" value={newPoolChange.eth} onValueChange={(values) => {
                    const value = parseFloat(values.value)
                    const currentPool = txns[txns.length - 1].nextPool
                    setNewPoolChange({
                      eth: value,
                      usdt: currentPool.usdt/currentPool.eth * value
                    })
                  }} thousandSeparator={true} decimalScale={3} suffix={pairName.eth} /> - 
                  <CustomerNumberFormat type="input" value={newPoolChange.usdt} onValueChange={(values) => {
                    const value = parseFloat(values.value)
                    const currentPool = txns[txns.length - 1].nextPool
                    setNewPoolChange({
                      usdt: value,
                      eth: currentPool.eth/currentPool.usdt * value
                    })
                  }} thousandSeparator={true} decimalScale={3} suffix={pairName.usdt} />
                  &nbsp;<button onClick={() => {
                    const currentPool = txns[txns.length - 1].nextPool
                    const nextPool = {
                      eth: currentPool.eth + newPoolChange.eth,
                      usdt: currentPool.usdt + newPoolChange.usdt
                    }
                    const _newTxn = {value:0, type:'liquidity_change', swap_result: 0, 
                      eth_price: nextPool.usdt/ nextPool.eth, 
                      nextPool, eth: pairName.eth, usdt: pairName.usdt}
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
        :null}
        {ui==='treasury'?
        <Row className="main">
          <Col lg={9}>
            <div>
              Epoch per day <CustomerNumberFormat type="input" value={treasuryEvents.epoch} onValueChange={(values) => {
                const value = parseFloat(values.value);
                setTreasuryEvents({...treasuryEvents, epoch: value})
              }} thousandSeparator={true} decimalScale={3} /> 
            </div>
            {CustomChart.TokenCirculationChart({title: 'Token circulation chart', labels: epochLabels, datasets: epochDataSet})}
            {CustomChart.PriceChart({title: 'Market cap', labels: epochLabels, datasets: marketCap})}
            {CustomChart.PriceChart({title: 'Run Way (days)', labels: epochLabels, datasets: runWayDataSet})}
            <div>
              <div>
                Epoch #{events.length}: Total supply: {num(lastEpoch.totalSupply)}, 
                <div>
                  <div>
                    Risk Free Value: {num(getRFV())} {pairName.usdt}
                  </div>
                  <div>
                    {/* DAO fund = Bond outstanding */}
                    DAO fund: {num(bondsOutstanding)} {pairName.eth}
                  </div>
                </div>
              </div>
              <div>Current price {txns.length > 0 ? <>{num(txns[txns.length-1].eth_price)} {pairName.usdt}</>: <>Not listed</>}</div>
              <div>APY: {num(getApy(lastEpoch.stakedOverTotalSupply,lastEpoch.rewardRate,lastEpoch.epoch)*100)}%</div>
              <div>Run Way: {calRunway({
                apy:getApy(lastEpoch.stakedOverTotalSupply,lastEpoch.rewardRate,lastEpoch.epoch), 
                treasuryRfv: getRFV(), 
                noOfStakedToken: lastEpoch.totalSupply * lastEpoch.stakedOverTotalSupply
              })} (days)</div>
              <h3>Event in this epoch:</h3>
              <Epoch {...lastEpoch} eth={pairName.eth} usdt={pairName.usdt} 
              rfv={getRFV()}
              price={txns.length > 0 ? txns[txns.length-1].eth_price : 0} 
              bondsOutstanding={bondsOutstanding}
              add={({rewardRate, stakedOverTotalSupply, bonderGrowth, reserveBondBought}) => {
                const tmp = {...treasuryEvents}
                const totalSupply = calNextTotalSupply({totalSupply: lastEpoch.totalSupply, rewardRate, stakedOverTotalSupply, bonderGrowth})
                const epochEvent = { 
                  rewardRate, stakedOverTotalSupply, 
                  totalSupply, bonderGrowth, reserveBondBought, 
                  eth_price: txns.length > 0 ? txns[txns.length-1].eth_price : 0,
                  treasuryRfv: getRFV(),
                  runway: calRunway({
                    apy:getApy(stakedOverTotalSupply,rewardRate,epoch), 
                    treasuryRfv: getRFV(), 
                    noOfStakedToken: totalSupply * stakedOverTotalSupply
                  })
                }
                tmp.events.push(epochEvent)
                setTreasuryEvents({...tmp})
              }}/>
            </div>
            
          </Col>
        </Row>
        :null}
      </Container>
    </div>
  )
}

export default App;
