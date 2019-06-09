<template>
  <div class="role">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="addrolebox=true">添加角色</el-button>
    <el-table :data="rolelist" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="first in scope.row.children" :key="first.id">
            <el-col :span="4" class="expand">
              <el-tag
                closable
                :type="'warning'"
                @close="delrole(scope.row,first.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id">
                <el-col :span="5" class="expand">
                  <el-tag
                    closable
                    :type="'success'"
                    @close="delrole(scope.row,second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="19">
                  <el-tag
                    closable
                    :type="'info'"
                    v-for="third in second.children"
                    :key="third.id"
                    class="expand mr"
                    @close="delrole(scope.row,third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="textfun(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" @click="delrolebyid(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="授权" placement="top">
            <el-button type="primary" icon="el-icon-s-operation" @click="authorization(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="授权" :visible.sync="rightdialogVisible">
      <div class="authorization">
        <el-tree
          ref="tree"
          :data="rightlist"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="CheckedKeys"
          :props="rightdefaultProps"
        ></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="authorizationbyid">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加角色" :visible.sync="addrolebox">
      <el-form :model="addrole" :rules="rules" label-width="100px" ref="addrole" >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addrole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addrole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addrolebox = false">取 消</el-button>
        <el-button type="primary" @click="addroleinfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getaxios, deleteaxios, postaxios } from '@/api/axios.js'
export default {
  data () {
    return {
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      },
      addrole: {
        roleName: '',
        roleDesc: ''
      },
      addrolebox: false,
      roleid: '',
      rightdialogVisible: false,
      CheckedKeys: [],
      keeprightlist: [],
      rightlist: [],
      rightdefaultProps: {
        children: 'children',
        label: 'authName'
      },
      rolelist: []
    }
  },
  methods: {
    delrolebyid (obj) {
      this.$confirm(`真的要删除角色${obj.roleName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteaxios(`roles/${obj.id}`).then(result => {
          if (result.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: result.data.meta.msg
            })
            this.getrolelist()
          } else {
            this.$message.error(result.data.meta.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async addroleinfo () {
      if (this.addrole.roleName !== '') {
        let result = await postaxios('roles', this.addrole)
        if (result.data.meta.status === 201) {
          this.$message({
            type: 'success',
            message: result.data.meta.msg
          })
          this.getrolelist()
          this.addrolebox = false
          this.$refs.addrole.resetFields()
        } else {
          this.$message.error(result.data.meta.msg)
        }
      }
    },
    async authorizationbyid () {
      let result = await postaxios(`roles/${this.roleid}/rights`, {
        rids: this.$refs.tree
          .getCheckedKeys()
          .concat(this.$refs.tree.getHalfCheckedKeys())
          .join(',')
      })
      if (result.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
        this.getrolelist()
        this.rightdialogVisible = false
      } else {
        this.$message.error(result.data.meta.msg)
      }
    },
    async getrightlist () {
      let result = await getaxios('rights/tree')
      this.keeprightlist = result.data.data
    },
    async getrolelist () {
      let result = await getaxios('roles')
      this.rolelist = result.data.data
    },
    async delrole (obj, rightid) {
      let result = await deleteaxios(`roles/${obj.id}/rights/${rightid}`)
      if (result.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
        obj.children = result.data.data
      } else {
        this.$message.error(result.data.meta.msg)
      }
    },
    authorization (obj) {
      this.roleid = obj.id
      this.CheckedKeys = []
      this.rightdialogVisible = true
      obj.children.forEach(first => {
        first.children.forEach(scend => {
          scend.children.forEach(third => {
            this.CheckedKeys.push(third.id)
          })
        })
      })
      this.rightlist = [].concat(this.keeprightlist)
    }
  },
  mounted () {
    this.getrolelist()
    this.getrightlist()
  }
}
</script>

<style lang="less" scoped>
.expand {
  margin-bottom: 10px;
}
.mr {
  margin-right: 10px;
}
.authorization {
  height: 400px;
  overflow: scroll;
}
</style>
