<template>
  <button
    v-if="!isWalletConnected"
    type="button"
    class="cw-btn px-4 py-2 rounded-md border-app-primary border-2 flex justify-center items-center text-app-primary text-sm font-medium focus:outline-none"
    @click="connectWallet"
  >
    Connect Wallet
  </button>
  <div v-else class="relative inline-block">
    <div>
      <button
        type="button"
        class="flex items-center space-x-2 focus:outline-none hover:bg-gray-200 md:py-2 md:px-4 md:rounded transition ease-in-out duration-150"
        @click.prevent="ui.openDrawer = !ui.openDrawer"
      >
        <div v-html="avatar"></div>
        <span class="font-medium">{{
          address.substring(0, 6) +
          '...' +
          address.substring(address.length - 6)
        }}</span>
        <i
          class="fas text-xs"
          :class="ui.openDrawer ? 'fa-caret-up' : 'fa-caret-down'"
        ></i>
      </button>
    </div>

    <!-- Drawer -->
    <div
      v-if="ui.openDrawer"
      class="origin-top-right rounded-md absolute z-10 right-0 mt-4 w-64 shadow-lg"
      style="width: 20rem"
    >
      <div class="rounded-md bg-white shadow-xs">
        <div
          class="py-1"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div class="px-4 py-2">
            <p class="text-gray-600 text-xs">Connected</p>
            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center space-x-2">
                <div v-html="avatar"></div>
                <div class="flex flex-col">
                  <div class="flex items-center space-x-2">
                    <span class="font-medium">{{
                      address.substring(0, 6) +
                      '...' +
                      address.substring(address.length - 4)
                    }}</span>
                    <div class="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span class="text-gray-600 text-xs">$0.00 · Metamask</span>
                </div>
              </div>

              <div>
                <a href="#">
                  <img
                    src="~/assets/icons/external-link.svg"
                    width="14"
                    alt="link"
                  />
                </a>
              </div>
            </div>
          </div>
          <div class="w-full border-b border-gray-200"></div>
          <div class="px-4 py-2">
            <button
              type="button"
              class="flex items-center w-full text-left py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
              role="menuitem"
            >
              Change Wallet
            </button>
            <button
              type="button"
              class="flex items-center w-full text-left py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
              role="menuitem"
              @click="disconnectWallet"
            >
              Disconnect
              <span class="text-app-primary px-2">
                ({{
                  address.substring(0, 6) +
                  '...' +
                  address.substring(address.length - 4)
                }})
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toSvg } from 'jdenticon'

import { ethers } from 'ethers'
import Web3 from 'web3'

export default {
  data() {
    return {
      avatar: null,
      network: null,
      ui: {
        openDrawer: false,
        showDialog: false,
        showChgNetDialog: false,
      },
    }
  },
  computed: {
    isWalletConnected() {
      return !!this.$store.state.address
    },
    address() {
      return this.$store.state.address
    },
  },

  mounted() {
    this.identicon()
    this.isConnected()
    this.getNetwork()
    this.reloadOnNetChange()
    this.reloadOnAccChange()
  },
  methods: {
    identicon() {
      const svgString = toSvg(this.$store.state.address, 24)
      this.avatar = svgString
    },

    reloadOnNetChange() {
      if (window.ethereum || window.web3) {
        const ethereum = window.ethereum || window.web3
        // Silence the metamask warning 🤫
        ethereum.autoRefreshOnNetworkChange = false
        // Reload browser tab when newtork changed
        ethereum.on('chainChanged', () => {
          window.location.reload()
        })
      }
    },
    reloadOnAccChange() {
      if (window.ethereum || window.web3) {
        const ethereum = window.ethereum || window.web3
        // Silence the metamask warning 🤫
        ethereum.autoRefreshOnNetworkChange = false
        // Reload browser tab when account changed
        ethereum.on('accountsChanged', (accounts) => {
          this.$store.commit('getProvider', accounts[0])
          this.identicon()
          window.location.reload()
        })
      }
    },
    async getNetwork() {
      if (window.ethereum || window.web3) {
        const web3 = new Web3(window.ethereum || window.web3)
        const network = await web3.eth.net.getNetworkType()
        this.$store.commit('getNetwork', network)
        this.network = network
        if (this.network !== 'kovan') {
          this.ui.showChgNetDialog = true
        }
      }
    },

    async connectWallet() {
      if (window.ethereum) {
        try {
          // Request account access if needed
          await window.ethereum.enable()
          const provider = await new ethers.providers.Web3Provider(
            window.ethereum
          )
          const address = await provider.getSigner().getAddress()
          // Store provider in state
          this.$store.commit('getProvider', address)
          this.$emit('connected', address)
          // Acccounts now exposed
        } catch (error) {
          console.log(error)
          // this.isMetamaskConnected()
          // User denied account access...
          // alert('Please allow access for the app to work')
        }
      } else if (window.web3) {
        await window.ethereum.enable()
        window.web3 = new Web3(window.web3.currentProvider)
        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        )
        const address = await provider.getSigner().getAddress()
        // Store provider in state
        this.$store.commit('getProvider', address)
        this.$emit('connected', address)
        // Acccounts always exposed
      } else {
        console.log(
          'Non-Ethereum browser detected. You should consider trying MetaMask!'
        )
      }
    },

    async isConnected() {
      const ethereum = window.ethereum || window.web3
      if (ethereum) {
        const isConnected = await ethereum.isConnected()
        if (isConnected) {
          // get the address
          const provider = await new ethers.providers.Web3Provider(ethereum)
          const address = await provider.getSigner().getAddress()
          await this.$store.commit('getProvider', address)
        }
      }
    },

    async disconnectWallet() {
      if (this.$store.state.address) {
        await this.$store.commit('getProvider', null)
      }
    },
  },
}
</script>

<style lang="scss">
@media (max-width: theme('screens.md')) {
  .cw-btn {
    width: 50%;
  }
}
</style>
