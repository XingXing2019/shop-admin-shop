export default {
  data () {
    return {
      roleData: [],
      rightData: [],
      assignRightVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: ''
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
    hideAssignRightDialog () {
      this.assignRightVisible = false
    },
    showAssignRightDialog (row) {
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
    }
  }
}
