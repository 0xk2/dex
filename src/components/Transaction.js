import CustomerNumberFormat from "./CustomNumerFormat";

function num(val){
  return <CustomerNumberFormat value={val} displayType={'text'} thousandSeparator={true} decimalScale={5} highlight={1} />
}
function Transaction(props){
  const {value, swap_result, fee, type, eth_price, nextPool, k, eth, usdt} = props;
  return <div style={{marginTop: "10px"}}>
    {type === 'get_eth' || type === 'get_usdt' ?
    <>
    TXN #{k}: Swap {num(value)} {type === 'get_eth' ? usdt : eth} for {num(swap_result*(1-fee))} {type !== 'get_eth' ? usdt : eth},
    fee: {num(swap_result*fee)} {type !== 'get_eth' ? usdt : eth}, price 1 {eth} = {num(eth_price)} {usdt}. 
    Pool ({num(nextPool.eth)} {eth}
    , {num(nextPool.usdt)} {usdt})
    </>:
    <>
    TXN #{k}: LP change to ({num(nextPool.eth)} {eth}, {num(nextPool.usdt)} {usdt})
    </>
    }
  </div>
}

export default Transaction;