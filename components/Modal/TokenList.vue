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
        v-model="search"
        type="text"
        class="px-4 py-2 border border-gray-200 focus:border-app-primary text-sm rounded-lg appearance-none focus:outline-none"
        placeholder="Search token, address or exchange..."
      />

      <template v-if="searchResult.length != 0">
        <div
          v-for="(token, index) in searchResult"
          :key="index"
          class="hover:bg-gray-200 rounded-md px-2"
          @click="selectToken(token)"
        >
          <div
            class="w-full flex items-center justify-between cursor-pointer py-1"
          >
            <div class="space-x-2 flex items-center">
              <double-logo
                :token0logo="token.currencyOneLogo"
                :token1logo="token.currencyTwoLogo"
              />
              <div class="flex flex-col">
                <span class="font-medium">{{ token.name }}</span>
                <span class="text-xs text-gray-500">{{ token.exchange }}</span>
              </div>
            </div>
            <div>
              <span class="text-gray-800 font-bold font-mono">
                {{ token.balance || 0 }}
              </span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="text-sm text-center p-4 text-gray-600">
          Token Not found.
        </div>
      </template>
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
      search: '',
      supportedPoolTokens,
    }
  },

  computed: {
    searchResult() {
      const search = this.search.trim()
      if (search) {
        const regex = new RegExp(search, 'ig')
        return this.supportedPoolTokens.filter(
          ({ name, address, exchange }) =>
            regex.test(name) ||
            (search.slice(0, 2).toLowerCase() === '0x' &&
              regex.test(address)) ||
            regex.test(exchange)
        )
      }
      return this.supportedPoolTokens
    },
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
      this.supportedPoolTokens = await Promise.all(
        supportedPoolTokens.map(async (poolToken) => {
          const balance = await getTokenBalance(poolToken.address)
          return {
            ...poolToken,
            balance: balance.toFixed,
          }
        })
      )
    },
  },
}
</script>
