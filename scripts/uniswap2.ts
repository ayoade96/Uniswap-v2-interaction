import { ethers } from "hardhat";

async function main() { 
       //uniswap router address
  /*const ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  // UNISWAP V2 FACTORY ADDRESS
  const FACTORY = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    //uni token address
    const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

      //dai holder
  //const DAIHolder = "0x748dE14197922c4Ae258c7939C7739f3ff1db573";
  const DAIHolder = "0x20bB82F2Db6FF52b42c60cE79cDE4C7094Ce133F"

  const currentTimestampInSeconds = Math.round(Date.now() / 1000)
  const deadline = currentTimestampInSeconds + 86400

  const uniswap = await ethers.getContractAt('IUniswapV2Router01', ROUTER)

  
  const helpers = require("@nomicfoundation/hardhat-network-helpers");
  await helpers.impersonateAccount(DAIHolder);
  const impersonatedSigner = await ethers.getSigner(DAIHolder);

  const DaiContract = await ethers.getContractAt("Itokens", DAI);

  const UniContract = await ethers.getContractAt("Itokens", UNI);

  const holderBalance = await DaiContract.balanceOf(DAIHolder);
  console.log(`Dai balance before ${holderBalance}`);

  const uniBalance = await UniContract.balanceOf(DAIHolder);
  console.log(`uniBalance ${uniBalance}`);

  const amountA =  ethers.parseEther("2000");
  const amountB =  ethers.parseEther("100");

  //QUESTION 1: ADDING LIQUIDITY
  await DaiContract.connect(impersonatedSigner).approve(ROUTER,amountB);

  await UniContract.connect(impersonatedSigner).approve(ROUTER,amountA);

  await uniswap.connect(impersonatedSigner).addLiquidity(DAI,UNI,amountA,amountA,0,0,impersonatedSigner.address,time);

  const holderBalance1 = await DaiContract.balanceOf(DAIHolder);
  console.log(`Dai balance after ${holderBalance1}`);

  const uniBalance1 = await UniContract.balanceOf(DAIHolder);
  console.log(`uniBalance after ${uniBalance1}`); */

  // QUESTION 2: ADD LIQUIDITY ETH


//import { BigNumber } from "ethers";
//import { providers } from "ethers";


 
  const ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  //const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  const WHALE = "0x748dE14197922c4Ae258c7939C7739f3ff1db573";

  const currentTimestampInSeconds = Math.round(Date.now() / 1000)
  const deadline = currentTimestampInSeconds + 86400

  // Getting contract implementation

  const Uniswap = await ethers.getContractAt("IUniswapV2Router01", ROUTER);
  const DaiContract = await ethers.getContractAt("Itokens", DAI);
  //const WETHContract = await ethers.getContractAt("IToken", WETH);
  const UniContract = await ethers.getContractAt("Itokens", UNI);
  

  // Setting up impersonator
  const helpers = require("@nomicfoundation/hardhat-network-helpers");
  await helpers.impersonateAccount(WHALE);
  const impersonatedSigner = await ethers.getSigner(WHALE);




  const txA = {
      tokenA: DAI,
      tokenB:UNI,
      amountADesired: ethers.parseEther("40"),
      amountBDesired: ethers.parseEther("60"),
      amountAMin: ethers.parseEther("0"),
      amountBMin: ethers.parseEther("0"),
      to: impersonatedSigner.address,
      deadline: deadline
      
  }

  await DaiContract.connect(impersonatedSigner).approve(ROUTER, txA.amountADesired)
  await UniContract.connect(impersonatedSigner).approve(ROUTER, txA.amountBDesired)
  

  console.log(`Adding DAI and UNI Liquidity...............`)
  Uniswap.connect(impersonatedSigner).addLiquidity(
    txA.tokenA,
    txA.tokenB,
    txA.amountADesired,
    txA.amountBDesired,
    txA.amountAMin,
    txA.amountBMin,
    txA.to,
    txA.deadline
  );

    const holderBalanceAfter = await DaiContract.balanceOf(WHALE);
    console.log(`Dai balance After ${holderBalanceAfter}`);

    const uniBalanceAfter = await UniContract.balanceOf(WHALE);
    console.log(`UNI Balance_After ${uniBalanceAfter}`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });