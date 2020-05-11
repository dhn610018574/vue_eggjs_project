
<template>
  <div>
    <el-date-picker
      v-model="svalue"
      @change="getTime"
      type="datetimerange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      style='width: 100%'
      range-separator="至"
      prefix-icon='el-icon-date'
      :default-time="['00:00:00', '23:59:59']">
    </el-date-picker>
  </div>
</template>
 
<script>
export default {
  name: "demoTimePicker",
  data() {
    return {
      svalue:[]
    }
  },
  methods: {
    getTime (t) {
      if (t) {
        this.$emit('update:startTime',+t[0])
        this.$emit('update:endTime', +t[1])
      }else{
        this.$emit('update:startTime','')
        this.$emit('update:endTime','')
      }
    }
  },
  watch: {
    //判断时间选择是否改变
    startTime() {
      this.svalue = [this.startTime,this.endTime]
    }
  },
  props: {
    startTime: {
    },
    endTime: {
    }
  },
  mounted() {
    this.svalue = [this.startTime,this.endTime]
  }
};
</script>