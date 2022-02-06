<template>
  <div>
    <form-component title="Reset your password" :type="type" :message="message" :alert-open="alertOpen">
      <input-component
          type="password"
          name="Password"
           v-model.trim="password"/>
      <input-component
          type="password"
          name="Confirm your password"
           v-model.trim="password2"/>
      <submit-button v-bind:fn="reset" title="Submit"></submit-button>
    </form-component>
  </div>
</template>

<script>
import FormComponent from "@/components/Form";
import InputComponent from "@/components/Input";
import SubmitButton from "@/components/SubmitButton";
import UsersService from "../../../../backend/frontend/src/api/UsersService";
import { avoidDuplicatedNavigation, isNullOrEmpty, openAlert } from "@/utils/helper";
import { router } from "@/router";

export default {
  name: "ResetPassword",
  components: {SubmitButton, InputComponent, FormComponent},
  data() {
    return {
      alertOpen: false,
      type: '',
      message: '',
      password: '',
      password2: ''
    }
  },
  methods: {
    async reset() {
      if (isNullOrEmpty(this.password)) {
        openAlert(this, "error", "Please enter the password.")
      } else if (this.password !== this.password2) {
        openAlert(this, "error", "Password is not matching.")
      } else {
        await UsersService.updatePassword(this.password).then(async () => {
          openAlert(this, "success", "Updated successfully.")
          await router.push("/").then(async() => window.location.reload()).catch(e => avoidDuplicatedNavigation(e))
        })
      }
    }
  }
}
</script>

<style scoped>

</style>