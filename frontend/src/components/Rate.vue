<template>
  <div>
    <div class="text-xl cursor-pointer" v-if="editable">
          <span v-for="(star,i) in stars" :key="i">
      <a v-on:click="assignNumber(i)">
        <span class="text-black" v-if="star">★</span>
      </a>
      <a v-on:click="assignNumber(i)">
        <span class="text-black" v-if="!star">☆</span>
      </a>
    </span>
    </div>

    <div class="text-l cursor-default" v-if="!editable">
      <span v-for="(star,i) in stars" :key="i">
        <a><span class="text-black" v-if="star">★</span></a>
        <a><span class="text-black"  v-if="!star">☆</span></a>
    </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Rate",
  props: ['rateValue', 'editable'],
  data() {
    return {
      stars: [],
      rate: this.rateValue
    }
  },
  async created() {
    if (!this.editable)
      this.rate = this.rateValue
    localStorage.setItem('rate-value', 0)
    await this.assignStar(this.rateValue)
  },
  methods: {
    async assignStar(rate) {
      for (let i = 0; i < 5; i++) {
        this.stars.push(parseInt(rate) > i)
      }
    },
    async assignNumber(i) {
      this.rate = i + 1
      localStorage.setItem('rate-value', this.rate)
      this.stars = []
      await this.assignStar(this.rate)
    }
  }
}
</script>

<style scoped>

</style>