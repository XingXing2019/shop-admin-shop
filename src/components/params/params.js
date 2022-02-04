export default {
  data () {
    return {
      categories: [],
      params: [],
      attrs: [],
      defaultProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      selectedKeys: [],
      activeName: 'many',
      activeIndex: 1,
      addParamsFormVisible: false,
      editParamsFormVisible: false,
      addParamsForm: {
        attr_name: '',
        attr_vals: ''
      },
      editParamForm: {
        attr_id: 0,
        attr_name: '',
        attr_vals: ''
      },
      paramsRules: {
        attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.loadCategoryData()
  },
  computed: {
    isBtnDisable () {
      return this.selectedKeys.length !== 3
    },
    categoryId () {
      let len = this.selectedKeys.length
      if (len === 3) {
        return this.selectedKeys[len - 1]
      }
    },
    titleText () {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    },
    addParamTitle () {
      return '添加' + this.titleText
    },
    editParamTitle () {
      return '编辑' + this.titleText
    },
    labelText () {
      return this.activeName === 'many' ? '参数名称' : '属性名称'
    }
  },
  methods: {
    async loadCategoryData () {
      let res = await this.$axios.get(`categories`)
      if (res.data.meta.status === 200) {
        this.categories = res.data.data
      }
    },
    async loadParamData () {
      if (this.selectedKeys.length !== 3) return
      let res = await this.$axios.get(`categories/${this.categoryId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.data.meta.status === 200) {
        this.params = res.data.data
      }
    },
    async addParam () {
      // eslint-disable-next-line
      const { attr_name, attr_vals } = this.addParamsForm
      let res = await this.$axios.post(`categories/${this.categoryId}/attributes`, {
        attr_name,
        attr_vals,
        attr_sel: this.activeName
      })
      if (res.data.meta.status === 201) {
        this.$message({
          message: '添加成功',
          type: 'success',
          duration: 800
        })
        this.loadParamData()
        this.hideAddParamsForm()
      }
    },
    async deleteParam (row) {
      const attrId = row.attr_id
      try {
        let res = await this.$confirm(`删除${this.titleText}, 是否继续`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        res = await this.$axios.delete(`categories/${this.categoryId}/attributes/${attrId}`)
        if (res.data.meta.status === 200) {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 800
          })
          this.loadParamData()
        }
      } catch (error) {
        this.$message({
          message: `取消删除${this.titleText}`,
          type: 'info',
          duration: 800
        })
      }
    },
    async editParam () {
      const attrId = this.editParamForm.attr_id
      // eslint-disable-next-line
      const { attr_name, attr_vals } = this.editParamForm
      let res = await this.$axios.put(`categories/${this.categoryId}/attributes/${attrId}`, {
        attr_name,
        attr_vals,
        attr_sel: this.activeName
      })
      if (res.data.meta.status === 200) {
        this.$message({
          message: '编辑成功',
          type: 'success',
          duration: 800
        })
        this.loadParamData()
        this.hideEditParamsForm()
      }
    },
    selectChange () {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys.length = 0
      }
      this.loadParamData()
    },
    clickTab (tab) {
      this.activeIndex = parseInt(tab.index) + 1
      this.loadParamData()
    },
    hideAddParamsForm () {
      this.$refs.addParamsForm.resetFields()
      this.addParamsFormVisible = false
    },
    showAddParamsForm () {
      this.addParamsFormVisible = true
    },
    hideEditParamsForm () {
      this.editParamsFormVisible = false
    },
    showEditParamsForm (row) {
      this.editParamForm.attr_id = row.attr_id
      this.editParamForm.attr_name = row.attr_name
      this.editParamForm.attr_vals = row.attr_vals
      this.editParamsFormVisible = true
    }
  }
}
