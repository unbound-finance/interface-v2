<template>
  <div class="app">
    <side-nav />
    <bottom-nav />
    <div class="content">
      <div>
        <app-header />
        <nuxt />
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.app {
  padding-left: var(--sidenav-width-desktop);
}

.content {
  padding: 1rem 2rem;
}

@media (max-width: theme('screens.md')) {
  .content {
    padding: 1rem;
  }
  .app {
    padding-left: 0px;
    padding-bottom: calc(60px + 1rem);
  }
}
</style>
