import CustomerNumberFormat from "./CustomNumerFormat";

function num(val){
  return <CustomerNumberFormat value={val} displayType={'text'} thousandSeparator={true} decimalScale={5} highlight={1} />
}
function Transaction(props){
  const {value, swap_result, fee, type, eth_price, nextPool, k} = props;
  return <div style={{marginTop: "10px"}}>
    {type === 'get_eth' || type === 'get_usdt' ?
    <>
    TXN #{k}: Swap {num(value)} {type === 'get_eth' ? "USDT" : "ETH"} for {num(swap_result*(1-fee))} {type !== 'get_eth' ? "USDT" : "ETH"},
    fee: {num(swap_result*fee)} {type !== 'get_eth' ? "USDT" : "ETH"}, price 1 ETH = {num(eth_price)} USDT. 
    Pool ({num(nextPool.eth)} ETH
    , {num(nextPool.usdt)} USDT)
    </>:
    <>
    TXN #{k}: LP change to ({num(nextPool.eth)} ETH, {num(nextPool.usdt)} USDT)
    </>
    }
  </div>
}

export default Transaction;