<template>
  <div class="py-12">
    <div v-for="(business,i) in businesses" :key="i" class="flex">
      <div v-if="business">
        <business-component v-if="showBusiness[i]" :business="business"/>
      </div>
    </div>
    <a v-if="showLoadMore" class="cursor-pointer" @click="loadMore">
      <font-awesome-icon class="text-2xl" :icon="['fas', 'angle-double-down']"></font-awesome-icon>
    </a>
    <a v-if="showLoadLess" class="cursor-pointer" @click="loadLess">
      <font-awesome-icon class="text-2xl" :icon="['fas', 'angle-double-up']"></font-awesome-icon>
    </a>
  </div>
</template>

<script>

import BusinessComponent from "@/components/Business";

export default {
  name: "BusinessList",
  components: {BusinessComponent},
  props: ['businesses', 'maxItems'],
  data() {
    return {
      showBusiness: [],
      updateResult: true,
      number: 10,
      max: 10,
      showLoadMore: true,
      showLoadLess: false
    }
  },
  async updated() {
    if (this.updateResult && (this.businesses === [] || this.businesses.length > 0)) {
      if (!this.maxItems) this.max = this.businesses.length
      else this.max = parseInt(this.maxItems)
      this.number = this.max
      await this.assignArray().then(async () => this.updateResult = false)
      if (this.businesses.length <= this.max || this.businesses === []) {
        this.showLoadMore = false
        this.showLoadLess = false
      }
    }
  },
  methods: {
    async assignArray() {
      this.showBusiness = []
      for (const i in this.businesses) {
        this.showBusiness.push(parseInt(i) < parseInt(this.number))
      }
      window.scrollTo(0, 0)
    },
    async loadMore() {
      this.number = this.businesses.length
      this.showLoadMore = false
      this.showLoadLess = true
      await this.assignArray()
    },
    async loadLess() {
      this.number = this.max
      this.showLoadMore = true
      this.showLoadLess = false
      await this.assignArray()
    }
  }
}
</script>