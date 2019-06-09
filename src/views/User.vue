<template>
  <div class="user">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top:15px;">
      <el-input
        placeholder="请输入内容"
        v-model="paging.query"
        style="width:300px;margin-right:10px;"
        @keyup.enter.native="getuserlist"
        clearable
      >
        <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button>
      </el-input>
      <el-button type="success" plain @click="adduserbox=true">添加用户</el-button>
    </div>
    <el-pagination
      background
      :page-sizes="[2, 3, 4, 5]"
      :page-size="paging.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="paging.total"
      :hide-on-single-page="paging.pagingshow"
      @current-change="topaging"
      @size-change="sizechange"
    ></el-pagination>
    <el-table :data="userlist" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="editstate(scope.row.id,$event)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="edituserinfo(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" @click="deluser(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="primary" icon="el-icon-s-operation" @click="editroleinfo(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

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
    <el-dialog :title="`请为${editrole.username}分配角色`" :visible.sync="editrolebox">
      <el-select v-model="editrole.roleid" placeholder="请选择">
        <el-option v-for="item in rolelist" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
      </el-select>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editrolebox = false">取 消</el-button>
        <el-button type="primary" @click="editrolebyid">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加用户" :visible.sync="adduserbox">
      <el-form :model="adduser" :rules="rules" ref="adduser" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="adduser.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="adduser.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="adduser.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="adduser.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adduserbox = false">取 消</el-button>
        <el-button type="primary" @click="addnewuser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getaxios, putaxios, deleteaxios, postaxios } from '@/api/axios.js'
export default {
  data () {
    return {
      paging: {
        query: '',
        pagenum: 1,
        pagesize: 2,
        total: 10,
        pagingshow: false
      },
      userlist: [],
      rolelist: [],
      edituserbox: false,
      editrolebox: false,
      adduserbox: false,
      edituser: {},
      editrole: {
        userid: '',
        roleid: '',
        username: ''
      },
      adduser: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            message: '手机号格式不对',
            trigger: 'blur'
          }
        ],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    editstate (id, bool) {
      putaxios(`users/${id}/state/${bool}`).then(result => {
        if (result.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: result.data.meta.msg
          })
        } else {
          this.$message.error(result.data.meta.msg)
        }
      })
    },
    addnewuser () {
      postaxios('users', this.adduser).then(result => {
        if (result.data.meta.status === 201) {
          this.getuserlist()
          this.$message({
            type: 'success',
            message: result.data.meta.msg
          })
          this.$refs['adduser'].resetFields()
          this.adduserbox = false
        } else {
          this.$message.error(result.data.meta.msg)
        }
      })
    },
    editrolebyid () {
      putaxios(`users/${this.editrole.userid}/role`, {
        rid: this.editrole.roleid
      }).then(result => {
        if (result.data.meta.status === 200) {
          this.getuserlist()
          this.$message({
            type: 'success',
            message: result.data.meta.msg
          })
          this.editrolebox = false
        } else {
          this.$message.error(result.data.meta.msg)
        }
      })
    },

    editroleinfo (obj) {
      this.editrole.userid = obj.id
      this.editrole.roleid = obj.rid
      this.editrole.username = obj.username
      this.editrolebox = true
    },
    deluser (obj) {
      this.$confirm(`真的要删除姓名为${obj.username}的用户吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteaxios(`users/${obj.id}`).then(result => {
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
        if (
          (result.data.data.pagenum - 1) * this.paging.pagesize >=
          result.data.data.total && result.data.data.pagenum !== 1
        ) {
          this.paging.pagenum--
          this.getuserlist()
        } else {
          this.userlist = result.data.data.users
          this.paging.total = result.data.data.total
          this.paging.pagingshow = this.paging.total <= 10
        }
      })
    },
    edituserinfo (obj) {
      this.edituser = { ...obj }
      this.edituserbox = true
    },
    topaging (num) {
      this.paging.pagenum = num
      this.getuserlist()
    },
    sizechange (size) {
      this.paging.pagesize = size
      this.getuserlist()
    }
  },
  mounted () {
    this.getuserlist()
    getaxios('roles').then(result => {
      this.rolelist = result.data.data
    })
  }
}
</script>
<style lang="less" scoped>
</style>
