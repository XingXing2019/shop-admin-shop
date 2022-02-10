import Vue from 'vue'
import moment from 'moment'

Vue.filter('dateFilter', res => {
  return moment(res).format('YYYY-MM-DD hh:mm:ss')
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
    changePage (curPage) {
      this.loadGoodsData(curPage, this.searchText)
    },
    changeSize (curSize) {
      this.pagesize = curSize
      this.loadGoodsData()
    },
    async deleteGood (row) {
      try {
        await this.$confirm('删除商品，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.$axios.delete(`goods/${row.goods_id}`)
        if (res.data.meta.status === 200) {
          this.$message({
            message: '删除商品成功',
            type: 'success',
            duration: 800
          })
          this.loadGoodsData(this.pagenum, this.searchText)
        }
      } catch (error) {
        this.$message({
          message: '取消删除商品',
          type: 'info',
          duration: 800
        })
      }
    },
    searchGoods () {
      this.loadGoodsData(1, this.searchText)
    },
    indexMethod (index) {
      return index + 1
    },
    addGoods () {
      this.$router.push('addGoods')
    }
  }
}
