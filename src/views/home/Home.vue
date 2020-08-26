<!--  -->
<template>
  <div class>
    <div class="nav-bar">
      <!-- <div class="company">三江分公司</div>-->
      <div class="company">{{userInfo.deptName}}</div>
      <div class="userinfo">
        <p class="name">{{userInfo.user.name || ''}}</p>
        <p class="phone">{{userInfo.user.id}}</p>
        <!--  <p class="name">周杰伦</p>
        <p class="phone">15577220012</p>-->
      </div>
    </div>
    <div class="count" v-show="isManager">
      <div class="count-item">
        <div class="count-item-num">{{totalNum.totalNum||0}}</div>
        <div class="count-item-text">总任务量</div>
      </div>
      <div class="count-item">
        <div class="count-item-num">{{totalNum.uploadNum||0}}</div>
        <div class="count-item-text">总上传</div>
      </div>
      <div class="count-item">
        <div class="count-item-num">{{notFinishNum}}</div>
        <div class="count-item-text">未完成</div>
      </div>
    </div>
    <div class="count" v-show="!isManager">
      <div class="count-item">
        <div class="count-item-single">{{totalNum.selfNum||0}}</div>
        <div class="count-item-text">己上传</div>
      </div>
    </div>

    <van-tabs v-model="active" @click="onTabClick" color="#009688">
      <van-tab title="上传">
        <van-uploader class="image-show" v-model="fileList" :after-read="afterRead" multiple />
        <div class="mark-text">上传示例↓</div>
        <home-swiper :banners="banners" @swiperImageFinishLoad="swiperImageFinishLoad"></home-swiper>
      </van-tab>
      <van-tab title="已上传">
        <van-dropdown-menu class="dropdown-menu">
          <van-dropdown-item v-model="queryType" @change="dropdownChange1" :options="option1" />
          <van-dropdown-item v-model="orderBy" @change="dropdownChange2" :options="option2" />
        </van-dropdown-menu>
        <van-uploader
          class="image-show"
          v-model="imageList"
          :show-upload="isShow"
          :before-delete="beforeDelete"
          @delete="deleteImage"
          multiple
          disabled
        />
        <van-pagination
          class="tab-pagination"
          v-model="currentPage"
          @change="onPagination"
          :page-count="pageCount"
          mode="simple"
        />
      </van-tab>
    </van-tabs>
    <!--<tab-control ref="tabControl" :titles="['上传','已上传']" @tabClick="tabClick"></tab-control>-->
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
// import jquery from '@/static/jquery-2.0.0.min'
// import WebUploader from '@/static/webuploader'

// import TabControl from '@/components/tabControl/TabControl'
import HomeSwiper from '@/views/home/childComponents/HomeSwiper'
import { Button } from 'vant'

import storage from '@/store/myStorage'
import * as types from '@/store/mutations-types'
import { getUserInfo } from '@/network/userInfo'
import { getTotalNum, getFiles, updateFile, removeFile } from '@/network/business'

import utils from '@/common/utils'

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    HomeSwiper
  },
  data() {
    //这里存放数据
    return {
      //查看图片
      queryType: 1,
      //查看图片排序
      orderBy: 'createTime desc',
      option1: [
        { text: '全部', value: 0 },
        { text: '只看自己', value: 1 }
      ],
      option2: [
        { text: '按时间↑', value: 'createTime asc' },
        { text: '按时间↓', value: 'createTime desc' }
      ],
      pageData: new Map(),
      //图片总数量
      totalCount: 0,
      limit: 12,
      //图片排序
      currentPage: 1,
      managerCode: 0,
      isShow: false,
      active: 2,
      imageList: [
        // { url: 'https://img.yzcdn.cn/vant/leaf.jpg' },
        // { url: 'https://img.yzcdn.cn/vant/leaf.jpg' },
        // { url: 'https://img.yzcdn.cn/vant/leaf.jpg' },
        // { url: 'https://img.yzcdn.cn/vant/leaf.jpg' }
      ],
      fileList: [
        // { url: 'https://img.yzcdn.cn/vant/leaf.jpg' },
        // Uploader 根据文件后缀来判断是否为图片文件
        // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
        // { url: 'https://cloud-image', isImage: true },
      ],
      userInfo: {
        user: {}
      },
      totalNum: {},
      banners: [
        { image: 'http://111.12.86.155:8332/swiper/1.png' },
        { image: 'http://111.12.86.155:8332/swiper/2.png' },
        { image: 'http://111.12.86.155:8332/swiper/3.png' },
        { image: 'http://111.12.86.155:8332/swiper/4.png' },
      ],
    }
  },
  //监听属性 类似于data概念
  computed: {
    notFinishNum() {
      let totalNum = this.totalNum.totalNum || 0
      let uploadNum = this.totalNum.uploadNum || 0
      return totalNum - uploadNum
    },
    selfNum() {
      return (this.totalNum.selfNum || 0).toString()
    },
    isManager() {
      return this.managerCode === 1
    },
    // 根据数据条数与每页多少条数据计算页数 
    //totalCount 数据条数
    //limit 每页多少条
    pageCount() {
      return this.totalCount > 0 ?
        ((this.totalCount < this.limit) ?
          1 : ((this.totalCount % this.limit) ?
            (parseInt(this.totalCount / this.limit) + 1) : (this.totalCount / this.limit))) : 0;
      // return parseInt(pageCount)
    }
  },
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    dropdownChange1(value) {
      this.queryType = value
      this.pageData = new Map()
      this.tabUploaded(0, this.limit, this.queryType, this.orderBy)
    },
    dropdownChange2(value) {
      this.orderBy = value
      this.pageData = new Map()
      this.tabUploaded(0, this.limit, this.queryType, this.orderBy)
    },
    beforeDelete(file) {
      if (file.creater == '000') {
        this.$toast("无权删除")
        return false
      }
      if (this.managerCode != 1) {
        if (this.userInfo.user.id != file.creater) {
          this.$toast("无权删除")
          return false
        }
      }
      return true
    },
    deleteImage(file) {
      removeFile(file.id).then(res => {
        console.log(res)
        res.success && this.getTotalNum(false)
        return res.success
      })
    },
    onTabClick(index) {
      if (index === 1) {
        this.pageData = new Map()
        this.currentPage = 1
        this.tabUploaded(0, this.limit, this.queryType, this.orderBy)
      }
      if (index === 0) {
        this.fileList = []
      }
    },
    tabUploading() { },
    tabUploaded(page, limit, type, orderBy) {
      //获取当前页面数据
      let pageData = this.pageData.get(page)
      if (pageData) {
        this.imageList = pageData
        // //排序图片
        // this.sortLocalImageList(orderBy)
      } else {
        //获取服务器分页图片数据
        getFiles(page * limit, limit, type, orderBy).then(res => {
          if (res.success) {
            console.log(res.data)
            this.totalCount = res.total
            this.imageList = []
            res.data.forEach(item => {
              this.imageList.push({ id: item.id, url: item.url, creater: item.creater, createTime: item.createTime })
            })
            this.pageData.set(page, this.imageList)
          }
        })
      }
    },
    sortLocalImageList(orderBy) {
      let sortArray
      //排序
      if (orderBy.indexOf('desc') > -1) {
        sortArray = sortByKey(this.imageList, 'createTime', true)
      } else {
        sortArray = sortByKey(this.imageList, 'createTime', false)
      }
      this.imageList = []
      sortArray.forEach(item => {
        this.imageList.push(item)
      })

      //排序当前图片array
      function sortByKey(array, key, sort) {
        return array.sort(function (a, b) {
          var x = a[key];
          var y = b[key];
          //升
          if (sort) {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
          } else {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
          }
        })
      }
    },
    tabClick(index) {
      this.$refs.tabControl.currentIndex = index
    },
    //监听文件上传
    afterRead(file) {
      // utils(file.file).then((blob, base64) => {
      //   console.log(blob)
      //   console.log(base64)
      // })

      // 此时可以自行将文件上传至服务器
      console.log(file.length);
      let num = file.length || 1
      if (num > 1) {
        file.forEach(itemFile => {
          this.imageUpload(itemFile)
        })
      } else { this.imageUpload(file) }
    },
    imageUpload(file) {
      file.status = 'uploading';
      file.message = '上传中...';
      updateFile(file.file).then(res => {
        console.log(res)
        if (res.success) {
          this.getTotalNum(false)
          file.status = 'done';
          file.message = '上传成功';
        } else {
          file.status = 'failed';
          file.message = '上传失败';
        }
      }, err => {
        file.status = 'failed';
        file.message = '上传失败';
      })
    },
    onPagination(index) {
      this.tabUploaded(index - 1, this.limit, this.queryType, this.orderBy)
    },
    swiperImageFinishLoad() {

    },
    //设置用户信息
    setUserInfo() {
      let token = storage.get('token')
      if (!token) {
        this.$router.push('/login')
        return
      }
      //根据token获取用户信息
      getUserInfo(this.$router).then(res => {
        if (res.success) {
          //保存用户状态到vuex
          this.$store.commit(types.USER_INFO, res.data)
          //获取统计数据
          this.getTotalNum()
          this.userInfo = res.data
          this.managerCode = res.data.user.managerCode
        } else {
          this.$router.push('/login')
        }
      })
    },
    //获取统计数据
    getTotalNum(isShowToast) {
      getTotalNum(isShowToast).then(res => {
        this.totalNum = res.data || {}
      })
    },
    /* 页面初始化 */
    init() {
      this.setUserInfo()
    }

  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {

  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.$dialog.alert({
      title: '拍照注意事项：',
      messageAlign: 'left',
      message: `1、村道、巷道里应多拍些。
2、不能开车的人行道，应多取小路有坎的来取镜拍照。
3、把手机和相机上的水印关起来（特别要注意地点和时间不能出现）。
4、拍照时不要出现太多的广角（应主要放在安装位置的10米之内为主要取镜）。
5、拍照时相片过长（应在拍照时取方形镜头拍照）。`,
    }).then(() => {
      // on close
    });
  },
  beforeCreate() { }, //生命周期 - 创建之前
  beforeMount() { }, //生命周期 - 挂载之前
  beforeUpdate() { }, //生命周期 - 更新之前
  updated() { }, //生命周期 - 更新之后
  beforeDestroy() { }, //生命周期 - 销毁之前
  destroyed() { }, //生命周期 - 销毁完成
  activated() {
    this.init()
  }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style scoped>
.nav-bar {
  display: flex;
  height: 70px;
  text-align: center;
  box-shadow: 0 1px 1px rgba(6, 202, 120, 0.1);
  background-color: #009688;
  color: #eee;
}
.company {
  font-size: 20px;
  line-height: 70px;
  flex: 1;
}
.userinfo {
  width: 150px;
}

.count {
  display: flex;
  text-align: center;
  width: 100%;
  height: 77px;
  padding: 10px 0 10px 0;
}
.count-item {
  margin-right: 10px;
  margin-left: 10px;
  background-color: #eeeded;
  flex: 1;
  width: 77px;
  height: 77px;
  border: 2px solid #eeeeee;
  border-radius: 20px;
}
.count-item-num {
  margin-top: 15%;
  font-size: 25px;
  color: #ec704b;
}
.count-item-single {
  margin-top: 5%;
  font-size: 25px;
  color: #ec704b;
}
.count-item-text {
  margin-top: 5px;
  font-size: 13px;
}
.mark-text {
  margin: 10px 0 10px 10px;
  font-size: 14px;
  color: #009688;
}
.image-show {
  padding: 10px 0 0 15px;
}
.image-item {
  display: inline-block;
  width: 100px;
  margin-left: 17px;
  margin-top: 10px;
}
.image-item img {
  width: 100px;
  height: 100px;
}
.image-item p {
  margin-left: 50%;
}
.tab-pagination {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 15px;
}
</style>