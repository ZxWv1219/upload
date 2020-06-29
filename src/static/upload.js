var uploadApi="api/upload",   //上传图片服务器api
    ratio = window.devicePixelRatio || 1,
    // 缩略图大小
    thumbnailWidth = 100 * ratio,
    thumbnailHeight = 100 * ratio,
    uploader = WebUploader.create({
        auto: true, // 选完文件后，是否自动上传   
        swf: "./Uploader.swf", // swf文件路径   
        server: uploadApi, // 文件接收服务端   
        fileVal:"file[]",      //上传参数名
        pick: '#imgPicker', // 选择文件的按钮。可选  
        fileNumLimit:9,     //图片上限
        // 只允许选择图片文件。   
        accept: {   
            title: 'Images',   
            extensions: 'gif,jpg,jpeg,png',   
            mimeTypes: 'image/*'  
        }
    });

    uploader.on('fileQueued', function( file ) {  
    var $list = $("#fileList"), //获取文件列表 
    $li = $(
        '<div id="' + file.id + '" class="dib pr file-thumb-item">' +   
        '<img class="db"><i class="pa progress"></i>' + //<i class="pa m i-cir-close"></i>
        '</div>'
    ),   
    $img = $li.find('img');
    $list.append( $li ); // $list为容器jQuery实例    
    // 创建缩略图   
    uploader.makeThumb( file, function( error, src ) {   
        if ( error ) {   
            $img.replaceWith('<span>不能预览</span>');   
            return;   
        }      
        $img.attr( 'src', src );//设置预览图
    }, thumbnailWidth, thumbnailHeight ); 
});

// 文件上传过程中创建进度条实时显示。
uploader.on('uploadProgress', function( file, percentage ) {   
    var $li = $( '#'+file.id ),   
    $percent = $li.find('.progress'); 
    $percent.css('width', (1-percentage) * 100 + '%');  
});

// 文件上传成功，给item添加成功class, 用样式标记上传成功。  
uploader.on('uploadSuccess', function( file, res ) {
    if(res.code===200)
    {
    $('#'+file.id).attr("data-src",res.data[0]);
    }
    else
    {
        this.trigger('uploadError', file);
    }
});

// 文件上传失败，显示上传出错。 
uploader.on('uploadError', function( file ) {   
var $li = $('#'+file.id),   
$error = $li.find('.error');      
// 避免重复创建   
if (!$error.length ) {   
    $error = $('<span class="error"></span>').appendTo( $li );   
}     
$error.text('上传失败');  
});

// 完成上传，成功或者失败，改为显示删除按钮。
uploader.on('uploadComplete', function( file ) {  
$('#'+file.id ).find('.progress').on("click",function(){
    $(this).parent().remove();
    uploader.removeFile(file);
}).css("width","").get(0).className="pa m i-cir-close";  
});

//上传检查
uploader.on('error', function(handler) {
if(handler==="Q_EXCEED_NUM_LIMIT"){
    app.tip("超出最大张数");
}
if(handler==="F_DUPLICATE"){
    app.tip("文件重复");
}
});

exports.reset=function(){
    uploader.reset();
    $("#fileList").empty();
};