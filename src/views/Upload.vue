<template>
  <div class="page bgm">
    <form class="form" @submit.prevent="formSubmitHandle" style="overflow: hidden;width: 100%;">
      <textarea
        class="patient-textarea c3"
        placeholder="请输入你要提的问题"
        required="required"
        data-required="请输入你要提的问题"
        v-model="words"
        maxlength="140"
        onchange="this.value=this.value.substring(0, 140)"
        onkeydown="this.value=this.value.substring(0, 140)"
        onkeyup="this.value=this.value.substring(0, 140)"
        name="title"
      ></textarea>
      <div class="c3 f2s tr num-pos" ref="num">{{num}}</div>
      <div class="me-dd">
        <span :class="['db','pr', 'con', 'bgw']">
          疾病分类
          <svg class="i-right">
            <use xlink:href="#icon-right" />
          </svg>
          <select
            class="pa appt-date-sel"
            required="required"
            data-required="请选择疾病分类"
            name="disease"
            ref="sel"
            @change="onSelectChange"
          >
            <option value class="cc">请选择疾病分类</option>
            <option v-for="(item, index) in patients" :value="item.id" :key="index">{{ item.title }}</option>
          </select>
          <span class="r cc" style="padding-right: 1em">请选择疾病分类</span>
        </span>
      </div>
      <div class="member-hint c3">为了保证信息的真实有效性，请填写真实信息</div>
      <div class="form-item">
        <label class="cf mdb">
          姓名
          <input
            class="r"
            type="text"
            required="required"
            placeholder="请输入姓名"
            name="name"
            data-required="请输入姓名"
          />
        </label>
      </div>
      <div class="form-item">
        <label class="cf mdb">
          手机号码
          <input
            type="tel"
            name="phone"
            maxlength="11"
            required="required"
            pattern="1\d{10}"
            data-required="请填写手机号"
            data-pattern="手机号填写错误"
            class="r"
            placeholder="请输入手机号"
          />
        </label>
      </div>
      <!--图片上传-->
      <div class="upload">
        <div class="wpr pic-list" id="fileList" ref="picFile"></div>
        <span class="pic-upload" id="imgPicker"></span>
        <span class="c3">最多可上传9张</span>
      </div>
      <div>
        <input class="member-btn on" type="submit" ref="doSubmit" name="submit" value="立即提交" />
      </div>
    </form>
  </div>
</template>

<script>
//  var three_part_css = [
//    "//cdn.bootcss.com/photoswipe/4.1.1/photoswipe.css",
//    "//cdn.bootcss.com/photoswipe/4.1.1/default-skin/default-skin.css"
//  ];
// import jquery from '@/static/jquery-2.0.0.min'
// var jquery = "//cdn.bootcss.com/jquery/2.1.4/jquery.js";
var jquery = "//cdn.bootcss.com/jquery/2.1.4/jquery.js"
var three_part_apis = ["//cdn.bootcss.com/webuploader/0.1.1/webuploader.js"],
  _isLoaded = false;

function loadQueue(cb) {
  if (!jquery) {
    cb && cb();
    return;
  }
  getScript(jquery, function () {
    var list = three_part_apis;
    if (_isLoaded) {
      cb();
      return;
    }
    var len = list.length,
      i = 0,
      c = 0,
      ready = function () {
        if (++c === len) {
          cb && cb();
        }
      };
    _isLoaded = true;
    while (i < len) {
      getScript(list[i++], ready);
    }

    three_part_apis.length = 0;
  });
  jquery = null;
}

//  function createCssLink() {
//    var d = document, i = three_part_css.length, s, frg = d.createDocumentFragment();
//    while (i--) {
//      s = d.createElement("link");
//      s.rel = "stylesheet";
//      s.href = three_part_css[i];
//      frg.appendChild(s);
//    }
//    d.head.appendChild(frg);
//  }

function getScript(src, cb) {
  var d = document,
    s = d.createElement("script");
  s.async = true;
  s.onload = cb;
  s.src = src;
  d.body.appendChild(s);
}

if (!Object.assign) {
  Object.assign = function (t, s) {
    for (var o in s) {
      t[o] = s[o];
    }
  }
}
export default {
  data() {
    return {
      patients: [],
      words: '',
      numMaxLen: 140,
      num: 140,
      isInit: false,
      list: [],
      statusText: "数据加载中...",
      faceShow: false,  //显示表情
      liveInfo: {
        isInit: false, //直播是否初始化成功，
        needLogined: false   //必须登录才能播放，5分钟后强制登录，true为必须登录，false不会弹出登录
      },
    }
  },
  watch: {
    //留言字数改变时
    words() {
      this.num = this.numMaxLen - this.words.length;
      if (this.num < 0) {
        this.$refs.num.classList.add("cr");
        this.$refs.num.nextElementSibling.disabled = true;
      }
      else {
        this.$refs.num.classList.remove("cr");
        this.$refs.num.nextElementSibling.disabled = false;
      }
    }
  },
  computed: {},
  created() {
    //      createCssLink();
    loadQueue(this.init);
    this.getPatientList();
  },
  methods: {
    init: function () {
      //上传图片
      require("@/static/upload.js");
    },
    onSelectChange(e) {
      var sel = e.target, span = sel.nextElementSibling;
      sel.selectedIndex ? span.classList.remove("cc") : span.classList.add("cc");
      span.innerHTML = sel.options[sel.selectedIndex].text;
    },
    //表单提交
    formSubmitHandle(e) {
      e.preventDefault();
      let form = e.target,
        picList,
        chs,
        i,
        ii,
        src,
        data = this.getFormData(form);
      //        获取图片信息
      picList = this.$refs.picFile;
      chs = picList.children;
      i = 0;
      ii = chs.length;
      for (let j = 0; j < ii; j++) {
        data += "&pic[]=";
        src = chs[j].getAttribute("data-src");
        data += src;
      }
      this.$http.post("api/question-submit", data).then(res => {
        var j = res.data;
        if (j.code === 200) {
          this.$tip("提交成功，请等待审核");
          this.$router.back(-1);
        }
        else {
          this.$tip(j.error);
        }
      });
    },
    //关闭留言
    formCloseHandle() {
      this.$refs.ineractFoot.classList.remove("show");
    },
    getPatientList() {
      this.$http.get("api/disease-onelevel").then(res => {
        var j = res.data;
        if (j.code === 200) {
          this.patients = j.data;
        }
      });
    }
  }
}
</script>

<style>
.live-contact {
  display: none;
  height: 3em;
  line-height: 3em;
  padding: 0 3%;
  color: #fff;
  background: #1a1a1f;
}

.live-btn {
  height: 2em;
  line-height: 2em;
  margin-top: 0.5em;
  padding: 0 1em;
  border-radius: 0.2em;
  color: #fff;
  background-color: #5777fd;
}

.live-interact-header > .m {
  display: block;
  width: 12%;
  height: 0;
  padding-top: 12%;
  border-radius: 50%;
  margin-right: 0.5em;
  background-size: cover;
}

.live-interact-header > .r {
  width: 5em;
}

.live-interact-header > span.l {
  -webkit-flex: 1;
  flex: 1;
}
.interact-foot.show > .interact-foot-cover {
  z-index: 6;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
}

.interact-foot.show > .interact-foot-inner > .interact-foot-btn {
  display: none;
}

.interact-foot.show > .interact-foot-inner > .interact-form {
  display: block;
}

/* 上传组件 */
.webuploader-container {
  position: relative;
  overflow: hidden;
}

.webuploader-element-invisible {
  position: absolute !important;
  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
  clip: rect(1px, 1px, 1px, 1px);
}

.webuploader-pick {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.webuploader-pick-disable {
  opacity: 0.6;
  pointer-events: none;
}
.file-thumb-item {
  width: 18%;
  margin-right: 2%;
  margin-bottom: 2%;
}

.file-thumb-item > .i-cir-close {
  top: 0;
  right: 0;
  width: 30%;
  height: 0;
  padding-top: 30%;
  background-color: #2a80c3;
  border-radius: 50%;
}

.file-thumb-item > .progress {
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
}

.file-thumb-item > .error {
  position: absolute;
  left: 0;
  bottom: 10%;
  width: 100%;
  font-size: 12px;
  text-align: center;
  color: red;
}
.num-pos {
  margin-right: 1em;
}
.member-btn {
  width: 100%;
  font-size: 0.416rem;
  height: 2.8em;
  line-height: 2.8em;
  color: #fff;
  text-align: center;
  background-color: #00b38b;
  border: 1px solid #00b38b;
  cursor: pointer;
  outline: none;
  position: fixed;
  bottom: 0;
}

.patient-textarea {
  display: block;
  width: 94%;
  height: 10em;
  border: none;
  resize: none;
  font-size: 14px;
  outline: none;
  padding: 1em 1em 0;
}

.me-dd {
  border-top: 1px solid #dddddd;
}

.me-dd > .db {
  line-height: 3;
}

.me-dd > .db > .i-right {
  position: absolute;
  width: 0.8em;
  height: 0.8em;
  right: 3%;
  top: 50%;
  margin-top: -0.4em;
}

.member-hint {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding-left: 0.8em;
}

.member-btn {
  width: 100%;
  font-size: 0.416rem;
  height: 2.8em;
  line-height: 2.8em;
  color: #fff;
  text-align: center;
  background-color: #00b38b;
  border: 1px solid #00b38b;
  cursor: pointer;
  outline: none;
  position: fixed;
  bottom: 0;
}

.mdb {
  display: block;
  padding: 0.5em 0.8em;
  border-bottom: 1px solid #ddd;
  background: #fff;
}

.form input.mr {
  width: calc(100% - 6em);
  font-size: 1em;
  margin: 0;
  margin-top: 0.2em;
  border: 0;
  outline: none;
}

.upload {
  margin-top: 10px;
  padding-top: 1em;
  height: 20em;
  background: #ffffff;
}

.pic-upload {
  width: 20%;
  height: 25%;
  display: inline-block;
  margin: 1em 1em 0;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM1NTQ1MUY1OUY3MzExRThCQkMwOEUxRkNDQjJCMUVCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM1NTQ1MUY2OUY3MzExRThCQkMwOEUxRkNDQjJCMUVCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzU1NDUxRjM5RjczMTFFOEJCQzA4RTFGQ0NCMkIxRUIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzU1NDUxRjQ5RjczMTFFOEJCQzA4RTFGQ0NCMkIxRUIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5eHAEoAAAHoklEQVR42uxd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);
}

.interact-foot.show > .interact-foot-cover {
  z-index: 6;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
}

.interact-foot.show > .interact-foot-inner > .interact-foot-btn {
  display: none;
}

.interact-foot.show > .interact-foot-inner > .interact-form {
  display: block;
}

.upload > .m {
  width: 1.6em;
  height: 1.6em;
  margin-right: 1em;
}

.appt-date-sel {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>
