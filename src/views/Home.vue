<!--  -->
<template>
  <div class>
    <!--dom结构部分-->
    <div id="uploader-demo">
      <!--用来存放item-->
      <div id="fileList" class="uploader-list"></div>
      <div id="filePicker">选择图片</div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import jquery from '@/static/jquery-2.0.0.min'
import WebUploader from '@/static/webuploader'

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {

    }
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {

  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {

  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    var uploader = WebUploader.create({
      // 选完文件后，是否自动上传。
      auto: true,
      resize: true,
      // swf文件路径
      swf: '../static/Uploader.swf',

      // 文件接收服务端。
      server: 'http://webuploader.duapp.com/server/fileupload.php',

      // 选择文件的按钮。可选。
      // 内部根据当前运行是创建，可能是input元素，也可能是flash.
      pick: '#filePicker',

      // 只允许选择图片文件。
      accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
      }
    });


    uploader.on('beforeFileQueued', function (file) {
      console.log('文件加入队前', file)
    });

    uploader.on('uploadComplete', function (file) {
      console.log('文件上传完成')
      $('#' + file.id).find('.progress').fadeOut();
    });


    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function (file, percentage) {
      var $li = $('#' + file.id),
        $percent = $li.find('.progress span');

      // 避免重复创建
      if (!$percent.length) {
        $percent = $('<p class="progress"><span></span></p>')
          .appendTo($li)
          .find('span');
      }

      $percent.css('width', percentage * 100 + '%');
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on('uploadSuccess', function (file) {
      $('#' + file.id).addClass('upload-state-done');
      console.log('文件上传成功', file, response)
      $('#' + file.id).find('p.state').text('已上传');
    });

    // 当有文件添加进来的时候
    uploader.on('fileQueued', function (file) {
      var $list = $('#fileList')
      var $li = $(
        '<div id="' + file.id + '" class="file-item thumbnail">' +
        '<img>' +
        '<div class="info">' + file.name + '</div>' +
        '</div>'
      ), $img = $li.find('img')

      // $list为容器jQuery实例
      $list.append($li);
      let thumbnailWidth = 100
      let thumbnailHeight = 100
      // 创建缩略图
      // 如果为非图片文件，可以不用调用此方法。
      // thumbnailWidth x thumbnailHeight 为 100 x 100
      uploader.makeThumb(file, function (error, src) {
        if (error) {
          $img.replaceWith('<span>不能预览</span>');
          return;
        }
        $img.attr('src', src);
      }, thumbnailWidth, thumbnailHeight);
    });

    // 文件上传失败，显示上传出错。
    uploader.on('uploadError', function (file) {
      var $li = $('#' + file.id),
        $error = $li.find('div.error');

      // 避免重复创建
      if (!$error.length) {
        $error = $('<div class="error"></div>').appendTo($li);
      }

      $error.text('上传失败');
    });

  },
  beforeCreate() { }, //生命周期 - 创建之前
  beforeMount() { }, //生命周期 - 挂载之前
  beforeUpdate() { }, //生命周期 - 更新之前
  updated() { }, //生命周期 - 更新之后
  beforeDestroy() { }, //生命周期 - 销毁之前
  destroyed() { }, //生命周期 - 销毁完成
  activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style scoped>
</style>