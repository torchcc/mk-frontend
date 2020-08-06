<template>
  <div class="exam_list_box">
    <mt-header fixed title="体检中心"></mt-header>

    <div class="exam_search">
      <!--搜索框-->
      <mt-field placeholder="请输入搜索条件" v-model="name">
        <mt-button @click="searchPkgF" size="small">搜索</mt-button>
      </mt-field>
      <div class="searchInfoBox">
        <div
          :class="order_by&&'active'"
          @click="showPopup('order_by')"
          class="searchInfoList"
        >{{recommendList.filter(item=>item.value==order_by)[0] && recommendList.filter(item=>item.value==order_by)[0].label||"排序推荐"}}▾</div>
        <div
          :class="category_id&&'active'"
          @click="showPopup('category_id')"
          class="searchInfoList"
        >{{typeList.filter(item=>item.value==category_id)[0] && typeList.filter(item=>item.value==category_id)[0].label||"套餐推荐"}}▾</div>
        <div
          :class="section&&'active'"
          @click="showPopup('section')"
          class="searchInfoList"
        >{{sectionList.filter(item=>item.value==section)[0] && sectionList.filter(item=>item.value==section)[0].label||"价格区间"}}▾</div>
        <div @click="showPopup('screen')" class="searchInfoList">
          筛选▾
          <mt-badge size="small" type="error" v-if="activeIds.length">{{activeIds.length}}</mt-badge>
        </div>
      </div>
      <div class="type-list">
        <div class="overflow-box">
          <div
            :class="(item.value)==category_id&&'active'"
            :key="index"
            @click="typeAction(item.value)"
            class="fl"
            v-for="(item,index) in typeList"
          >{{item.label}}</div>
        </div>
      </div>
      <mt-popup position="top" v-model="popupVisible" style="height: 70vh;overflow: auto;">
        <div style="width:100vw">
          <!-- <div style="height:40px"></div> -->
        </div>
        <div v-if="showType=='order_by'">
          <mt-cell>
            <div @click="clearSearchInfo('order_by')">不限</div>
          </mt-cell>
          <mt-cell
            :key="index"
            @click.native="enterSearchInfo(item.value)"
            v-for="(item,index) in (recommendList)"
          >
            <div :class="(item.value)==order_by&&'active'">{{item.label}}</div>
          </mt-cell>
        </div>
        <div v-if="showType=='category_id'">
          <mt-cell>
            <div @click="clearSearchInfo('category_id')">不限</div>
          </mt-cell>
          <mt-cell
            :key="index"
            @click.native="enterSearchInfo(item.value)"
            v-for="(item,index) in typeList"
          >
            <div :class="item.value==category_id&&'active'">{{item.label}}</div>
          </mt-cell>
        </div>
        <div v-if="showType=='section'">
          <mt-cell>
            <div @click="clearSearchInfo('section')">不限</div>
          </mt-cell>
          <mt-cell
            :key="index"
            @click.native="enterSearchInfo(item.value)"
            v-for="(item,index) in sectionList"
          >
            <div :class="(item.value)==section&&'active'">{{item.label}}</div>
          </mt-cell>
        </div>
        <div v-if="showType=='screen'">
          <TreeSelect
            :active-id.sync="activeIds"
            :items="items"
            :main-active-index.sync="activeIndex"
            @click-item="changeSec"
          ></TreeSelect>
          <div style="margin-top:10px">
            <van-button
              style="float:right;margin-right:20px"
              size="small"
              plain
              type="danger"
              @click="popupVisible = false"
            >确定</van-button>
            <van-button
              style="float:right;margin-right:20px"
              size="small"
              plain
              type="danger"
              @click="resetActiveIds"
            >重置</van-button>
          </div>
        </div>
      </mt-popup>
    </div>
    <div class="header_bar"></div>

    <div class="exam_inner">
      <!--套餐列表-->
      <div class="exam_list">
        <div :key="key" @click="toDetail(item.id)" class="examList_card" v-for="(item,key) in res">
          <div class="card_top">
            <div class="card_img">
              <img :src="item.avatar_url" />
            </div>
            <div class="card_detail">
              <div>
                <p class="no-wrap">{{item.name}}</p>
              </div>
              <div
                class="flags"
              >{{levelList.filter(i=>i.value==item.level)[0] && levelList.filter(i=>i.value==item.level)[0].label}}</div>
              <div class="card_price">
                <div class="price">
                  <span>¥{{(item.price_real/100).toFixed(2)}}</span>
                  <span
                    :style="{fontSize:'12px',textDecoration:'line-through'}"
                  >¥{{(item.price_original/100).toFixed(2)}}</span>
                </div>
                <div class="sold" v-if="item.sold > 0">已约{{item.sold}}单</div>
              </div>
            </div>
          </div>
          <div class="card_bottom">
            <div class="hospital">
              <span>
                <van-icon name="hotel-o" />
              </span>
              {{item.hospital_name}}
            </div>
            <div
              class="hospital_level"
            >{{levelList.filter(val=>val.value==item.level)[0] && levelList.filter(val=>val.value==item.level)[0].label}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TreeSelect } from "vant";
import { pkg, categories, diseases } from "@/api/exam";
export default {
  name: "list",
  data() {
    return {
      page_no: 1,
      has_next: 1,
      value: "",
      popupVisible: false,
      name: "",
      order_by: 0,
      category_id: 0,
      max_price: 0,
      min_price: 0,
      target: 0,
      disease: 0,
      level: 0,
      section: 0,
      screen: [],
      showType: "",
      recommendList: [
        { value: 1, label: "低价优先" },
        { value: 2, label: "高价优先" }
      ],
      typeList: [
        { value: 1, label: "入职体检" },
        { value: 2, label: "核酸检测" },
        { value: 3, label: "全身体检" },
        { value: 4, label: "常规体检" },
        { value: 5, label: "基础体检" },
        { value: 6, label: "中老年体检" },
        { value: 7, label: "高端体检" },
        { value: 8, label: "青年体检" },
        { value: 9, label: "职场白领" },
        { value: 10, label: "老年体检" },
        { value: 11, label: "儿童体检" },
        { value: 12, label: "孕前体检" },
        { value: 13, label: "影像检查" },
        { value: 14, label: "肿瘤筛查" },
        { value: 15, label: "青少年体检" },
        { value: 16, label: "团检体检" },
        { value: 17, label: "男性体检" },
        { value: 18, label: "女性体检" },
        { value: 19, label: "妇科体检" },
        { value: 20, label: "父母体检" },
        { value: 21, label: "中青年体检" },
        { value: 22, label: "陪检服务" }
      ],
      sectionList: [
        { value: 1, label: "300元以下" },
        { value: 2, label: "300~1000元" },
        { value: 3, label: "1000~1500元" },
        { value: 4, label: "1500~3000元" },
        { value: 5, label: "3000以上" }
      ],
      levelList: [
        { value: 1, label: "公里三甲" },
        { value: 2, label: "公立医院" },
        { value: 3, label: "民营医院" },
        { value: 4, label: "专业机构" }
      ],
      items: [
        {
          text: "医院等级",
          children: [
            { text: "公立三甲", id: "1-1" },
            { text: "公立医院", id: "1-2" },
            { text: "民营医院", id: "1-3" },
            { text: "专业机构", id: "1-4" }
          ]
        },
        {
          text: "适用人群",
          children: [
            { text: "男士", id: "2-1" },
            { text: "女未婚", id: "2-2" },
            { text: "女已婚", id: "2-3" }
          ]
        },
        {
          text: "高发疾病",
          children: [
            { text: "食物不耐受检测", id: "3-1" },
            { text: "骨关节疾病体检", id: "3-2" },
            { text: "健康防癌体检", id: "3-3" },
            { text: "幽门螺旋杆菌检测", id: "3-4" },
            { text: "甲状腺检测", id: "3-5" },
            { text: "糖尿病检测", id: "3-6" }
          ]
        }
      ],
      activeIds: [],
      activeIndex: 0,
      res: [],
      active: "tab-container1",
      isNavFlag: false,
      id1: "推荐排序",
      id2: "套餐分类",
      id3: "价格区间",
      id4: "筛选"
    };
  },
  components: {
    TreeSelect
  },
  async created() {
    this.getCategories();
    this.searchPkg();
    this.getDiseases();
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
        this.searchPkg();
      }
    };
  },
  methods: {
    searchPkgF(){
      this.initPageList()
      this.searchPkg()
    },
    resetActiveIds() {
      this.activeIds = [];
      this.level = 0;
      this.target = 0;
      this.disease = 0;
    },
    async getCategories() {
      const res = await categories();
      const list = [];
      res.data.map(item => {
        list.push({ value: item.id, label: item.name });
      });
      this.typeList = list;
    },
    async getDiseases() {
      const res = await diseases();
      const illness = {
        text: "高发疾病",
        children: []
      };

      res.data.map(item => {
        illness.children.push({ text: item.name, id: "3-" + item.id });
      });
      this.$set(this.items, "2", illness);
    },
    initPageList(){
      this.res = []
      this.page_no = 1
      this.has_next = 1
      document.documentElement.scrollTop = 0
    },
    async searchPkg() {
      if (this.has_next == 1) {
        const res = await pkg({
          page_no: this.page_no,
          page_size: 10,
          name: this.name,
          order_by: this.order_by,
          category_id: this.category_id,
          max_price: this.max_price,
          min_price: this.min_price,
          target: this.target,
          disease_id: this.disease,
          level: this.level
        });
        this.page_no++;
        this.res.push(...res.data.list);
        this.has_next = res.data.has_next;
      }
    },
    changeSec(value) {
      var levelStr = "1-" + this.level;
      var targetStr = "2-" + this.target;
      var diseaseStr = "3-" + this.disease;
      var iArr = value.id.split("-");
      switch (iArr[0]) {
        case "1":
          if (this.level == iArr[1]) {
            this.level = 0;
          } else {
            this.level = iArr[1];
          }
          levelStr = String(iArr[0]) + "-" + String(iArr[1]);
          break;
        case "2":
          if (this.target == iArr[1]) {
            this.target = 0;
          } else {
            this.target = iArr[1];
          }
          targetStr = String(iArr[0]) + "-" + String(iArr[1]);
          break;
        case "3":
          if (this.disease == iArr[1]) {
            this.disease = 0;
          } else {
            this.disease = iArr[1];
          }
          diseaseStr = String(iArr[0]) + "-" + String(iArr[1]);
          break;
      }
      this.activeIds = [];
      if (this.level) {
        this.activeIds.push(levelStr);
      }
      if (this.target) {
        this.activeIds.push(targetStr);
      }
      if (this.disease) {
        this.activeIds.push(diseaseStr);
      }
    },
    showPopup(type) {
      this.popupVisible = true;
      this.showType = type;
    },
    enterSearchInfo(value) {
      this[this.showType] = value;
      if (this.showType == "section") {
        if (value == 1) {
          this.min_price = 0;
          this.max_price = 30000;
        } else if (value == 2) {
          this.min_price = 30000;
          this.max_price = 1000000;
        } else if (value == 3) {
          this.min_price = 1000000;
          this.max_price = 1500000;
        } else if (value == 4) {
          this.min_price = 1500000;
          this.max_price = 300000;
        } else if (value == 5) {
          this.min_price = 3000000;
          this.max_price = 0;
        } else {
          this.min_price = 0;
          this.max_price = 0;
        }
      }
      this.popupVisible = false;
      this.initPageList()
      this.searchPkg();
    },
    typeAction(item) {
      if (this.category_id == item) {
        this.category_id = 0;
      } else {
        this.category_id = item;
      }
      this.initPageList()
      this.searchPkg();
    },
    clearSearchInfo(type) {
      this[type] = 0;
      if (type == "screen") {
        this.min_price = 0;
        this.max_price = 0;
      }
      this.popupVisible = false;
      this.initPageList()
      this.searchPkg();
    },
    toDetail(id) {
      this.$router.push({
        name: "examInfo",
        query: {
          id: id
        }
      });
    }
  },
  watch: {
    popupVisible() {
      this.searchPkg();
    }
  }
};
</script>

<style lang="scss">
.exam_list_box {
  .header_bar {
    height: 160px;
  }
  .hd {
    font-size: 18px;
  }
  .type-list {
    width: 100vw;
    overflow: auto;
    .overflow-box {
      width: 650vw;
      .fl {
        background: #ccc;
        color: #fff;
        font-size: 12px;
        padding: 4px;
        border-radius: 4px;
        margin: 10px;
        float: left;
      }
      .active {
        color: #fff !important;
        background: dodgerblue;
      }
    }
  }
  .exam_search {
    position: fixed;
    top: 40px;
    z-index: 100000;
    width: 100vw;
    background: #fff;
    margin-bottom: 10px;
    .mint-cell {
      .mint-cell-wrapper {
        .mint-cell-value {
          div {
            padding: 0px 10px;
          }
        }
      }
    }
    .active {
      color: dodgerblue !important;
    }
    .searchInfoBox {
      display: flex;
      justify-content: space-around;
      .searchInfoList {
        float: left;
        margin: 10px;
        font-size: 12px;
        color: #888;
        border-radius: 10px;
        box-sizing: border-box;
      }
    }
  }
  .mint-cell-value {
    width: 100vw;
    input {
      border: 1px solid #cccccc;
      border-radius: 30px;
      padding-left: 10px;
    }
  }
  .exam_inner {
    min-height: 92vh;
    padding: 10px 12px 10px 12px;
    background-color: #f5f5f5;
    .exam_sort {
      width: 100%;
      height: 150px;
      background-color: rgb(245, 245, 245);
      .sort_top {
        width: 100%;
        height: 100px;
        .mint-button {
          border-radius: 0;
        }
      }
    }
    .examList_card {
      width: 100%;
      height: 140px;
      background-color: #fff;
      margin: 10px 0;
      border-radius: 10px;
      box-shadow: #696969 0px 0px 4px;
      .card_top {
        padding: 10px 15px;
        display: flex;
        justify-content: flex-start;
        .card_img {
          width: 110px;
          height: 90px;
          margin-right: 15px;
          background-color: lightblue;
          img {
            width: 110px;
            height: 100%;
          }
        }
        .card_detail {
          width: 100%;
          .no-wrap {
            width: 45vw;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          p {
            font-size: 14px;
          }
          .flags {
            font-size: 12px;
            width: 60px;
            margin-top: 10px;
            padding: 4px;
            color: #1e90ff;
            text-align: center;
            background: rgba(87, 168, 180, 0.1);
          }
          .card_price {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            .price {
              color: #dc143c;
            }
            .sold {
              font-size: 12px;
              color: #696969;
            }
          }
        }
      }
      .card_bottom {
        width: 100%;
        height: 28px;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0px 10px;
        .hospital {
          color: #696969;
          font-size: 14px;
        }
        .hospital_level {
          font-size: 14px;
          color: #696969;
        }
      }
    }
  }
}
</style>
