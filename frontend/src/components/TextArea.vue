<template>
  <div class="py-2">
    <textarea @keyup="countCharacters" class="block w-full placeholder-gray-400
                     transition duration-100 ease-in-out bg-white border
                     border-gray-300 rounded shadow-sm focus:border-blue-500
                     focus:ring-2 focus:ring-blue-500 focus:outline-none
                     focus:ring-opacity-50  disabled:opacity-50
                     disabled:cursor-not-allowed h-48 text-lg"
              placeholder="Enter your thoughts here..."
              :value="value" @input="$emit('input', $event.target.value)">
    </textarea>
    <p class="text-right cursor-default" v-bind:class="{'text-red-800':overLimit}">{{ characters }} characters remaining...</p>
  </div>
</template>

<script>

export default {
  name: "TextArea",
  props: ["value"],
  data() {
    return {
      characters: 3000,
      overLimit: false
    }
  },
  methods: {
    async countCharacters() {
      this.characters = 3000 - this.value.length
      this.overLimit = this.characters < 0
    }
  }
}
</script>

<style scoped>
textarea {
  padding: 12px;
}
</style>