<template>
  <div>
    <div class="flex flex-wrap content-left px-6">
      <h2 class="font-semibold text-xl">Wishlist - {{ businesses.length }}</h2>
    </div>
    <div class="py-4 px-8">
      <business-list v-if="businesses" :max-items="3" :businesses="businesses"/>
    </div>
  </div>
</template>

<script>
import BusinessList from "@/components/BusinessList";
import WishlistService from "@/api/WishlistService";

export default {
  name: "WishlistItems",
  components: {BusinessList},
  data() {
    return {
      businesses: []
    }
  },
  async mounted() {
    this.businesses = await WishlistService.getWishlists()
  }
}
</script>

<style scoped>

</style>