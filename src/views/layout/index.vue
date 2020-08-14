<template>
  <!--    内容区域-->
  <div>
    <div>
      <router-view v-if="$store.state.auth=='true'" />
      <div class="mustBottom"></div>
    </div>
    <mt-tabbar fixed v-model="selected">
      <!--<mt-tab-item id="mine"  @click.native="routerChange('hospital')">
                <van-icon name="manager-o" class="layout_icon"/>
                医院
      </mt-tab-item>-->
      <mt-tab-item id="examList" @click.native="routerChange('examList')">
        <!--                <img slot="icon">-->
        <van-icon name="chat-o" class="layout_icon" />体检套餐
      </mt-tab-item>
      <mt-tab-item id="shopCart" @click.native="routerChange('shopCart')">
        <van-icon name="shopping-cart-o" class="layout_icon" />购物车
      </mt-tab-item>
      <mt-tab-item id="mine" @click.native="routerChange('mine')">
        <van-icon name="manager-o" class="layout_icon" />个人中心
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
export default {
  name: "Layout",
  data() {
    return {
      selected: "examList"
    };
  },
  methods: {
    routerChange(name) {
      this.$router.push({ name });
    }
  },
  async created() {
    this.selected = this.$route.name;
  },
  watch: {
    $route: {
      handler(val, oldval) {
        this.selected = val.name
      },
      // 深度观察监听
      deep: true
    }
  }
};
</script>

<style lang="scss">
.mustBottom {
  height: 55px;
}
.layout_icon {
  display: block;
  margin-bottom: 6px;
  font-size: 24px;
}
</style>
