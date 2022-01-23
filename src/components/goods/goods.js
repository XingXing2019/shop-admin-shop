import Vue from 'vue'
import moment from 'moment'

Vue.filter('dateFilter', res => {
  return moment(res).format('YYYY-MM-DD')
})

export default {
  data () {
    return {
      pagenum: 1,
      pagesize: 5,
      searchText: '',
      goodsData: [],
      totalGoods: 0
    }
  },
  created () {
    this.loadGoodsData()
  },
  methods: {
    async loadGoodsData (pagenum = 1, query = '') {
      let res = await this.$axios.get(`goods`, {
        params: {
          pagenum,
          pagesize: this.pagesize,
          query
        }
      })
      if (res.data.meta.status === 200) {
        this.goodsData = res.data.data.goods
        this.totalGoods = res.data.data.total
        this.pagenum = parseInt(res.data.data.pagenum)
      }
    },
    async changePage (curPage) {
      this.loadGoodsData(curPage, this.searchText)
    },
    searchGoods () {
      this.loadGoodsData(1, this.searchText)
    },
    indexMethod (index) {
      return index
    },
    addGoods () {
      this.$router.push('addGoods')
    }
  }
}
