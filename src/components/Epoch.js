import CustomerNumberFormat from './CustomNumerFormat';
import React from 'react'
// import {getApy, calRunway} from '../utils'
function num(val){
  return <CustomerNumberFormat value={val} displayType={'text'} thousandSeparator={true} decimalScale={5} highlight={1} />
}

export default class Epoch extends React.Component{
  constructor(props){
    super()
    const {rr, stakedOverTotalSupply} = props
    this.state = {rr, stakedOverTotalSupply, directBondBought:0}
  }
  render() {
    return <div className="epoch-dialog">
      <div>
        Reward rate 
        <CustomerNumberFormat type="input" value={this.state.rr} onValueChange={(values) => {
          const value = parseFloat(values.value);
          this.setState({...this.state, rr: value})
        }} thousandSeparator={true} decimalScale={9} isAllowed={({floatValue}) => floatValue <= 1} /> ({this.state.rr*100}%) 
      </div>
      <div>
        Staked Over Total
        <CustomerNumberFormat type="input" value={this.state.stakedOverTotalSupply} onValueChange={(values) => {
          const value = parseFloat(values.value);
          this.setState({...this.state, stakedOverTotalSupply: value})
        }} thousandSeparator={true} decimalScale={9} isAllowed={({floatValue}) => floatValue <= 1} /> ({this.state.stakedOverTotalSupply*100}%)
      </div>
      <div>
        Bond to buy, max: {this.props.maxDirectBond} {this.props.eth}
        <CustomerNumberFormat type="input" value={this.state.directBondBought} onValueChange={(values) => {
          const value = parseFloat(values.value);
          this.setState({...this.state, directBondBought: value})
        }} thousandSeparator={true} decimalScale={9} />
        {/* isAllowed={({floatValue}) => floatValue <= parseFloat(this.props.maxDirectBond)} />  */}
         ({num(this.state.directBondBought*this.props.price)} {this.props.usdt}) 
      </div>
      <div><button onClick={() => {
        const {rr, stakedOverTotalSupply, directBondBought} = this.state
        this.props.add({rr, stakedOverTotalSupply, directBondBought})
      }}>Next epoch</button></div>
    </div>
  }
}