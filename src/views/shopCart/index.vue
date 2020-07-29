<template>
  <div>
    <mt-header fixed title="购物车">
      <!-- <mt-button @click="$router.go(-1)" slot="left" icon="back">返回</mt-button> -->
      <router-link to="#" slot="right">
        <mt-button @click="deleteItem">删除</mt-button>
      </router-link>
    </mt-header>
    <div class="inner">
      <div class="pad">
        <!--                   <van-button icon="add-o" type="info" class="" @click="order">下单测试</van-button>-->
        <div class="cart_card" v-for="(item,index) in orderList" :key="index">
          <div class="hostipalName">{{item.hospital_name}}</div>
          <div class="orderDeail">
            <van-field name="radio">
              <template #input>
                <van-checkbox-group v-model="radios" direction="horizontal">
                  <van-checkbox :name="item.id" shape="round"></van-checkbox>
                </van-checkbox-group>
              </template>
            </van-field>
            <div class="img" @click.stop="goPkg(item)">
              <img :src="item.avatar_url" alt />
            </div>
            <div class="right">
              <p>{{item.name}}</p>
              <div class="rBottom">
                <p style="line-height: 66px;">¥{{item.pkg_price | fmtPrice}}</p>
                <div>
                  <van-field name="stepper">
                    <template #input>
                      <van-stepper
                        input-width="20px"
                        button-size="20px"
                        v-model="item.pkg_count"
                        @change="onChange"
                      />
                    </template>
                  </van-field>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <van-submit-bar :price="price" button-text="提交订单" @submit="order">
        <van-checkbox v-model="checked" @click="all">全选</van-checkbox>
      </van-submit-bar>
    </div>
  </div>
</template>

<script>
import { cart, deleteCart } from "@/api/exam";
import { Dialog, Toast } from "vant";

export default {
  name: "index",
  data() {
    return {
      radios: [],
      orderList: [],
      stepperedst: [],
      stepper: 1,
      checked: false,
      price: 0
    };
  },
  async created() {
    const res = await cart();
    this.orderList = res.data;

    let num = 0;
    this.orderList.map(item => {
      if (this.radios.some(radio => radio == item.id)) {
        num += item.pkg_price;
      }
    });
    this.price = num;
  },
  methods: {
    goPkg(item){
      this.$router.push({
        name:"examInfo",
        query:{
          id:item.pkg_id
        }
      })
    },
    onChange() {
      let num = 0;
      this.orderList.map(item => {
        if (this.radios.some(radio => radio == item.id)) {
          num += (item.pkg_price * item.pkg_count);
        }
      });
      this.price = num;
    },
    async order() {
      if (this.radios.length < 1) {
        Toast.fail("请选择要购买的套餐！");
      } else {
        const arr = this.orderList.filter(item =>
          this.radios.some(radio => radio == item.id)
        );
        this.$store.commit("setOrderList", arr);
        this.$router.push({
          name: "order"
        });
      }
    },
    all() {
      if (this.checked) {
        this.radios = [];
        this.orderList.map(item => {
        this.radios.push(item.id);
        });
      } else {
        this.radios = [];
      }
    },
    async deleteItem() {
      if (this.radios.length < 1) {
        Toast.fail("请至少选中一条！");
      } else {
        Dialog.confirm({
          title: "温馨提示",
          message: "是否确认删除？"
        }).then(() => {
          const data = {
            cart_ids: this.radios
          };
          deleteCart(data).then(item => {
            if (item.ecode == 0) {
              Toast("删除成功！");
              cart().then(res => {
                this.orderList = res.data;
              });
            }
          });
        });
      }
    }
  },
  filters: {
    fmtPrice(val) {
      return ((val - 0) / 100).toFixed(2);
    }
  },
  watch: {
    radios() {
      this.onChange()
      if (this.radios.length != this.orderList.length) {
        this.checked = false;
      } else {
        this.checked = true;
      }
    }
  }
};
</script>

<style lang="scss">
.van-submit-bar {
  bottom: 57px;
}
.inner {
  background: #f5f5f5;
  height: 100vh;
  .btn {
    width: 76%;
    border-radius: 20px;
    position: absolute;
    font-size: 18px;
    left: 50%;
    transform: translateX(-50%);
  }
  .pad {
    margin-top: 40px;
    padding-top: 1px;
    .cart_card {
      height: auto;
      margin: 30px 16px;
      border-radius: 10px;
      background-color: #fff;
      padding: 10px 20px 20px 20px;
      box-shadow: 0 8px 12px #ebedf0;
      .hostipalName {
        padding: 6px;
        border-bottom: 1px solid #c0c0c0;
      }
      .orderDeail {
        display: flex;
        justify-content: flex-start;
        padding: 10px 0;
        img {
          display: inline-block;
          width: 80px;
          height: 80px;
          margin-right: 10px;
          background-color: pink;
          border-radius: 20px;
        }
        .right {
          font-size: 14px;
          width: 100%;
          .rBottom {
            display: flex;
            font-size: 16px;
            color: #ff0000;
            justify-content: space-between;
          }
        }
        .van-cell {
          width: auto;
          padding: 20px 10px 0 0;
        }
      }
    }
  }
}
</style>
