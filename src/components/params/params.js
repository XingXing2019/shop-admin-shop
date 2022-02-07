export default {
  data () {
    return {
      categories: [],
      params: [],
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
        attr_name: ''
      },
      editParamForm: {
        attr_id: 0,
        attr_name: ''
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
        res.data.data.forEach(item => {
          item.attr_vals = item.attr_vals === '' ? [] : item.attr_vals.split(',')
          item.inputValue = ''
          item.inputVisible = false
        })
        this.params = res.data.data
      }
    },
    async addParam () {
      // eslint-disable-next-line
      const { attr_name, attr_vals } = this.addParamsForm
      let res = await this.$axios.post(`categories/${this.categoryId}/attributes`, {
        attr_name,
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
    async confirmInput (row) {
      if (row.inputValue.trim().length === 0) {
        return
      }
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    async deleteInput (i, row) {
      try {
        await this.$confirm(`删除属性, 是否继续`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        row.attr_vals.splice(i, 1)
        this.saveAttrVals(row)
      } catch (error) {
        this.$message({
          message: `取消删除属性`,
          type: 'info',
          duration: 800
        })
      }
    },
    async saveAttrVals (row) {
      let res = await this.$axios.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(',')
      })
      if (res.data.meta.status === 200) {
        this.$message({
          message: '修改属性成功',
          type: 'success',
          duration: 800
        })
      }
    },
    selectChange () {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys.length = 0
        this.params = []
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
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(x => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  }
}
