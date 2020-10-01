<template>
  <div class="flex items-center flex-wrap pt-8 md:pt-4">
    <div class="w-full md:w-1/3">
      <div class="hero-text">Mint</div>
      <span class="text-xs text-gray-500">Mint UND by locking LP tokens.</span>

      <!-- Mint Section -->
      <div class="flex flex-col space-y-4 items-center justify-center mt-8">
        <!-- Supply -->
        <input-field
          v-model="amount"
          label="Supply"
          :pool-token.sync="poolToken"
        />

        <i class="fas fa-long-arrow-alt-down text-app-primary text-lg"></i>

        <!-- Mint -->
        <input-field label="Mint" :readonly="true">
          <template v-slot:append>
            <div class="flex flex-col">
              <div class="flex items-center focus:outline-none">
                <img src="~/assets/tokens/und.svg" width="24" alt="und logo" />
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
          class="text-white font-medium rounded-lg bg-app-primary w-full p-4 focus:outline-none"
        >
          Mint
        </button>
      </div>
    </div>
    <div class="w-full md:w-1/3">
      <!-- Additional Information -->
    </div>
    <AwaitingModal v-model="ui.showAwaitingModal" />
  </div>
</template>

<script>
import AwaitingModal from '@/components/Modal/Awaiting'
export default {
  components: { AwaitingModal },
  data() {
    return {
      ui: {
        showAwaitingModal: false,
      },
      amount: '',
      poolToken: null,
    }
  },
  methods: {},
}
</script>
