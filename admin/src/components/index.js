/*
 * @Author: ji.xuyu
 * @Date: 2020-02-03 17:29:45
 * @LastEditors: ji.xuyu
 * @LastEditTime: 2020-02-03 17:30:04
 * @Description: file content
 */
import HxGrid from './grid/index'

function plugin (Vue) {
  if (plugin.installed) {
    return
  }
  Vue.component('HxGrid', HxGrid)
}
export default plugin