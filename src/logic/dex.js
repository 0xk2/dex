export function mockSwap({type, value, prevPool, eth_label, usdt_label}) {
  let nextPool = {}, swap_result = null, eth_price = null
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
  return {value, type, swap_result, eth_price, nextPool, eth_label, usdt_label};
}