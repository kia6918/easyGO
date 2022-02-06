<template>
  <form-component :alert-open="alertOpen" :type="type" :message="message" title="Forgot Password">
    <input-component
        type="email"
        name="Email"
         v-model.trim="email"/>
    <submit-button type="submit" title="Submit" :fn="forgot"/>
    <div class="text-gray-700 mt-6 text-sm">
      Remember the password now?
      <a class="hover:no-underline underline text-gray-700" href="../login">
        Login here
      </a>.
    </div>
  </form-component>
</template>

<script>

import InputComponent from "@/components/Input";
import FormComponent from "@/components/Form";
import SubmitButton from "@/components/SubmitButton";
import UsersService from "../../../../backend/frontend/src/api/UsersService";
import { avoidDuplicatedNavigation, openAlert } from "@/utils/helper";
import { router } from "@/router";

export default {
  name: 'ForgotPassword',
  components: {SubmitButton, FormComponent, InputComponent},
  data() {
    return {
      email: '',
      type: '',
      message: '',
      alertOpen: false
    }
  },
  methods: {
    async forgot() {
      await UsersService.forgotPassword(this.email).then(async () => {
        openAlert(this, "success", "Check your email for verification code.")
        this.$cookies.set('reset-password', true, '30min')
        this.$cookies.set('forgot-password-email', this.email,'30min')
        await router.push('/verifyCode').catch(e => avoidDuplicatedNavigation(e))
      }).catch(e => {
        openAlert(this, "error", e.response.data.error.toString())
      })
    }
  }
}
</script>