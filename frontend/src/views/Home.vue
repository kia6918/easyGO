<template>
  <div>
    <div class="h-5"/>
    <form @submit.prevent="onSubmit">
      <search-bar v-model.trim="keyword"/>
    </form>
    <categories :key="openTab" :fn="getBusiness"/>
    <div class="py-10"></div>
    <h2 v-if="$route.query.keyword" class="text-left font-semibold text-2xl">Search Results:</h2>
    <h2 v-else-if="$route.query.type" class="text-left font-semibold text-2xl">Category: {{ $route.query.type }}</h2>
    <h2 v-else class="text-left font-semibold text-2xl">Inspiration</h2>
    <business-list :businesses="businesses"/>
  </div>
</template>

<script>
import SearchBar from "@/components/SearchBar";
import Categories from "@/components/Categories";
import BusinessService from "@/api/BusinessService";
import BusinessList from "@/components/BusinessList";
import { router } from "@/router";
import { avoidDuplicatedNavigation } from "@/utils/helper";

export default {
  name: "Home",
  components: {
    BusinessList,
    Categories,
    SearchBar
  },
  data() {
    return {
      business: false,
      authenticated: false,
      user: {},
      businesses: [],
      keyword: this.$route.query.keyword,
      toProfile: '',
      openTab: -1
    }
  },
  async created() {
    if (!this.$route.query.keyword) await this.getBusiness()
    this.openTab = localStorage.getItem('open-tab')
    if (this.$route.query.keyword) await this.search()
  },
  methods: {
    async search() {
      this.businesses = await BusinessService.searchKeyword(this.$route.query.keyword)
      localStorage.setItem('open-tab', -1)
      this.openTab = -1
    },
    async onSubmit() {
      const path = '/?keyword=' + this.keyword
      await router.push(path).then(async () => {
        await this.search()
        window.location.reload()
      }).catch(e => avoidDuplicatedNavigation(e))
    },
    async getBusiness() {
      if (this.$route.query.type) {
        this.businesses = await BusinessService.getBusinessByType(this.$route.query.type)
      } else {
        localStorage.setItem("open-tab", "-1")
        this.businesses = await BusinessService.getBusinesses()
      }
    }
  }
}
</script>

<style scoped>

</style>