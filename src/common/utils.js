/**
  * 上传文件
  */
function uploadImg(blob, base64) {
  //   接收到回调函数  获取到压缩后  图片文件，然后上传就可以了
  const formData = new FormData()

  // 需要给文件名添加后缀扩展名，否则传到后端的是一个没有扩展名的文件
  formData.append('file', blob, '.jpg')
  formData.append('filename', blob + '.jpg')

  //此处我自己封装的api接口，大家可以无视，就是上传提交的意思
  api.uploadImg(formData)
    .then(res => {
      console.log(res)
    })
}

export default function (file) {
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve('hello vue.js')
  //   }, 1000)
  // }).then((res) => {
  //   console.log('33');
  //   console.log('res');

  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve()
  //     }, 1000)
  //   })
  // }).then((res) => {
  //   console.log('44');
  //   console.log('res');
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve()
  //     }, 1000)
  //   })
  // })
  return new Promise((resolve) => {
    resolve(file)
  }).then(res => {
    return fileToBase64(res)
  }).then((base64, scale) => {
    return compressImg(base64, scale)
  })
}
/**
* 获取到的二进制文件 转 base64文件
* @param file
*/
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader() //实例化一个reader文件
    reader.readAsDataURL(file) // 添加二进制文件
    reader.onload = function (event) {
      const base64 = event.target.result // 获取到它的base64文件
      const scale = 0.99  // 设置缩放比例 （0-1） 
      resolve(base64, scale)
    }
  })
}

/**
* 压缩图片方法
* @param base64  ----baser64文件
* @param scale ----压缩比例 画面质量0-9，数字越小文件越小画质越差
* @param callback ---回调函数
*/
function compressImg(base64, scale) {
  console.log(`执行缩放程序，scale=${scale}`)
  return new Promise((resolve, reject) => {
    // 处理缩放，转换格式
    // 下面的注释就不写了，就是new 一个图片，用canvas来压缩
    const img = new Image()
    img.src = base64
    img.onload = function () {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.setAttribute('width', this.width)
      canvas.setAttribute('height', this.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      // 转成base64 文件
      let base64 = canvas.toDataURL('image/jpeg')
      // 根据自己需求填写大小 我的目标是小于3兆
      while (base64.length > 1024 * 1024 * 3) {
        scale -= 0.01
        base64 = canvas.toDataURL('image/jpeg', scale)
      }
      // baser64 TO blob 这一块如果不懂可以自行百度，我就不加注释了
      const arr = base64.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bytes = atob(arr[1])
      const bytesLength = bytes.length
      const u8arr = new Uint8Array(bytesLength)
      for (let i = 0; i < bytes.length; i++) {
        u8arr[i] = bytes.charCodeAt(i)
      }
      const blob = new Blob([u8arr], { type: mime })
      // 回调函数 根据需求返回二进制数据或者base64数据，我的项目都给返回了
      // callback(blob, base64)
      resolve(blob, base64)
    }
  })

}