<template>
  <div>
    <mt-header title="订单详情">
      <mt-button @click="$router.go(-1)" icon="back" slot="left">返回</mt-button>
      <mt-button @click="$router.push({name:'examList'})" slot="right">
        <van-icon name="wap-home-o" />
      </mt-button>
    </mt-header>
    <div class="inner">
      <div :key="index" class="orderInfo" v-for="(item,index) in orderList">
        <div class="top">
          <div class="topCard">
            <p>{{item.pkg_name}}</p>
            <div class="infos">
              <span class="left">体检项目{{item.pkg_num}}个</span>
              <!--                            <span class="right">套餐信息 > </span>-->
            </div>
            <div class="tip">
              <span>疫情期间，若无法安排体检，我们会及时联系您！</span>
            </div>
          </div>
        </div>

        <div class="form">
          <van-collapse
            :key="k"
            @change="handleChange"
            accordion
            v-for="(v,k) in item.examinees"
            v-model="v.activeName"
          >
            <van-collapse-item
              :name="'1'"
              :value="v.activeName!='1'?'预约':'暂不预约'"
              class="isBook"
              icon="shop-o"
              title="体检人信息"
            >
              <van-form>
                <van-field
                  @click="v.showPicker = true"
                  clickable
                  label="常用联系人"
                  name="picker"
                  placeholder="点击选择常用联系人"
                  readonly
                />
                <van-popup position="bottom" v-model="v.showPicker">
                  <van-picker
                    :columns="columns"
                    @cancel="v.showPicker = false"
                    @confirm="(i)=>onConfirm1(i,v)"
                    show-toolbar
                    value-key="examinee_name"
                  />
                </van-popup>
                <van-field
                  :rules="[{ required: true, message: '请填写姓名' }]"
                  label="姓名"
                  name="examinee_name"
                  placeholder="姓名"
                  required
                  v-model="v.examinee_name"
                />
                <van-field
                  :rules="[{ required: true, message: '请填写手机号' }]"
                  label="手机号"
                  name="examinee_mobile"
                  placeholder="手机号"
                  required
                  v-model="v.examinee_mobile"
                />
                <van-field
                  :rules="[{ required: true, message: '请填写身份证' }]"
                  @input="((value)=>isWomen(value,v))"
                  label="身份证"
                  name="id_card_no"
                  placeholder="身份证"
                  required
                  v-model="v.id_card_no"
                />
                <van-field label="性别" name="gender" required>
                  <template #input>
                    <van-radio-group direction="horizontal" disabled v-model.number="v.gender">
                      <van-radio :name="1">男</van-radio>
                      <van-radio :name="2">女</van-radio>
                    </van-radio-group>
                  </template>
                </van-field>

                <van-field label="婚否" name="is_married" required>
                  <template #input>
                    <van-radio-group direction="horizontal" v-model.number="v.is_married">
                      <van-radio :disabled="v.gender == 2&&item.target==2" :name="1">是</van-radio>
                      <van-radio :disabled="v.gender == 2&&item.target==3" :name="2">否</van-radio>
                    </van-radio-group>
                  </template>
                </van-field>

                <van-field
                  :value="v.examine_date|formatter"
                  @click="v.showCalendar = true"
                  clickable
                  label="预约日期"
                  name="calendar"
                  placeholder="点击选择日期"
                  readonly
                  required
                />
                <van-calendar @confirm="(data)=>{onConfirm(data,v)}" v-model="v.showCalendar" />
              </van-form>
            </van-collapse-item>
          </van-collapse>
        </div>
      </div>

      <div class="personInfo">
        <van-cell-group>
          <van-cell title="预约人信息" />
          <van-form>
            <van-field
              :rules="[{ required: true, message: '请填写用户名' }]"
              label="预约人手机号"
              name="预约人手机号"
              placeholder="请输入预约人手机号"
              v-model="form.subscriber_mobile"
            />
            <van-field
              label="订单备注"
              name="订单备注"
              placeholder="请输入订单备注"
              type="textarea"
              v-model="form.subscriber_comment"
            />
          </van-form>
          <van-cell>
            <p class="orders">
              点击“提交订单”表示已阅读并同意
              <span @click="show=true">下单须知</span>
            </p>
            <van-action-sheet title="下单须知" v-model="show">
              <div class="content">
                <div style="margin-bottom: 20px;">
                  <p>改退说明</p>
                  <ul>
                    <li>
                      <span>退款：</span>
                      如客户预约成功后选择退款，需扣除套餐实付金额的10%作为服务费。
                    </li>
                    <li>
                      <span>改期:</span>
                      每位客户拥有3次改期机会，无需支付任何费用的权益。3次后再改期，需扣除套餐实付金额的10%作为服务费。
                    </li>
                    <li>
                      <span>补偿：</span>
                      客户预约好体检时间后，由迈康体检网的原因造成客户体检当天无法进行体检，迈康体检网会补偿不超过支付金额的10%作为补偿费用。
                    </li>
                  </ul>
                </div>

                <div>
                  <p>弃检变更</p>
                  <ul>
                    <li>
                      <span>弃检：</span>
                      当您预约套餐时，即表示接受检测的所有项目。如因自身原因放弃体检套餐中的检查项目，网站将不予退款处理。
                    </li>
                    <li>
                      <span>变更：</span>
                      套餐里的体检项目，可能会由于体检中心设备或其他原因，体检中心会自动帮您更换同价位其他项目或升级项目，望您能理解和支持。
                    </li>
                  </ul>
                </div>
              </div>
            </van-action-sheet>
          </van-cell>
        </van-cell-group>
      </div>
      <!--            <button @click="test">查看组装后参数</button>-->

      <van-submit-bar :price="money" @submit="onSubmit" button-text="提交订单" class="absBottom" />
      <!--            ¥{{item.pkg_price | fmtPrice}}-->
    </div>
  </div>
</template>

<script>
import { formatTimeToStr } from "@/utils/date.js";
import { Dialog, Toast } from "vant";
import { orders, profile, pkgID } from "@/api/exam";
import { getExaminees } from "@/api/users";
export default {
  name: "order",
  data() {
    return {
      orderList: [],
      orderRes: "",
      money: 0,
      columns: [],
      showPicker: false,
      form: {
        subscriber_mobile: "",
        subscriber_comment: ""
      },
      show: false
    };
  },

  methods: {
    async getExaminees() {
      const res = await getExaminees();
      this.columns = res.data;
    },
    isWomen(UUserCard, v) {
      console.log(UUserCard, v);
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
    handleChange() {
      this.$forceUpdate();
    },
    onConfirm1(data, item) {
      item.activeName = "1";
      item.showCalendar = false;
      item.examine_date = 0;
      item.examinee_mobile = data.examinee_mobile;
      item.examinee_name = data.examinee_name;
      item.gender = data.gender;
      item.id_card_no = data.id_card_no;
      item.is_married = data.is_married;
      item.showPicker = false;
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
    async onSubmit() {
      const orderList = [];
      this.orderList.map(item => {
        const i = JSON.parse(JSON.stringify(item));
        for (let k = 0; k < i.examinees.length; k++) {
          if (i.examinees[k] && i.examinees[k].activeName != "1") {
            i.examinees.splice(k, 1);
            k--;
          }
        }
        orderList.push(i);
      });

      if (
        orderList.some(item => {
          for (let k = 0; k < item.examinees.length; k++) {
            if (item.examinees[k] && item.examinees[k].id_card_no == "") {
              Toast(`${item.pkg_name}套餐预约人未填写身份证`);
              return true;
            }
            if (item.examinees[k] && item.examinees[k].examine_date == 0) {
              Toast(`${item.pkg_name}套餐预约人未填写时间`);
              return true;
            }
            if (item.target == 1 && item.examinees[k].gender == 2) {
              Toast(`${item.pkg_name}套餐只适合男性`);
              return true;
            } else if (item.target == 2 && item.examinees[k].gender == 1) {
              Toast(`${item.pkg_name}套餐只适合女性`);
              return true;
            }
          }
        })
      ) {
        return false;
      } else {
        this.form.cart_items = orderList;
        const res = await orders(this.form);
        this.orderRes = res.data;
        if (res.ecode == 0) {
          this.onBridgeReady();
        }
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
                // on close
                that.$router.push({
                  name: "mine"
                });
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
  filters: {
    formatter: function(time) {
      if (time != null && time != "") {
        var date = new Date(time * 1000);
        return formatTimeToStr(date, "yyyy-MM-dd");
      } else {
        return "";
      }
    },
    fmtPrice(val) {
      return ((val - 0) / 100).toFixed(2);
    }
  },
  async created() {
    this.getExaminees();
    this.money = 0;
    this.$store.state.order.orderList.map(async item => {
      const res = await pkgID(item.pkg_id);
      const examinees = [];
      for (let i = 0; i < item.pkg_count; i++) {
        examinees.push({
          showPicker: false,
          showCalendar: false,
          activeName: "1",
          examine_date: 0,
          examinee_mobile: "",
          examinee_name: "",
          gender: 0,
          id_card_no: "",
          is_married: 0
        });
      }
      const obj = {
        cart_id: item.id,
        pkg_num: res.data.items.length,
        target: res.data.basic_info.target,
        examinees: examinees,
        pkg_count: item.pkg_count,
        pkg_id: item.pkg_id,
        pkg_name: item.name
      };
      this.money += item.pkg_price * item.pkg_count;
      this.orderList.push(obj);
    });
    const res = await profile();
    this.form.subscriber_mobile = res.data.mobile;
  }
};
</script>

<style lang="scss">
.inner {
  .van-cell__value {
    color: #26a2ff;
  }
  min-height: 100vh;
  background-color: #f5f5f5;
  .top {
    padding: 16px;
    background-color: #26a2ff;
    .topCard {
      background-color: #fff;
      border-radius: 5px;
      p {
        padding: 10px;
        font-weight: bold;
        font-size: 16px;
      }
      .infos {
        padding: 10px;
        display: flex;
        font-size: 14px;
        justify-content: space-between;
        .left {
          color: #c0c0c0;
        }
        .right {
          color: #3f9efa;
        }
      }
      .tip {
        background-color: rgba(63, 158, 250, 0.1);
        border-top: 1px solid rgba(63, 158, 250, 0.1);
        font-size: 12px;
        color: #ff0000;
        padding: 10px;
      }
    }
  }
  .form {
    margin-bottom: 20px;
  }
  .personInfo {
    margin: 20px 0 70px 0;
  }
  .absBottom {
    height: 50px;
    position: fixed;
    bottom: 0;
  }
}
.orders {
  font-size: 14px;
  color: #ff8c00;
  span {
    text-decoration: underline;
  }
}
.content {
  padding: 16px 16px 160px;
  font-size: 14px;
  p {
    font-weight: bold;
  }
  p,
  span {
    color: #3f9efa;
    padding: 10px;
  }
}
</style>
