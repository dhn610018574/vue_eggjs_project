<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
            @select="select"
        >   
            <template  v-for="(item,idx) in items">
                <template v-if="item.childResourceVoList">
                    <el-submenu :index="item.resourceUrl || idx+'_1'" :key="item.resourceCode">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span slot="title">{{ item.resourceName }}</span>
                        </template>
                        <template  v-for="(subItem,i) in item.childResourceVoList">
                            <el-submenu
                                v-if="subItem.childResourceVoList"
                                :index="subItem.resourceUrl || i+'_2'"
                                :key="subItem.resourceCode"
                            >
                                <template slot="title">{{ subItem.resourceName }}</template>
                                <el-menu-item
                                    v-for="(threeItem,k) in subItem.childResourceVoList"
                                    :key="threeItem.resourceCode"
                                    :index="threeItem.linkType == 1 ? threeItem.resourceUrl:'marketing-activities?idx='+i+'_'+k || k+'_3'"
                                >{{ threeItem.resourceName }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.resourceUrl || i+'_2'"
                                :key="subItem.resourceCode"
                            >{{ subItem.resourceName }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.resourceUrl || idx+'_1'" :key="item.resourceCode">
                        <i class="el-icon-location"></i>
                        <span>{{ item.resourceName }}</span>
                    </el-menu-item>
                    <!-- <el-menu-item :index="item.resourceUrl || idx+'_1'" :key="item.resourceCode" class="workPT" v-if="item.resourceUrl == 'navBar'">
                        <i class="el-icon-location"></i>
                        <span>{{ item.resourceName }}</span>
                    </el-menu-item>
                    <el-menu-item :index="item.resourceUrl || idx+'_1'" :key="item.resourceCode" v-else>
                        <i class="el-icon-location"></i>
                        <span>{{ item.resourceName }}</span>
                    </el-menu-item> -->
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from "@/utils/bus";
export default {
    data() {
        return {
            collapse: false
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    },
    props:['items'],
    methods: {
        select (idx,path) {
            this.$emit('select',path)
        }
    },
};
</script>

<style scoped>
.el-menu /deep/.is-active{
    color: #091647 !important;
    background-color: #fff !important;
}
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
.el-menu-item {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.sidebar /deep/.workPT{
    background-color: #fff !important;
    color: #909399 !important;
    border-top: 1px solid #d8d8d8;
    /* border-right: 0px; */
    overflow: hidden !important;
}
.sidebar /deep/.workPT:hover{
    /* background-color: #e6f4ff !important; */
}

</style>
