<template>
  <div class="py-4">
    <section>
      <div class="grid w-full xl:grid-cols-12 lg:grid-cols-10 md:grid-cols-9 sm:grid-cols-6">
        <div class="col-span-1 w-24">
          <large-round-image v-if="reviewer" :redirect="redirectLink" :user="reviewer"></large-round-image>
          <rate :editable="editable" v-bind:rateValue="review.rate"/>
        </div>
        <div class="col-span-1"/>
        <div class="text-left py-1 xl:col-span-10 lg:col-span-8 md:col-span-7 sm:col-span-4">
          <a :href="businessRedirect" v-if="showBusinessName" class="font-semibold text-xl">{{ business.name }} -
            {{ business.category }}</a>
          <a :href="redirectLink" v-if="!showBusinessName" class="font-medium text-lg">Author: {{
              reviewer.userName
            }}</a>
          <div class="p-2"></div>
          <read-more class="text-gray-700 whitespace-pre-line" more-str="Read more" :text="review.content" link="#"
                     less-str="Hide" :max-chars="350"></read-more>
          <div v-if="isBusiness && !review.reply && business.id === parseInt($cookies.get('business-id'))"
               class="cursor-pointer py-4 text-sm underline text-gray-500"
               @click="showReplyModal">Reply here
          </div>
          <div v-if="reviewer.id === parseInt($cookies.get('user-id'))" class="cursor-pointer py-4 text-sm underline"
               @click="showUpdateModal">Edit here
          </div>
          <reply v-if="review.reply" :reply-content="review.reply.content"></reply>
        </div>
      </div>
    </section>
    <div class="p-2"></div>
    <hr>
    <div class="p-2"></div>
    <popup-modal :show="replyModal.show" title="Reply">
      <alert-component v-if="replyModal.alertOpen" :type="replyModal.type" :message="replyModal.message"/>
      <text-area v-model="content"/>
      <div class="py-2"></div>
      <action-button :fn="submitReply" :block="false" title="Submit"/>
      <action-button :fn="showReplyModal" :block="false" title="Close"/>
    </popup-modal>
    <popup-modal :show="updateModal.show" title="Edit your review">
      <alert-component v-if="updateModal.alertOpen" :type="updateModal.type" :message="updateModal.message"/>
      <text-area v-model="review.content"/>
      <div class="py-2"></div>
      <action-button :fn="updateReview" :block="false" title="Submit"/>
      <action-button :fn="showUpdateModal" :block="false" title="Close"/>
    </popup-modal>
  </div>
</template>

<script>
import Rate from "@/components/Rate";
import UsersService from "../../../../backend/frontend/src/api/UsersService";
import BusinessService from "@/api/BusinessService";
import LargeRoundImage from "@/components/LargeRoundImage";
import PopupModal from "@/components/PopupModal";
import TextArea from "@/components/TextArea";
import ActionButton from "@/components/ActionButton";
import AlertComponent from "@/components/Alert";
import Reply from "@/components/Reply";
import { openAlert } from "@/utils/helper";

export default {
  name: "ReviewComponent",
  components: {Reply, AlertComponent, ActionButton, TextArea, PopupModal, LargeRoundImage, Rate},
  props: ['review'],
  data() {
    return {
      reviewer: {},
      editable: false,
      redirectLink: '',
      business: {},
      businessRedirect: '',
      showBusinessName: false,
      isBusiness: this.$cookies.get('is-business') === "true",
      content: '',
      reply: {},
      replyModal: {
        alertOpen: false,
        type: '',
        message: '',
        show: false
      },
      updateModal: {
        alertOpen: false,
        type: '',
        message: '',
        show: false
      }
    }
  },
  async created() {
    this.showBusinessName = this.$route.fullPath.includes('profile')
    this.businessRedirect = '/businesses/' + this.review.businessId
    this.redirectLink = "/profile/" + this.review.userId
    await UsersService.getUser(this.review.userId)
        .then(async res => this.reviewer = res.data)
        .catch(e => console.error(e))
    await BusinessService.getBusiness(this.review.businessId)
        .then(async res => {
          this.business = res.data
          if (this.business.category === null) this.business.category = "Not categorized"
        }).catch(e => console.error(e))
  },
  methods: {
    async showReplyModal() {
      this.replyModal.show = !this.replyModal.show;
    },
    async showUpdateModal() {
      this.updateModal.show = !this.updateModal.show;
    },
    async submitReply() {
      await BusinessService.postReplies(this.content, this.business.id, this.review.id)
          .then(async res => {
            this.reply = res.data
            this.replyModal.show = false
            window.location.reload()
          }).catch(e => openAlert(this.replyModal, 'error', e.response.data.error))
    },
    async updateReview() {
      await BusinessService.updateReview(this.review.content, this.business.id, this.review.id)
          .then(async () => this.updateModal.show = false).catch(e => openAlert(this.updateModal, 'error', e.response.data.error))
    }
  }
}
</script>