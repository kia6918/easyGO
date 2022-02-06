<template>
  <div class="flex flex-wrap">
    <div>
      <round-image class="w-full" :user="user" :redirect="redirectLink"/>
    </div>
  </div>
</template>

<script>
import RoundImage from "@/components/RoundImage";
import UsersService from "../../../../backend/frontend/src/api/UsersService";

export default {
  name: "ProfileComponent",
  components: {RoundImage},
  data() {
    return {
      redirectLink: '',
      user: {}
    }
  },
  async created() {
    if (this.$cookies.get('authenticated') === "true") {
      await UsersService.getMe().then(async r => {
        this.user = r.data
        if (!this.user.isBusiness)
          this.redirectLink = "/profile/" + this.user.id
        else
          this.redirectLink = "/businesses/" + this.user.business.id
      }).catch(() => this.redirectLink = "/login")
    } else {
      this.user.id = 0
      this.user.avatar = null
    }
  }
}
</script>

<style scoped>

</style>