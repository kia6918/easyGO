<template>
  <button
      v-on:click="fn"
      type="submit"
      :class="{'w-full': fullWidth}"
      class="text-center bg-bs-blue hover:bg-bs-light-blue text-white focus:outline-none font-bold py-2 px-4 h-12 border-none rounded"
  >{{ title }}
  </button>
</template>

<script>
export default {
  name: "SubmitButton",
  props: {
    title: String,
    fn: Function,
    notFull: Boolean
  },
  data() {
    return {
      fullWidth: true
    }
  },
  created() {
    if(this.notFull) this.fullWidth = false
  }
}
</script>

<style scoped>

</style>