<template>
  <div>
    <div class="flex flex-wrap content-start px-6">
      <h2 class="py-4 font-semibold text-xl">Review - {{ reviews.length }}</h2>
    </div>
    <div class="w-full block flex-wrap py-4 px-8">
      <div v-for="(review,i) in reviews" :key="i">
        <div v-if="review">
          <review-component v-if="showReviews[i]" :review="review"></review-component>
        </div>
      </div>
      <a v-if="showLoadMore" class="cursor-pointer" @click="loadMore">
        <font-awesome-icon class="text-2xl" :icon="['fas', 'angle-double-down']"></font-awesome-icon>
      </a>
      <a v-if="showLoadLess" class="cursor-pointer" @click="loadLess">
        <font-awesome-icon class="text-2xl" :icon="['fas', 'angle-double-up']"></font-awesome-icon>
      </a>
    </div>
  </div>
</template>

<script>
import ReviewComponent from "@/components/Review";

export default {
  name: "ReviewList",
  components: {ReviewComponent},
  props: ['reviews', 'noMax'],
  data() {
    return {
      showReviews: [],
      updateResult: true,
      max: 3,
      number: 3,
      showLoadMore: true,
      showLoadLess: false
    }
  },
  async updated() {
    if (this.updateResult && this.reviews) {
      if (!this.noMax) this.max = this.reviews.length
      this.number = this.max
      await this.assignArray().then(async () => this.updateResult = false)
      if (this.reviews.length <= this.max || this.reviews.length === 0) {
        this.showLoadMore = false
        this.showLoadLess = false
      }
    }
  },
  methods: {
    async assignArray() {
      this.showReviews = []
      for (const i in this.reviews) {
        this.showReviews.push(parseInt(i) < parseInt(this.number))
      }
    },
    async loadMore() {
      this.number = this.reviews.length
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

<style scoped>

</style>