<template>
  <div class="p-12 sm:px-0">
    <input
        class="p-2 w-8/12 h-12
               focus:outline-none focus:shadow-outline
               text-base shadow-md placeholder-gray-500
               border border-gray-200"
        type="search" placeholder="Search..."
        :value="value" @input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  props: ['value']
}
</script>

<style scoped>
button {
  opacity: 0.2;
}

</style>