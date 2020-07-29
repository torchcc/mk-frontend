<template>
  <div>
    <div class="personal_inner">
      <mt-header title="账户信息">
        <router-link to="/layout/mine" slot="left">
          <mt-button icon="back">返回</mt-button>
        </router-link>
        <mt-button slot="right" @click="$router.push({name:'examList'})">
          <van-icon name="wap-home-o" />
        </mt-button>
      </mt-header>

      <div class="boxs headImg" @click="reviseProfile('修改头像','head')">
        <p class="labels">头像</p>
        <div class="img_box">
          <img :src="userInfo.avatar_url" alt />
          <p>
            <van-icon name="arrow" size="30" />
          </p>
        </div>
      </div>
      <div class="boxs userName">
        <van-cell title="昵称" size="large" @click="reviseProfile('设置昵称','name',value)">
          <span style="margin-right: 10px; font-size: 16px;">{{userInfo.user_name}}</span>
          <van-icon name="arrow" size="10" />
        </van-cell>
        <van-cell title="性别" size="large">
          <!--                    <span style="margin-right: 10px; font-size: 16px;">未设置</span>-->
          <van-field
            readonly
            clickable
            :value="value"
            placeholder="选择性别  "
            @click="showPicker = true"
            style="width: 100%;"
          >
            <!--                        <van-icon name="arrow" size="10" />-->
          </van-field>
          <van-popup v-model="showPicker" round position="bottom">
            <van-picker
              show-toolbar
              :columns="columns"
              @cancel="showPicker = false"
              @confirm="genderConfirm"
            />
          </van-popup>
        </van-cell>
      </div>
      <div class="boxs addr">
        <van-cell title="手机号" size="large" @click="reviseProfile('修改手机号','tel')">
          <span style="margin-right: 10px; font-size: 16px;">{{userInfo.mobile}}</span>
          <van-icon name="arrow" size="10" />
        </van-cell>
        <van-cell title="收件地址" size="large" @click="reviseProfile('收件地址','addr')">
          <span style="margin-right: 10px; font-size: 16px;">修改</span>
          <van-icon name="arrow" size="10" />
        </van-cell>
      </div>
      <div class="boxs pwd">
        <van-cell title="登陆密码" size="large" @click="reviseProfile('修改密码','pwd')">
          <span style="margin-right: 10px; font-size: 16px;">修改</span>
          <van-icon name="arrow" size="10" />
        </van-cell>
      </div>
    </div>
  </div>
</template>

<script>
import { profileInfo, profile } from "@/api/exam";
import { Toast } from "vant";
export default {
  name: "personalInfo",
  data() {
    return {
      value: "",
      showPicker: false,
      userInfo: {},
      columns: ["男", "女"]
    };
  },
  async created() {
    const res = await profile();
    this.userInfo = res.data;
    this.userInfo.gender == "1" ? (this.value = "男") : (this.value = "女");
  },
  methods: {
    reviseProfile(type, name, value) {
      this.$router.push({
        name: "personal",
        query: {
          type: type,
          name: name,
          value: value
        }
      });
    },
    async genderConfirm(picker, value) {
      this.value = picker;
      const data = {
        gender: value,
        update_time: 0,
        user_id: 0,
        user_name: this.userInfo.user_name
      };
      const res = await profileInfo(data);
      console.log(res);
      if (res.ecode == 0) {
        this.showPicker = false;
        Toast("性别修改成功");
      }
    },
    onConfirm(value) {
      this.value = value;
      this.showPicker = false;
    }
  }
};
</script>

<style lang="scss" scope>
.personal_inner {
  height: 100vh;
  background-color: #f5f5f5;
  .boxs {
    margin-top: 14px;
  }
  .headImg {
    width: auto;
    display: flex;
    min-height: 5em;
    padding: 10px 20px;
    justify-content: space-between;
    background-color: #fff;
    .labels {
      display: inline-block;
      font-size: 16px;
      line-height: 5em;
    }
    .img_box {
      display: flex;
      justify-content: flex-start;
      img {
        margin-right: 10px;
        margin-top: 10px;
      }
      p {
        line-height: 5em;
      }
    }
    img {
      width: 60px;
      height: 60px;
      display: inline-block;
      border-radius: 50%;
      background-color: pink;
    }
  }

  .userName {
    .van-field__control {
      text-align: right;
    }
  }
}
</style>
