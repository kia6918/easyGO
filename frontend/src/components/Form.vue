<template>
  <div class="bg-grey-lighter px-2 py-16 flex flex-col">
    <div class="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center">
      <div class="bg-white px-6 py-8 rounded shadow-md w-full">
        <h2 class="mb-10 text-3xl font-semibold text-center">{{ title }}</h2>
        <form @submit.prevent="scroll">
          <alert-component v-if="alertOpen" :type="type" :message="message"></alert-component>
          <slot></slot>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import AlertComponent from "@/components/Alert";
import {scroller} from 'vue-scrollto/src/scrollTo';
const scrollTo = scroller()

export default {
  name: "FormComponent",
  components: {AlertComponent},
  props: ['title', 'type', 'message', 'alertOpen'],
  methods: {
    scroll() {
      if (this.alertOpen) scrollTo("#app")
    }
  }
}
</script>

<style scoped>

</style>