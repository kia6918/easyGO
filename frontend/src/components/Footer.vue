<template>
  <div>
    <div>
      <hr class="p-3">
    </div>
    <footer class="flex flex-wrap items-center justify-between p-4">
      <div class="w-full lg:w-auto lg:mr-6 mb-4 lg:mb-0 text-center">© 2022 Yan
      </div>
      <div class="flex flex-col lg:flex-row items-center w-full lg:w-auto">
        <div class="mx-auto lg:mx-0 lg:ml-auto">
          <a class="inline-block mt-0 ml-8 text-gray-700"
             href="https://github.com/daerxi/easyGo">
            <span><font-awesome-icon :icon="['fab','github']"/></span> Github
          </a>
        </div>
        <div class="flex justify-center space-x-6 mt-4 lg:mt-0 lg:ml-8">
          <a href="mailto: kia7482@gmail.com">
            <svg class="text-gray-600 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>

export default {
  name: "FooterComponent",
  data() {
    return {
      show: false,
      currentURL: '',
      type: '',
      message: '',
      alertOpen: false,
      showEnd: false
    }
  },
  async created() {
    this.showEnd = this.$route.name === 'Home'
  }
}
</script>

<style scoped>

</style>