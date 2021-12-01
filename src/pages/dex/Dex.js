import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CustomChart from './components/CustomChart';
import CustomerNumberFormat, {num} from '../../components/CustomNumerFormat';
import Transaction from '../../components/Transaction';
import { mockSwap } from '../../logic/dex';

const defaultTxn = { type: "get_eth", value: 0 }
const poolFormat = { eth: 0, usdt: 0 }

export default class Dex extends React.Component {
  constructor(props){ // props: txns, pairName, initPool
    super(props)
    this.state = {
      fee: 0.0025,
      newTxn: {...defaultTxn},
      newPoolChange: {...poolFormat}
    }
  }
  swap(){
    if(this.state.newTxn.value > 0){
      this.setState({
        newTxn: {...defaultTxn}
      })
      this.props.setTxns({txns: [...this.props.txns, {...this.state.newTxn}]})
    }else{
      alert('invalid value!')
    }
  }
  calFee() {
    const {fee} = this.state
    const {txns} = this.props
    let eth_fee = 0;
    let usdt_fee = 0;
    for(var i=0;i<txns.length;i++){
      if(txns[i].type === 'get_eth'){
        eth_fee += txns[i].swap_result * fee
      }else{
        usdt_fee += txns[i].swap_result * fee
      }
    }
    return {eth_fee, usdt_fee}
  }
  render(){
    const {pairName, initPool, txns, setTxns} = this.props
    const {fee, newTxn, newPoolChange} = this.state
    const started = txns.length === 0 ? false : true;
    const {eth_fee, usdt_fee} = this.calFee()
    const labels = Array.from({length: txns.length}, (_, i) => i)
    console.log("txns: ",txns)
    const currentPool = txns.length === 0 ? initPool : txns[txns.length - 1].nextPool
    return <Row>
      <Col lg={9}>
        <h1>AMM demo, a sample DEX</h1>
        <h4>Pair {pairName.eth} - {pairName.usdt}</h4>
        {CustomChart.PriceChart({pairName, labels, txns})}
        {CustomChart.LPChart({pairName, labels, txns})}
        <div style={{marginTop: "10px"}}>
          Init pool: ({started === false ? <>
            <CustomerNumberFormat type="input" value={initPool.eth} onValueChange={(values) => {
              const value = parseFloat(values.value);
              this.setState({
                initPool: {...initPool, eth: value}
              })
            }} thousandSeparator={true} decimalScale={3} suffix={pairName.eth} />, 
            <CustomerNumberFormat type="input" value={initPool.usdt} onValueChange={(values) => {
              const value = parseFloat(values.value);
              this.setState({
                initPool: {...initPool, usdt: value}
              })
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
            this.setState({fee: parseFloat(value)})
          }} /> or</> : null} {fee*100}% {started === true ? <> - Total fee: {num(eth_fee)} {pairName.eth}, {num(usdt_fee)} {pairName.usdt}</>:null}
        </div>
        <div>
          {started === true? <button onClick={() => {
            setTxns({txns: []})
          }}>Restart!</button> : null}
        </div>
        <div style={{marginTop: "10px", border: "1px solid #ccc", padding: "15px"}}>
          <div>
            New txn, type: 
            <select value={newTxn.type} onChange={(e) => {
              const value = newTxn.value
              const type = e.target.value
              this.setState({
                newTxn: {...mockSwap({type, value, prevPool: currentPool, eth_label: pairName.eth, usdt_label: pairName.usdt})}
              })
            }}>
              <option value="get_eth">Swap {pairName.usdt} for {pairName.eth}</option>
              <option value="get_usdt">Swap {pairName.eth} for {pairName.usdt}</option>
            </select>; 
            swap <CustomerNumberFormat type="input" value={newTxn.value} onValueChange={(values) => {
              const value = parseFloat(values.value)
              const type = newTxn.type
              this.setState({
                newTxn: {...mockSwap({type, value, prevPool: currentPool, eth_label: pairName.eth, usdt_label: pairName.usdt})}
              })
            }} thousandSeparator={true} decimalScale={3} onKeyDown={(e) => {
              if(e.code === 'Enter'){
                this.swap()
              }
            }} /> 
            {newTxn.type === "get_eth" ? pairName.usdt : pairName.eth} for {num(newTxn.swap_result)} 
            {newTxn.type !== "get_eth" ? pairName.usdt : pairName.eth} 
            - price: 1 {pairName.eth} = {num(newTxn.eth_price)} {pairName.usdt} 
            &nbsp; <button onClick={() => {this.swap()}}>Swap now</button>
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
                this.setState({
                  newPoolChange: {
                    eth: value,
                    usdt: currentPool.usdt/currentPool.eth * value
                  }
                })
              }} thousandSeparator={true} decimalScale={3} suffix={pairName.eth} /> - 
              <CustomerNumberFormat type="input" value={newPoolChange.usdt} onValueChange={(values) => {
                const value = parseFloat(values.value)
                this.setState({
                  newPoolChange: {
                    usdt: value,
                    eth: currentPool.eth/currentPool.usdt * value
                  }
                })
              }} thousandSeparator={true} decimalScale={3} suffix={pairName.usdt} />
              &nbsp;<button onClick={() => {
                const nextPool = {
                  eth: currentPool.eth + newPoolChange.eth,
                  usdt: currentPool.usdt + newPoolChange.usdt
                }
                const _newTxn = {value:0, type:'liquidity_change', swap_result: 0, 
                eth_price: nextPool.usdt/ nextPool.eth,
                nextPool, eth: pairName.eth, usdt: pairName.usdt}
                setTxns({txns: [...txns, _newTxn]})
                this.setState({
                  newPoolChange: {...poolFormat}
                })
              }}>Commit the change</button>
            </div>
          </div>
        </div>
      </Col>
      <Col lg={3} className="fullheight">
        {txns.map((txn, k) => {
          return <div key={k}><Transaction {...txn} k={k} fee={fee} /></div>
        }).reverse()}
      </Col>
    </Row>
  }
}