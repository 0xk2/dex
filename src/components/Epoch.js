import CustomerNumberFormat from './CustomNumerFormat';
import React from 'react'
// import {getApy, calRunway} from '../utils'
function num(val){
  return <CustomerNumberFormat value={val} displayType={'text'} thousandSeparator={true} decimalScale={5} highlight={1} />
}

export default class Epoch extends React.Component{
  constructor(props){
    super()
    const {rewardRate, stakedOverTotalSupply} = props
    this.state = {rewardRate, stakedOverTotalSupply, reserveBondBought:0, bcv: 1}
  }
  render() {
    return <div className="epoch-dialog">
      <div>
        Reward rate 
        <CustomerNumberFormat type="input" value={this.state.rewardRate} onValueChange={(values) => {
          const value = parseFloat(values.value);
          this.setState({...this.state, rewardRate: value})
        }} thousandSeparator={true} decimalScale={9} isAllowed={({floatValue}) => floatValue <= 1} /> 
        ({this.state.rewardRate*100}%) 
      </div>
      <div>
        Staked Over Total (&lt; 1)
        <CustomerNumberFormat type="input" value={this.state.stakedOverTotalSupply} onValueChange={(values) => {
          const value = parseFloat(values.value);
          this.setState({...this.state, stakedOverTotalSupply: value})
        }} thousandSeparator={true} decimalScale={9} isAllowed={({floatValue}) => floatValue > 0} /> ({this.state.stakedOverTotalSupply*100}%)
      </div>
      <div>
        BCV value &gt; 0 (1,2)
        <CustomerNumberFormat type="input" value={this.state.bcv} onValueChange={(values) => {
          const value = parseFloat(values.value);
          this.setState({...this.state, bcv: value})
        }} thousandSeparator={true} decimalScale={9} isAllowed={({floatValue}) => floatValue <= 1} />
      </div>
      <div>
        Buy Reseave bond:
        <CustomerNumberFormat type="input" value={this.state.reserveBondBought} onValueChange={(values) => {
          const value = parseFloat(values.value);
          this.setState({...this.state, reserveBondBought: value})
        }} thousandSeparator={true} decimalScale={9} suffix={this.props.usdt} />
        with price {num(1 + this.props.bondsOutstanding / this.props.totalSupply * this.state.bcv)} {this.props.usdt}&nbsp;
        for {num(this.state.reserveBondBought/(1 + this.props.bondsOutstanding / this.props.totalSupply * this.state.bcv))} {this.props.eth}
      </div>
      <div><button onClick={() => {
        const {rewardRate, stakedOverTotalSupply, reserveBondBought, bcv} = this.state
        const bondPrice = 1 + this.props.bondsOutstanding / this.props.totalSupply * bcv
        const bonderGrowth = reserveBondBought / bondPrice
        this.props.add({rewardRate, stakedOverTotalSupply, bonderGrowth, reserveBondBought, bcv})
      }}>Next epoch</button></div>
    </div>
  }
}