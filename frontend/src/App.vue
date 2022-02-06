<template>
  <div>
    <cookie-banner :fn="enableCookie" v-if="!cookie"/>
    <div id="app">
      <div>
        <div class="px-12"/>
        <nav-bar/>
        <div>
          <router-view class="p-6"/>
        </div>
      </div>
      <footer-component/>
    </div>
  </div>
</template>

<script>
import FooterComponent from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import NavBar from "@/components/NavBar";

export default {
  name: 'App',
  components: {NavBar, CookieBanner, FooterComponent},
  data() {
    return {
      cookie: this.$cookies.get("acceptCookie")
    }
  },
  methods: {
    async enableCookie() {
      if (navigator.cookieEnabled)
        this.$cookies.set("acceptCookie", true, Infinity)
      this.cookie = true
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: indianred;
}

a {
  box-sizing: border-box;
  border-width: 0;
}

#readmore {
  color: palevioletred;
  text-decoration: underline;
}

html {
  background: #f3f3f3;
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}

h1, h2, h3, h4 {
  color: indianred;
}

button {
  border: none;
  outline: none;
}

textarea {
  overflow: auto;
  margin: 10px;
}

.bg-bs-blue {
  background-color: #e07272;
}

button:hover {
  background-color: indianred;
}

.text-bs-blue {
  color: indianred;
}

</style>