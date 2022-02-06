<template>
  <div>
    <transition name="slide" appear>
      <div class="modal bg-gray-100 px-6 py-8 rounded shadow-lg border-gray-500" v-if="show">
        <h2 class="font-semibold text-lg">{{ title }}</h2>
        <div class="p-6">
          <slot/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "PopupModal",
  props: ['title', 'show']
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  width: 100%;
  max-width: 400px;
  background-color: whitesmoke;
  border-radius: 16px;
  padding: 25px;
}
</style>