export function getApy({stakedOverTotalSupply, rewardRate, epochPerDay}){
  return Math.pow(1+rewardRate / stakedOverTotalSupply, 365*epochPerDay)
};

export function calcNextTotalSupply({totalSupply, rewardRate, stakedOverTotalSupply, bonderGrowth}){
  // bond mua xong có stake luôn không?
  const stakerGrowth = totalSupply * rewardRate / stakedOverTotalSupply
  const daoGrowth = bonderGrowth
  const pohmExerciseGrowth = 0
  return totalSupply + stakerGrowth + bonderGrowth + daoGrowth + pohmExerciseGrowth;
};

export function calcRunway({apy, treasuryRfv, noOfStakedToken}) {
  return 3*(Math.log(treasuryRfv/noOfStakedToken) / Math.log(apy))
}

export function calcRFV({epochEvents, liquidityPool}){
  let reserveBondBought = 0;
  for(var i=0;i<epochEvents.length;i++){
    reserveBondBought += epochEvents[i].reserveBondBought
  }
  if(liquidityPool !== undefined){
    return reserveBondBought+2*Math.sqrt(liquidityPool.eth * liquidityPool.usdt) // * ownership
  }
  return reserveBondBought;
}

export function calcBondOutsStanding({bonds, currentEpochIdx}) {
  let bondsOutStanding = 0;
  for(let i=0;i<bonds.length;i++){
    const bond = bonds[i]
    const vestedPercentage  = 
      currentEpochIdx - bond.startVestingEpochIdx < 0 ? 0 : 
        (currentEpochIdx - bond.startVestingEpochIdx) > bond.vestingPeriod ? 1 : (currentEpochIdx - bond.startVestingEpochIdx)/bond.vestingPeriod
    bondsOutStanding += bond.bondPayout * vestedPercentage
  }
  return bondsOutStanding
}

export function calcBondPayout({bondsOutStanding, bcv, totalSupply, marketValue}) {
  const debtRatio = bondsOutStanding / totalSupply
  const bondPrice = 1 + (debtRatio * bcv)
  const bondPayout = marketValue / bondPrice
  return bondPayout
}