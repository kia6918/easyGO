import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/views/Home"
import LoginUser from "@/views/LoginUser"
import RegisterUser from "@/views/RegisterUser";
import ForgotPassword from "@/views/ForgotPassword";
import BusinessProfile from "@/views/BusinessProfile";
import UserProfile from "@/views/UserProfile";
import CompanyInfoForm from "@/views/CompanyInfoForm";

import { verifyAuth } from "@/utils/validation";
import ResetPassword from "@/views/ResetPassword";
import VerifyCode from "@/views/VerifyCode";
import EditUserProfile from "@/views/EditUserProfile";
import PageNotFound from "@/components/PageNotFound";

Vue.use(VueRouter)
Vue.use(require('vue-cookies'))

function requireAuth(to, from, next) {
    verifyAuth().then(async () => {
        if (!Vue.$cookies.isKey('authenticated')) {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        } else {
            next()
        }
    })
}

function requireBusiness(to, from, next) {
    requireAuth(to, from, next);
    if (!Vue.$cookies.isKey('is-business')) {
        next({
            path: '/not-found'
        })
    } else {
        next()
    }
}

export const router = new VueRouter({
    mode: 'history',
    base: '',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/categories',
            name: 'Sub Home',
            component: Home
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginUser
        },
        {
            path: '/signup',
            name: 'Sign Up',
            component: RegisterUser
        },
        {
            path: '/forgotPassword',
            name: 'Forgot Password',
            component: ForgotPassword
        },
        {
            path: '/profile/:userId',
            name: "User's Profile",
            component: UserProfile,
            beforeEnter: requireAuth
        },
        {
            path: '/user/edit',
            name: 'Edit User Profile',
            component: EditUserProfile,
            beforeEnter: requireAuth
        },
        {
            path: '/business/edit',
            name: 'Edit Business Profile',
            component: CompanyInfoForm,
            beforeEnter: requireBusiness
        },
        {
            path: '/businesses/:businessId',
            name: 'Business Info',
            component: BusinessProfile,
            beforeEnter: requireAuth
        },
        {
            path: '/resetPassword',
            name: 'Reset Password',
            component: ResetPassword,
            beforeEnter: requireAuth
        },
        {
            path: '/verifyCode',
            name: 'Verify Code',
            component: VerifyCode
        },
        {
            path: "*",
            component: PageNotFound
        }
    ]
})

