import { ethers } from 'ethers'
import config from '~/configs/config'

// get nonce from Uniswap for the permit()s
const getNonce = async (poolTokenAddress, signer) => {
  const userAddress = await signer.getAddress()
  const abi = ['function nonces(address) view returns (uint256)']
  const PoolTokenContract = new ethers.Contract(poolTokenAddress, abi, signer)
  try {
    const nonce = await PoolTokenContract.nonces(userAddress)
    return parseInt(nonce)
  } catch (error) {
    console.log(error)
  }
}
// generating and EIP Signature
// https://github.com/ethereum/EIPs/blob/8a34d644aacf0f9f8f00815307fd7dd5da07655f/EIPS/eip-2612.md
const getEIP712Signature = (
  poolTokenAddress,
  spender,
  userAddress,
  amount,
  nonce,
  deadline
) => {
  const Permit = [
    {
      name: 'owner',
      type: 'address',
    },
    {
      name: 'spender',
      type: 'address',
    },
    {
      name: 'value',
      type: 'uint256',
    },
    {
      name: 'nonce',
      type: 'uint256',
    },
    {
      name: 'deadline',
      type: 'uint256',
    },
  ]
  const EIP712Domain = [
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'version',
      type: 'string',
    },
    {
      name: 'chainId',
      type: 'uint256',
    },
    {
      name: 'verifyingContract',
      type: 'address',
    },
  ]
  const message = {
    owner: userAddress,
    spender,
    value: amount,
    nonce,
    deadline,
  }
  const domain = {
    name: 'Uniswap V2',
    version: '1',
    chainId: parseInt(config.chainId),
    verifyingContract: poolTokenAddress,
  }
  const data = JSON.stringify({
    types: {
      Permit,
      EIP712Domain,
    },
    primaryType: 'Permit',
    domain,
    message,
  })

  return data
  // this.relaySig(nonce, sig)
}

export { getEIP712Signature, getNonce }
