import { BASE_URL } from "@/utils/config";
import Vue from "vue";
import axios from "axios";

const instance = axios.create({
    baseURL: BASE_URL + '/wishlist',
    timeout: 5000
})

class WishlistService {
    static getWishlists(token = Vue.$cookies.get('user-token')) {
        return new Promise((resolve, reject) => {
            try {
                instance.get('/', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }).then(res => {
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

    static addToWishList(businessId, token = Vue.$cookies.get('user-token')) {
        return instance.post('/', {
            businessId
        }, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
    }

    static removeFromWishList(businessId, token = Vue.$cookies.get('user-token')) {
        return instance.delete('/' + businessId, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
    }

    static checkWishlist(businessId, token = Vue.$cookies.get('user-token')) {
        return instance.get('/' + businessId, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
    }
}

export default WishlistService;