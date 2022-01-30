export default {
  data () {
    return {
      roleData: [],
      rightData: [],
      assignRightVisible: false,
      editRoleVisible: false,
      addRoleVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleForm: {
        roleName: '',
        roleDesc: ''
      }
    }
  },
  created () {
    this.loadRolesData()
    this.loadRightData()
  },
  methods: {
    async loadRolesData () {
      let res = await this.$axios.get(`roles`)
      if (res.data.meta.status === 200) {
        this.roleData = res.data.data
      }
    },
    async loadRightData () {
      let res = await this.$axios.get(`rights/tree`)
      if (res.data.meta.status === 200) {
        this.rightData = res.data.data
      }
    },
    async assignRight () {
      let checked = this.$refs.tree.getCheckedKeys()
      let halfChecked = this.$refs.tree.getHalfCheckedKeys()
      let keys = checked.concat(halfChecked)
      let res = await this.$axios.post(`roles/${this.roleId}/rights`, {
        rids: keys.join(',')
      })
      if (res.data.meta.status === 200) {
        this.$message({
          message: '分配角色成功',
          type: 'success',
          duration: 800
        })
        this.hideAssignRightDialog()
        this.loadRolesData()
      }
    },
    async removeRight (role, rightId) {
      let res = await this.$confirm('删除权限，继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res === 'cancel') {
        this.$message({
          message: '取消删除权限',
          type: 'info',
          duration: 800
        })
        return
      }
      res = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.data.meta.status === 200) {
        this.$message({
          message: '删除权限成功',
          type: 'success',
          duration: 800
        })
        role.children = res.data.data
      } else {
        this.$message({
          message: '删除权限失败',
          type: 'error',
          duration: 800
        })
      }
    },
    async addRole () {
      const { roleName, roleDesc } = this.addRoleForm
      let res = await this.$axios.post(`roles`, {
        roleName,
        roleDesc
      })
      if (res.data.meta.status === 201) {
        this.$message({
          message: '创建角色成功',
          type: 'success',
          duration: 800
        })
        this.loadRolesData()
        this.hideAddRoleDialog()
      }
    },
    async deleteRole (row) {
      if (row.id === 30) {
        this.$message({
          message: '禁止删除主管',
          type: 'error',
          duration: 800
        })
        return
      }
      let res = await this.$confirm('删除角色，继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res === 'cancel') {
        this.$message({
          message: '取消删除角色',
          type: 'info',
          duration: 800
        })
        return
      }
      res = await this.$axios.delete(`roles/${row.id}`)
      if (res.data.meta.status === 200) {
        this.$message({
          message: '删除角色成功',
          type: 'success',
          duration: 800
        })
        this.loadRolesData()
      }
    },
    async editRole () {
      let res = await this.$confirm('编辑角色, 继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res === 'cancel') {
        this.$message({
          message: '取消编辑角色',
          type: 'info',
          duration: 800
        })
        return
      }
      const { roleName, roleDesc } = this.editRoleForm
      res = await this.$axios.put(`roles/${this.roleId}`, {
        roleName,
        roleDesc
      })
      if (res.data.meta.status === 200) {
        this.$message({
          message: '编辑角色成功',
          type: 'success',
          duration: 800
        })
        this.loadRolesData()
        this.hideEditRoleDialog()
      }
    },
    hideAssignRightDialog () {
      this.assignRightVisible = false
    },
    showAssignRightDialog (row) {
      if (row.id === 30) {
        this.$message({
          message: '禁止编辑主管权限',
          type: 'error',
          duration: 800
        })
        return
      }
      this.assignRightVisible = true
      this.roleId = row.id
      let keys = []
      row.children.forEach(item => {
        item.children.forEach(subItem => {
          subItem.children.forEach(subSubItem => {
            keys.push(subSubItem.id)
          })
        })
      })
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(keys)
      })
    },
    showAddRoleDialog () {
      this.addRoleVisible = true
    },
    hideAddRoleDialog () {
      this.$refs.addRoleForm.resetFields()
      this.addRoleVisible = false
    },
    showEditRoleDialog (row) {
      this.roleId = row.id
      this.editRoleForm.roleName = row.roleName
      this.editRoleForm.roleDesc = row.roleDesc
      this.editRoleVisible = true
    },
    hideEditRoleDialog () {
      this.$refs.editRoleForm.resetFields()
      this.editRoleVisible = false
    }
  }
}
