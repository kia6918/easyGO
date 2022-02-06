<template>
  <div v-if="replyContent" class="py-2">
    <hr class="p-2">
    <p class="text-gray-600 text-sm">Owner reply: {{ replyContent }}</p>
  </div>
</template>

<script>
export default {
  name: "Reply",
  props: ['replyContent'],
  async created() {
    console.log(this.replyContent)
  }
}
</script>

<style scoped>

</style>