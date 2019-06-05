<template>
  <div class="user">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top:15px;">
      <el-input placeholder="请输入内容" v-model="paging.query" style="width:300px;margin-right:10px;">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" plain>添加用户</el-button>
    </div>
    <el-table :data="userlist" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="editinfo(scope.row)"></el-button>
          <el-button type="primary" icon="el-icon-delete" @click="deluser(scope.row)"></el-button>
          <el-button type="primary" icon="el-icon-s-operation"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="paging.total"
      :hide-on-single-page="paging.pagingshow"
      @current-change="topaging"
    ></el-pagination>
    <el-dialog title="编辑用户" :visible.sync="edituserbox">
      <el-form :model="edituser" :rules="rules" ref="edituser">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="edituser.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px" prop="email">
          <el-input v-model="edituser.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="100px" prop="mobile">
          <el-input v-model="edituser.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="edituserbox = false">取 消</el-button>
        <el-button type="primary" @click="edituserbyid">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getaxios, putaxios, deleteaxios } from '@/api/axios.js'
export default {
  data () {
    return {
      value: true,
      paging: {
        query: '',
        pagenum: 1,
        pagesize: 3,
        total: 10,
        pagingshow: false
      },
      userlist: [],
      edituserbox: false,
      edituser: {},
      rules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    deluser (obj) {
      this.$confirm(`真的要删除姓名为${obj.username}的用户吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteaxios(`users/${obj.id}`).then(result => {
            console.log(result)
            if (result.data.meta.status === 200) {
              this.getuserlist()
              this.$message({
                type: 'success',
                message: result.data.meta.msg
              })
            } else {
              this.$message.error(result.data.meta.msg)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    edituserbyid () {
      this.$refs.edituser.validate(valid => {
        if (valid) {
          putaxios(`users/${this.edituser.id}`, this.edituser).then(result => {
            if (result.data.meta.status === 200) {
              this.getuserlist()
              this.$message({
                message: result.data.meta.msg,
                type: 'success'
              })
              this.edituserbox = false
            } else {
              this.$message.error(result.data.meta.msg)
            }
          })
        }
      })
    },
    getuserlist () {
      getaxios('users', {
        params: this.paging
      }).then(result => {
        this.userlist = result.data.data.users
        this.paging.total =
          Math.ceil(result.data.data.total / this.paging.pagesize) * 10
        this.paging.pagingshow = this.paging.total <= 10
      })
    },
    editinfo (obj) {
      this.edituser = { ...obj }
      this.edituserbox = true
    },
    topaging (num) {
      this.paging.pagenum = num
      this.getuserlist()
    }
  },
  mounted () {
    this.getuserlist()
  }
}
</script>
<style lang="less" scoped>
</style>
