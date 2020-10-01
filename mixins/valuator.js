import { ethers } from 'ethers'
import UnboundValuatorABI from '~/configs/abi/UnboundValuator'
import config from '~/configs/config'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

const getLLC = async (llcAddress) => {
  // get LLC details like feeRate and LTV
  const valuator = new ethers.Contract(
    config.contracts.valuator,
    UnboundValuatorABI,
    signer
  )

  const getLLCStruct = await valuator.getLLCStruct(llcAddress)

  return {
    fee: getLLCStruct.fee.toString(),
    loanRate: getLLCStruct.loanrate.toString(),
  }
}

export { getLLC }
