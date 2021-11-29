export function getApy(stakedOverTotalSupply, RewardRate, epoch){
  return Math.pow(1+RewardRate / stakedOverTotalSupply, 365*epoch)*100
};

export function calNextTotalSupply({totalNoOfToken, rr, stakedOverTotalSupply, directBondBought}){
  // bond mua xong có stake luôn không?
  console.log('calNextTotalSupply: totalNoOfToken ',totalNoOfToken);
  console.log('calNextTotalSupply: totalNoOfToken * RewardRateYield ',totalNoOfToken * rr/stakedOverTotalSupply);
  return totalNoOfToken * (1 + rr / stakedOverTotalSupply) + directBondBought
};

export function calRunway({apy, treasuryRfv, noOfStakedToken}) {
  return 3*(Math.log(treasuryRfv/noOfStakedToken) / Math.log(apy))
}