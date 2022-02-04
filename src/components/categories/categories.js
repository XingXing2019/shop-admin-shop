export default {
  data () {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 5,
        type: 3
      },
      total: 0,
      categories: [],
      parentCategories: [],
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCategoryFormVisible: false,
      editCategoryFormVisible: false,
      addCategoryForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      editCategoryForm: {
        cat_id: 0,
        cat_name: ''
      },
      selectedKeys: [],
      categoryRules: {
        cat_name: [
          { required: true, message: '请输分类名称', trigger: 'blur' }
        ]
      },
      defaultProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }
    }
  },
  created () {
    this.loadCategoryData()
  },
  methods: {
    async loadCategoryData () {
      let res = await this.$axios.get(`categories`, {
        params: this.queryInfo
      })
      if (res.data.meta.status === 200) {
        this.total = res.data.data.total
        this.categories = res.data.data.result
      }
    },
    async loadParentCategoryData () {
      let res = await this.$axios.get(`categories`, {
        params: {
          type: 2
        }
      })
      if (res.data.meta.status === 200) {
        this.parentCategories = res.data.data
      }
    },
    async addCategory () {
      let res = await this.$axios.post(`categories`, this.addCategoryForm)
      if (res.data.meta.status === 201) {
        this.$message({
          message: '添加分类成功',
          type: 'success',
          duration: 800
        })
        this.loadCategoryData()
        this.hideAddCategoryForm()
      }
    },
    async deleteCategory (row) {
      try {
        await this.$confirm('删除分类，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.$axios.delete(`categories/${row.cat_id}`)
        if (res.data.meta.status === 200) {
          this.$message({
            message: '删除分类成功',
            type: 'success',
            duration: 800
          })
          this.loadCategoryData()
        }
      } catch (error) {
        this.$message({
          message: '取消删除分类',
          type: 'info',
          duration: 800
        })
      }
    },
    async editCategory () {
      let res = await this.$axios.put(`categories/${this.editCategoryForm.cat_id}`, {
        cat_name: this.editCategoryForm.cat_name
      })
      if (res.data.meta.status === 200) {
        this.$message({
          message: '编辑分类成功',
          type: 'success',
          duration: 800
        })
        this.loadCategoryData()
        this.hideEditCategoryForm()
      }
    },
    changePage (curPage) {
      this.queryInfo.pagenum = curPage
      this.loadCategoryData()
    },
    changeSize (curSize) {
      this.queryInfo.pagesize = curSize
      this.loadCategoryData()
    },
    showAddCategoryForm () {
      this.loadParentCategoryData()
      this.addCategoryFormVisible = true
    },
    hideAddCategoryForm () {
      this.$refs.addCategoryForm.resetFields()
      this.selectedKeys = []
      this.addCategoryForm.cat_pid = 0
      this.addCategoryForm.cat_level = 0
      this.addCategoryFormVisible = false
    },
    selectedChange () {
      let len = this.selectedKeys.length
      this.addCategoryForm.cat_level = len
      this.addCategoryForm.cat_pid = len > 0 ? this.selectedKeys[len - 1] : 0
    },
    showEditCategoryDialog (row) {
      this.editCategoryForm.cat_id = row.cat_id
      this.editCategoryForm.cat_name = row.cat_name
      this.editCategoryFormVisible = true
    },
    hideEditCategoryForm () {
      this.$refs.editCategoryForm.resetFields()
      this.editCategoryFormVisible = false
    }
  }
}
