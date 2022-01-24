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
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        is_promote: true,
        pics: [],
        goods_cat: [],
        goods_introduce: ''
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
    async addGood () {
      /* eslint-disable */
      const {
        goods_name,
        goods_price,
        goods_number,
        goods_weight,
        is_promote,
        pics,
        goods_cat,
        goods_introduce
      } = this.infoForm
      /* eslint-enable */
      let res = await this.$axios.post(`goods`, {
        goods_name,
        goods_cat: goods_cat.join(','),
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics
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
    },
    nextStep (activeIndex, activeName) {
      this.activeIndex = activeIndex
      this.activeName = activeName
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove (file, fileList) {
      const filePath = file.response.data.tmp_path
      this.infoForm.pics = this.infoForm.pics.filter(x => x.pic !== filePath)
    },
    uploadSuccess (file) {
      this.infoForm.pics.push({
        pic: file.data.tmp_path
      })
    }
  }
}
