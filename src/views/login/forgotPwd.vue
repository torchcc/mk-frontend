<template>
  <div>
    <mt-header title="用户登录_迈康体检网">
      <router-link to="/layout/mine" slot="left">
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
            v-model="captcha"
            clearable
            left-icon="checked"
            class="ipt"
            style="position:relative;"
            placeholder="请输入图形验证码"
          >
            <template #extra>
              <!-- <van-button size="small" type="primary">发送验证码</van-button> -->
              <img :src="imgUrl" width="80px" height="40px" @click="changeImg" />
            </template>
          </van-field>
          <van-field
            v-model="text"
            clearable
            left-icon="comment-circle"
            class="ipt"
            style="position:relative;"
            placeholder="请输入验证码"
          />
          <van-button type="info" size="small" class="miniBtn" @click="msgCode">获取验证码</van-button>
        </van-cell-group>

        <van-button type="info" class="btn">下一步</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { loginRegister, captcha, sms } from "@/api/exam";
export default {
  name: "forgotPwd",
  data() {
    return {
      telephone: "",
      Img: "",
      text: "",
      captcha: "",
      verifyImg: "",
      verifyText: "",
      imgUrl: "",
      countDown:false, //f-获取验证码 t-倒计时
    };
  },
  async created() {
    this.getCaptcha();
  },
  methods: {
    async msgCode() {
      if (this.telephone == "" || this.captcha == "") {
        Toast.fail("请填写手机号和图形验证码！");
        return false;
      } else {
        this.countDown = true;
        this.getCode();
      }
    },
     async getCode(){
                const TIME_COUNT = 60;
                if (!this.timer) {
                    this.sec = TIME_COUNT;
                    const obj = {
                        mobile: this.telephone,
                        captcha_code:this.captcha
                    };
                    sms(obj)
                    this.timer = setInterval(() => {
                        if (this.sec > 0 && this.sec <= TIME_COUNT) {
                            this.sec--;
                        } else {
                            this.countDown = false;
                            clearInterval(this.timer);
                            this.timer = null;
                        }
                    }, 1000)
                }
            },
    async getCaptcha() {
      const res = await captcha();
      this.imgUrl = res.data.captcha_img_url;
    },
    changeImg() {
      //点击后替换新的验证码图片
      this.getCaptcha();
    },
    changeMode(name) {
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
    .captcha {
      position: absolute;
      right: 0;
      top: 68px;
      width: 88%;
      img {
        width: 100px;
        height: 40px;
      }
    }
  }
  .miniBtn {
    border-radius: 20px;
    font-size: 12px;
    padding: 0 12px;
    position: absolute;
    bottom: 14px;
    right: 0px;
  }
  .btn {
    width: 100%;
    border-radius: 20px;
    margin-top: 50px;
  }
  .other {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    p {
      font-size: 12px;
      color: #c0c0c0;
    }
  }
  .van-icon-friends::before {
    content: "\F05F";
    color: #c0c0c0;
  }
  .van-icon-checked::before {
    content: "\F02F";
    color: #c0c0c0;
  }
  .van-icon-comment-circle::before {
    content: "\F03A";
    color: #c0c0c0;
  }
  .ipt {
    line-height: 40px;
    border-bottom: 1px solid #c0c0c0;
  }
}
</style>
