<template>
  <div
    class="flex space-x-2 my-3 items-center"
    :class="isActive ? 'text-app-primary' : 'text-inactive'"
  >
    <component
      :is="icon"
      :color="isActive ? 'text-app-primary' : ''"
    ></component>
    <span class="text-sm" :class="isActive ? 'font-bold' : 'font-medium'">{{
      name
    }}</span>
  </div>
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
  },
}
</script>

<style></style>
