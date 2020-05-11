/*
 * @Author: ji.xuyu
 * @Date: 2020-02-03 16:46:14
 * @LastEditors  : ji.xuyu
 * @LastEditTime : 2020-02-03 17:17:35
 * @Description: hxtabs
 */
import './style/index.scss'
export default {
  name: 'HxTabs',
  props: {
    titles: {
      type: [ Function, Array, ],
      default () { return [] },
    },
    value: {},
    // 默认只渲染当前tab页
    forceRender: {
      type: [ Boolean, ],
      default: true,
    },
    // tab类型的选择
    type: {
      Type: String,
      default: '', // (border-card)
    },
    // tabs样式控制 {top,right,bottom,left/ 上下左右}
    tabPosition: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      defaultValue: this.detailDefaultValue(),
      tabsCache: {},
    }
  },
  created () {
    this.tabsCache = this.detailCache(this.defaultValue, this.forceRender)
  },
  computed: {
    _activeName () {
      return this.detailDefaultValue()
    },
  },
  render (h) {
    const childs = this.$slots.default && this.$slots.default.filter(child => {
      return child.tag
    })
    const titles = Array.isArray(this.titles) ? this.titles : this.titles
    const childItem = titles.map((title, index) => {
      return (
        <el-tab-pane name={'tabs' + index}>
          <span slot='label'> { title } </span>
          {
            this.tabsCache['tabs' + index] && childs && childs[index]
          }
        </el-tab-pane>
      )
    })
    return (
      <el-tabs
        type={this.type}
        class={'rd-tabs' }
        value={this._activeName}
        tab-position={this.tabPosition}
        onInput={this.handlerChange.bind(this)}>
        {childItem}
      </el-tabs>
    )
  },
  methods: {
    handlerChange (value) {
      this.tabsCache[value] = true
      this.$emit('input', value)
      this.$emit('tab-click', value)
    },
    /**
         *  v-model 默认情况下的兼职处理
         *  如果外部的v-model没有传值，默认赋值(tabs0)
         *  @return {v-model}
         */
    detailDefaultValue () {
      return (!this.value || this.value == '') ? 'tabs0' : this.value
    },

    /**
         * 将当前的activeName作为缓存(tabsCache)
         * @param {string} activeName: 点击的当前活动页键值
         * @param {Boolean} forceRender: 是否缓存所有tab(true只缓存当前tab页)
         * @return {Object} cacheLists: {tabs_0: true, tabs_1: false}
         */
    detailCache (activeName, forceRender) {
      const cacheLists = {}
      const titles = Array.isArray(this.titles) ? this.titles : this.titles

      titles.forEach((title, index) => {
        if (!forceRender) {
          cacheLists['tabs' + index] = true
        } else {
          if (activeName.replace(/[^\d]/g, '') == index) {
            cacheLists['tabs' + index] = true
          } else {
            cacheLists['tabs' + index] = false
          }
        }
      })
      return cacheLists
    },
  },
}
