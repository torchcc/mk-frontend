<template>
  <div>
    <div>
      <mt-header :title="type">
        <router-link
          to="/personal?type=收件地址&name=addr"
          slot="left"
          v-if="isAddress"
          @click.native.stop="isAddress = false"
        >
          <mt-button icon="back">返回</mt-button>
        </router-link>
        <router-link v-else to="/personalInfo" slot="left">
          <mt-button icon="back">返回</mt-button>
        </router-link>
        <mt-button slot="right" @click="$router.push({name:'examList'})">
          <van-icon name="wap-home-o" />
        </mt-button>
      </mt-header>

      <div class="personal_inner">
        <div v-if="name == 'name'" class="pdt">
          <van-cell-group>
            <van-field size="large" v-model="userName" placeholder="请输入用户名" />
          </van-cell-group>
          <p class="name_desc">用户名限2-12位中英文 数字</p>
          <van-button type="info" class="btn" @click="confirmName">保 存</van-button>
        </div>

        <div v-if="name == 'tel'" class="pdt">
          <div class="editPhoneNum">
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
                    <img :src="imgUrl" width="80px" height="40px" @click="changeImg" />
                  </template>
                </van-field>
                <van-field
                  v-model="verifyText"
                  clearable
                  left-icon="comment-circle"
                  class="ipt"
                  style="position:relative;"
                  placeholder="请输入验证码"
                />
                <van-button
                  type="info"
                  size="small"
                  v-show="!countDown"
                  class="miniBtn"
                  @click="msgCode"
                >获取验证码</van-button>
                <van-button type="info" size="small" v-show="countDown" class="miniBtn">{{sec}} s</van-button>
              </van-cell-group>
            </div>
          </div>
          <van-button type="info" class="btn" @click="login">确认修改</van-button>
        </div>

        <div v-if="name == 'addr'" class="pdt">
          <van-empty description v-if="arr.length<1" />
          <div v-if="arr.length > 0">
            <van-address-list
              :switchable="false"
              v-model="chosenAddressId"
              :list="list"
              v-if="!isAddress"
              default-tag-text="默认"
              @add="onAdd"
              @edit="onEdit"
            >
              <template slot="item-bottom" slot-scope="scope">
                <div style="display:flex;flex-direction:row-reverse;height:20px;margin-right:10px">
                  <van-button round type="danger" size="mini" @click="deleteAddr(scope)">删 除</van-button>
                </div>
              </template>
            </van-address-list>
            <div class="form" v-if="isAddress">
              <van-cell>
                <van-field
                  readonly
                  clickable
                  name="picker"
                  :value="columns.filter(item=>item.id == addr.province_id)[0]&&columns.filter(item=>item.id == addr.province_id)[0].name"
                  label="省份"
                  placeholder="点击选择省份"
                  @click="showPicker = true"
                />
                <van-popup v-model="showPicker" position="bottom">
                  <van-picker
                    show-toolbar
                    :columns="columns"
                    @confirm="onConfirm"
                    value-key="name"
                    @cancel="showPicker = false"
                  />
                </van-popup>
              </van-cell>

              <van-cell>
                <van-field
                  readonly
                  clickable
                  name="picker"
                  :value="cities.filter(item=>item.id == addr.city_id)[0]&&cities.filter(item=>item.id == addr.city_id)[0].name"
                  label="城市"
                  placeholder="点击选择城市"
                  @click="showPicker1 = true"
                />
                <van-popup v-model="showPicker1" position="bottom">
                  <van-picker
                    show-toolbar
                    :columns="cities"
                    value-key="name"
                    @confirm="onConfirm1"
                    @cancel="showPicker1 = false"
                  />
                </van-popup>
              </van-cell>

              <van-cell>
                <van-field
                  readonly
                  clickable
                  name="picker"
                  :value="area.filter(item=>item.id == addr.county_id)[0]&&area.filter(item=>item.id == addr.county_id)[0].name"
                  label="区/县"
                  placeholder="点击选择区/县"
                  @click="showPicker2 = true"
                />
                <van-popup v-model="showPicker2" position="bottom">
                  <van-picker
                    show-toolbar
                    :columns="area"
                    value-key="name"
                    @confirm="onConfirm2"
                    @cancel="showPicker2 = false"
                  />
                </van-popup>
              </van-cell>
              <van-cell>
                <van-field
                  readonly
                  clickable
                  name="picker"
                  :value="towns.filter(item=>item.id == addr.town_id)[0]&&towns.filter(item=>item.id == addr.town_id)[0].name"
                  label="乡/镇/街道"
                  placeholder="点击选择乡/镇/街道"
                  @click="showPicker3 = true"
                />
                <van-popup v-model="showPicker3" position="bottom">
                  <van-picker
                    show-toolbar
                    :columns="towns"
                    value-key="name"
                    @confirm="onConfirm3"
                    @cancel="showPicker3 = false"
                  />
                </van-popup>
              </van-cell>
              <van-cell>
                <van-field
                  v-model="addr.building_detail"
                  rows="2"
                  autosize
                  label="详细地址"
                  type="textarea"
                  maxlength="120"
                  placeholder="请输入详细地址"
                  show-word-limit
                />
              </van-cell>
              <van-cell>
                <van-field name="switch" label="设为默认">
                  <template #input>
                    <van-switch v-model="addr.is_default" size="20" />
                  </template>
                </van-field>
              </van-cell>

              <van-button type="info" class="btn" @click="confirm">保 存</van-button>
            </div>
          </div>
        </div>

        <div v-if="name == 'pwd'" class="pdt">
          <van-form @submit="onSubmit">
            <van-field
              v-model="oldPwd"
              type="password"
              name="旧密码"
              label="旧密码"
              placeholder="请输入旧的密码"
              :rules="[{ required: true, message: '请输入旧的密码' }]"
            />
            <van-field
              v-model="confirmOld"
              type="password"
              name="确认密码"
              label="确认密码"
              placeholder="请确认旧密码"
              :rules="[{ required: true, message: '请确认旧密码' }]"
            />
            <van-field
              v-model="newPwd"
              type="password"
              name="新密码"
              label="新密码"
              placeholder="请输入新密码"
              :rules="[{ required: true, message: '请输入新密码' }]"
            />

            <van-button type="info" class="btn" @click="onSubmit">保 存</van-button>
          </van-form>
        </div>

        <div v-if="name == 'head'" class="pdt">
          <div class="oldHead">
            <!--                        <img src="#" alt="">-->
            <van-uploader class="img" v-model="fileList" :max-count="1" multiple />
          </div>
          <div class="btns">
            <van-button type="info" class="btn" @click="onSubmit">保 存</van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { avatar, captcha, sms, loginRegister, profileInfo } from "@/api/exam";
import {
  getAddrs,
  addAddrs,
  regions,
  getAddrsById,
  editAddrs,
  deleteAddrs
} from "@/api/users";
import { Dialog } from "vant";
export default {
  name: "personal",
  data() {
    return {
      addr: {
        building_detail: "",
        city_id: 0,
        county_id: 0,
        is_default: 0,
        province_id: 0,
        town_id: 0
      },
      type: "",
      name: "",
      userName: "",
      description: "验证原号码",
      percent: 50,
      verify: "",
      telephone: "",
      captcha: "",
      verifyImg: "",
      verifyText: "",
      imgUrl: "",
      arr: [{}], //页面中如果地址数量大于1则不现实空白页
      chosenAddressId: "1",
      list: [],
      columns: [],
      cities: [],
      area: [],
      towns: [],
      showPicker: false,
      showPicker1: false,
      showPicker2: false,
      showPicker3: false,
      message: "",
      switchChecked: false,
      isAddress: false,
      oldPwd: "",
      confirmOld: "",
      newPwd: "",
      fileList: [],
      sec: 0,
      countDown: false, //f-获取验证码 t-倒计时
      timer: null
    };
  },
  created() {
    this.type = this.$route.query.type;
    this.name = this.$route.query.name;

    this.regionsA();
    this.getCaptcha();
    this.getAddrs();
  },
  methods: {
    async deleteAddr(item) {
      Dialog.confirm({
        title: "注意",
        message: "您确定要删除此地址吗"
      })
        .then(async () => {
          const res = await deleteAddrs(item.id);
          if (res.ecode == 0) {
            Toast("删除成功");
            this.getAddrs();
          }
        })
        .catch(() => {
          // on cancel
        });
    },
    async getAddrs() {
      this.list = [];
      const res = await getAddrs();
      res.data.map(item => {
        this.list.push({
          id: item.id,
          address:
            item.province_name +
            item.city_name +
            item.county_name +
            item.town_name +
            item.city_name,
          isDefault: item.is_default,
          name: "常用地址" + item.id,
          tel: ""
        });
      });
    },
    async addAddrs() {
      const res = await addAddrs();
    },
    async getCaptcha() {
      const res = await captcha();
      this.imgUrl = res.data.captcha_img_url;
    },
    async getCode() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.sec = TIME_COUNT;
        const obj = {
          mobile: this.telephone,
          captcha_code:this.captcha
        };
        const res = await sms(obj);
        this.timer = setInterval(() => {
          if (this.sec > 0 && this.sec <= TIME_COUNT) {
            this.sec--;
          } else {
            this.countDown = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    async msgCode() {
      if (this.telephone == "" || this.captcha == "") {
        Toast.fail("请填写手机号和图形验证码！");
        return false;
      } else {
        this.countDown = true;
        this.getCode();
      }
    },

    async login() {
      const data = {
        captcha_code: this.captcha,
        latitude: 0,
        longitude: 0,
        mobile: this.telephone,
        sms_code: this.verifyText
      };
      const res = await loginRegister(data);
      if (res.ecode == 0) {
        Toast("修改成功！");
      }
    },
    changeImg() {
      this.getCaptcha();
      //点击后替换新的验证码图片
    },
    //修改用户名
    async confirmName() {
      const data = {
        gender: this.$route.query.value == "男" ? 1 : 2,
        update_time: 0,
        user_id: 0,
        user_name: this.userName
      };
      const res = await profileInfo(data);
      console.log(res);
      if (res.ecode == 0) {
        this.showPicker = false;
        Toast("昵称修改成功");
      }
    },
    async confirm() {
      if (this.addr.province_id == 0) {
        Toast("请选择省份！");
        return;
      }
      if (this.addr.city_id == 0) {
        Toast("请选择城市！");
        return;
      }
      if (this.addr.county_id == 0) {
        Toast("请选择区/县！");
        return;
      }
      if (this.addr.town_id == 0) {
        Toast("请选择乡/镇/街道！");
        return;
      }
      if (this.addr.building_detail == "") {
        Toast("请填写详细地址！");
        return;
      }

      let res;
      this.addr.is_default = this.addr.is_default ? 1 : 0;
      if (this.isAddrEdit) {
        res = await editAddrs(this.addr, this.addr.id);
      } else {
        res = await addAddrs(this.addr);
      }
      if (res.ecode == 0) {
        Toast(this.isAddrEdit ? "修改成功" : "添加成功");
        this.getAddrs();
        this.isAddress = false;
      }
    },
    async regionsA(id = 0) {
      const res = await regions({ parent_id: id });
      this.columns = res.data;
    },
    async regionsB(id = 0) {
      const res = await regions({ parent_id: id });
      this.cities = res.data;
    },
    async regionsC(id = 0) {
      const res = await regions({ parent_id: id });
      this.area = res.data;
    },
    async regionsD(id = 0) {
      const res = await regions({ parent_id: id });
      this.towns = res.data;
    },
    onAdd() {
      this.isAddrEdit = false;
      this.addr = {
        building_detail: "",
        city_id: 0,
        county_id: 0,
        is_default: 0,
        province_id: 0,
        town_id: 0
      };
      this.isAddress = true;
    },
    async onEdit(item, index) {
      const res = await getAddrsById(item.id);
      if (res.ecode == 0) {
        this.addr = res.data;
        this.addr.id = item.id;
        this.addr.is_default = !!this.addr.is_default;

        await this.regionsA(0);
        await this.regionsB(this.addr.province_id);
        await this.regionsC(this.addr.city_id);
        await this.regionsD(this.addr.county_id);
        this.isAddrEdit = true;
        this.isAddress = true;
      }
    },
    onConfirm(value) {
      this.addr.province_id = value.id;
      this.regionsB(this.addr.province_id);
      this.addr.city_id = 0;
      this.addr.county_id = 0;
      this.addr.town_id = 0;
      this.addr.building_detail = "";
      this.showPicker = false;
    },
    onConfirm1(value) {
      this.addr.city_id = value.id;
      this.regionsC(this.addr.city_id);
      this.addr.county_id = 0;
      this.addr.town_id = 0;
      this.addr.building_detail = "";
      this.showPicker1 = false;
    },
    onConfirm2(value) {
      this.addr.county_id = value.id;
      this.regionsD(this.addr.county_id);
      this.addr.town_id = 0;
      this.addr.building_detail = "";
      this.showPicker2 = false;
    },
    onConfirm3(value) {
      this.addr.town_id = value.id;
      this.addr.building_detail = "";
      this.showPicker3 = false;
    },
    //提交头像
    async onSubmit(values) {
      const formData = new FormData();
      formData.set("avatar", this.fileList[0].file);
      const res = await avatar(formData);
      console.log(res);
      if (res.data.ecode == 0) {
        Dialog.alert({
          message: "头像上传成功!"
        });
      }
    },
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
    }
  }
};
</script>

<style lang="scss" scope>
.personal_inner {
  background: #f5f5f5;
  height: 100vh;
  .pdt {
    padding-top: 10px;
  }
  .name_desc {
    font-size: 14px;
    color: #c0c0c0;
    padding: 10px;
  }
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
      border: none;
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
    right: 10px;
  }
}
.btn {
  width: 90%;
  border-radius: 20px;
  margin-top: 34px;
  position: absolute;
  font-size: 18px;
  left: 50%;
  transform: translateX(-50%);
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
.oldHead {
  padding: 20px 40px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  .img {
    display: inline-block;
    border-radius: 50%;
  }
}
.btns {
  padding-top: 20px;
  display: flex;
  justify-content: center;
  .button {
    width: 30%;
    border-radius: 30px;
  }
}
</style>
