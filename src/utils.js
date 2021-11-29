export function getApy(stakedOverTotalSupply, RewardRate, epoch){
  return Math.pow(1+RewardRate / stakedOverTotalSupply, 365*epoch)
};

export function calNextTotalSupply({totalSupply, rewardRate, stakedOverTotalSupply, bonderGrowth}){
  // bond mua xong có stake luôn không?
  const stakerGrowth = totalSupply * rewardRate / stakedOverTotalSupply
  const daoGrowth = bonderGrowth
  const pohmExerciseGrowth = 0
  return totalSupply + stakerGrowth + bonderGrowth + daoGrowth + pohmExerciseGrowth;
};

export function calRunway({apy, treasuryRfv, noOfStakedToken}) {
  return 3*(Math.log(treasuryRfv/noOfStakedToken) / Math.log(apy))
}