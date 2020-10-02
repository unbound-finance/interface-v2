import { ethers } from 'ethers'
import ERC20ABI from '~/configs/abi/ERC20'
import UnboundDollarABI from '~/configs/abi/UnboundDai'
import UnboundLLCABI from '~/configs/abi/UnboundLLCABI'
import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'

import config from '~/configs/config'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

const getBalanceOfToken = async (tokenAddress) => {
  const contract = await new ethers.Contract(tokenAddress, ERC20ABI, signer)
  const userAddress = signer.getAddress()
  const getBalance = await contract.balanceOf(userAddress)
  const balance = ethers.utils.formatEther(getBalance.toString())
  const formattedBalance = parseFloat(balance).toFixed(4).slice(0, -1)
  return formattedBalance
}

const checkLoan = async (LLCAddress) => {
  const contract = await new ethers.Contract(
    config.contracts.unboundDai,
    UnboundDollarABI,
    signer
  )
  const userAddress = signer.getAddress()
  const getBalance = await contract.checkLoan(userAddress, LLCAddress)
  const balance = ethers.utils.formatEther(getBalance.toString())
  const formattedBalance = parseFloat(balance).toFixed(4).slice(0, -1)
  return formattedBalance
}

const getLockedLPT = async (LPTAddress) => {
  const signer = provider.getSigner()
  const contract = await new ethers.Contract(LPTAddress, UnboundLLCABI, signer)
  const userAddress = signer.getAddress()
  const getLocked = await contract._tokensLocked(userAddress)
  const locked = ethers.utils.formatEther(getLocked.toString())
  const formatted = parseFloat(locked).toFixed(4).slice(0, -1)
  return formatted
}

const getLPTPrice = async (poolToken) => {
  const contract = await new ethers.Contract(
    poolToken.address,
    UniswapLPTABI,
    signer
  )
  const reserve = await contract.getReserves()
  const LPTTotalSupply = await contract.totalSupply()
  const token0 = await contract.token0()

  if (token0.toLowerCase() === poolToken.stablecoin) {
    const totalValueInDai = reserve[0].toString() * 2
    return (totalValueInDai / LPTTotalSupply).toFixed(4).slice(0, -1)
  } else {
    const totalValueInDai = reserve[1].toString() * 2
    return (totalValueInDai / LPTTotalSupply).toFixed(4).slice(0, -1)
  }
}

export { getBalanceOfToken, checkLoan, getLockedLPT, getLPTPrice }
