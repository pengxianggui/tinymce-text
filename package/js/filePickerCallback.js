export default function (callback, value, meta, tinymce, config) {
    //文件分类
    let filetype;
    //后端接收上传文件的地址
    if (!config.files_upload_url) {
        console.error('you must config `config.files_upload_url`, but it is empty: ' + config.files_upload_url)
        return;
    }

    let upload_url = config.files_upload_url;

    // 为不同插件指定文件类型及后端地址
    switch (meta.filetype) {
        case 'image':
            filetype = '.jpg, .jpeg, .png, .gif, .svg';
            break;
        case 'media':
            filetype = '.mp3, .mp4';
            break;
        case 'file':
        default:
            filetype = '*/*'
    }

    //模拟出一个input用于添加本地文件
    let input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', filetype);
    input.click();
    input.onchange = function () {
        let file = this.files[0];

        let xhr, formData;
        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', upload_url);
        xhr.onload = function () {
            let json;
            if (xhr.status != 200) {
                console.error('HTTP Error: ' + xhr.status);
                return;
            }
            try {
                json = JSON.parse(xhr.responseText);
            } catch (err) {
                console.error('expect result format is {"location": "the url of file"}')
            }
            callback(json.location);
        };
        formData = new FormData();
        formData.append('file', file, file.name);
        xhr.send(formData);


        console.log(file.name)

        // 下方是官方的一个例子
        let reader = new FileReader();
        reader.onload = function () {
            // Note: Now we need to register the blob in TinyMCEs image blob
            // registry. In the next release this part hopefully won't be
            // necessary, as we are looking to handle it internally.
            let id = 'blobid' + (new Date()).getTime();
            let blobCache = tinymce.editorUpload.blobCache;
            let base64 = reader.result.split(',')[1];
            let blobInfo = blobCache.create(id, file, base64);
            blobCache.add(blobInfo);

            // call the callback and populate the Title field with the file name
            callback(blobInfo.blobUri(), {text: file.name});
        };
        reader.readAsDataURL(file);
    };
}
