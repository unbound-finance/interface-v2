<template>
  <div class="dl__wrapper">
    <div class="dl__token0">
      <img :src="token0logo" alt="token0" />
    </div>
    <div class="dl__token1">
      <img :src="token1logo" alt="token1" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * Token 0 Logo
     * @type String
     */
    token0logo: {
      type: String,
      required: true,
    },
    /**
     * Token 1 Logo
     * @type String
     */
    token1logo: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss">
:root {
  --logo-size: 24px;
}

.dl__wrapper {
  position: relative;
  display: flex;
  width: calc(var(--logo-size) * 2);
}

.dl__token0 {
  display: flex;
  align-items: center;
  align-self: center;
}

.dl__token0 > img {
  width: var(--logo-size);
  height: var(--logo-size);
  z-index: 2;
  border-radius: 9999px;
}

.dl__token1 {
  position: absolute;
  left: calc(var(--logo-size) / 2);
}

.dl__token1 > img {
  width: var(--logo-size);
  height: var(--logo-size);
  border-radius: 9999px;
}
</style>
