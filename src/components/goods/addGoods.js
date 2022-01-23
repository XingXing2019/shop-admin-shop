export default {
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
        goods_weight: '',
        is_promote: true,
        pics: [],
        goods_cat: []
      },
      dialogVisible: false,
      dialogImageUrl: '',
      headers: {
        Authorization: localStorage.getItem('token')
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
      this.infoForm.pics = this.infoForm.pics.filter(x => x.pic != filePath)
    },
    uploadSuccess (file) {
      this.infoForm.pics.push({
        pic: file.data.tmp_path
      })
    }
  }
}
