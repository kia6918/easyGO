<template>
  <label class="inline-flex items-center text-sm p-1 rounded">
    <input v-on:click="check" type="checkbox" class="form-checkbox h-5 w-5 text-gray-600" checked><span
      class="ml-2 text-gray-700">{{ label }}</span>
  </label>
</template>

<script>
export default {
  name: "Checkbox",
  props: ['label', 'check']
}
</script>

<style scoped>

</style>