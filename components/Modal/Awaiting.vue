<template>
  <Modal v-model="modal" :persistent="persistent">
    <div class="flex flex-col justify-center py-4 items-center space-y-4">
      <loader size="72" stroke="3" color="#6c5ce7" />
      <div class="pt-4">
        <p class="text-xl dark:text-white font-medium text-gray-700">
          Waiting For Confirmation
        </p>
        <p class="text-xs text-center text-gray-500 dark:text-gray-700">
          Confirm this transaction in your wallet.
        </p>
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
  },
}
</script>
