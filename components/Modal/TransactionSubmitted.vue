<template>
  <Modal v-model="modal" :persistent="persistent">
    <div class="flex flex-col justify-center py-4 items-center space-y-4">
      <img
        src="~/assets/icons/transaction_submitted.svg"
        width="56"
        alt="success"
      />
      <div class="pt-4 text-center flex flex-col space-y-6">
        <div>
          <p class="text-lg font-medium text-gray-900">Transaction Submitted</p>
          <p class="text-sm text-gray-700">
            Minting {{ und }} UND for {{ lpt }} {{ lptName }} LP Tokens
          </p>

          <div class="py-2">
            <a
              :href="`https://${this.$store.state.network}.etherscan.io/tx/${hash}`"
              target="_blank"
            >
              <p class="text-xs text-center text-app-primary">
                View on Etherscan
              </p>
            </a>
          </div>
        </div>

        <button
          class="w-full px-4 py-2 rounded-lg bg-app-primary text-white text-sm font-medium focus:outline-none"
          @click="modal = false"
        >
          Close
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal'
export default {
  extends: Modal,
  props: {
    persistent: Boolean,
    hash: {
      type: String,
      required: true,
    },
    und: {
      type: [String, Number],
      required: true,
      default: 0,
    },
    lpt: {
      type: [String, Number],
      required: true,
      default: 0,
    },
    lptName: {
      type: String,
      required: true,
    },
  },
}
</script>
