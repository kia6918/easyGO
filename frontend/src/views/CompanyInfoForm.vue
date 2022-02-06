<template>
  <div>
    <form-component :alert-open="alertOpen" title="Edit Company Info" :type="type" :message="message">
      <input-component type="text" name="Company Name" v-model.trim="business.name"></input-component>
      <dropdown-component class="h-6" v-model.trim="business.category" :options="categories"
                          placeholder="Please select your category"></dropdown-component>
      <div class="p-2"></div>
      <input-component type="text" name="Description" v-model="business.description"></input-component>
      <input-component type="text" name="Website" v-model.trim="business.website"></input-component>
      <input-component type="text" name="Country" v-model.trim="business.country"></input-component>
      <input-component type="text" name="Province" v-model.trim="business.province"></input-component>
      <input-component type="text" name="City" v-model="business.city"></input-component>
      <input-component type="text" name="Address" v-model="business.address"></input-component>
      <submit-button title="Submit" :fn="updateInfo"></submit-button>
    </form-component>
  </div>
</template>

<script>
import FormComponent from "@/components/Form";
import InputComponent from "@/components/Input";
import DropdownComponent from "@/components/Dropdown";
import CategoriesService from "@/api/CategoriesService";
import SubmitButton from "@/components/SubmitButton";
import BusinessService from "@/api/BusinessService";
import { openAlert } from "@/utils/helper";
import {scroller} from 'vue-scrollto/src/scrollTo';
const scrollTo = scroller()

export default {
  name: "CompanyInfoForm",
  components: {SubmitButton, DropdownComponent, InputComponent, FormComponent},
  data() {
    return {
      alertOpen: false,
      message: '',
      categories: [],
      type: 'error',
      business: {
        name: '',
        category: '',
        website: '',
        description: '',
        country: '',
        province: '',
        city: '',
        address: ''
      }
    }
  },
  async created() {
    await this.getCategories()
    await this.getInfo()
  },
  methods: {
    async getCategories() {
      this.categories = await CategoriesService.getCategories()
    },
    async updateInfo() {
      this.alertOpen = false
      await BusinessService.updateInfo(this.business).then(async () => {
        openAlert(this, "success", "Updated successfully")
        scrollTo("#app")
      }).catch(e => {
        openAlert(this, "error", "Update failed.")
        console.error(e)
      })
    },
    async getInfo() {
      await BusinessService.getInfo().then(async res => this.business = res.data)
    }
  }
}
</script>

<style scoped>

</style>