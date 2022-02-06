<template>
  <a class="bg-transparent w-16 cursor-pointer" v-on:click="fn">
    <a class="text-xs p-2 shadow-md rounded leading-normal text-blueGray-600 bg-gray-100"
       v-bind:class="{'block': isBlock}">
      {{ title }}
    </a>
  </a>
</template>

<script>
export default {
  name: "ActionButton",
  props: ["title", "block", "fn"],
  data() {
    return {
      isBlock: true
    }
  },
  async created() {
    if (this.block === false) this.isBlock = false
  }
}
</script>

<style scoped>

</style>