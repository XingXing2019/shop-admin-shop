import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  data () {
    return {
      uploadUrl: 'http://localhost:8888/api/private/v1/upload',
      tabPosition: 'left',
      activeIndex: 1,
      activeName: 'info',
      categoryData: [],
      defaultProps: {
        label: 'cat_name',
        value: 'cat_id'
      },
      infoForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        is_promote: true,
        pics: [],
        goods_cat: [],
        goods_introduce: '',
        attrs: []
      },
      params: [],
      attrs: [],
      infoRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      dialogImageUrl: '',
      headers: {
        Authorization: localStorage.getItem('token')
      },
      editorOption: {
        placeholder: '请输入商品内容'
      }
    }
  },
  created () {
    this.loadCategoryData()
  },
  computed: {
    categoryId () {
      let len = this.infoForm.goods_cat.length
      if (len === 3) {
        return this.infoForm.goods_cat[len - 1]
      }
    }
  },
  methods: {
    async loadCategoryData () {
      let res = await this.$axios.get(`categories`, {
        params: {
          type: 3
        }
      })
      if (res.data.meta.status === 200) {
        this.categoryData = res.data.data
      }
    },
    async loadAttrData (sel) {
      let res = await this.$axios.get(`categories/${this.categoryId}/attributes`, {
        params: { sel }
      })
      if (res.data.meta.status === 200) {
        if (sel === 'many') {
          res.data.data.forEach(item => {
            item.attr_vals = item.attr_vals === '' ? [] : item.attr_vals.split(',')
          })
        }
        sel === 'only' ? this.attrs = res.data.data : this.params = res.data.data
      }
    },
    async addGood () {
      this.attrs.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
        this.infoForm.attrs.push(newInfo)
      })
      this.params.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(',')
        }
        this.infoForm.attrs.push(newInfo)
      })
      /* eslint-disable */
      const {
        goods_name,
        goods_price,
        goods_number,
        goods_weight,
        is_promote,
        pics,
        goods_cat,
        goods_introduce,
        attrs
      } = this.infoForm
      /* eslint-enable */
      let res = await this.$axios.post(`goods`, {
        goods_name,
        goods_cat: goods_cat.join(','),
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics,
        attrs
      })
      if (res.data.meta.status === 201) {
        this.$message({
          message: '添加商品成功',
          type: 'success',
          duration: 800
        })
        this.$router.push('goods')
      }
    },
    clickTab (tab) {
      this.activeIndex = parseInt(tab.index) + 1
      if (this.activeIndex === 4) {
        this.loadAttrData('only')
      } else if (this.activeIndex === 5) {
        this.loadAttrData('many')
      }
    },
    nextStep (activeIndex, activeName) {
      this.activeIndex = activeIndex
      this.activeName = activeName
      if (activeName === 'attr') {
        this.loadAttrData('only')
      } else if (activeName === 'param') {
        this.loadAttrData('many')
      }
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove (file, fileList) {
      const filePath = file.response.data.tmp_path
      this.infoForm.pics = this.infoForm.pics.filter(x => x.pic !== filePath)
    },
    handleChange () {
      if (this.infoForm.goods_cat.length !== 3) {
        this.infoForm.goods_cat.length = 0
      }
    },
    uploadSuccess (file) {
      this.infoForm.pics.push({
        pic: file.data.tmp_path
      })
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === 'info' && this.infoForm.goods_cat.length !== 3) {
        this.$message({
          message: '请选择商品分类',
          type: 'warning',
          duration: 800
        })
        return false
      }
    }
  }
}
