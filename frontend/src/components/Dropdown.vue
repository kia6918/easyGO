<template>
  <div class="h-16 flex flex-wrap">
    <label :for="placeholder" class="md-5 text-sm">{{ placeholder }}</label>
    <select @change="func" :value="value" @input="$emit('input', $event.target.value)"
        class="transition-all block border border-gray-300 p-3.5 rounded mb-4 w-full text-sm" :name="placeholder" :id="placeholder" required>
      <option disabled class="rounded bg-transparent text-gray-300 p-2 w-full h-6 mb-4"
              value="">{{
          placeholder
        }}
      </option>
      <option v-for="(option,id) in options" :key="id"
              class="rounded bg-transparent text-gray-300 p-2 w-full h-6 mb-4">
        {{ option.type }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'DropdownComponent',
  props: {
    options: Array,
    placeholder: String,
    value: String,
    fn: Function
  },
  data() {
    return {
      func: function() {}
    }
  },
  async mounted() {
    if (this.fn) this.func = this.fn
  }
}
</script>