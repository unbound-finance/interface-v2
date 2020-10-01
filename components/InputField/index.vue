<template>
  <div class="flex flex-col items-center justify-center">
    <div class="mint__input">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-500">{{ label }}</span>
        <p v-if="poolToken" class="text-sm text-gray-500">
          Balance:
          <span class="font-mono text-gray-900 font-medium">{{
            poolToken.balance
          }}</span>
        </p>
        <p v-if="locked" class="text-sm text-gray-500">
          Locked LPT's:
          <span class="font-mono text-gray-900 font-medium">{{ locked }}</span>
        </p>
      </div>
      <form>
        <div class="flex items-center py-2">
          <input
            v-model="model"
            type="number"
            placeholder="0.00"
            class="font-mono text-3xl appearance-none bg-transparent text-gray-900 font-semibold w-full leading-tight focus:outline-none"
            :class="readonly ? 'cursor-not-allowed' : ''"
            :readonly="readonly"
          />
          <slot name="append">
            <div v-if="poolToken" class="flex flex-col">
              <button
                type="button"
                class="flex items-center focus:outline-none"
                @click="ui.showTokenListModal = true"
              >
                <double-logo
                  :token0logo="poolToken.currencyOneLogo"
                  :token1logo="poolToken.currencyTwoLogo"
                />
                <div class="flex items-center hover:bg-gray-100 rounded-md p-1">
                  <p class="text-gray-900 font-semibold text-right">
                    {{ poolToken.name }}
                  </p>
                  <i class="fas fa-chevron-down text-xs pl-1 font-bold"></i>
                </div>
              </button>
              <span class="text-xs text-right text-gray-500">{{
                poolToken.exchange
              }}</span>
            </div>

            <button
              v-else
              type="button"
              class="bg-app-primary text-white text-xs font-medium rounded-lg py-1 w-2/3 focus:outline-none"
              @click="ui.showTokenListModal = true"
            >
              Select Token
              <i class="fas fa-chevron-down text-xs pl-1 font-bold"></i>
            </button>
          </slot>
        </div>
      </form>
    </div>
    <token-list v-model="ui.showTokenListModal" :pool-token.sync="poolToken" />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: [String, Number],
      default: 0.0,
    },
    locked: {
      type: [String, Number],
      default: 0.0,
    },
    value: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      model: this.value,
      ui: {
        showTokenListModal: false,
      },
      poolToken: null,
      LPTBalance: 0,
    }
  },
  watch: {
    value(a) {
      this.model = a
    },
    model(a) {
      this.$emit('input', a)
    },
    poolToken(a) {
      this.$emit('update:poolToken', a)
    },
  },
}
</script>

<style lang="scss">
.mint__input {
  width: 100%;
  padding: 0.8rem 1.2rem;
  border: 1px solid #00000010;
  border-radius: 16px;
}
</style>
