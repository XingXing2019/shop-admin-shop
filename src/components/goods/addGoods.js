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
        goods_cat: []
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
      console.log(res);
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
    }
  }
}
