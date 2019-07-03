<template>
  <div>
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
         <el-table
    ref="rights"
    :data="rightsData"
    style="width: 100%">
    <el-table-column
      type="index"
      width="50">
    </el-table-column>
    <el-table-column
      property="authName"
      label="权限名称"
      width="120">
    </el-table-column>
    <el-table-column
      property="path"
      label="路径"
      width="120">
    </el-table-column>
  
           <el-table-column
      label="层级">
          <template v-slot='{row}'>
         <span>{{row.level|rightfilter}}</span>
          </template>
    </el-table-column>
   

  </el-table>
  </div>
</template>
<script>

import axios from 'axios';
  export default {
    data() {
      return {
        rightsData: [],
        currentRow: null
      }
    },
    async created(){
     let res=await axios({
       url:"rights/list",
      
     });
     console.log(res);
     
    this.rightsData=res.data.data;
     

    },

  
     filters:{
       rightfilter(value){
        
         
         switch(value){
           case "0":
             return '一级';
            
               case "1":
             return '二级';
            
               case "2":
             return '三级';
          
         }
       }
     }
      
    }

</script>
