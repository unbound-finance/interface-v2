<template>
  <nuxt-link
    class="flex flex-col space-y-2 md:space-y-0 md:flex-row justify-center items-center md:justify-start md:space-x-2 md:py-3 md:mb-1"
    :class="isActive ? 'text-app-primary' : 'text-inactive'"
    :to="to"
  >
    <component
      :is="icon"
      class="md:mr-3"
      :color="isActive ? 'text-app-primary' : ''"
      :width="16"
    ></component>
    <span
      class="text-xs md:text-sm leading-3"
      :class="isActive ? 'md:font-bold font-medium' : 'font-medium'"
      >{{ name }}</span
    >
  </nuxt-link>
</template>

<script>
import OverviewIcon from '@/components/icons/OverviewIcon'
import MintIcon from '@/components/icons/MintIcon'
import UnlockIcon from '@/components/icons/UnlockIcon'
import EarnIcon from '@/components/icons/EarnIcon'
import VoteIcon from '@/components/icons/VoteIcon'
import HistoryIcon from '@/components/icons/HistoryIcon'

export default {
  components: {
    OverviewIcon,
    MintIcon,
    UnlockIcon,
    EarnIcon,
    VoteIcon,
    HistoryIcon,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
      default: '/',
      required: true,
    },
  },
}
</script>

<style></style>
