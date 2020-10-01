<template>
  <div class="sidenav">
    <!-- Logo -->
    <div>
      <div class="logo space-x-2">
        <!-- Logo -->
        <!-- <div class="logo__">U</div> -->
        <img src="~/assets/logo.svg" width="22" alt="logo" />
        <!-- Brand Name -->
        <div class="logo__name">unbound</div>
      </div>

      <!-- Nav Links -->
      <div class="nav__links-container">
        <div v-for="link in navLinks" :key="link.id" class="nav__links">
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
    </div>

    <!-- SideBar Footer -->
    <div class="flex flex-col space-y-8">
      <div class="flex flex-col space-y-1">
        <a href="#" class="text-inactive text-xs">Docs</a>
        <a href="#" class="text-inactive text-xs">WhitePaper</a>
        <a href="#" class="text-inactive text-xs">Github</a>
      </div>
      <div class="flex space-x-6">
        <a href="#"><i class="fab fa-twitter text-inactive text-sm"></i> </a>
        <a href="#"><i class="fab fa-discord text-inactive text-sm"></i> </a>
        <a href="#">
          <i class="fab fa-reddit-alien text-inactive text-sm"></i
        ></a>
        <a href="#"> <i class="fab fa-medium-m text-inactive text-sm"></i></a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.sidenav {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: var(--sidenav-width-desktop);
  background-color: var(--background-light);
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: 0.5s;
}

.logo {
  display: flex;
  align-items: center;

  &__ {
    width: 24px;
    height: 24px;
    border-radius: 2.4px;
    background-color: var(--primary-color);
    color: white;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__name {
    color: var(--primary-color);
    font-weight: 600;
    font-size: 14pt;
  }
}

.nav__links-container {
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
}

@media (max-width: theme('screens.md')) {
  .sidenav {
    display: none;
  }
}
</style>

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
        // {
        //   id: 5,
        //   title: 'Vote',
        //   icon: 'VoteIcon',
        //   route: '/vote',
        // },
        {
          id: 6,
          title: 'History',
          icon: 'HistoryIcon',
          route: '/history',
        },
      ],
    }
  },
}
</script>
