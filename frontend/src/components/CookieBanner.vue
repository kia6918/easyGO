<template>
  <div class="w-screen bg-transparent relative items-center justify-center footer">
    <section class="p-5 lg:px-24 bg-gray-400">
      <div class="md:flex items-center -mx-3">
        <div class="md:flex-1 px-3 mb-5 md:mb-0">
          <p class="text-center md:text-left text-white text-xs leading-tight md:pr-12">We and selected partners and
            related companies, use cookies and similar technologies as specified in our Cookies Policy. You agree to
            consent to the use of these technologies by clicking Accept, or by continuing to browse this website. You
            can learn more about how we use cookies and set cookie preferences in Settings.</p>
        </div>
        <div class="px-3 text-center">
          <button v-on:click="fn"
              class="py-2 px-8 bg-bs-blue text-white rounded font-bold text-sm shadow-xl">
            Accept cookies
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "CookieBanner",
  props: ['fn']
}
</script>

<style scoped>
.footer {
  z-index: 99;
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
}

</style>