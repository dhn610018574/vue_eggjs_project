

export default {
    install(Vue) {
       
        // 生成并下载二维码
        Vue.prototype.$downloadFileByBase64 = function (base64, name) {
            let myBlob = this.$dataURLtoBlob(base64);
            let myUrl = URL.createObjectURL(myBlob);
            this.$downloadFile(myUrl, name);
        }
      
        // 把base64 字符串转成 图片并下载
        Vue.prototype.$dataURLtoBlob = function (dataurl) {
            let arr = dataurl.split(",");
            let mime = arr[0].match(/:(.*?);/)[1];
            let bstr = atob(arr[1]);
            let n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {
                type: mime
            });
        }
        // 下载文件
        Vue.prototype.$downloadFile = function (url, name) {
            let a = document.createElement("a");
            a.setAttribute("href", url);
            a.setAttribute("download", name);
            a.setAttribute("target", "_blank");
            let clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", true, true);
            a.dispatchEvent(clickEvent);
        }

    }
}
