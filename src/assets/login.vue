<template>
<el-row type="flex" class="row-bg" justify="center" align="middle">
  <el-col :xs="16" :sm="14" :md="12" :lg="10" :xl="8">
    <el-form ref="form" :model="form" class="form-bg" label-width="80px" label-position="top">
  <el-form-item label="用户名">
    <el-input v-model="form.username"></el-input>
  </el-form-item>
 <el-form-item label="密码">
    <el-input v-model="form.password"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">登录</el-button>
    <el-button>重置</el-button>
  </el-form-item>
</el-form>
  </el-col>
 
</el-row>




</template>
<script>
  export default {
    data() {
      return {
        form: {
          username: '',
          password:""
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>
<style>
  .row-bg{
    height: 100%;
    background-color: black;
  }
  .form-bg{
    background-color: #fff;
    border-radius: 10px;
    padding: 30px 20px;
    min-width: 400px;
    
  }
</style>
