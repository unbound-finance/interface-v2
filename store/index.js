export const state = () => ({
  address: null,
  network: null,
})

export const mutations = {
  getProvider(state, address) {
    state.address = address
  },
  getNetwork(state, network) {
    state.network = network
  },
}

export const getters = {
  getAddress: (state) => {
    return state.address
  },
}
