import { ethers } from 'ethers'
import Web3 from 'web3'

import UniswapRouterABI from '~/configs/abi/UniswapRouter'
import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'
import config from '~/configs/config'

import { getEIP712Signature, getNonce } from '~/mixins/crypto'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

const addLiquidity = async (tokenA, tokenB, amountA, amountB) => {
  const contract = await new ethers.Contract(
    config.contracts.uniswapRouter,
    UniswapRouterABI,
    signer
  )
  const formatAmountA = ethers.utils.parseEther(amountA).toString()
  const formatAmountB = ethers.utils.parseEther(amountB).toString()

  const amountADesired = formatAmountB
  const amountBDesired = formatAmountB
  const amountAMin = (formatAmountA - (formatAmountA * 10) / 100).toString()
  const amountBMin = (formatAmountB - (formatAmountB * 10) / 100).toString()
  const to = await signer.getAddress()
  const deadline = +new Date() + 5000

  const transaction = await contract.addLiquidity(
    tokenA,
    tokenB,
    amountADesired,
    amountBDesired,
    amountAMin,
    amountBMin,
    to,
    deadline
  )
  return transaction
}

const removeLiquidity = async (tokenA, tokenB, amountA, amountB) => {
  const userAddress = await signer.getAddress()
  const nonce = await getNonce(config.contracts.UNDUniswapPool, signer)
  const deadline = +new Date() + 10000
  const formatAmountA = ethers.utils.parseEther(amountA).toString()
  const formatAmountB = ethers.utils.parseEther(amountB).toString()

  const liquidity = Math.sqrt(formatAmountA * formatAmountB).toString()

  const amountAMin = (formatAmountA - (formatAmountA * 10) / 100).toString()
  const amountBMin = (formatAmountB - (formatAmountB * 10) / 100).toString()

  const signedData = await getEIP712Signature(
    config.contracts.UNDUniswapPool,
    config.contracts.uniswapRouter,
    userAddress,
    liquidity,
    nonce,
    deadline
  )

  const web3 = new Web3(window.ethereum)
  const metamaskSigner = await web3.eth.getAccounts()

  const promise = new Promise(function (resolve, reject) {
    web3.currentProvider.send(
      {
        method: 'eth_signTypedData_v3',
        params: [metamaskSigner[0], signedData],
        from: metamaskSigner[0],
      },
      async (error, signedData) => {
        if (error || signedData.error) {
          return console.log(error)
        }
        const signature = ethers.utils.splitSignature(signedData.result)
        const UniswapRouter = await new ethers.Contract(
          config.contracts.uniswapRouter,
          UniswapRouterABI,
          signer
        )
        try {
          const removeLiquidity = await UniswapRouter.removeLiquidityWithPermit(
            tokenA,
            tokenB,
            liquidity,
            amountAMin,
            amountBMin,
            userAddress,
            deadline,
            false,
            signature.v,
            signature.r,
            signature.s
          )
          resolve(removeLiquidity)
        } catch (error) {
          reject(Error('It broke'))
        }
      }
    )
  })

  return promise
  // const signature = ethers.utils.splitSignature(signedData.result)
  // console.log(signature)
  // const contract = await new ethers.Contract(
  //   config.contracts.uniswapRouter,
  //   UniswapRouterABI,
  //   signer
  // )
  // const formatAmountA = ethers.utils.parseEther(amountA).toString()
  // const formatAmountB = ethers.utils.parseEther(amountB).toString()

  // const liquidity = Math.sqrt(formatAmountA * formatAmountB)

  // const amountAMin = (formatAmountA - (formatAmountA * 10) / 100).toString()
  // const amountBMin = (formatAmountB - (formatAmountB * 10) / 100).toString()
  // const to = await signer.getAddress()

  // console.log({
  //   tokenA,
  //   tokenB,
  //   liquidity,
  //   amountAMin,
  //   amountBMin,
  //   to,
  //   deadline,
  // })

  // const transaction = await contract.removeLiquidity(
  //   tokenA,
  //   tokenB,
  //   liquidity,
  //   amountAMin,
  //   amountBMin,
  //   to,
  //   deadline
  // )
}

const getPoolTokenBalance = async () => {
  const userAddress = signer.getAddress()
  const poolTokenContract = await new ethers.Contract(
    config.contracts.UNDUniswapPool,
    UniswapLPTABI,
    signer
  )
  const balance = poolTokenContract.balanceOf(userAddress)
  return balance
}

const getPoolTokenReserves = async () => {
  const poolTokenContract = new ethers.Contract(
    config.contracts.UNDUniswapPool,
    UniswapLPTABI,
    signer
  )
  const reserves = await poolTokenContract.getReserves()
  return {
    reserve0: reserves[0].toString(),
    reserve1: reserves[1].toString(),
  }
}

const getPoolTokenTotalSupply = async () => {
  const poolTokenContract = new ethers.Contract(
    config.contracts.UNDUniswapPool,
    UniswapLPTABI,
    signer
  )
  const totalSupply = await poolTokenContract.totalSupply()
  return totalSupply
}

const getAmountOfLockedTokens = async () => {
  const poolTokenTotalSupply = await getPoolTokenTotalSupply()
  const poolTokenBalance = await getPoolTokenBalance()
  const poolTokenReserves = await getPoolTokenReserves()
  const poolTokenRatio =
    poolTokenBalance.toString() / poolTokenTotalSupply.toString()
  return {
    token0: (poolTokenReserves.reserve0 * poolTokenRatio) / 1e18,
    token1: (poolTokenReserves.reserve0 * poolTokenRatio) / 1e18,
    poolShare: poolTokenRatio * 100,
  }
}

export {
  addLiquidity,
  removeLiquidity,
  getPoolTokenBalance,
  getPoolTokenReserves,
  getPoolTokenTotalSupply,
  getAmountOfLockedTokens,
}
