import { BASE_URL } from "@/utils/config";
import Vue from 'vue';
import axios from "axios";

const instance = axios.create({
    baseURL: BASE_URL + '/business',
    timeout: 5000
})

Vue.use(require('vue-cookies'))

class BusinessService {
    static getBusinesses() {
        return new Promise((resolve, reject) => {
            try {
                instance.get('/').then(res => {
                    const data = res.data
                    resolve(
                        data.map(businesses => ({
                            ...businesses
                        }))
                    )
                })
            } catch (err) {
                reject(err)
            }
        })
    }

    static getBusinessByType(type) {
        return new Promise((resolve, reject) => {
            try {
                instance.get('/categories/' + type).then(res => {
                    const data = res.data
                    resolve(
                        data.map(businesses => ({
                            ...businesses
                        }))
                    )
                })
            } catch (err) {
                reject(err)
            }
        })
    }

    static getInfo(token = Vue.$cookies.get('user-token')) {
        return instance.get('/info', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
    }

    static getBusiness(id, token = Vue.$cookies.get('user-token')) {
        return instance.get('/info?id=' + id, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
    }

    static getBusinessByUserId(userId, token = Vue.$cookies.get('user-token')) {
        return instance.get('/info?userId=' + userId, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
    }

    static updateInfo(body, token = Vue.$cookies.get('user-token')) {
        return instance.put('/info', body, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
    }

    static updateClickTrack(businessId) {
        return instance.put('/' + businessId + '/click', {})
    }

    static searchKeyword(keyword) {
        return new Promise((resolve, reject) => {
            try {
                instance.get('/search?keyword=' + keyword).then(res => {
                    const data = res.data
                    resolve(
                        data.map(businesses => ({
                            ...businesses
                        }))
                    )
                })
            } catch (err) {
                reject(err)
            }
        })
    }

    static postReview(content, rate, businessId, token = Vue.$cookies.get('user-token')) {
        return instance.post(businessId + '/reviews', {
            content,
            rate
        }, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
    }

    static updateReview(content, businessId, reviewId, token = Vue.$cookies.get('user-token')) {
        return instance.put(businessId + '/reviews/' + reviewId, {
            content
        }, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
    }

    static postReplies(content, businessId, reviewId, token = Vue.$cookies.get('user-token')) {
        return instance.post(businessId + '/reviews/' + reviewId + '/replies', {
            content,
            reviewId
        }, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
    }

}

export default BusinessService;