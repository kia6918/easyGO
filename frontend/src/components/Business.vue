<template>
  <section v-if="business.id" class="py-4">
    <div class="grid w-full xl:grid-cols-12 lg:grid-cols-10 md:grid-cols-9 sm:grid-cols-6">
      <div class="col-span-1 w-24">
        <div @click="updateClick">
          <large-round-image :redirect="redirectLink" :user="this.business.user"/>
        </div>
        <rate :key="business.rate" :editable="editable" :rateValue="business.rate"/>
      </div>
      <div class="col-span-1"/>
      <div class="text-left py-1 xl:col-span-10 lg:col-span-8 md:col-span-7 sm:col-span-4">
        <div @click="updateClick">
          <router-link :to="redirectLink">
            <a class="text-base font-semibold">{{ business.name }}</a>
          </router-link>
        </div>
        <p class="text-sm italic">{{ business.category }}</p>
        <p class="text-sm text-gray-600">{{ business.description }}</p>
        <a class="text-sm no-underline" :href="website"><p class="text-gray-600">{{ business.website }}</p></a>
        <p class="text-sm text-gray-600"
           v-if="business.address && business.city && business.province && business.country">
          {{ business.address }}, {{ business.city }}, {{ business.province }}, {{ business.country }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import Rate from "@/components/Rate";
import BusinessService from "@/api/BusinessService";
import LargeRoundImage from "@/components/LargeRoundImage";

export default {
  name: "BusinessComponent",
  components: {LargeRoundImage, Rate},
  props: ['business'],
  data() {
    return {
      redirectLink: "/",
      editable: false,
      rateValue: 0,
      website: ''
    }
  },
  async created() {
    if (this.business.id) {
      if (this.business && this.business.website && !this.business.website.includes("http"))
        this.website = "https://" + this.business.website
      else this.website = this.business.website
      this.redirectLink = "/businesses/" + this.business.id
    }
  },
  methods: {
    async updateClick() {
      await BusinessService.updateClickTrack(this.business.id)
          .then(async res => console.log(res.data))
          .catch(e => console.error(e))
    }
  }
}
</script>

<style scoped>

</style>