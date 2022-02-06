<template>
  <div>
    <form-component :alert-open="alertOpen" title="Edit Company Info" :type="type" :message="message">
      <div @click="openFilePicker" class="p-3">
        <large-round-image :key="user.avatar" :user="user" redirect=""></large-round-image>
      </div>
      <input-component type="text" name="User name" v-model.trim="user.userName"></input-component>
      <submit-button title="Submit" :fn="updateInfo"></submit-button>
    </form-component>
  </div>
</template>

<script>
import FormComponent from "@/components/Form";
import InputComponent from "@/components/Input";
import SubmitButton from "@/components/SubmitButton";
import * as filestack from 'filestack-js';
import UsersService from "../../../../backend/frontend/src/api/UsersService";
import LargeRoundImage from "@/components/LargeRoundImage";

const client = filestack.init("AbwNkleZZTQaydgi7rFcQz");

export default {
  name: "EditProfile",
  components: {LargeRoundImage, SubmitButton, InputComponent, FormComponent},
  data() {
    return {
      user: {},
      alertOpen: false,
      type: '',
      message: ''
    }
  },
  async created() {
    await UsersService.getMe().then(async res => this.user = res.data).catch(e => console.error(e))
    const base64data = btoa(this.user.avatar)
    console.log(base64data);
    this.user.avatar = 'data:image/jpeg;base64,' + base64data;
  },
  methods: {
    async updateInfo() {
      UsersService.updateProfile(this.user.email, this.user.userName, this.user.avatar).then(async res => {
        console.log(res)
      }).catch(e => console.error(e))
    },
    async openFilePicker() {
      const options = {
        fromSources: ["local_file_system", "instagram", "facebook"],
        accept: ["image/*"],
        maxSize: 10 * 1024 * 1024,
        maxFiles: 1,
        onUploadDone: this.getFileUri
      }
      await client.picker(options).open()
    }
  },
  async getFileUri(result) {
    const fileData = result.filesUploaded[0]
    this.user.avatar = fileData.url
  }
}
</script>

<style scoped>

</style>