<template>
    <el-cascader
            :options="addressList"
            @active-item-change="handleItemChange"
            :disabled="disabled"
            v-model="cityArr"
            ref="cascader"
            @change="change"
    ></el-cascader>
</template>

<script>
    import api from '@/api/as_commonApi'
    import Utils from '../utils/utils'

    export default {
        name: "my-select-address",
        props: {
            disabled: {
                type: Boolean,
                default: false
            },
            value: {
                type: Array,
                default() {
                    return [];
                }
            },
        },
        data() {
            return {
                cityArr: [],//['11000','10010','100001']用于element組建的value
                cityItemList:[],//传递给父组件的city数组
                addressList: [],
                index: '',//点击省份时候的索引，选3级的时候少遍历一次
            }
        },
        watch: {
            value: {
                handler: function (val, oldVal) {
                    if (val) {
                        this.cityArr = Utils.deepClone(val, [])
                    }
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            //cityArr改变时触发，处理数据，发送emit
            change(val){
                const vm = this
                //获得第三个对象塞进数据
                if(vm.cityItemList[1]&&vm.cityItemList[1].children){
                    if(vm.cityItemList[1].children){
                        vm.cityItemList[1].children.forEach(item=>{
                            if(item.value==vm.cityArr[2]){
                                vm.cityItemList[2] = item
                            }
                        })
                    }
                }
                this.$emit('handleAddressChange',vm.cityItemList);
                this.$emit('input',vm.cityArr)
                this.$emit('change',vm.cityArr)
            },
            //处理一级列表
            getFirstList(){
                const vm = this
                //一级列表
                api.getRegionByCode().then(res => {
                    res.data.data.forEach(item => {
                        vm.addressList.push({
                            label: item.adress,
                            value: item.adressCode,
                            children: []
                        })
                    })
                    //有父组件传值，调二级三级接口
                    if(vm.value.length>0){
                        vm.handleItemChange([vm.value[0]])
                        if(vm.addressList[vm.index]){
                            vm.handleItemChange([vm.value[0],vm.value[1]])
                        }else{
                            setTimeout(()=>{
                                vm.handleItemChange([vm.value[0],vm.value[1]])
                            },200)
                        }
                    }

                })
            },
            // 处理二级三级
            handleItemChange(val) {
                const vm = this
                if (val.length == 1) {  //处理二级list
                    api.getRegionByCode(val[0]).then(res => {
                        vm.addressList.forEach((item, index) => {
                            if (item.value == val[0]) {
                                vm.cityItemList[0] = item
                                vm.index = index
                                let arr = []
                                item.children = []
                                res.data.data.forEach(data => {
                                    arr.push({
                                        label: data.adress,
                                        value: data.adressCode,
                                        children: []
                                    })
                                })

                                vm.$set(vm.addressList[index], 'children', arr) // right
                            }
                        })
                    })
                } else if (val.length == 2) {  //处理三级list，
                    api.getRegionByCode(val[1]).then(res => {
                        vm.addressList[vm.index].children.forEach(province => {
                            if (province.value == val[1] && province.children.length == 0) {
                                vm.cityItemList[1] = province
                                if (res.data.data && res.data.data.length > 0) {  //有三级列表
                                    res.data.data.forEach(city => {
                                        province.children.push({
                                            label: city.adress,
                                            value: city.adressCode,
                                            children: ''
                                        })
                                    })
                                } else {  //没有第三级
                                    province.children = ''
                                    vm.cityArr = val
                                    vm.cityItemList[2] = null
                                    vm.$refs.cascader.hideMenu()
                                    vm.change(val)
                                }
                            }
                        })
                    })
                }
            },
        },
        created() {
            this.getFirstList()
        }
    }
</script>

<style scoped>

</style>