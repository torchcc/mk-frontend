<template>
  <div class="mine_body">
    <mt-header style="background: #fff; color: #000; " title="个人中心"></mt-header>
    <!--    个人信息-->
    <div class="mine_login">
      <!--        已登陆 //待调用接口后判断展示哪个-->
      <div class="logined" v-if="!unLogin">
        <div @click="goToPersonalInfo" class="login_box">
          <img alt :src="user.avatar_url" />
          <p>{{user.user_name||"未登录"}}</p>
          <p style="right: 0; ">
            <van-icon name="arrow" size="30" />
          </p>
        </div>
      </div>
      <!--  未登录-->
      <div class="unLogin" v-if="unLogin">
        <p>欢迎登陆迈康体检网</p>
        <van-button @click="login('login')" class="logBtn" type="info">登陆/注册</van-button>
      </div>
    </div>

    <div class="mine_inner">
      <!--    我的订单-->
      <div class="mine_card">
        <div class="top">
          <div class="left">
            <i>|</i>
            我的订单
          </div>
          <div @click="goToDetail(1)" class="right">全部订单 ></div>
        </div>
        <div class="bottom">
          <van-row gutter="24">
            <van-col @click="goToDetail(0)" class="mine_item" span="6">
              <van-icon class="mine_icons" name="balance-o" />
              <p>待付款</p>
            </van-col>
            <van-col @click="goToDetail(2)" class="mine_item" span="6">
              <van-icon class="mine_icons" name="orders-o" />
              <p>待预约</p>
            </van-col>
            <van-col @click="goToDetail(5)" class="mine_item" span="6">
              <van-icon class="mine_icons" name="comment" />
              <p>已完成</p>
            </van-col>
            <van-col @click="goToDetail(3)" class="mine_item" span="6">
              <van-icon class="mine_icons" name="comment" />
              <p>已退款</p>
            </van-col>
          </van-row>
        </div>
      </div>

      <!--    我的资产-->
      <div class="mine_card">
        <div class="top">
          <div class="left">
            <i>|</i>
            我的资产
          </div>
        </div>
        <div class="bottom">
          <van-row gutter="24">
            <van-col @click="goToContact" class="mine_item" span="6">
              <van-icon class="mine_icons" name="column" />
              <p>常用体检人</p>
            </van-col>
            <van-col class="mine_item" span="6">
              <van-icon class="mine_icons" name="todo-list" />
              <p>体检报告</p>
            </van-col>
          </van-row>
        </div>
      </div>

      <!--    我的记录-->
      <!--<div class="mine_card">
            <div class="top">
                <div class="left">
                    <i>|</i>
                    我的记录
                </div>
            </div>
            <div class="bottom" @click="goTo('mineDetail','我的评价')">
                <van-row gutter="20">
                    <van-col span="6" class="mine_item">
                        <van-icon name="chat-o" class="mine_icons"/>
                        <p>我的评价</p>
                    </van-col>
                </van-row>
            </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import { profile } from "@/api/exam";
import { avatar } from "@/api/exam";
export default {
  name: "index",
  data() {
    return {
      unLogin: true,
      user: {}
    };
  },
  async created() {
    if (!localStorage.getItem("userToken")) {
    
    } else {
      this.unLogin = false;
      const res = await profile();
      this.user = res.data;
    }
  },
  methods: {
    login(name) {
      this.$router.push({ name });
    },
    goToPersonalInfo() {
      this.$router.push({ name: "personalInfo" });
    },
    goToDetail(type) {
      this.$router.push({
        name: "mineDetail",
        query: {
          type
        }
      });
    },
    goToContact() {
      this.$router.push({
        name: "contact"
      });
    }
  }
};
</script>

<style lang="scss">
.mine_body {
  width: 100%;
  min-height: 93.2vh;
  background-color: rgb(245, 245, 245);
}

.mine_login {
  width: 100%;
  height: 136px;
  background-color: rgb(63, 158, 250);
  .logined {
    width: auto;
    height: 55%;
    padding: 30px;
    .login_box {
      position: relative;
      img {
        width: 60px;
        height: 60px;
        display: inline-block;
        border-radius: 50%;
        margin-top: 6px;
        background-color: #fff;
      }
      p {
        display: inline-block;
        position: absolute;
        top: 40%;
        font-size: 18px;
        color: #fff;
        padding-left: 18px;
      }
    }
  }
  .unLogin {
    width: 45%;
    margin: 0 auto;
    padding: 8%;
  }
  .unLogin p {
    color: #fff;
    font-size: 16px;
    text-align: center;
  }
  .logBtn {
    font-size: 14px;
    width: 86%;
    height: 34px;
    margin-left: 13px;
    margin-top: 18px;
    background: #fff;
    color: #3f9efa;
    border-radius: 5px;
  }
}

.mine_inner {
  padding: 10px;
  .mine_card {
    width: 100%;
    height: auto;
    margin: 10px 0;
    border-radius: 10px;
    background-color: #fff;
    .top {
      display: flex;
      line-height: 44px;
      border-bottom: 1px solid #dcdcdc;
      justify-content: space-between;
      font-size: 14px;
      .left {
        i {
          width: 2px;
          height: 4px;
          margin-right: 5px;
          color: #3f9efa;
          background-color: #3f9efa;
        }
        color: #696969;
        margin-left: 20px;
      }
      .right {
        color: #c0c0c0;
        margin-right: 20px;
      }
    }
    .bottom {
      height: 80px;
      margin-top: 30px;
      .mine_item {
        height: 80px;
        text-align: center;
      }
      .mine_icons {
        width: 34px;
        height: 30px;
        font-size: 40px;
        color: #3f9efa;
      }
      p {
        font-size: 14px;
        text-align: center;
        padding-top: 5px;
      }
      .van-icon-column::before {
        content: "\F038";
        color: #ff8c00;
      }
      .van-icon-orders-o::before {
        color: #3cb371;
      }
    }
  }
}
</style>
