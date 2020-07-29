<template>
  <div>
    <mt-header title="用户登录_迈康体检网">
      <router-link to="/login" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button slot="right" @click="$router.push({name:'examList'})">
        <van-icon name="wap-home-o" />
      </mt-button>
    </mt-header>
    <div class="login_inner">
      <div class="form">
        <van-cell-group>
          <van-field
            v-model="telephone"
            left-icon="friends"
            right-icon="warning-o"
            class="ipt"
            placeholder="请输入手机号，未注册将会自动注册"
          />
          <van-field
            v-model="verifyImg"
            clearable
            left-icon="eye"
            class="ipt"
            style="position:relative;"
            placeholder="请输入密码"
          />
        </van-cell-group>
        <van-button type="info" class="btn">登 陆</van-button>
        <div class="other">
          <p>
            <i>
              <van-checkbox v-model="checked" class="checked"></van-checkbox>
            </i>下次自动登陆
          </p>
          <p @click="changeToTel('login')">手机号码登陆 ></p>
        </div>
        <div class="other">
          <p style="color: #3f9efa; ">新用户登陆</p>
          <p @click="forgot('forgotPwd')">忘记密码 ></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "passwordLogin",
  data() {
    return {
      checked: true,
      verifyImg: "",
      telephone: ""
    };
  },
  methods: {
    changeToTel(name) {
      this.$router.push({ name });
    },
    forgot(name) {
      this.$router.push({ name });
    }
  }
};
</script>

<style lang="scss">
.login_inner {
  padding: 30px;
  .form {
    margin-top: 20px;
    .ipt {
      line-height: 40px;
      border-bottom: 1px solid #c0c0c0;
    }
    .van-icon-eye::before {
      content: "\F055";
      color: #c0c0c0;
    }
    .van-icon-friends::before {
      content: "\F05F";
      color: #c0c0c0;
    }
    .btn {
      width: 100%;
      border-radius: 20px;
      margin-top: 50px;
      font-size: 18px;
    }
    .other {
      margin-top: 20px;
      display: flex;
      font-size: 14px;
      color: #c0c0c0;
      justify-content: space-between;
      .checked {
        display: inline-block;
        .van-checkbox__icon {
          height: 14px;
          line-height: 14px;
          margin-right: 6px;
        }
        .van-checkbox__icon .van-icon {
          width: 14px;
          height: 14px;
          line-height: 12px;
        }
      }
    }
  }
}
</style>
