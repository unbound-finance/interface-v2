import { ethers } from 'ethers'

import ERC20ABI from '~/configs/abi/ERC20'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

const getTokenBalance = async (tokenAddress) => {
  const userAddress = signer.getAddress()
  const poolTokenContract = await new ethers.Contract(
    tokenAddress,
    ERC20ABI,
    signer
  )
  const raw = await poolTokenContract.balanceOf(userAddress)
  const formatted = ethers.utils.formatEther(raw.toString())
  const toFixed = parseFloat(formatted).toFixed(4).slice(0, -1)

  return {
    raw,
    formatted,
    toFixed,
  }
}

export { getTokenBalance }
