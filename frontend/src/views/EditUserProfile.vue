<template>
  <div>
    <form-component :alert-open="alertOpen" title="Edit User Info" :type="type" :message="message">
      <div class="p-3" @click="showModal">
        <large-round-image :overlay="true" :key="user.avatar" :user="user" redirect=""></large-round-image>
      </div>
      <div class="p-3"></div>
      <input-component type="text" name="User Name" v-model.trim="user.userName"></input-component>
      <popup-modal :show="show" title="Upload your profile photo">
        <image-uploader
            :preview="true"
            capture="environment"
            :maxWidth="1024"
            :quality="0.7"
            :debug="1"
            :autoRotate="true"
            outputFormat="verbose"
            @input="setImage"
        />
        <div class="p-5"/>
        <action-button :fn="submitImage" :block="false" title="Confirm"></action-button>
        <action-button :fn="showModal" :block="false" title="Close"></action-button>
      </popup-modal>
      <div class="p-3"></div>
      <submit-button title="Submit" :fn="updateInfo"></submit-button>
      <div v-if="user.isBusiness" class="text-gray-700 mt-6 text-sm">
        Update your
        <a class="hover:no-underline underline text-gray-700" href="../business/edit">company info</a>
        here
      </div>
    </form-component>
  </div>
</template>

<script>
import FormComponent from "@/components/Form";
import InputComponent from "@/components/Input";
import SubmitButton from "@/components/SubmitButton";
import ImageUploader from 'vue-image-upload-resize'
import UsersService from "../../../../backend/frontend/src/api/UsersService";
import LargeRoundImage from "@/components/LargeRoundImage";
import PopupModal from "@/components/PopupModal";
import ActionButton from "@/components/ActionButton";
import { openAlert } from "@/utils/helper";

export default {
  name: "EditUserProfile",
  components: {ActionButton, PopupModal, LargeRoundImage, SubmitButton, InputComponent, FormComponent, ImageUploader},
  data() {
    return {
      user: {},
      alertOpen: false,
      type: '',
      message: '',
      show: false,
      tempAvatar: ''
    }
  },
  async created() {
    await UsersService.getMe().then(async res => this.user = res.data).catch(e => console.error(e))
  },
  methods: {
    async updateInfo() {
      UsersService.updateProfile(this.user.email, this.user.userName, this.user.avatar)
          .then(async () => {
            openAlert(this, "success", "Updated successfully.")
          })
          .catch(e => {
            console.error(e)
            openAlert(this, "error", "Updated failed. Your file might be too large.")
          })
    },
    setImage: function (output) {
      this.tempAvatar = output.dataUrl
      openAlert(this, "warn", "Your change will only be saved after you click the submit button.")
    },
    async showModal() {
      this.show = !this.show
    },
    async submitImage() {
      this.user.avatar = this.tempAvatar
      this.show = false
    }
  }
}
</script>