import { ethers } from 'ethers'
import ERC20ABI from '~/configs/abi/ERC20'
import UnboundDollarABI from '~/configs/abi/UnboundDai'
import UnboundLLCABI from '~/configs/abi/UnboundLLCABI'

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

export { getBalanceOfToken, checkLoan, getLockedLPT }
