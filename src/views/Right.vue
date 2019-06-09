<template>
  <div class="right">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="rightlist" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span>{{scope.row.level |levelfilter}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getaxios } from '@/api/axios.js'
export default {
  data () {
    return {
      rightlist: []
    }
  },
  methods: {
    async getallrightlist () {
      let result = await getaxios('rights/list')
      this.rightlist = result.data.data
    }
  },
  mounted () {
    this.getallrightlist()
  },
  filters: {
    levelfilter (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
