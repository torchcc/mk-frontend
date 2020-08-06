<template>
  <div>
    <mt-header :title="`我的订单`" fixed>
      <router-link slot="left" to="/layout/mine">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button slot="right" @click="$router.push({name:'examList'})">
        <van-icon name="wap-home-o" />
      </mt-button>
    </mt-header>

    <div class="detail_inner">
      <!--当从订单进来时展示订单卡片-->
      <van-tabs :active="activeName" @change="changeTab">
        <van-tab :key="key" :name="item.name" :title="item.title" v-for="(item,key) in titleList">
          <van-list :finished="finished" finished-text="没有更多了" v-model="finished">
            <!-- <van-cell v-for="item in list" :key="item" :title="item"></van-cell> -->
            <div style="margin-top: 20px;">
              <div :key="index" v-for="(ele,index) in list" style="margin-top: 20px;">
                <div class="topInfo">
                  <p class="top_order">订单号：{{ele.out_trade_no}}</p>
                  <p class="top_status">{{filterStatus(ele.status)}}</p>
                </div>
                <van-card
                  :key="i"
                  v-for="(eleInfo,i) in ele.aggregated_order_items"
                  :num="eleInfo.pkg_count"
                  :price="(eleInfo.pkg_price/100).toFixed(2)"
                  :thumb="eleInfo.pkg_avatar_url"
                  :title="eleInfo.pkg_name"
                  @click="toDetile(eleInfo.order_id,ele.status)"
                  class="detail_card"
                ></van-card>
                <div class="bottom-card">
                  <div class="total_price">应付金额：¥ {{numprice(ele)}}</div>

                  <van-dialog v-model="show" title="标题" @confirm="reason(ele)" show-cancel-button>
                    <van-form>
                      <van-field
                        readonly
                        clickable
                        name="picker"
                        :value="columns.filter(item=>item.id == arr.ids)[0]&&columns.filter(item=>item.id == arr.ids)[0].label"
                        label="取消原因"
                        placeholder="点击选择原因"
                        @click="showPicker = true"
                      />
                      <van-popup v-model="showPicker" position="bottom">
                        <van-picker
                          show-toolbar
                          :columns="isDrawback?columns2:columns"
                          value-key="label"
                          @confirm="onConfirm"
                          @cancel="showPicker = false"
                        />
                      </van-popup>

                      <van-field
                        v-model="message"
                        rows="2"
                        autosize
                        label="留言"
                        type="textarea"
                        maxlength="50"
                        placeholder="请输入留言"
                        show-word-limit
                      />
                    </van-form>
                  </van-dialog>

                  <div v-if="ele.status == 0">
                    <van-button
                      class="detailBtn"
                      plain
                      round
                      size="small"
                      style="margin-right: 16px;"
                      type="primary"
                      @click="cancel(ele)"
                    >取消订单</van-button>

                    <van-button
                      class="detailBtn"
                      plain
                      round
                      size="small"
                      type="info"
                      @click="payNow(ele)"
                    >立即付款</van-button>
                  </div>
                  <div v-if="ele.status == 2">
                    <van-button
                      class="detailBtn"
                      plain
                      round
                      size="small"
                      type="info"
                      @click="cancel(ele,true)"
                    >申请退款</van-button>
                    <van-button
                      class="detailBtn"
                      plain
                      round
                      size="small"
                      type="info"
                      @click="toDetile(ele.order_id,ele.status)"
                    >查看订单</van-button>
                  </div>

                  <div v-if="ele.status == 4 || ele.status == 5 || ele.status == 3">
                    <van-button
                      class="detailBtn"
                      plain
                      round
                      size="small"
                      style="margin-right: 16px;"
                      type="primary"
                      @click="deleteOrder(ele)"
                    >删除订单</van-button>
                  </div>
                </div>
              </div>
            </div>
          </van-list>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { Dialog } from "vant";
import { Toast } from "vant";
import { ordersList, deleteOrder } from "@/api/orders";
import { scnd_pay, cancel_order, refund_order } from "@/api/exam";
export default {
  name: "mineDetail",
  data() {
    return {
      page_no: 1,
      list: [],
      has_next: 1,
      error: false,
      finished: false,
      loading: false,
      isDrawback: false,
      activeName: "",
      titleList: [
        {
          name: 1,
          title: "全部"
        },
        {
          name: 0,
          title: "待付款"
        },
        {
          name: 2,
          title: "待预约"
        },
        {
          name: 3,
          title: "已退款"
        },
        {
          name: 4,
          title: "已关闭"
        },
        {
          name: 5,
          title: "已完成"
        }
      ],
      orderRes: {},
      value: "",
      arr: {
        ids: 0,
        val: ""
      },
      columns2: [
        {
          id: 3,
          label: "买多了/不想买了"
        },
        {
          id: 4,
          label: "信息写错，重新下单"
        },
        {
          id: 5,
          label: "朋友/网上评价不好"
        },
        {
          id: 6,
          label: "计划有变，时间按排不上"
        },
        {
          id: 7,
          label: "其他"
        }
      ],
      columns: [
        {
          id: 1,
          label: "支付时出故障，支付不了"
        },
        {
          id: 2,
          label: "付款时 余额限制了"
        },
        {
          id: 3,
          label: "买多了/不想买了"
        },
        {
          id: 4,
          label: "信息写错，重新下单"
        },
        {
          id: 5,
          label: "朋友/网上评价不好"
        },
        {
          id: 6,
          label: "计划有变，时间按排不上"
        },
        {
          id: 7,
          label: "其他"
        }
      ],
      message: "",
      showPicker: false,
      show: false,
      orderRes: {}
    };
  },
  created() {
    this.activeName = Number(this.$route.query.type);

    this.listInit();
    this.getList();
  },
  mounted() {
    function getScrollTop() {
      var scrollTop = 0,
        bodyScrollTop = 0,
        documentScrollTop = 0;
      if (document.body) {
        bodyScrollTop = document.body.scrollTop;
      }
      if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop;
      }
      scrollTop =
        bodyScrollTop - documentScrollTop > 0
          ? bodyScrollTop
          : documentScrollTop;
      return scrollTop;
    }
    //文档的总高度
    function getScrollHeight() {
      var scrollHeight = 0,
        bodyScrollHeight = 0,
        documentScrollHeight = 0;
      if (document.body) {
        bodyScrollHeight = document.body.scrollHeight;
      }
      if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight;
      }
      scrollHeight =
        bodyScrollHeight - documentScrollHeight > 0
          ? bodyScrollHeight
          : documentScrollHeight;
      return scrollHeight;
    }
    //浏览器视口的高度
    function getWindowHeight() {
      var windowHeight = 0;
      if (document.compatMode == "CSS1Compat") {
        windowHeight = document.documentElement.clientHeight;
      } else {
        windowHeight = document.body.clientHeight;
      }
      return windowHeight;
    }
    window.onscroll = () => {
      if (getScrollTop() + getWindowHeight() == getScrollHeight()) {
        this.getList();
      }
    };
  },
  methods: {
    toDetile(order_num, state) {
      let name = "";
      this.$router.push({
        name: "orderDetail",
        query: {
          orderNum: order_num,
          state: state //是否预约，跳转后需要判断使用
        }
      });
    },
    changeTab(e) {
      document.documentElement.scrollTop = 0;
      this.activeName = e;
      this.listInit();
      this.getList();
    },
    numprice(ele) {
      let num = 0;
      ele.aggregated_order_items.map(item => {
        num += (item.pkg_price / 100) * item.pkg_count;
      });
      return num.toFixed(2);
    },
    filterStatus(name) {
      return (
        this.titleList &&
        this.titleList.filter(item => item.name == name)[0] &&
        this.titleList.filter(item => item.name == name)[0].title
      );
    },
    listInit() {
      this.list = [];
      this.page_no = 1;
      this.has_next = 1;
      document.documentElement.scrollTop = 0
    },
    async getList(flag) {
      if (this.has_next == 1) {
        const res = await ordersList({
          page_size: 10,
          page_no: this.page_no,
          status: this.activeName == 1 ? undefined : this.activeName
        });
        this.list.push(...res.data.list);
        this.page_no++;
        this.has_next = res.data.has_next;
      }
    },
    async payNow(row) {
      const data = {
        id: row.order_id
      };
      const res = await scnd_pay(data);
      this.orderRes = res.data;
      this.onBridgeReady();
    },
    onBridgeReady() {
      const that = this;
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: "wx5e628e27370137da", //公众号名称，由商户传入
          timeStamp: this.orderRes.timestamp, //时间戳，自1970年以来的秒数
          nonceStr: this.orderRes.nonceStr, //随机串
          package: this.orderRes.package,
          signType: this.orderRes.signType, //微信签名方式：
          paySign: this.orderRes.paySign //微信签名
        },
        function(res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            Dialog.alert({
              message: "支付成功！"
            })
              .then(() => {
                that.$router.push({ name: "mine" });
              })
              .catch(e => {
                Dialog.alert({
                  message: e
                });
              });
          }
        }
      );
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            onBridgeReady,
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
          document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
        }
      } else {
        // this.onBridgeReady();
      }
    },
    //取消订单
    cancel(row, flag) {
      if (flag) {
        Dialog.confirm({
          message: "是否确认申请退款?"
        }).then(() => {
          this.show = true;
          this.isDrawback = true;
        });
      } else {
        Dialog.confirm({
          message: "是否确认取消订单?"
        }).then(() => {
          this.show = true;
          this.isDrawback = false;
        });
      }
    },
    onConfirm(value) {
      this.arr.ids = value.id;
      this.showPicker = false;
    },
    //未付款状态下取消订单
    async reason(row) {
      const data = {
        order_id: row.order_id,
        [this.isDrawback ? "refund_reason_id" : "cancel_reason_id"]: this.arr
          .ids,
        [this.isDrawback ? "refund_reason_remark" : "remark"]: this.message
      };
      if (this.isDrawback) {
        const res = await refund_order(data);
        if (res.ecode == 0) {
          Dialog.alert({
            title: "提示",
            message: "已提交申请，系统将在三个工作日内处理"
          }).then(() => {
            this.listInit();
            this.getList();
          });
        }
      } else {
        const res = await cancel_order(data);
        if (res.ecode == 0) {
          Toast("取消订单成功");
          this.listInit();
          this.getList();
        }
      }
    },
    //删除订单
    async deleteOrder(row) {
      Dialog.confirm({
        message: "是否确认删除订单?"
      }).then(() => {
        deleteOrder(row.order_id).then(item => {
          console.log(item);
          if (item.ecode == 0) {
            Toast("删除订单成功！");
            this.listInit();
            this.getList(); //不刷新页面
          }
        });
      });
    },
    goTo(row) {
      this.$router.push({
        name: "orderDetail",
        query: {
          orderNum: row.order_id,
          reservation: true //是否预约，跳转后需要判断使用
        }
      });
    }
  }
};
</script>

<style lang="scss">
.detail_inner {
  margin-top: 40px;
  min-height: 100vh;
  background-color: #f5f5f5;
  .van-dialog {
    min-height: 70vh;
  }
}

/*
    *我的订单
    */
.bottom-card {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #fff;
  margin-bottom: 5px;
}
.topInfo {
  height: 4em;
  display: flex;
  background: #fff;
  line-height: 4em;
  font-size: 14px;
  padding: 0 20px;
  border-bottom: 1px solid #c0c0c0;
  justify-content: space-between;
  .top_order {
    color: #c0c0c0;
  }
  .top_status {
    color: #ff0000;
  }
}

.detail_card {
  font-size: 16px;
  border-bottom: 1px solid #c0c0c0;
  .total_price {
    display: inline-block;
    font-size: 14px;
    padding-top: 3px;
  }
}
.van-card {
  padding: 0;
}
.van-card__header {
  padding: 10px;
}
.van-card:not(:first-child) {
  margin-top: 0;
}
.van-card__footer {
  margin-top: 20px;
  padding: 10px 20px;
  border-top: 1px solid #c0c0c0;
}
.van-card {
  background: #fff;
}
.van-tabs__line {
  background: #26a2ff;
}
.van-card__desc .van-ellipsis {
  font-size: 12px;
  padding-top: 6px;
}
</style>
