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
          <div class="text-4xl text-gray-800 font-bold">$38.02K</div>
        </div>

        <!-- Total UND Minted -->
        <div class="md:mt-8 mt-4">
          <div class="w-full flex items-center justify-between">
            <span class="text-xs text-gray-500">Total UND Minted</span>
          </div>
          <div class="text-4xl text-gray-800 font-bold">$400.00</div>
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
            <div class="grid grid-cols-2">
              <span class="text-xs mb-2 text-gray-500"
                >Total Liquidity Provided</span
              >
              <span class="text-xs font-medium text-app-primary text-right"
                >$5.20K</span
              >

              <span class="text-xs mb-2 text-gray-500">Total Fees Earned</span>
              <span class="text-xs font-medium text-app-primary text-right"
                >$10.22</span
              >

              <span class="text-xs text-gray-500">Net APY</span>
              <span class="text-xs font-medium text-app-primary text-right"
                >9.25%</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full md:w-2/3"></div>
  </div>
</template>

<script>
export default {
  layout: 'default',
}
</script>

<style></style>
