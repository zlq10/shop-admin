<template>
  <div>
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          v-model="query "
          @keyup.enter.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="success" plain @click="adduser">添加信息</el-button>
      </el-col>
    </el-row>

    <el-table :data=" userlist" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot="{row}">
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changebtn(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" plain size="mini" icon="el-icon-edit" @click='editclick(row)'></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      @current-change="curchange"
      :pagenum="pagenum"
    ></el-pagination>
    <el-dialog title="添加用户" :visible.sync="addialog" class="addialog">
      <el-form :model="addform" :rules="rules" ref="addform">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="addform.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addialog = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
     <el-dialog title="修改用户" :visible.sync="editdialog" >
      <el-form :model="editform" :rules="rules" ref="editform">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-tag type="info">{{editform.username}}</el-tag>
        </el-form-item>
      
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="editform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editdialog= false">取 消</el-button>
        <el-button type="primary" @click="editsubmit">确 定</el-button>
      </div>
    </el-dialog>
   
  </div>
</template>



<script>
import axios from "axios";
export default {
  data() {
    return {
      userlist: [],
      total: 0,
      pagesize: 3,
      pagenum: 1,
      currentPage: 0,
      query: "",
      addialog: false,
      editdialog: false,
      addform: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
     editform:{
        username: "",
        email: "",
        mobile: "",
        id:''
     },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 12, message: "长度在5到 12 个字符", trigger: "change" }
        ],
        password: [
          { required: true, message: "请输入密码名", trigger: "blur" },
          { min: 6, max: 15, message: "长度在6到 15个字符", trigger: "change" }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "change"
          }
        ],
        mobile: [
          {
            patter:/^/,
            message: "请输入正确的手机格式",
            trigger: "change"
          }
        ]
      },
      formLabelWidth: "120px"
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      axios({
        url: "http://localhost:8888/api/private/v1/users",
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          query: this.query
        },
        headers: { Authorization: localStorage.getItem("token") }
      }).then(res => {
        this.userlist = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    async changebtn(row) {
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/users/${row.id}/state/${row.mg_state}`,
        method: "put",
        headers: { Authorization: localStorage.getItem("token") }
      });
      if ((res.data.meta.status = 200)) {
        this.$message({
          message: "恭喜你，修改成功",
          type: "success",
          duration: 1000
        });
      } else {
        this.$message({
          message: "修改失败",
          type: "error",
          duration: 1000
        });
        row.mg_state = !row.mg_state;
      }
    },
    curchange(page) {
      this.pagenum = page;
      this.getData();
    },
    async del(id) {
      try {
        await this.$confirm("是否要删除用户信息", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
      
        let res = await axios({
          url: `http://localhost:8888/api/private/v1/users/${id}`,
          method: "delete",
          headers: { Authorization: localStorage.getItem("token") }
        });
        if (res.data.meta.status == 200) {
          this.$message({
            message: res.data.meta.msg,
            type: "success",
            duration: 1000
          });
          this.getData();
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: "error",
            duration: 1000
          });
        }
      } catch (err) {
        () => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        };
      }
    },
    search() {
      this.getData();
    },
    adduser() {
      this.addialog = true;
    },
    submit(){
     this.$refs.addform.validate();    
     axios({
       url:'http://localhost:8888/api/private/v1/users',
       method:'post',
       headers: { Authorization: localStorage.getItem("token") },
       data:this.addform
     }).then(res=>{
       this.getData();
        this.addialog=false;
          this.$refs.addform.resetFields();
      
     });
    
    
    },
    editclick(row){
     
      this.editdialog= true;
      axios({
        url:`http://localhost:8888/api/private/v1/users/${row.id}`,
         headers: { Authorization: localStorage.getItem("token") },    
      }).then(res=>{        
       this.editform=res.data.data
        
      })
    },
    editsubmit(){
    
     axios({
         url: `http://localhost:8888/api/private/v1/users/${this.editform.id}`,
        method: "put",
        data:{
         email:this.editform.email,
         mobile:this.editform.mobile
        },
        headers: { Authorization: localStorage.getItem("token") }
     }).then(res=>{
         this.getData();
           
        this.editdialog= false;
     })
      
    }
  
  }
};
</script>
<style>
.el-breadcrumb.breadcrumb {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  background-color: #eee;
  padding-left: 20px;
}
</style>

