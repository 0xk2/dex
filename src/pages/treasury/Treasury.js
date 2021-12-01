import React from 'react';
import CustomerNumberFormat from '../../components/CustomNumerFormat';
import { Row, Col } from 'react-bootstrap';
// import CustomChart from '../../components/CustomChart';
import CustomerNumberFormat, {num} from '../../components/CustomNumerFormat';

export default class Treasury extends React.Component {
  constructor(props){
    super()
    this.state = {
      epochPerDay: 3,
      init: {
        totalSupply: 3,
        rewardRate: 0.003058,
        stakedOverTotalSupply: 1
      },
      eth: 'OHM',
      backedTokens: ['DAI'],
      events: []
    }
  }

  render() {
    const {epochPerDay, events} = this.state;
    const lastEpoch = events.length === 0 ? this.state.init : events[events.length - 1]
    const epochLabels = Array.from({length: events.length}, (_, i) => i)
    return <Row className="main">
    <Col lg={9}>
      <div>
        Epoch per day <CustomerNumberFormat type="input" value={epochPerDay} onValueChange={(values) => {
          const value = parseFloat(values.value);
          this.setState({epochPerDay: value})
        }} thousandSeparator={true} decimalScale={3} /> 
      </div>
      {/* {CustomChart.TokenCirculationChart({title: 'Token circulation chart', labels: epochLabels, datasets: epochDataSet})}
      {CustomChart.SimpleLineChart({title: 'Market cap', labels: epochLabels, datasets: marketCap})}
      {CustomChart.SimpleLineChart({title: 'Runway dataset', labels: epochLabels, datasets: runWayDataSet})}
      {CustomChart.SimpleLineChart({title: pairName.usdt, labels: epochLabels, datasets: bondsOutstandingDataSet})} */}
      <div>
        <div>
          Epoch #{events.length}: Total supply: {num(lastEpoch.totalSupply)}, 
          <div>
            <div>
              Risk Free Value: {num(currentRFV)} {pairName.usdt}
            </div>
            <div>
              {/* DAO fund = Bond outstanding */}
              DAO fund: {num(bondsOutstanding)} {pairName.eth}
            </div>
          </div>
        </div>
        <div>Current price {txns.length > 0 ? <>{num(txns[txns.length-1].eth_price)} {pairName.usdt}</>: <>Not listed</>}</div>
        <div>APY: {num(
          getApy({
            stakedOverTotalSupply: lastEpoch.stakedOverTotalSupply,
            rewardRate: lastEpoch.rewardRate,
            epoch: lastEpoch.epoch
          })*100)
        }%</div>
        <div>Run Way: {num(calcRunway({
          apy:getApy({
            stakedOverTotalSupply: lastEpoch.stakedOverTotalSupply,
            rewardRate: lastEpoch.rewardRate,
            epoch: lastEpoch.epoch
          }), 
          treasuryRfv: currentRFV, 
          noOfStakedToken: lastEpoch.totalSupply * lastEpoch.stakedOverTotalSupply
        }))} (days)</div>
        <h3>Event in this epoch:</h3>
        <Epoch {...lastEpoch} eth={pairName.eth} usdt={pairName.usdt} 
        rfv={currentRFV}
        price={txns.length > 0 ? txns[txns.length-1].eth_price : 0} 
        bondsOutstanding={bondsOutstanding}
        add={({rewardRate, stakedOverTotalSupply, bonderGrowth, reserveBondBought}) => {
          const tmp = {...treasuryEvents}
          const totalSupply = calcNextTotalSupply({totalSupply: lastEpoch.totalSupply, rewardRate, stakedOverTotalSupply, bonderGrowth})
          const epochEvent = { 
            rewardRate, stakedOverTotalSupply, 
            totalSupply, bonderGrowth, reserveBondBought, 
            eth_price: txns.length > 0 ? txns[txns.length-1].eth_price : 0,
            treasuryRfv: currentRFV,
            runway: calcRunway({
              apy:getApy(stakedOverTotalSupply,rewardRate,epoch), 
              treasuryRfv: currentRFV, 
              noOfStakedToken: totalSupply * stakedOverTotalSupply
            }),
            bondsOutstanding
          }
          tmp.events.push(epochEvent)
          setTreasuryEvents({...tmp})
        }}/>
      </div>
    </Col>
  </Row>
  }
}