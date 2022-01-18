export default {
  data () {
    return {
      userData: [],
      total: 0,
      pagenum: 1,
      pagesize: 5,
      searchText: '',
      addUserFormVisible: false,
      editUserFormVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      userRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在3-20之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在3-20之间', trigger: 'blur' }
        ],
        email: [
          // eslint-disable-next-line
          { pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, message: '邮箱格式不正确', trigger: 'blur' }
        ],
        mobile: [
          // eslint-disable-next-line
          { pattern: /^(\+\d{1,3}[- ]?)?\d{10}$/, message: '手机格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.loadUserData()
  },
  methods: {
    async loadUserData (pagenum = 1, query = '') {
      let res = await this.$axios.get('users', {
        params: {
          pagenum,
          pagesize: this.pagesize,
          query
        }
      })
      if (res.data.meta.status === 200) {
        this.userData = res.data.data.users
        this.total = res.data.data.total
        this.pagenum = res.data.data.pagenum
      }
    },
    async submitAddUser () {
      let res = await this.$axios.post(`users`, this.addUserForm)
      if (res.data.meta.status === 201) {
        this.hideAddUserForm()
        this.$message({
          message: '添加用户成功',
          type: 'success',
          duration: 800
        })
        this.loadUserData()
      }
    },
    async deleteUser (row) {
      if (row.id === 500) {
        this.$message({
          message: '禁止删除管理员',
          type: 'error',
          duration: 800
        })
        return
      }
      try {
        await this.$confirm('删除用户， 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.$axios.delete(`users/${row.id}`)
        if (res.data.meta.status === 200) {
          this.$message({
            message: '删除用户成功',
            type: 'success',
            duration: 800
          })
          this.loadUserData()
        }
      } catch (error) {
        this.$message({
          message: '取消删除用户',
          type: 'info',
          duration: 800
        })
      }
    },
    async changeUserState (row) {
      const state = row.mg_state
      let res = await this.$axios.put(`users/${row.id}/state/${state}`)
      if (res.data.meta.status === 200) {
        this.$message({
          message: '修改用户状态成功',
          type: 'success',
          duration: 800
        })
        this.loadUserData(this.pagenum)
      }
    },
    async submitEditUser () {
      const {id, email, mobile} = this.editUserForm
      let res = await this.$axios.put(`users/${id}`, {
        email,
        mobile
      })
      if (res.data.meta.status === 200) {
        this.$message({
          message: '编辑用户成功',
          type: 'success',
          duration: 800
        })
        this.loadUserData(this.pagenum)
        this.hideEditUserForm()
      }
    },
    changePage (curPage) {
      this.loadUserData(curPage, this.searchText)
    },
    searchUser () {
      this.loadUserData(1, this.searchText)
    },
    showAddUserForm () {
      this.addUserFormVisible = true
    },
    hideAddUserForm () {
      this.$refs.addUserForm.resetFields()
      this.addUserFormVisible = false
    },
    showEditUserForm (row) {
      const { id, username, email, mobile } = row
      if (id === 500) {
        this.$message({
          message: '禁止编辑管理员',
          type: 'error',
          duration: 800
        })
        return
      }
      this.editUserFormVisible = true
      this.editUserForm.id = id
      this.editUserForm.username = username
      this.editUserForm.email = email
      this.editUserForm.mobile = mobile
    },
    hideEditUserForm () {
      this.editUserFormVisible = false
    }
  }
}
