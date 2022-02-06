<template>
  <div>
    <div class="py-6 px-8 flex flex-wrap">
      <business-component v-if="business.id" :business="business"/>
      <div v-if="!isBusiness" class="content-left">
        <a v-if="!inWishlist" class="cursor-pointer underline text-gray-500 text-sm" @click="changeShowModel">Add to wishlist</a>
        <a v-else class="cursor-pointer underline text-gray-500 text-sm" @click="changeDeleteModel">Remove from wishlist</a>
      </div>
    </div>
    <div v-if="showTextArea" class="content-center lg:px-12 xl:px-24">
      <alert-component class="px-2" v-if="alertOpen" :type="type" :message="message"/>
      <rate class="text-right text-5xl" :rate-value="rateValue" :editable="editable"/>
      <text-area v-model="content"/>
      <div class="inline-block">
        <submit-button :not-full="true" title="Submit" :fn="onSubmit"/>
      </div>
      <div class="py-4"></div>
    </div>
    <review-list :number="max" :reviews="reviews"/>
    <popup-modal :show="showModal" title="Do you want to add this business to your wishlist?">
      <action-button :fn="addWishlistItem" :block="false" title="Yes"></action-button>
      <action-button :fn="changeShowModel" :block="false" title="No"></action-button>
    </popup-modal>
    <popup-modal :show="showDeleteModal" title="Do you want to remove this business from your wishlist?">
      <action-button :fn="removeWishListItem" :block="false" title="Yes"></action-button>
      <action-button :fn="changeShowModel" :block="false" title="No"></action-button>
    </popup-modal>
  </div>
</template>

<script>
import BusinessService from "@/api/BusinessService";
import TextArea from "@/components/TextArea";
import SubmitButton from "@/components/SubmitButton";
import ReviewList from "@/components/ReviewList";
import Rate from "@/components/Rate"
import AlertComponent from "@/components/Alert";
import { isNullOrEmpty, openAlert } from "@/utils/helper";
import PopupModal from "@/components/PopupModal";
import ActionButton from "@/components/ActionButton";
import WishlistService from "@/api/WishlistService";
import BusinessComponent from "@/components/Business";

export default {
  name: "BusinessProfile",
  components: {
    BusinessComponent,
    ActionButton,
    PopupModal,
    AlertComponent,
    ReviewList,
    SubmitButton,
    TextArea,
    Rate
  },
  data() {
    return {
      business: {},
      reviews: [],
      content: '',
      rateValue: 0,
      alertOpen: false,
      message: '',
      type: '',
      editable: true,
      max: 2,
      showTextArea: true,
      showModal: false,
      inWishlist: false,
      showDeleteModal: false,
      isBusiness: this.$cookies.get('is-business') === "true"
    }
  },
  async mounted() {
    await this.checkInWishlist()
    if (this.$cookies.get('is-business') === 'true') this.showTextArea = false
    await this.getBusinessById().then(async () => {
      this.reviews = this.business.reviews
      for (const review of this.reviews) {
        if (review.userId === parseInt(this.$cookies.get('user-id'))) this.showTextArea = false
      }
    })
  },
  methods: {
    async changeShowModel() {
      this.showModal = !this.showModal
    },
    async changeDeleteModel() {
      this.showDeleteModal = !this.showDeleteModal
    },
    async getBusinessById() {
      if (this.$route.params.businessId)
        await BusinessService.getBusiness(this.$route.params.businessId)
            .then(async res => this.business = res.data)
            .catch(e => console.error(e))
      else
        await BusinessService.getInfo()
            .then(async res => this.business = res.data)
            .catch(e => console.error(e))
    },
    async addWishlistItem() {
      await WishlistService.addToWishList(this.business.id).then(async res => {
        console.log(res.data)
        this.showModal = false
        this.inWishlist = true
      }).catch(e => console.log(e.response.data))
    },
    async removeWishListItem() {
      await WishlistService.removeFromWishList(this.business.id).then(async res => {
        console.log(res.data.success)
        this.showDeleteModal = false
        this.inWishlist = !res.data.success
      }).catch(e => console.log(e.response.data))
    },
    async checkInWishlist() {
      await WishlistService.checkWishlist(this.$route.params.businessId)
          .then(async res => this.inWishlist = res.data.success)
          .catch(e => console.log(e.response.data))
    },
    async onSubmit() {
      this.rateValue = localStorage.getItem('rate-value')
      if (isNullOrEmpty(this.content)) {
        openAlert(this, "error", "The content of the review cannot be empty.")
      } else if (parseInt(this.rateValue) === 0) {
        openAlert(this, "error", "The rate cannot be empty.")
      } else {
        await BusinessService.postReview(this.content, parseInt(this.rateValue), this.business.id).then(async review => {
          console.log(review)
          window.location.reload()
        })
      }
    }
  }
}
</script>
