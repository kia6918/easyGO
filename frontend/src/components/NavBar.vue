<template>
  <div id="nav">
    <nav class="relative select-none bg-bs-blue p-3 lg:flex lg:items-stretch w-full">
      <div class="flex flex-no-shrink items-stretch h-12">
        <a href="/"
           class="ml-auto mt-3 font-semibold text-3xl flex-no-grow flex-no-shrink relative p-5 leading-normal text-white no-underline flex items-center">
          EasyGO
        </a>
        <p class="ml-auto mt-3 font-semibold text-m flex-no-grow flex-no-shrink relative p-5 leading-normal text-white flex items-center">- An easier way to go</p>
        <a v-if="showMenu" @click="showMenu = !showMenu"
           class="block xl:hidden lg:hidden cursor-pointer ml-auto relative w-14 h-14 p-3">
          <font-awesome-icon class="text-xl text-gray-300" :icon="['fas', 'times']"></font-awesome-icon>
        </a>
        <a v-if="!showMenu" @click="showMenu = !showMenu"
           class="block xl:hidden lg:hidden cursor-pointer ml-auto relative w-14 h-14 p-3">
          <font-awesome-icon class="text-xl text-gray-300" :icon="['fas', 'ellipsis-v']"></font-awesome-icon>
        </a>
      </div>
      <div v-if="showMenu" class="flex items-stretch flex-no-shrink py-2 flex-grow">
        <div class="flex items-stretch ustify-end ml-auto">
          <a href="/login" v-if="!authenticated"
             class="inline-block  flex-no-grow flex-no-shrink relative py-2 px-4 leading-normal text-white no-underline flex hover:bg-grey-dark">Sign In</a>
          <a @click="logout" v-if="authenticated"
             class="cursor-pointer flex-no-grow flex-no-shrink relative py-2 px-4 leading-normal text-white no-underline flex hover:bg-grey-dark">Sign Out</a>
          <a href="/user/edit" v-if="authenticated"
             class="flex-no-grow flex-no-shrink relative py-2 px-4 leading-normal text-white no-underline flex hover:bg-grey-dark">Edit
            Profile</a>
          <profile-component></profile-component>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import ProfileComponent from "@/components/Profile";
import UsersService from "../../../../backend/frontend/src/api/UsersService";
import { clearCookies } from "@/utils/validation";
import { router } from "@/router";
import { avoidDuplicatedNavigation } from "@/utils/helper";

export default {
  name: "NavBar",
  components: {ProfileComponent},
  data() {
    return {
      authenticated: false,
      isBusiness: false,
      showMenu: true
    }
  },
  async beforeMount() {
    this.authenticated = this.$cookies.get('authenticated') === 'true'
    this.isBusiness = this.$cookies.get('is-business') === 'true'
  },
  methods: {
    async logout() {
      this.authenticated = false
      this.$cookies.remove('authenticated')
      await UsersService.logoutUser().then(async () => {
        await router.push("/").then(async () => await clearCookies()).catch(e => avoidDuplicatedNavigation(e))
      }).catch(e => console.log(e))
    }
  }
}
</script>

<style scoped>

</style>