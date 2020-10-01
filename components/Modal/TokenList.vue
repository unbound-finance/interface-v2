<template>
  <Modal v-model="modal" :persistent="persistent">
    <div class="flex flex-col space-y-4">
      <div class="flex justify-between items-center">
        <p class="font-medium dark:text-white">Select Pool Token</p>
        <button type="button" class="focus:outline-none" @click="modal = false">
          <i class="fas fa-times text-gray-900 dark:text-gray-500"></i>
        </button>
      </div>

      <input
        type="text"
        class="px-4 py-2 border border-gray-200 focus:border-app-primary text-sm rounded-lg appearance-none focus:outline-none"
        placeholder="Search Liquidity Pool Token"
      />

      <div
        v-for="(poolToken, index) in supportedPoolTokens"
        :key="index"
        class="hover:bg-gray-200 rounded-md px-2"
        @click="selectToken(poolToken)"
      >
        <div
          class="w-full flex items-center justify-between cursor-pointer py-1"
        >
          <div class="space-x-2 flex items-center">
            <double-logo
              :token0logo="poolToken.currencyOneLogo"
              :token1logo="poolToken.currencyTwoLogo"
            />
            <div class="flex flex-col">
              <span class="font-medium">{{ poolToken.name }}</span>
              <span class="text-xs text-gray-500">{{
                poolToken.exchange
              }}</span>
            </div>
          </div>
          <div>
            <span class="text-gray-800 font-bold font-mono">
              {{ poolToken.balance || 0 }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal'
import supportedPoolTokens from '@/configs/supportedPoolTokens'
import { getTokenBalance } from '~/mixins/ERC20'

export default {
  extends: Modal,
  props: {
    persistent: {
      type: Boolean,
      default: false,
    },
    poolToken: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      supportedPoolTokens,
    }
  },

  mounted() {
    this.getSupportedPoolTokens()
  },
  methods: {
    selectToken(poolToken) {
      this.$emit('update:poolToken', poolToken)
      this.modal = false
    },

    async getSupportedPoolTokens() {
      let i
      const poolTokens = []
      for (i = 0; i < supportedPoolTokens.length; i++) {
        const balance = await getTokenBalance(supportedPoolTokens[i].address)
        const poolTokenObj = {
          name: supportedPoolTokens[i].name,
          exchange: supportedPoolTokens[i].exchange,
          address: supportedPoolTokens[i].address,
          llcAddress: supportedPoolTokens[i].llcAddress,
          currencyOneLogo: supportedPoolTokens[i].currencyOneLogo,
          currencyTwoLogo: supportedPoolTokens[i].currencyTwoLogo,
          stablecoin: supportedPoolTokens[i].stablecoin,
          balance: balance.toFixed,
        }
        poolTokens.push(poolTokenObj)
        this.supportedPoolTokens = poolTokens
      }
    },
  },
}
</script>
