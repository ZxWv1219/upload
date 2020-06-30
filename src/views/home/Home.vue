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
    <div class="count">
      <div class="count-item">{{totalNum.totalNum||0}}</div>
      <div class="count-item">{{totalNum.uploadNum||0}}</div>
      <div class="count-item">{{totalNum.selfNum||0}}</div>
    </div>

    <van-tabs v-model="active" @click="onTabClick">
      <van-tab title="上传">
        <van-uploader class="image-show" v-model="fileList" :after-read="afterRead" multiple />
        <home-swiper :banners="banners" @swiperImageFinishLoad="swiperImageFinishLoad"></home-swiper>
      </van-tab>
      <van-tab title="已上传">
        <van-uploader
          class="image-show"
          v-model="imageList"
          :show-upload="isShow"
          @delete="deleteImage"
          multiple
          disabled
        />
        <!--
        <div>
          <div class="image-item">
            <img src="https://img.yzcdn.cn/vant/cat.jpeg" />
            <p>1</p>
          </div>
          <div class="image-item">
            <img src="https://img.yzcdn.cn/vant/cat.jpeg" />
            <p>1</p>
          </div>
          <div class="image-item">
            <img src="https://img.yzcdn.cn/vant/cat.jpeg" />
            <p>1</p>
          </div>
          <div class="image-item">
            <img src="https://img.yzcdn.cn/vant/cat.jpeg" />
            <p>1</p>
          </div>
          <div class="image-item">
            <img src="https://img.yzcdn.cn/vant/cat.jpeg" />
            <p>1</p>
          </div>
        </div>
        -->
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


export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    HomeSwiper
  },
  data() {
    //这里存放数据
    return {
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
    selfNum() {
      return (this.totalNum.selfNum || 0).toString()
    }
  },
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    deleteImage(file) {
      console.log(file)
      removeFile(file.id).then(res => {
        console.log(res)
        return res.success
      })
    },
    onTabClick(index) {
      if (index === 1) {
        this.tabUploaded()
      }
    },
    tabUploading() { },
    tabUploaded() {


      getFiles().then(res => {
        this.imageList = []
        res.data.forEach(item => {
          this.imageList.push({ id: item.id, url: item.url })
        })
        console.log(this.imageList)
      })
    },
    tabClick(index) {
      this.$refs.tabControl.currentIndex = index
    },
    //监听文件上传
    afterRead(file) {
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
      updateFile(file).then(res => {
        console.log(res)
        if (res.success) {
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
        } else {
          this.$router.push('/login')
        }
      })
    },
    //获取统计数据
    getTotalNum() {
      getTotalNum().then(res => {
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

.allcount {
  color: #ec704b;
}

.count {
  display: flex;
  text-align: center;
  line-height: 77px;
  font-size: 25px;
  width: 100%;
  padding: 10px 0 20px 0;
  border-bottom: 8px solid #eeeeee;
}
.count-item {
  color: #ec704b;
  background-color: #EEEDED;
  flex: 1;
  width: 77px;
  height: 77px;
  margin-bottom: 5px;
  border: 2px solid #eeeeee;
  border-radius: 20px;
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
</style>