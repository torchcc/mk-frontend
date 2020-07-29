<template>
  <div id="app">
    <router-view />
  </div>
</template>


<script>
import { GetQueryString } from "@/utils/getQuery";
import { enter, enterUrl,location } from "@/api/wx";

export default {
  async created() {
    if (this.$store.state.auth == "true") {
      setTimeout(() => {
      if (window.localStorage.getItem("token")) {
        var location_lon = "";
        var location_lat = "";
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const obj = {
                "latitude": position.coords.latitude,
                "longitude": position.coords.longitude
              }
            const res = await location(obj)
          });
        }
      }
    }, 0);
    return;
    }
    if (!GetQueryString("code")) {
      const res = await enterUrl();
      window.location.href =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5e628e27370137da&redirect_uri=https%3A%2F%2Fwww.mkhealth.club%2F%23%2Flayout%2FexamList&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect";
    } else {
      const res = await enter({ code: GetQueryString("code") });
      window.localStorage.setItem("token", res.data.token);
      if(res.data.mobile_verified){
        localStorage.setItem('userToken',res.data.token)
      }
      window.localStorage.setItem("auth", true);
      this.$store.commit("setAuth");
    }
    
  }
};
</script>


<style lang="scss">
#app {
  min-height: 100vh;
}
* {
  margin: 0;
  padding: 0;
}
</style>
