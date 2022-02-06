<template>
  <div v-if="alertOpen">
    <div v-if="type==='error'"
         class="py-3 px-5 mb-4 bg-red-200 text-red-900 text-sm rounded-md border border-red-200 flex items-center"
         role="alert">
      <div class="w-4 mr-2">
        <font-awesome-icon icon="exclamation-triangle"></font-awesome-icon>
      </div>
      <span><b class="capitalize inline">Oops!</b> {{ message }}</span>
    </div>
    <div v-else-if="type==='warn'"
         class="py-3 px-5 mb-4 bg-yellow-200 text-yellow-900 text-sm rounded-md border border-yellow-200 flex items-center"
         role="alert">
      <div class="w-4 mr-2">
        <font-awesome-icon icon="bell"></font-awesome-icon>
      </div>
      <span>{{ message }}</span>
    </div>
    <div v-else
         class="py-3 px-5 mb-4 bg-green-200 text-green-900 text-sm rounded-md border border-green-200 flex items-center"
         role="alert">
      <div class="w-4 mr-2">
        <font-awesome-icon icon="thumbs-up"></font-awesome-icon>
      </div>
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "AlertComponent",
  props: ['type', 'message'],
  data() {
    return {
      alertOpen: true
    }
  },
  methods: {
    async closeAlert() {
      this.alertOpen = false
    }
  }
}
</script>