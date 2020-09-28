<template>
  <div class="container">
    <side-nav />
    <div class="content">
      <div class="hero-text">Overview</div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.container {
  padding-left: var(--sidenav-width-desktop);
}

.content {
  padding: 1rem 2rem;
}

@media (max-width: theme('screens.md')) {
  .content {
    padding: 1rem;
  }
}
</style>
