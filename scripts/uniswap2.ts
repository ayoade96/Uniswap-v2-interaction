import { ethers } from "hardhat";

async function main() { 
       //uniswap router address
  const ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  // UNISWAP V2 FACTORY ADDRESS
  const FACTORY = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

    const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

    //uni token address

    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    //dai token address
    
    const currentTimestampInSeconds = Math.round(Date.now() / 1000)
  const deadline = currentTimestampInSeconds + 86400

      //dai holder
  //const DAIHolder = "0x748dE14197922c4Ae258c7939C7739f3ff1db573";
  const DAIHolder = "0x20bB82F2Db6FF52b42c60cE79cDE4C7094Ce133F"

 
  const impersonatedSigner = await ethers.getImpersonatedSigner(DAIHolder);

  const uniswap = await ethers.getContractAt('IUniswapV2Router01', ROUTER);

  const uniswapFactory = await ethers.getContractAt("IUniswapV2Factory",FACTORY);

  const DaiContract = await ethers.getContractAt("Itokens", DAI);

  const UniContract = await ethers.getContractAt("Itokens", UNI);

  await DaiContract.connect(impersonatedSigner).approve(
    ROUTER,
    ethers.parseEther("1000000")
  );

  await UniContract.connect(impersonatedSigner).approve(
    ROUTER,
    ethers.parseEther("1000000")
  );


  const holderBalance = await DaiContract.balanceOf(DAIHolder);
  console.log(`Dai balance before ${holderBalance}`);

  const uniBalance = await UniContract.balanceOf(DAIHolder);
  console.log(`uniBalance ${uniBalance}`);

  const amountA =  ethers.parseEther("20");
  const amountB =  ethers.parseEther("40");
  const aMin = ethers.parseEther("0");
  const bMin = ethers.parseEther("0");
  const amountRADesired = ethers.parseEther("0");
  const amountRBDesired = ethers.parseEther("0");

  //QUESTION 1: ADDING LIQUIDITY


  const addLiquidity = await uniswap.connect(impersonatedSigner).addLiquidity(UNI,DAI,amountA,amountB,aMin,bMin,impersonatedSigner,deadline);

  addLiquidity.wait()
  
  const holderBalance1 = await DaiContract.balanceOf(DAIHolder);
  console.log(`Dai balance after ${holderBalance1}`);

  const uniBalance1 = await UniContract.balanceOf(DAIHolder);
  console.log(`uniBalance after ${uniBalance1}`); 

   //   uniswapFactory

 const getLiquidityPair = await uniswapFactory.connect(impersonatedSigner).getPair(UNI, DAI);
const pairContract = await ethers.getContractAt("Itokens", getLiquidityPair);

const pairLiquidity = await pairContract.balanceOf(impersonatedSigner);

console.log(getLiquidityPair);
console.log(pairContract);
console.log(pairLiquidity);

const approvePairLiquidity = await pairContract
 .connect(impersonatedSigner)
 .approve(ROUTER, pairLiquidity);

const aprovalRecipt1 = await Promise.all([approvePairLiquidity.wait()]);

console.log(aprovalRecipt1);

console.log(approvePairLiquidity);

const txremoveLiqiudity = await uniswap
 .connect(impersonatedSigner)
 .removeLiquidity(
  UNI,
  DAI,
  pairLiquidity,
  amountRADesired,
  amountRBDesired,
  DAIHolder,
  deadline
 );

await txremoveLiqiudity.wait();
console.log(txremoveLiqiudity);
console.log("Transaction hash:", txremoveLiqiudity.hash);

console.log(
 `USDC Balance after ${ethers.formatUnits(
  await UniContract.balanceOf(DAIHolder),
  6
 )})`
);

console.log(
 `Dai Balance after ${ethers.formatEther(
  await DaiContract.balanceOf(DAIHolder)
 )})`
);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });