<template>
  <div class="flex items-center flex-wrap pt-8 md:pt-4">
    <div class="w-full md:w-1/3">
      <div class="hero-text">Overview</div>
      <div class="flex flex-col space-y-6">
        <!-- Total Locked Assets -->
        <div class="md:mt-12 mt-6">
          <div class="w-full flex items-center justify-between">
            <span class="text-xs text-gray-500">Total Locked Assets</span>
            <button
              class="text-app-primary text-xs flex items-center space-x-2 focus:outline-none"
            >
              <span>View</span>
              <i class="fas fa-long-arrow-alt-right"></i>
            </button>
          </div>
          <div
            v-if="lockedAssetsValue"
            class="text-4xl text-gray-800 font-bold"
            :title="`$${Number(lockedAssetsValue).toLocaleString()}`"
          >
            ${{
              (lockedAssetsValue &&
                $numberFormatter(Number(lockedAssetsValue))) ||
              '0.00'
            }}
          </div>
          <div v-else class="loading-dots text-4xl">.</div>
        </div>

        <!-- Total UND Minted -->
        <div class="md:mt-8 mt-4">
          <div class="w-full flex items-center justify-between">
            <span class="text-xs text-gray-500">Total UND Minted</span>
          </div>
          <div
            v-if="totalMinted"
            class="text-4xl text-gray-800 font-bold"
            :title="`$${Number(totalMinted).toLocaleString()}`"
          >
            ${{
              (totalMinted && $numberFormatter(Number(totalMinted))) || '0.00'
            }}
          </div>
          <div v-else class="loading-dots text-4xl">.</div>
        </div>

        <!-- Your Liquidity -->
        <div class="md:mt-8 mt-4">
          <div class="w-full flex items-center justify-between">
            <span class="text-xs text-gray-500">Your Liquidity</span>
            <button
              class="text-app-primary text-xs flex items-center space-x-2 focus:outline-none"
            >
              <span>View</span>
              <i class="fas fa-long-arrow-alt-right"></i>
            </button>
          </div>
          <div class="p-4 rounded-md border border-gray-200 w-full mt-4">
            <template v-if="liquidity">
              <div class="grid grid-cols-2">
                <span class="text-xs mb-2 text-gray-500"
                  >Total Liquidity Provided</span
                >
                <span class="text-xs font-medium text-app-primary text-right"
                  >${{
                    liquidity &&
                    $numberFormatter(
                      Number(liquidity.token0 + liquidity.token1)
                    )
                  }}</span
                >

                <span class="text-xs mb-2 text-gray-500"
                  >Total Fees Earned</span
                >
                <span class="text-xs font-medium text-app-primary text-right"
                  >$0</span
                >

                <span class="text-xs text-gray-500">Net APY</span>
                <span class="text-xs font-medium text-app-primary text-right"
                  >0%</span
                >
              </div>
            </template>
            <template v-else>
              <div
                class="flex items-center justify-center text-xs text-gray-600"
              >
                No Liquidity provided.
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full md:w-2/3"></div>
  </div>
</template>

<script>
import '@/assets/css/loading-dots.css'
import { ethers } from 'ethers'

import { getAmountOfLockedTokens } from '~/mixins/stake'
import { getLockedLPT, getLPTPrice } from '~/mixins/info'

import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'
import config from '~/configs/config'
import UnboundDai from '~/configs/abi/UnboundDai'

import supportedPoolTokens from '~/configs/supportedPoolTokens'

const provider = new ethers.providers.Web3Provider(window.ethereum)

export default {
  layout: 'default',
  data() {
    return {
      lockedAssetsValue: null,
      liquidity: null,
      totalLiquidity: '0',
      totalMinted: '',
      collectedFees: {
        safu: '',
        team: '',
      },
    }
  },

  mounted() {
    this.getTotalUND()
    this.getCollectedFees()
    this.fetchLiquidity()
    this.getLockedAssets()
  },

  methods: {
    async getCollectedFees() {
      const signer = provider.getSigner()
      const UND = new ethers.Contract(
        config.contracts.unboundDai,
        UnboundDai,
        signer
      )
      const safu = await UND.balanceOf(config.safuFund)
      const team = await UND.balanceOf(config.devFund)
      this.collectedFees.safu = (safu.toString() / 1e18).toFixed(3)
      this.collectedFees.team = (team.toString() / 1e18).toFixed(3)
    },

    async getTotalUND() {
      const signer = provider.getSigner()
      const UND = new ethers.Contract(
        config.contracts.unboundDai,
        UnboundDai,
        signer
      )
      const supply = await UND.totalSupply()
      this.totalMinted = (supply / 1e18).toFixed(2)
    },

    async fetchLiquidity() {
      const signer = provider.getSigner()
      const userAddress = provider.getSigner().getAddress()
      const poolTokenContract = new ethers.Contract(
        config.contracts.UNDUniswapPool,
        UniswapLPTABI,
        signer
      )
      try {
        const lptBalance = await poolTokenContract.balanceOf(userAddress)
        if (lptBalance > 0) {
          const data = await getAmountOfLockedTokens()
          this.liquidity = data
        }
      } catch (error) {}
    },

    async getLockedAssets() {
      this.lockedAssetsValue = (
        await Promise.all(
          supportedPoolTokens.map(async (poolToken) => {
            const lockedLPT = await getLockedLPT(poolToken.llcAddress)
            const lptPrice = await getLPTPrice(poolToken)
            return Number(lockedLPT * lptPrice)
          })
        )
      ).reduce((a, b) => {
        return a + b
      }, 0)
    },
  },
}
</script>

<style></style>
