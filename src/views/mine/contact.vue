<template>
  <!-- 当从常用联系人进来时-->
  <div class="commonly">
    <mt-header :title="`常用体检人`">
      <router-link v-if="isAdd" slot="left" to="/layout/mine">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <router-link v-else slot="left" to="/contact" @click.native="isAdd = true">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button slot="right" @click="$router.push({name:'examList'})">
         <van-icon name="wap-home-o" />
       </mt-button>
    </mt-header>
    <div v-if="isAdd">
      <div class="commonly_user">
        <van-button icon="add-o" type="info" class="commonly_add" @click="addUser">添加</van-button>
      </div>
      <!--常用体检人卡片 后期需要加逻辑判断，即拉取到的用户信息数量-->
      <div class="commonly_card" v-for="(item,index) in examinees" :key="index">
        <div class="top">
          <div class="left">{{item.examinee_name}}</div>
          <div class="right">
            <span @click="deleteExaminess(item)">删除</span>
            <van-button
              round
              type="primary"
              size="small"
              class="commonly_edit"
              @click="edit(item)"
            >编辑</van-button>
          </div>
        </div>
        <div class="bottom">
          <div class="detail">
            <div class="detail_info">
              <p style="margin-right: 30px;">{{item.age}}岁</p>
              <p>{{item.is_married==1?"已婚":"未婚"}}</p>
            </div>
            <p>手机号：{{item.examinee_mobile}}</p>
            <p>证件号：{{item.id_card_no}}</p>
          </div>
          <div class="imgs">
            <img :src="require('@/assets/user.png')" alt />
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isAdd">
      <div class="form">
        <van-cell-group>
          <van-field v-model="form.examinee_name" required label="姓名" placeholder="体检人姓名" />
          <van-field
            readonly
            required
            clickable
            name="relation"
            :value="columns.filter(item=>item.value==form.relation)[0].label"
            label="关系"
            placeholder="请选择与体检人的关系"
            @click="showPicker = true"
          />
          <van-popup v-model="showPicker" position="bottom">
            <van-picker
              show-toolbar
              value-key="label"
              :columns="columns"
              @confirm="onConfirm"
              @cancel="showPicker = false"
            />
          </van-popup>
          <!--<van-action-sheet
            v-model="show"
            :actions="actions"
            cancel-text="取消"
            close-on-click-action
            @cancel="onCancel"
          />-->
          <van-field v-model="form.id_card_no" required label="身份证" placeholder="请填写身份证号码" />
          <van-field label="婚姻状况" name="gender" required>
            <template #input>
              <van-radio-group
                direction="horizontal"
                v-model.number="form.is_married"
                placeholder="请选择婚姻状况"
              >
                <van-radio :name="1">已婚</van-radio>
                <van-radio :name="2">未婚</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field v-model="form.examinee_mobile" required label="手机号" placeholder="请输入手机号" />
        </van-cell-group>

        <van-button type="info" class="btn" @click="commonlySubmit">确 认</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getExaminees, addExaminess, editExaminess, deleteExaminess } from "@/api/users";
import {Dialog,Toast} from "vant"
export default {
  name: "Contact",
  data() {
    return {
      isEdit: false,
      columns: [
        { value: 0, label: "本人" },
        { value: 1, label: "父亲" },
        { value: 2, label: "兄弟姐妹" },
        { value: 3, label: "儿子" },
        { value: 4, label: "女儿" },
        { value: 5, label: "母亲" },
        { value: 6, label: "夫妻" },
        { value: 7, label: "其他" }
      ],
      showPicker: false,
      isAdd: true, //切换添加按钮和添加用户的form true:添加按钮展示
      form: {
        examinee_mobile: "",
        examinee_name: "",
        id_card_no: "",
        is_married: 0,
        relation: 0
      },
      examinees: []
    };
  },
  methods: {
    onConfirm(value) {
      this.form.relation = value.value;
      this.showPicker = false;
    },
    //添加常用联系人
    addUser() {
      this.isAdd = false;
      this.isEdit = false;
    },
    //提交添加体检人的方法
    async commonlySubmit() {
      //axios
      //提交信息后取得返回值
      //清空form的信息
      let res;
      if (this.isEdit) {
        res = await editExaminess(this.form, this.form.id);
      } else {
        res = await addExaminess(this.form);
      }
      if (res.ecode == 0) {
        this.form = {};
        this.getExaminees();
        Toast(this.isEdit ? "修改成功" : "添加成功");
        this.isAdd = true;
      }
    },
    async deleteExaminess(item) {
        Dialog.confirm({
        title: '注意',
        message: '确认要删除常用体检人吗',
        })
        .then(async () => {
            const res = await deleteExaminess(item.id);
              if (res.ecode == 0) {
                this.getExaminees();
                Toast("删除成功");
              }
        })
        .catch(() => {
        });
    },
    //卡片编辑
    edit(item) {
      this.form = item;
      this.isEdit = true;
      //获取到当前卡片上的信息
      //打开form
      //传递给form
      this.isAdd = false;
    },
    async getExaminees() {
      const res = await getExaminees();
      if (res.ecode == 0) {
        this.examinees = res.data;
      }
    }
  },

  created() {
    this.getExaminees();
  }
};
</script>

<style lang="scss">
/*
    * 常用体检人
    */
.commonly {
  .commonly_user {
    padding: 20px 30px;
    .commonly_add {
      width: 100%;
      height: 4em;
      border-radius: 8px;
      border: none;
      color: #3f9efa;
      line-height: 4em;
      font-size: 16px;
      background: rgb(255, 255, 255);
      box-shadow: 0 8px 12px #ebedf0;
    }
  }
  .form {
    padding-top: 20px;
    .btn {
      width: 90%;
      border-radius: 20px;
      margin-top: 50px;
      position: absolute;
      font-size: 18px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .commonly_card {
    height: auto;
    margin: 0 30px;
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
        .commonly_edit {
          width: 5em;
          height: 2em;
          margin-left: 6px;
          background: #3f9efa;
        }
      }
    }
    .bottom {
      height: 80px;
      display: flex;
      overflow: hidden;
      padding: 10px 0 10px 20px;
      justify-content: space-between;
      .detail {
        font-size: 12px;
        color: #cdcdcd;
        p {
          padding: 5px 0;
        }
        .detail_info {
          display: flex;
          justify-content: flex-start;
        }
      }
      .imgs {
        width: 7em;
        height: 7em;
        img {
          display: inline-block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
