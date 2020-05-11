
export default {
    /**--------------获取cookies--------------**/
    getCookie(name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }

    },

    /**--------------设置cookies--------------**/
    setCookie(c_name, value, expiredays) {
        let exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + value + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
    },
    /**--------------设置cookies到一级域名--------------**/
    setCookieToOne(c_name, value, expiredays) {
        let exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        //document.cookie = c_name +"="+value+";Path=/;domain=.rs.com";
        if (window.location.origin.indexOf(".rs.com") > -1) {
            document.cookie = c_name + "=" + value + ((expiredays == null) ? ";Path=/;domain=.rs.com" : ";expires=" + exdate.toGMTString() + ";Path=/;domain=.rs.com");
        } else if (window.location.origin.indexOf(".aimall.cloud") > -1) {
            document.cookie = c_name + "=" + value + ((expiredays == null) ? ";Path=/;domain=.aimall.cloud" : ";expires=" + exdate.toGMTString() + ";Path=/;domain=.aimall.cloud");
        } else if (window.location.origin.indexOf(".aegeanpark.cn") > -1) {
            document.cookie = c_name + "=" + value + ((expiredays == null) ? ";Path=/;domain=.aegeanpark.cn" : ";expires=" + exdate.toGMTString() + ";Path=/;domain=.aegeanpark.cn");
        } else if (window.location.origin.indexOf("localhost") > -1) {
            document.cookie = c_name + "=" + value + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
        } else {
            document.cookie = c_name + "=" + value + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
        }
    },
    /**--------------删除cookies--------------**/
    delCookie(name) {
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = this.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },

    /**--------------sessionStorage获取对象--------------**/
    getSession(key, isObj = true) {
        let value = sessionStorage.getItem(key);
        if (isObj) {
            value = JSON.parse(value);
        }
        return value;
    },

    /**--------------sessionStorage设置对象--------------**/
    setSession(key, value) {
        let str = value;
        if (value != undefined && typeof value == 'object') {
            str = JSON.stringify(value);
        }
        sessionStorage.setItem(key, str);
    },

    /**--------------sessionStorage删除对象--------------**/
    delSession(key) {
        sessionStorage.removeItem(key);
    },
    /**--------------localStorage设置对象--------------**/
    setLocalStorage(key, value) {
        let str = value;
        if (value !== undefined && typeof (value) === 'object') {
            str = JSON.stringify(value);
        }
        localStorage.setItem(key, str);
    },

    getLocalStorage(key, isObj) {
        let value = localStorage.getItem(key);
        if (isObj) {
            value = JSON.parse(value);
        }
        return value;
    },
    /**--------------sessionStorage删除对象--------------**/
    delLocalStorage(key) {
        localStorage.removeItem(key);
    },
    /**--------------按钮权限--------------**/

    buttonResource(btnNameList) {
        if(JSON.parse(sessionStorage.getItem('aegeanButtonResource'))) {
            console.log('用户有按钮权限！')
            const btnResource = JSON.parse(sessionStorage.getItem('aegeanButtonResource'))
            const obj = {}
            btnNameList.forEach(item => {
                if (btnResource.hasOwnProperty(item)) {
                    obj[item] = true
                } else {
                    obj[item] = false
                }
            })
            return obj
        } else {
            console.log('用户无按钮权限！')
            return {}
        }
    },

    btnResource(btnNameList) {
        if(JSON.parse(sessionStorage.getItem('aegeanButtonResource'))) {
            const btnResource = JSON.parse(sessionStorage.getItem('aegeanButtonResource'))
            const obj = {}
            if(btnNameList && btnNameList.length>0){
                for(let i=0;i<btnNameList.length;i++){
                    let name = btnNameList[i]
                    if (btnResource.hasOwnProperty(btnNameList[i])) {
                        let opt = btnResource[name]
                        let flag = opt.isClick//点击权限
                        obj[name] = flag
                    } else {
                        obj[name] = false
                    }
                }
            }
            return obj
        } else {
            return {}
        }
    },
    /**
     * 格式化文件上传后组件返回后的model
     * @param file {object}
     *******************************************************
     */
    formatViewFileVo(file,bizType) {
        const fileVo = {};
        const { response } = file;
        if (response && response.code === 200) {
            const dataModel = response.data || {};
            fileVo.id = file.id || dataModel.id;
            fileVo.uid = file.uid || dataModel.fileNo;
            fileVo.name = file.name || dataModel.fileName;
            fileVo.url = dataModel.fileUrl;
            fileVo.fileUrl = dataModel.fileUrl;
            fileVo.fileName = file.name || dataModel.fileName;
            fileVo.bizType = bizType || '';
            fileVo.status = '';
        } else {
            fileVo.id = file.id;
            fileVo.uid = file.uid ;
            fileVo.name = file.name || file.fileName;
            fileVo.fileName = file.name || file.fileName;
            fileVo.url = file.url || file.fileUrl;
            fileVo.fileUrl = file.url || file.fileUrl;
            fileVo.bizType = bizType || '';
            fileVo.status = '';
        }
        return {...fileVo};
    },
   
    // 获取url
    getUrl() {
        let url = ''
        if (window.location.href.indexOf('/#/') > -1) {
            url = window.location.origin + '/#'
        } else {
            url = window.location.origin
        }
        return url
    },
    
}
