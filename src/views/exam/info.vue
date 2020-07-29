<template>
  <div>
    <div>
      <mt-header fixed title="体检详情">
        <mt-button @click="$router.go(-1)" slot="left" icon="back">返回</mt-button>
        <mt-button slot="right" @click="$router.push({name:'examList'})">
          <van-icon name="wap-home-o" />
        </mt-button>
      </mt-header>

      <div class="inner" style="background: #fff;">
        <div class="swipe">
          <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="(image, index) in images" :key="index">
              <img v-lazy="image" />
            </van-swipe-item>
          </van-swipe>
        </div>

        <div class="card">
          <div class="examName">
            <p>{{basic_info.name}}</p>
          </div>
          <div class="desc">
            <p>{{basic_info.brief}}</p>
          </div>
          <div class="price">
            <div>
              <p style="color: #FF0000; ">
                ¥{{(basic_info.price_real/100).toFixed(2)}}
                <span
                  style="font-size:12px;text-decoration: line-through;"
                >¥{{(basic_info.price_original/100).toFixed(2)}}</span>
              </p>
              <p style="font-size: 12px; color: #c0c0c0;">已约 {{basic_info.sold}} 人</p>
            </div>
            <div>
              <van-field name="stepper">
                <template #input>
                  <van-stepper v-model="stepper" />
                </template>
              </van-field>
            </div>
          </div>
        </div>

        <div class="details">
          <div class="tabs">
            <van-button plain type="info" size="mini" class="tabBtn" @click="showTime = true">可约时间</van-button>
            <van-calendar v-model="showTime" @confirm="onConfirm" />
            <!--<van-tabs v-model="activeName" animated>
                        <van-tab v-for="(item,index) in nameList" :title="item.title">
                            内容 {{ index }}

                        </van-tab>
            </van-tabs>-->
            <van-tabs :active="activeName" sticky>
              <van-tab title="套餐" name="a">
                <div class="tips" v-if="basic_info.tips">{{basic_info.tips}}</div>
                <div class="intro">
                  <h4 v-if="items&&items.length >= 1">具体项目</h4>
                  <div v-for="(ele,index) in items" :key="index" class="introCard">
                    <p>{{ele.name}}</p>
                    <span>{{ele.brief}} {{ele.comment}}</span>
                  </div>
                </div>
                <div style="margin-top: 20px;"></div>
              </van-tab>
              <van-tab title="须知" name="b">
                <div class="mustKnow">
                  <h4>预约须知</h4>
                  <div class="description" v-for="(item,index) in notices" :key="index">
                    <p style="font-weight: bold">
                      <i></i>
                      {{item.name}}
                    </p>
                    <p style="padding-left: 10px;">{{item.brief}} {{item.comment}}</p>
                  </div>
                  <div class="description">
                    <p style="font-weight: bold">
                      <i></i>预约流程
                    </p>
                    <van-steps direction="vertical" :active="0">
                      <van-step v-for="(item,index) in procedure" :key="index">
                        <h3>{{item.name}}</h3>
                        <p>{{item.brief}}</p>
                      </van-step>
                    </van-steps>
                  </div>
                </div>
              </van-tab>
            </van-tabs>
          </div>
        </div>
      </div>

      <van-goods-action style="z-index:100000; margin-top: 50px;">
        <van-goods-action-icon icon="cart-o" text="购物车" @click="onClickIcon" />
        <van-goods-action-button type="info" text="加入购物车" class="btn" @click="onClickButton" />
        <van-goods-action-button type="warning" text="立即下单" class="btn" @click="orderNow" />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
import { pkgID, addCart } from "@/api/exam";
export default {
  name: "info",
  data() {
    return {
      showTime: false,
      images: [],
      activeName: 1,
      stepper: 1,
      basic_info: {},
      items: [],
      notices: [],
      procedure: []
    };
  },
  async created() {
    const res = await pkgID(this.$route.query.id);
    this.basic_info = res.data.basic_info;
    this.items = res.data.items;
    this.notices = res.data.notices;
    this.procedure = res.data.procedure;
    this.images.push(res.data.basic_info.avatar_url);
  },
  methods: {
    onClickIcon() {
      this.$router.push({
        name: "shopCart"
      });
    },
    async onClickButton() {
      const data = {
        pkg_id: this.items[0] ? this.items[0].pkg_id : undefined,
        pkg_count: this.stepper
      };
      const res = await addCart(data);
      if (res.ecode == 0) {
        Dialog.confirm({
          title: "温馨提示",
          message: "加入购物车成功，是否去购物车结算？"
        })
          .then(() => {
            // on confirm
            this.$router.push({ name: "shopCart" });
          })
          .catch(() => {
            // on cancel
          });
      } else {
        Toast.fail("加入购物车失败！");
      }
    },
    onConfirm() {
      this.showTime = false;
    },
    orderNow() {
      const order = [
        {
          avatar_url: this.basic_info.avatar_url,
          hospital_id: this.basic_info.hospital_id,
          hospital_name: this.basic_info.hospital_name,
          id: 0,
          name: this.basic_info.name,
          pkg_count: this.stepper,
          pkg_id: this.basic_info.id,
          pkg_price: this.basic_info.price_real,
          target: this.basic_info.target
        }
      ];
      this.$store.commit("setOrderList", order);
      this.$router.push({
        name: "order"
      });
    }
  }
};
</script>

<style lang="scss">
.van-tabs__line {
  background-color: #3f9efa;
}
.inner {
  min-height: 100vh;
  margin: 0px 0 60px 0;
  .swipe {
    width: 100%;
    height: 200px;
    img {
      width: 100%;
      height: 200px;
    }
  }
  .card {
    height: auto;
    margin: 30px;
    border-radius: 10px;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0px 10px 19px 4px #ebedf0;
    .examName {
      font-size: 16px;
      font-weight: bold;
    }
    .desc {
      font-size: 12px;
      color: #c0c0c0;
      margin: 20px 0;
    }
    .price {
      display: flex;
      justify-content: space-between;
    }
    .details {
      margin-top: 20px;
    }
  }
  .tabs {
    position: relative;
    border-top: 1px solid #f5f5f5;
    .tips {
      margin: 20px;
      padding: 16px;
      color: #ff0000;
      font-size: 14px;
      border-radius: 10px;
      box-shadow: 0px 10px 19px 4px #ebedf0;
      background: rgba(255, 160, 122, 0.3);
    }
    .intro {
      margin: 20px;

      .introCard {
        margin: 20px 0;
        font-size: 14px;

        p {
          color: #3f9efa;
        }
        span {
          padding: 10px;
          background-color: #f5f5f5;
          margin-top: 10px;
          display: inline-block;
        }
      }
    }
    .mustKnow {
      margin: 20px;
      i {
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin-right: 10px;
        background-color: #3f9efa;
      }
      .description {
        margin-top: 20px;
        padding: 10px;
        font-size: 14px;
      }
    }
    .tabBtn {
      position: absolute;
      top: 10px;
      right: 0;
      z-index: 999;
    }
  }
  .van-goods-action-button--danger {
    background-color: #3f9efa;
  }
}
</style>
