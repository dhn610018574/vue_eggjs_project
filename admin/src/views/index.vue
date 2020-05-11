<template>
  <div class="index">
    <!-- 搜索 -->
    <el-card class="box-card">
      <el-form class="searchForm" :model="searchForm" label-width="80px" size="small">
        <el-col :span="6">
          <el-form-item label="房源位置 :">
            <el-select v-model="searchForm.location" placeholder="请选择房源位置" clear>
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="item in regions"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="房源状态 :">
            <el-select v-model="searchForm.status" placeholder="请选择房源状态" clear>
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="item in status"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="装修">
            <el-select v-model="searchForm.renovation" placeholder="请选择房源位置" clearable>
              <el-option value="毛坯"></el-option>
              <el-option value="简装"></el-option>
              <el-option value="精装"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="租价(元) :">
            <el-input v-model="searchForm.rental" placeholder="请输入房源租价" clear></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="售价(万) :">
            <el-input v-model="searchForm.price" placeholder="请输入房源售价" clear></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="电话 :">
            <el-input v-model="searchForm.owner" placeholder="请输入电话" clear></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关键字 :">
            <el-input v-model="searchForm.followInfo" placeholder="请输入跟进关键字" clear></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <el-row class="search_btn">
        <el-button type="primary" size="small" @click="searchList">搜索</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <div class="add">
        <el-button type="primary" size="small" @click="add">新增</el-button>
      </div>
      <!-- 列表 -->
      <el-table
        :data="list"
        style="width: 100%"
        stripe
        border
        :row-class-name="tableRowClassName"
        max-height="700"
      >
        <el-table-column prop="location" label="位置"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '1'">可租</span>
            <span v-else-if="scope.row.status === '2'">暂缓</span>
            <span v-else>已租</span>
          </template>
        </el-table-column>
        <el-table-column prop="floor" label="栋数"></el-table-column>
        <el-table-column prop="roomNum" label="房号"></el-table-column>
        <el-table-column prop="roomLayout" label="房型"></el-table-column>
        <el-table-column prop="renovation" label="装修"></el-table-column>
        <el-table-column prop="area" label="面积"></el-table-column>
        <el-table-column prop="rental" label="租价(元)"></el-table-column>
        <el-table-column prop="price" label="售价(万)"></el-table-column>
        <el-table-column prop="imgUrl" label="图片">
          <template slot-scope="scope">
            <img
              v-if="scope.row.src&&scope.row.src.indexOf('.mp4') === -1"
              :src="scope.row.src"
              alt="图片加载失败"
              height="40"
            />
            <video
              v-if="scope.row.src&&scope.row.src.indexOf('.mp4') > -1"
              :src="scope.row.src"
              height="40"
            ></video>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
        <el-table-column label="操作" width="210" align="center">
          <template slot-scope="scope">
            <el-button type="info" size="mini" @click="search(scope.row)">查看</el-button>
            <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
            <el-button
              v-if="Accesslevel === '0'"
              type="danger"
              size="mini"
              @click="del(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.page"
          :page-sizes="[20,50, 100, 400,1000,2000]"
          :page-size="searchForm.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        ></el-pagination>
      </div>
    </el-card>
    <!-- 模态框 -->
    <el-dialog
      title="房源信息"
      :visible.sync="dialogFormVisible"
      width="80%"
      :close-on-click-modal="false"
      @close="resetForm"
    >
      <el-form
        :model="form"
        label-width="90px"
        size="small"
        :rules="rules"
        :disabled="mode == 'search'"
        ref="form"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="位置" prop="location">
              <el-select
                v-model="form.location"
                placeholder="请选择房源位置"
                clearable
                filterable
                allow-create
              >
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in regions"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择房源状态">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in status"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业主信息">
              <el-input v-model="form.owner" size="small" placeholder="请输入业主信息"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="楼栋" prop="floor">
              <el-input v-model="form.floor" size="small" placeholder="请输入楼栋号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="房号" prop="roomNum">
              <el-input v-model="form.roomNum" size="small" placeholder="请输入房号"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="房型" prop="roomLayout">
              <el-select
                v-model="form.roomLayout"
                placeholder="请选择或者输入房型"
                clearable
                filterable
                allow-create
              >
                <el-option value="一室户"></el-option>
                <el-option value="单间"></el-option>
                <el-option value="两室一厅"></el-option>
                <el-option value="两室两厅"></el-option>
                <el-option value="三室一厅"></el-option>
                <el-option value="三室两厅"></el-option>
                <el-option value="四室一厅"></el-option>
                <el-option value="四室两厅"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="面积(平方)" prop="area">
              <el-input v-model="form.area" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="朝向" prop="orientation">
              <el-input v-model="form.orientation" size="small" placeholder="请输入朝向"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="装修" prop="renovation">
              <el-select v-model="form.renovation" placeholder="请选择装修类别" clearable>
                <el-option value="毛坯"></el-option>
                <el-option value="简装"></el-option>
                <el-option value="精装"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="租价(元)">
              <el-input v-model="form.rental" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="售价(万)">
              <el-input v-model="form.price" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6}"
                placeholder="请输入内容"
                v-model="form.remarks"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图片">
              <el-upload
                :action="action"
                :headers="headers"
                list-type="picture-card"
                :file-list="fileList"
                :on-preview="handlePictureCardPreview"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :limit="10"
                :disabled="mode == 'search'"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt />
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        跟进信息 :
        <el-button
          size="small"
          type="primary"
          v-if="mode !== 'search'"
          @click="innerVisible = true"
        >添加</el-button>
        <el-table :data="form.followInfo" border max-height="250" size="small">
          <el-table-column prop="followInfo" label="跟进信息"></el-table-column>
          <el-table-column prop="followUser" label="跟进人"></el-table-column>
          <el-table-column prop="followTime" label="时间">
            <template slot-scope="scope">{{scope.row.followTime | formatDate }}</template>
          </el-table-column>
        </el-table>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save" v-if="mode !== 'search'">确 定</el-button>
      </div>
      <el-dialog
        width="30%"
        title="添加跟进信息"
        :visible.sync="innerVisible"
        append-to-body
        :close-on-click-modal="false"
      >
        <el-form ref="innerForm" :model="innerForm" label-width="80px" :rules="followRules">
          <el-form-item label="跟进内容" prop="info">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 6}"
              placeholder="请输入内容"
              v-model="innerForm.followInfo"
            ></el-input>
          </el-form-item>
          <el-form-item label="跟进人">
            <el-input v-model="innerForm.followUser"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="addFollow">确 定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import Http from "@/api/api";
export default {
  data() {
    return {
      Accesslevel: localStorage.getItem("Accesslevel"), // 用户
      action: Http.upload(), // 上传图片
      headers: { Authorization: localStorage.getItem("auth_token") },
      searchForm: {
        location: "",
        status: "",
        renovation: "",
        rental: "",
        price: "",
        owner: "",
        followInfo: "",
        page: 1,
        size: 2000
      },
      regions: [
        { label: "爱博一村", value: "爱博一村" },
        { label: "爱博二村", value: "爱博二村" },
        { label: "爱博三村", value: "爱博三村" },
        { label: "爱博四村", value: "爱博四村" },
        { label: "爱博五村", value: "爱博五村" },
        { label: "爱博六村", value: "爱博六村" },
        { label: "爱博七村", value: "爱博七村" },
        { label: "其他", value: "其他" }
      ],
      status: [
        { label: "可租", value: "1" },
        { label: "暂缓", value: "2" },
        { label: "已租", value: "3" }
      ],
      list: [],
      total: 50,
      // 添加房源
      dialogFormVisible: false,
      mode: "add",
      form: {
        location: "", // 位置
        status: "", // 状态
        owner: "", //
        floor: "", //楼栋
        roomNum: "", //房间号
        roomLayout: "", // 房型
        area: "", //面积
        orientation: "", //朝向
        renovation: "", // 装修
        rental: "", // 租价
        price: "", // 售价
        remarks: "", // 备注
        imgUrl: [], // 图片
        followInfo: []
      },
      fileList: [],
      rules: {
        location: [
          { required: true, message: "请选择房源地址", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择房源状态", trigger: "blur" }
        ],
        floor: [{ required: true, message: "请输入楼栋号", trigger: "blur" }],
        roomNum: [{ required: true, message: "请输入房号", trigger: "blur" }],
        roomLayout: [
          { required: true, message: "请输入房型", trigger: "blur" }
        ],
        renovation: [
          { required: true, message: "请选择装修类别", trigger: "blur" }
        ]
      },
      followRules: {
        followInfo: [
          { required: true, message: "请输入跟进信息", trigger: "blur" }
        ]
      },
      // 添加跟进信息
      innerVisible: false,
      innerForm: {
        followInfo: "",
        followUser: localStorage.getItem("userName")
      },
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      let parame = this.searchForm;
      this.list = [];
      this.total = 0;
      Http.getList(parame).then(res => {
        if (res.data && res.data.code == 0) {
          this.total = res.data.data.count;
          this.list = res.data.data.result || [];
          this.list.forEach(v => {
            v.imgUrl = v.imgUrl ? JSON.parse(v.imgUrl) : [];
            v.src = v.imgUrl[0] || "";
            v.followInfo = v.followInfo ? JSON.parse(v.followInfo) : [];
          });
        }
      });
    },
    tableRowClassName(row, rowIndex) {
      let status = row.row.status;
      if (status == "1") {
        return "success-row";
      } else if (status == "2") {
        return "warning-row";
      }
      return "";
    },
    // 搜索
    searchList() {
      this.searchForm.page = 1;
      this.getList();
    },
    // 重置
    reset() {
      this.searchForm = {
        location: "",
        status: "",
        renovation: "",
        rental: "",
        price: "",
        owner: "",
        followInfo: "",
        page: 1,
        size: 2000
      };
    },
    // 分页大小变化
    handleSizeChange(size) {
      this.searchForm.size = size;
      this.getList();
    },
    // 当前页面变化
    handleCurrentChange(page) {
      this.searchForm.page = page;
      this.getList();
    },
    // 新增
    add() {
      this.mode = "add";
      this.dialogFormVisible = true;
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.mode == "add") {
            this.addHouse();
          } else if (this.mode == "edit") {
            this.updateHouse();
          }
        }
      });
    },
    // 添加房源
    addHouse() {
      let params = JSON.parse(JSON.stringify(this.form));
      params.imgUrl = JSON.stringify(params.imgUrl);
      params.followInfo = JSON.stringify(params.followInfo);
      Http.add(params).then(res => {
        if (res && res.data && res.data.code == 0) {
          this.$message.success("添加成功");
          this.getList();
          this.dialogFormVisible = false;
        }
      });
    },
    // 更新房源
    updateHouse() {
      let params = JSON.parse(JSON.stringify(this.form));
      params.imgUrl = JSON.stringify(params.imgUrl);
      params.followInfo = JSON.stringify(params.followInfo);
      delete params.src;
      Http.update(params).then(res => {
        if (res && res.data && res.data.code == 0) {
          this.$message.success("更新成功");
          this.getList();
          this.dialogFormVisible = false;
          this.innerVisible = false;
        }
      });
    },
    // 查看
    search(row) {
      let form = JSON.parse(JSON.stringify(row));
      this.fileList = form.imgUrl.map((v, i) => {
        return { name: i, url: v };
      });
      this.form = form;
      this.mode = "search";
      this.dialogFormVisible = true;
    },
    // 编辑
    edit(row) {
      let form = JSON.parse(JSON.stringify(row));
      this.fileList = form.imgUrl.map((v, i) => {
        return { name: i, url: v };
      });
      this.form = form;
      this.mode = "edit";
      this.dialogFormVisible = true;
    },
    // 删除
    del(row) {
      this.$confirm("此操作将永久删除该房源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          Http.del({ id: row.id }).then(res => {
            console.log(res);
            if (res.data && res.data.code == 0) {
              this.getList();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addFollow() {
      let { followInfo, followUser } = this.innerForm;
      let followTime = +new Date();
      this.form.followInfo.unshift({ followInfo, followUser, followTime });
      this.innerVisible = false;
    },
    // 照片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      let url = file.url;
      this.fileList = this.fileList.filter(v => v.url !== url);
      this.form.imgUrl = this.fileList.map(v => {
        return v.url;
      });
    },
    handleSuccess(res, file, fileList) {
      if (res.data && res.data.length) {
        let url = res.data[0];
        let name = file.name;
        this.fileList.push({ name, url });
        this.form.imgUrl = this.fileList.map(v => {
          return v.url;
        });
      } else {
        this.$message.error("图片上传失败, 请删除后重新上传");
      }
    },
    resetForm() {
      this.fileList = [];
      this.innerForm = {
        followInfo: "",
        followUser: localStorage.getItem("userName")
      };
      this.form = {
        location: "", // 位置
        status: "", // 状态
        owner: "", //
        floor: "", //楼栋
        roomNum: "", //房间号
        roomLayout: "", // 房型
        area: "", //面积
        orientation: "", //朝向
        renovation: "", // 装修
        rental: "", // 租价
        price: "", // 售价
        remarks: "", // 备注
        imgUrl: [], // 图片
        followInfo: []
      };
      this.$refs.form.clearValidate();
    }
  }
};
</script>
<style lang="less" scoped>
.el-card {
  margin-bottom: 30px;
}
.pagination {
  text-align: right;
  padding-top: 20px;
}
.searchForm {
  overflow: hidden;
}
</style>
<style >
.el-table .warning-row {
  color: #e73f6c;
}

.el-table .success-row {
  color: #86aa73;
}
.el-select {
  width: 100%;
}
.el-upload-list__item {
  transition: none !important;
}
</style>

