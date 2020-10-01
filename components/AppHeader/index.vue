<template>
  <div class="w-full flex justify-between md:justify-end md:space-x-4">
    <!-- logo on mobile -->
    <img class="md:hidden" src="~/assets/logo.svg" width="24" alt="logo" />
    <!-- UNC Balance -->
    <!-- <div class="unc-bal">0.0000 UNC</div> -->
    <!-- Connect Wallet Button -->
    <connect-wallet />
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.unc-bal {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 4px;
  background: #dcd8f9;
  color: var(--primary-color);
  font-family: var(--s-font);
  font-size: 12pt;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: theme('screens.md')) {
  .unc-bal {
    display: none;
  }
}
</style>
