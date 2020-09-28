<template>
  <div class="bottom-nav">
    <!-- Nav Links -->
    <div v-for="link in navLinks" :key="link.id">
      <nuxt-link v-slot="{ isExactActive }" :to="link.route">
        <nav-link
          :to="link.route"
          :icon="link.icon"
          :name="link.title"
          :is-active="isExactActive"
        />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navLinks: [
        {
          id: 1,
          title: 'Overview',
          icon: 'OverviewIcon',
          route: '/',
        },
        {
          id: 2,
          title: 'Mint',
          icon: 'MintIcon',
          route: '/mint',
        },
        {
          id: 3,
          title: 'Unlock',
          icon: 'UnlockIcon',
          route: '/unlock',
        },
        {
          id: 4,
          title: 'Earn',
          icon: 'EarnIcon',
          route: '/earn',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.bottom-nav {
  widows: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 0.8rem 1rem 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0.5px solid #00000010;
  transition: 0.5s;
}

@media (min-width: theme('screens.md')) {
  .bottom-nav {
    display: none;
  }
}
</style>
