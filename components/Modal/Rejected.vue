<template>
  <Modal v-model="modal" :persistent="persistent">
    <div class="flex flex-col justify-center py-4 items-center space-y-4">
      <img src="~/assets/icons/failed.svg" width="64" alt="success" />
      <div>
        <p class="text-red-600 font-medium">Transaction Rejected</p>

        <button
          class="w-full px-4 py-2 rounded mt-4 bg-red-600 bg-opacity-25 text-red-600 font-medium focus:outline-none"
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
  },
}
</script>

<style></style>
