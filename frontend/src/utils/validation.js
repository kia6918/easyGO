import UsersService from "../../../../backend/frontend/src/api/UsersService";
import { router } from "@/router";
import { avoidDuplicatedNavigation } from "@/utils/helper";
import Vue from "vue";

Vue.use(require('vue-cookies'))
Vue.$cookies.config('1d', '', '', false, 'Strict')

export const verifyAuth = async () => {
    if (Vue.$cookies.isKey('user-token')) {
        await UsersService.getMe().then(async r => {
            await setCookies(r.data)
            if (!r.data.active) {
                return await router.push('/verifyCode')
                    .then(() => Vue.$cookies.remove('reset-password'))
                    .catch(e => avoidDuplicatedNavigation(e))
            }
        }).catch(() => clearCookies())
    } else if (Vue.$cookies.isKey('refresh-token')) {
        await UsersService.refreshToken().then(async res => {
            Vue.$cookies.set('user-token', res.data.token, '30min')
            await verifyAuth()
        })
    }
}

export const setCookies = async (user) => {
    Vue.$cookies.set('authenticated', true, '30min')
    Vue.$cookies.set('user-id', user.id, '30min')
    Vue.$cookies.set('is-business', user.isBusiness, '30min')
    Vue.$cookies.set('user-avatar', user.avatar, '30min')
    Vue.$cookies.set('forgot-password-email', user.email, '30min')
    if (user.isBusiness) Vue.$cookies.set('business-id', user.business.id, '30min')
    else Vue.$cookies.remove('business-id')
}

export const clearCookies = async () => {
    localStorage.clear()
    Vue.$cookies.remove('authenticated')
    Vue.$cookies.remove('user-token')
    Vue.$cookies.remove('refresh-token')
    Vue.$cookies.remove('forgot-password-email')
    Vue.$cookies.remove('is-business')
}

export const saveAuth = async (userToken) => {
    Vue.$cookies.set('authenticated', true, '30min')
    Vue.$cookies.set('refresh-token', userToken.refreshToken, '1d')
    Vue.$cookies.set('user-token', userToken.token, '30min')
    Vue.$cookies.set('user-id', userToken.userId, '30min')
    await verifyAuth()
    if (Vue.$cookies.get('reset-password')) {
        Vue.$cookies.remove('reset-password')
        return router.push('/resetPassword').catch(e => avoidDuplicatedNavigation(e))
    } else return router.push('/').then(async () => window.location.reload()).catch(e => avoidDuplicatedNavigation(e))
}

export const emptyAvatar = "https://imgur.com/uF05hWw.png"