<template>
  <div>
    <mt-header :title="`订单详情`" fixed>
      <router-link slot="left" to="/mineDetail?type=1">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button @click="$router.push({name:'examList'})" slot="right">
        <van-icon name="wap-home-o" />
      </mt-button>
    </mt-header>
    <div class="orderDetail" v-if="(state!=2 && state!=0)">
      <div class="orderCard">
        <div class="img"></div>
        <div class="text">
          <div v-if="state==0">
            <p>待付款</p>
            <p>名额有限，请尽快支付</p>
          </div>
          <div v-if="state==3">
            <p style="color:#ccc">已退款</p>
          </div>
          <div v-if="state==4">
            <p>已关闭</p>
          </div>
          <div v-if="state==5">
            <p>待评价</p>
          </div>
        </div>
      </div>
      <div class="orderNum copy-code-button" :data-clipboard-text="order.out_trade_no"   >
        订单号:{{order.out_trade_no}}
        <a href="#" class="copy" @click="copy">复制单号</a>
      </div>
      <div :key="index" v-for="(item,index) in order.aggregated_order_items_with_pkg_item">
        <van-card
          :num="item.pkg_count"
          :price="(item.pkg_price/100).toFixed(2)"
          :thumb="item.pkg_avatar_url"
          :title="item.pkg_name"
        >
          <template #footer>
            <div style="padding-left:100px;">创建时间:{{item.create_time|formatter}}</div>
          </template>
        </van-card>
        <van-divider>体检人</van-divider>
        <van-cell-group :key="k" v-for="(i,k) in item.Examinees">
          <van-cell :value="i.examinee_name" title="姓名" />
          <van-cell :value="i.examinee_mobile" title="手机号" />
          <van-cell :value="i.id_card_no" title="身份证" />
          <van-cell :value="i.gender==0?'否':'是'" title="性别" />
          <van-cell :value="i.is_married==0?'否':'是'" title="婚否" />
          <van-cell :value="i.examine_date|formatterDay" title="体检日期" />
        </van-cell-group>
        <van-divider>套餐项（{{item.PkgItems.length}}）</van-divider>
        <van-cell-group :key="k" v-for="(i,k) in item.PkgItems">
          <van-cell :title="i.name" />
        </van-cell-group>
        <van-divider>预约人信息</van-divider>
        <van-cell-group>
          <van-cell :value="order.mobile" title="手机号" />
          <van-cell :label="order.remark" title="备注" />
        </van-cell-group>
      </div>
      <div style="height:120px"></div>
      <van-goods-action v-if="state==0">
        <van-goods-action-button @click="clearOrder" text="取消订单" type="info" />
        <van-goods-action-button @click="toPay" text="立即购买" type="danger" />
      </van-goods-action>
    </div>

    <div class="orderDetail" v-if="state==2||state == 0">
      <div class="orderNum copy-code-button" :data-clipboard-text="order.out_trade_no"   >
        订单号:{{order.out_trade_no}}
        <a href="#" class="copy" @click="copy">复制单号</a>
      </div>
      <div :key="index" v-for="(item,index) in order.aggregated_order_items_with_pkg_item">
        <van-card
          :num="item.pkg_count"
          :price="(item.pkg_price/100).toFixed(2)"
          :thumb="item.pkg_avatar_url"
          :title="item.pkg_name"
        >
          <template #footer>
            <div style="padding-left:100px;">创建时间:{{item.create_time|formatter}}</div>
          </template>
        </van-card>
        <van-divider>体检人</van-divider>
        <template v-if="!isSave">
          <van-cell-group :key="k" style="margin:10px 0" v-for="(i,k) in item.Examinees">
            <div class="btnGroup">
              <van-button @click="isSave=true" plain size="mini" type="info" v-if="!isSave">填写</van-button>
              <van-button @click="save(i,item)" plain size="mini" type="info" v-if="isSave">保存</van-button>
              <van-button @click="isSave=false" plain size="mini" type="info" v-if="isSave">取消</van-button>
            </div>
            <van-cell :value="i.examinee_name" style="text-align: left; " title="姓名" />
            <van-cell :value="i.examinee_mobile" style="text-align: left; " title="手机号" />
            <van-cell :value="i.id_card_no" style="text-align: left; " title="身份证" />
            <van-cell :value="i.gender==0?'否':'是'" style="text-align: left; " title="性别" />
            <van-cell :value="i.is_married==0?'否':'是'" style="text-align: left; " title="婚否" />
            <van-cell :value="i.examine_date|formatterDay" style="text-align: left; " title="体检日期" />
          </van-cell-group>
        </template>
        <template v-if="isSave">
          <van-cell-group :key="k" style="margin:10px 0" v-for="(i,k) in item.Examinees">
            <div class="btnGroup">
              <van-button @click="isSave=true" plain size="mini" type="info" v-if="!isSave">填写</van-button>
              <van-button @click="save(i,item)" plain size="mini" type="info" v-if="isSave">保存</van-button>
              <van-button @click="isSave=false" plain size="mini" type="info" v-if="isSave">取消</van-button>
            </div>
            <van-field
              @click="i.showPickerC = true"
              clickable
              label="常用联系人"
              name="picker"
              placeholder="点击选择常用联系人"
              readonly
            />
            <van-popup position="bottom" v-model="i.showPickerC">
              <van-picker
                :columns="columns"
                @cancel="i.showPickerC = false"
                @confirm="(value)=>onConfirm1(value,i)"
                show-toolbar
                value-key="examinee_name"
              />
            </van-popup>
            <van-field
              :rules="[{ required: true, message: '请填写姓名' }]"
              required
              label="姓名"
              name="examinee_name"
              placeholder="姓名"
              v-model="i.examinee_name"
            />
            <van-field
              :rules="[{ required: true, message: '请填写手机号' }]"
              required
              label="手机号"
              name="examinee_mobile"
              placeholder="手机号"
              v-model="i.examinee_mobile"
            />
            <van-field
              :rules="[{ required: true, message: '请填写身份证' }]"
              required
              @input="((value)=>isWomen(value,i))"
              label="身份证"
              name="id_card_no"
              placeholder="身份证"
              v-model="i.id_card_no"
            />

            <van-field label="性别" name="gender" required>
              <template #input>
                <van-radio-group direction="horizontal" disabled v-model.number="i.gender">
                  <van-radio :name="1">男</van-radio>
                  <van-radio :name="2">女</van-radio>
                </van-radio-group>
              </template>
            </van-field>

            <van-field label="婚否" name="is_married" required>
              <template #input>
                <van-radio-group direction="horizontal" v-model.number="i.is_married">
                  <van-radio :disabled="i.gender == 2&&item.target==2" :name="1">是</van-radio>
                  <van-radio :disabled="i.gender == 2&&item.target==3" :name="2">否</van-radio>
                </van-radio-group>
              </template>
            </van-field>

            <van-field
              :value="i.examine_date|formatter"
              required
              @click="i.showCalendar = true"
              clickable
              label="预约日期"
              name="calendar"
              placeholder="点击选择日期"
              readonly
            />
            <van-calendar @confirm="(data)=>{onConfirm(data,i)}" v-model="i.showCalendar" />
          </van-cell-group>
        </template>

        <van-divider>套餐项（{{item.PkgItems.length}}）</van-divider>
        <van-cell-group :key="k" v-for="(i,k) in item.PkgItems">
          <van-cell :title="i.name" />
        </van-cell-group>
        <van-divider>预约人信息</van-divider>
        <van-cell-group>
          <van-cell :value="order.mobile" title="手机号" />
          <van-cell :label="order.remark" title="备注" />
        </van-cell-group>
      </div>

      <div style="height:120px"></div>
      <van-goods-action v-if="state==0">
        <van-goods-action-button @click="clearOrder" text="取消订单" type="info" />
        <van-goods-action-button @click="toPay" text="立即购买" type="danger" />
      </van-goods-action>
      <van-goods-action v-if="state==2">
        <van-goods-action-button @click="clearOrder(true)" text="申请退款" type="danger" />
      </van-goods-action>
    </div>

    <van-dialog @confirm="reason()" show-cancel-button title="标题" v-model="show">
      <van-form>
        <van-field
          :value="columnsT.filter(item=>item.id == arr.ids)[0]&&columnsT.filter(item=>item.id == arr.ids)[0].label"
          @click="showPickerT = true"
          clickable
          label="取消原因"
          name="picker"
          placeholder="点击选择原因"
          readonly
        />

        <van-field
          autosize
          label="留言"
          maxlength="50"
          placeholder="请输入留言"
          rows="2"
          show-word-limit
          type="textarea"
          v-model="message"
        />
      </van-form>
    </van-dialog>
    <van-popup position="bottom" v-model="showPickerT">
      <van-picker
        :columns="isDrawback?columnsT2:columnsT"
        @cancel="showPickerT = false"
        @confirm="onConfirmT"
        show-toolbar
        value-key="label"
      />
    </van-popup>
  </div>
</template>
<script>
import { getOrderById, order_items } from "@/api/orders";
import { scnd_pay, cancel_order, refund_order } from "@/api/exam";
import { getExaminees } from "@/api/users";
import { formatTimeToStr } from "@/utils/date.js";
import { Toast, Dialog } from "vant";
import Clipboard from 'clipboard'
export default {
  name: "OrderDetail",
  data() {
    return {
      show: false,
      showPickerT: false,
      arr: {
        ids: 0,
        val: ""
      },
      message: "",
      order: {},
      state: this.$route.query.state,
      showPickerC: false,
      isDrawback: false,
      examinees: [
        {
          showCalendar: false,
          activeName: "1",
          examine_date: 0,
          examinee_mobile: "",
          examinee_name: "",
          gender: 0,
          id_card_no: "",
          is_married: 0
        }
      ],
      columnsT2:[
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
      columnsT: [
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
      isSave: false
    };
  },
  filters: {
    formatter: function(time) {
      if (time != null && time != "") {
        var date = new Date(time * 1000);
        return formatTimeToStr(date, "yyyy-MM-dd hh:mm:ss");
      } else {
        return "";
      }
    },
    formatterDay: function(time) {
      if (time != null && time != "") {
        var date = new Date(time * 1000);
        return formatTimeToStr(date, "yyyy-MM-dd");
      } else {
        return "";
      }
    }
  },
  methods: {
    copy(){
      var clipboard = new Clipboard('.copy-code-button') // 这里可以理解为选择器，选择上面的复制按钮
      clipboard.on('success', e => {
        Toast('复制成功')
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        Toast('手机权限不支持复制功能')
        // 释放内存
        clipboard.destroy()
      })
    },
    async getExaminees() {
      const res = await getExaminees();
      if (res.ecode == 0) {
        this.columns = res.data;
      }
    },
    onConfirmT(value) {
      this.arr.ids = value.id;
      this.showPickerT = false;
    },
    onConfirm1(value, i) {
      i.examinee_name = value.examinee_name;
      i.examinee_mobile = value.examinee_mobile;
      i.id_card_no = value.id_card_no;
      i.gender = value.gender;
      i.is_married = value.is_married;
      i.showPickerC = false;
    },
    isWomen(UUserCard, v) {
      if (UUserCard.length == "18") {
        if (parseInt(UUserCard.substr(16, 1)) % 2 == 0) {
          v.gender = 2;
          //是女则执行代码 ...
        } else {
          v.gender = 1;
          //是男则执行代码 ...
        }
      } else {
        v.gender = 0;
      }
    },

    goMineDetail() {
      this.$router.push({ name: "mineDetail" });
    },
    clearOrder(flag) {
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
    async reason() {
      const data = {
        order_id: this.order.order_id,
        [this.isDrawback?"refund_reason_id":"cancel_reason_id"]: this.arr.ids,
        [this.isDrawback?"refund_reason_remark":"remark"]: this.message
      };
      if (this.isDrawback) {
        const res = await refund_order(data);
        if (res.ecode == 0) {
          Dialog.alert({
            title: "提示",
            message: "已提交申请，系统将在三个工作日内处理"
          }).then(() => {
            window.location.reload();
          });
        }
      } else {
        const res = await cancel_order(data);
        if (res.ecode == 0) {
          Toast("取消订单成功");
          window.location.reload();
        }
      }
    },
    async toPay() {
      const data = {
        id: this.order.order_id
      };
      const res = await scnd_pay(data);
      this.orderRes = res.data;
      this.onBridgeReady();
    },
    async getOrder() {
      const res = await getOrderById(this.$route.query.orderNum);
      res.data?.aggregated_order_items_with_pkg_item?.map(item => {
        item.Examinees?.map(i => {
          i.showCalendar = false;
          i.showPickerC = false;
        });
      });
      this.order = res.data;
      this.state = res.data.status;
    },
    onConfirm(date, item) {
      if (
        date.getTime() -
          new Date(
            new Date(new Date().toLocaleDateString()).getTime() +
              24 * 60 * 60 * 1000 -
              1
          ) <
        0
      ) {
        Toast("不可选择今天");
        return false;
      }
      item.examine_date = ~~(date.getTime() / 1000);
      item.showCalendar = false;
    },
    async save(i, item) {
      if (
        !i.examine_date ||
        !i.examinee_mobile ||
        !i.examinee_name | !i.id_card_no
      ) {
        Toast("请完整填写体检人信息");
        return;
      }
      const data = {
        ...i,
        pkg_id: item.pkg_id
      };
      const res = await order_items(data);
      if (res.ecode == 0) {
        this.isSave = false;
      }
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
    }
  },
  created() {
    this.getOrder();
    this.getExaminees();
  }
};
</script>
<style lang="scss">
.orderDetail {
  background: #eee;
  box-sizing: border-box;
  padding-top: 40px;
  .copy{
    color: #aaa;
    float: right;
    font-size: 14px;
  }
  .orderCard {
    height: 120px;
    width: 100vw;
    background: #26a3aa;
    display: flex;
    padding: 25px 0 0 25px;
    box-sizing: border-box;
    .img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: #fff;
    }
    .text {
      padding-left: 12px;
      p {
        color: #fff;
        font-size: 24px;
      }
      p + p {
        padding-top: 10px;
        font-size: 14px;
      }
    }
  }
  .van-card {
    .van-card__content {
      height: 80%;
    }
  }
  .orderNum {
    background: #fff;
    padding: 10px;
    color: #aaa;
  }
  .btn {
    width: 90%;
    border-radius: 20px;
    margin-top: 20px;
    position: absolute;
    font-size: 18px;
    left: 50%;
    transform: translateX(-50%);
  }
  .btnGroup {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    padding: 5px 20px;
    flex-direction: row-reverse;
    justify-content: space-between;
  }
}
</style>
