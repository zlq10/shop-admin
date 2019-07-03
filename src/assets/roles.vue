<template>
  <div>
     <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
     <el-table
    ref="singleTable"
    :data="rolesData"
    highlight-current-row
    
    style="width: 100%">
    
     <el-table-column
      type="expand"
      width="50">
      <template v-slot={row}>
        <el-row  type="flex" v-for='item in row.children' :key="item.id" class="leve1" >
           <el-col :span='6' > <el-tag  closable @close="delrights(row, item.id)" >{{item.authName}}</el-tag>  <i class="el-icon-arrow-right"></i></el-col>
           <el-col>
             <el-row type="flex" v-for='item1 in item.children' :key="item1.id" class="leve2">
               <el-col :span='6' > <el-tag type="success"  @close="delrights(row,item1.id)" closable>{{item1.authName}}</el-tag>  <i class="el-icon-arrow-right"></i></el-col>
                <el-col>      
                   <el-tag  v-for='item2 in item1.children' :key="item2.id" class="leve3" type="warning"  closable  @close="delrights(row,item2.id)">{{item2.authName}}</el-tag> 
   
                </el-col>
             </el-row>
           </el-col>
        </el-row>
        
      </template>

     </el-table-column>
  
     <el-table-column
      type="index"
      width="50">
     </el-table-column>
     <el-table-column
      property="roleName"
      label="角色名称"
      width="180">
      </el-table-column>
      <el-table-column
      property="roleDesc"
      label="描述"
      width="180">
    </el-table-column>
    <el-table-column
      property="address"
      label="操作">
       <template v-slot='{row}'>
              <el-button type="primary" plain size="mini" icon="el-icon-edit" ></el-button>
          <el-button type="danger"  icon="el-icon-delete" size="mini"></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" @click="assign(row)">分配权限</el-button>
       </template>

    </el-table-column>

  </el-table>
    <el-dialog title="角色授权" :visible.sync="assignright" >
            <el-tree
  :data="assigndata"
  show-checkbox
  node-key="id"
  :default-checked-keys="checkeddata"
  :props="defaultProps"
  :default-expand-all='true'
  ref='tree'
  >
</el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignright= false">取 消</el-button>
        <el-button type="primary" @click="queren" >确 定</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>
<script>
import axios from "axios";
  export default {
 
    data() {
      return {
        rolesData: [],
        assignright:false,
         assigndata: [],
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        checkeddata:[], 
      //为展示勾选的数据
       currentid:-1,
        
        
      
      }
    },
   created(){
     this.getdata();
      // let res= await axios({
      //   url:'roles',     
      // });
     
      // this.rolesData=res.data.data
      
    },
    methods:{
       getdata(){
        axios({
          url:'roles'
        }).then(res=>{
          //把获取到角色列表赋值给绑定的数据
          this.rolesData=res.data.data
        })

       },
     async assign(row){
       // 把当前的id赋值给currenid
       this.currentid=row.id
        this.assignright=true;
        let res=await axios({
          url:'rights/tree'
        })
        console.log(res);
        this.assigndata=res.data.data;
        console.log(row);
        let arr1=[];
        let arr2=[];
        let arr3=[];
        row.children.forEach(v=>{
         
          arr1.push(v.id);
          v.children.forEach(v1=>{
            arr2.push(v1.id);
            v1.children.forEach(v2=>{
              arr3.push(v2.id)
            })
          })
        })
      this.checkeddata=[...arr1,...arr2,...arr3]
   
      },
      async queren(){
        let rids=[...this.$refs.tree.getCheckedKeys(),...this.$refs.tree.getHalfCheckedKeys()].join();
        console.log(rids);
       let res =await axios({
         url:`roles/${this.currentid}/rights`,
         method:'post',
         data:{
           rids
         }
       }) ;
        if (res.data.meta.status == 200) {
          this.$message({
            message: res.data.meta.msg,
            type: "success",
            duration: 1000
          });
          this.assignright=false;
          this.getdata();
          }
      },
      async delrights(row,id){
        let arr1=[];
        let arr2=[];
        let arr3=[];
        //把所有的id值存储到数组中
        row.children.forEach(v=>{
         
          arr1.push(v.id);
          v.children.forEach(v1=>{
            arr2.push(v1.id);
            v1.children.forEach(v2=>{
              arr3.push(v2.id)
            })
          })
        })
      let result=[...arr1,...arr2,...arr3];
       let rids= result.filter(v=>v!==id).join();
      let res =await axios({
         url:`roles/${row.id}/rights`,
         method:'post',
         data:{
           rids
         }
       }) ;
       console.log(res);
       
        if (res.data.meta.status == 200) {
          this.$message({
            message: res.data.meta.msg,
            type: "success",
            duration: 1000
          });
       
        this.getdata();
      
   
       }
      }
    }

  }
</script>
 <style scoped>
  .leve1{
    padding: 10px 0;
    border-bottom: 1px dashed #ccc;
  }
  .leve2{
    padding-bottom: 10px
  }
  .leve3{
    margin-right: 10px;
    margin-bottom: 10px
  }
   
 </style>
 

