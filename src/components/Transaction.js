import CustomerNumberFormat from "./CustomNumerFormat";

function num(val){
  return <CustomerNumberFormat value={val} displayType={'text'} thousandSeparator={true} decimalScale={5} highlight={1} />
}
function Transaction(props){
  const {value, swap_result, fee, type, eth_price, nextPool, k, eth_label, usdt_label} = props;
  return <div style={{marginTop: "10px"}}>
    {type === 'get_eth' || type === 'get_usdt' ?
    <>
    TXN #{k}: Swap {num(value)} {type === 'get_eth' ? usdt_label : eth_label} for {num(swap_result*(1-fee))} {type !== 'get_eth' ? usdt_label : eth_label},
    fee: {num(swap_result*fee)} {type !== 'get_eth' ? usdt_label : eth_label}, price 1 {eth_label} = {num(eth_price)} {usdt_label}. 
    Pool ({num(nextPool.eth)} {eth_label}
    , {num(nextPool.usdt)} {usdt_label})
    </>:
    <>
    TXN #{k}: LP change to ({num(nextPool.eth)} {eth_label}, {num(nextPool.usdt)} {usdt_label})
    </>
    }
  </div>
}

export default Transaction;