<template>
  <div class="pt-8 md:pt-4">
    <div class="hero-text">Mint</div>
    <span class="text-xs text-gray-500">Mint UND by locking LP tokens.</span>
    <div class="flex flex-wrap">
      <div class="w-full md:w-1/3">
        <!-- Mint Section -->
        <div class="flex flex-col space-y-4 items-center justify-center mt-8">
          <!-- Supply -->
          <input-field
            v-model="LPTAmount"
            label="Supply"
            :pool-token.sync="poolToken"
          />

          <i class="fas fa-long-arrow-alt-down text-app-primary text-lg"></i>

          <!-- Mint -->
          <input-field
            :value="(Number(UNDOutput) && UNDOutput) || ''"
            label="Mint"
            :readonly="true"
          >
            <template v-slot:append>
              <div class="flex flex-col">
                <div class="flex items-center focus:outline-none">
                  <img
                    src="~/assets/tokens/und.svg"
                    width="24"
                    alt="und logo"
                  />
                  <div class="flex items-center p-1">
                    <p class="text-gray-900 font-semibold text-right">UND</p>
                  </div>
                </div>
                <span class="text-xs text-right text-gray-500">Unbound</span>
              </div>
            </template>
          </input-field>

          <!-- Mint Button -->
          <button
            type="button"
            class="font-medium rounded-lg w-full p-4 focus:outline-none"
            :class="[
              !poolToken ? getDisabledClass : getActiveClass,
              !LPTAmount ? getDisabledClass : getActiveClass,
              isSufficentBalance ? getDisabledClass : getActiveClass,
            ]"
            :disabled="shouldDisableMint"
            @click="mint(poolToken.address, poolToken.llcAddress)"
          >
            <span v-if="!poolToken">Select Token</span>
            <span v-else-if="!LPTAmount">Enter an amount</span>
            <span v-else-if="isSufficentBalance">Insufficient Balance</span>
            <span v-else>Mint</span>
          </button>
        </div>
      </div>

      <div v-if="poolToken && LPTAmount" class="w-full md:w-1/3 px-6">
        <!-- Additional Information -->
        <table class="w-full mt-8">
          <tr class="text-sm font-mono font-medium">
            <td class="px-4 py-1">Price Per LP Token</td>
            <td class="px-4 py-1 text-right">{{ LPTPrice }} DAI</td>
          </tr>
          <tr class="text-sm font-mono font-medium">
            <td class="px-4 py-1">Minting Fees</td>
            <td class="px-4 py-1 text-right">
              {{ (parseInt(UNDOutput) * 0.25) / 100 }} UND
            </td>
          </tr>
          <tr class="text-sm font-mono font-medium">
            <td class="px-4 py-1">Funding Rate</td>
            <td class="px-4 py-1 text-right">
              {{ (llc.loanRate && 100 / llc.loanRate) || '-' }}%
            </td>
          </tr>
        </table>
        <div class="px-4 mt-4">
          <a
            v-if="poolToken"
            :href="`https://kovan.etherscan.io/address/${poolToken.address}`"
            target="_blank"
          >
            <button
              class="border border-gray-900 py-1 font-mono text-sm w-full rounded-md focus:outline-none"
            >
              Contract Address
              <i
                class="fas fa-long-arrow-alt-up text-sm"
                style="transform: rotate(45deg)"
              ></i>
            </button>
          </a>
        </div>
      </div>

      <AwaitingModal v-model="ui.showAwaitingModal" />
      <TransactionSubmitted
        v-model="ui.showTransactionSubmittedModal"
        :hash="txLink"
        :und="Number(UNDOutput)"
        :lpt="LPTAmount"
        :lpt-name="(poolToken && poolToken.name) || ''"
      />
      <Rejected v-model="ui.showRejectedModal" />
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import Web3 from 'web3'

import AwaitingModal from '@/components/Modal/Awaiting'

import UnboundDaiABI from '~/configs/abi/UnboundDai.js'
import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'
import UnboundLLCABI from '~/configs/abi/UnboundLLCABI'

// import signature from '~/mixins/signature'
import { getNonce, getEIP712Signature } from '~/mixins/crypto'
import { getTokenBalance } from '~/mixins/ERC20'
import { getLLC } from '~/mixins/valuator'

import config from '~/configs/config'

export default {
  components: { AwaitingModal },
  data() {
    return {
      ui: {
        showAwaitingModal: false,
        showTransactionSubmittedModal: false,
        showRejectedModal: false,
      },
      LPTAmount: '',
      poolToken: null,
      LPTPrice: '',
      loanRatioPerLPT: '',
      llc: {
        loanRate: '',
        fee: '',
      },
      txLink: '',
    }
  },

  computed: {
    UNDOutput() {
      const loanRatioPerLPT = this.LPTAmount * this.loanRatioPerLPT
      return loanRatioPerLPT.toFixed(4).slice(0, -1)
    },

    isSufficentBalance() {
      return (
        this.poolToken &&
        parseFloat(this.LPTAmount) > parseFloat(this.poolToken.balance)
      )
    },
    shouldDisableMint() {
      return !this.LPTAmount || this.isSufficentBalance
    },
    getDisabledClass() {
      return 'bg-gray-300 text-gray-600 cursor-not-allowed'
    },
    getActiveClass() {
      return 'bg-app-primary text-white'
    },
  },

  watch: {
    poolToken(a) {
      this.getLoanRatioPerLPT(a)
    },
  },
  methods: {
    async getLoanRatioPerLPT(poolToken) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = await new ethers.Contract(
        poolToken.address,
        UniswapLPTABI,
        signer
      )
      const reserve = await contract.getReserves()
      const LPTTotalSupply = await contract.totalSupply()
      const token0 = await contract.token0()
      const llc = await getLLC(poolToken.llcAddress)
      this.llc.loanRate = llc.loanRate
      this.llc.fee = llc.fee
      if (token0.toLowerCase() === poolToken.stablecoin) {
        const totalValueInDai = reserve[0].toString() * 2
        this.loanRatioPerLPT = totalValueInDai / LPTTotalSupply / llc.loanRate
        this.LPTPrice = (totalValueInDai / LPTTotalSupply)
          .toFixed(4)
          .slice(0, -1)
      } else {
        const totalValueInDai = reserve[1].toString() * 2
        this.loanRatioPerLPT = totalValueInDai / LPTTotalSupply / llc.loanRate
        this.LPTPrice = (totalValueInDai / LPTTotalSupply)
          .toFixed(4)
          .slice(0, -1)
      }
    },
    async mint(poolTokenAddress, llcAddress) {
      this.ui.showAwaitingModal = true
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const userAddress = await signer.getAddress()
      const nonce = await getNonce(poolTokenAddress, signer)
      const deadline = +new Date() + 5000
      const amount = ethers.utils.parseEther(this.LPTAmount).toString()
      const EIP712Signature = await getEIP712Signature(
        poolTokenAddress,
        llcAddress,
        userAddress,
        amount,
        nonce,
        deadline
      )
      const web3 = new Web3(window.ethereum)
      const metamaskSigner = await web3.eth.getAccounts()
      web3.currentProvider.sendAsync(
        {
          method: 'eth_signTypedData_v3',
          params: [metamaskSigner[0], EIP712Signature],
          from: metamaskSigner[0],
        },
        async (error, signedData) => {
          if (error || signedData.error) {
            this.ui.showAwaitingModal = false
            return console.error(signedData)
          }
          const signature = ethers.utils.splitSignature(signedData.result)
          const UnboundLLCContract = await new ethers.Contract(
            llcAddress,
            UnboundLLCABI,
            signer
          )
          try {
            const mintUND = await UnboundLLCContract.lockLPTWithPermit(
              amount,
              config.contracts.unboundDai,
              deadline,
              signature.v,
              signature.r,
              signature.s
            )
            // close awaiting modal
            this.ui.showAwaitingModal = false
            this.txLink = mintUND.hash
            // show success screen
            this.ui.showTransactionSubmittedModal = true
            // initiate the UND contract to detect the event so we can update the balances in real time
            const UND = new ethers.Contract(
              config.contracts.unboundDai,
              UnboundDaiABI,
              signer
            )
            // listen to mint event from UND contract
            UND.on('Mint', async () => {
              const balance = await getTokenBalance(poolTokenAddress)
              this.poolToken.balance = balance.toFixed
            })
          } catch (error) {
            this.ui.showAwaitingModal = false
            this.ui.showTransactionSubmittedModal = false
            this.ui.showRejectedModal = true
          }
        }
      )
    },
  },
}
</script>
