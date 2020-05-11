/***---------------全局过滤器--------------***/
import moment from 'moment'
export default {
  install (vue) {
    // 格式化日期
    vue.filter('formatDate',function (value, fmt='YYYY-MM-DD') {
      if(value){
     return moment(value).format(fmt)

      }else{
        return ''
      }
    });
  }
}
