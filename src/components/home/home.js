export default {
  data () {
    return {
      NavBarData: []
    }
  },
  created () {
    this.loadNaviBarData()
  },
  methods: {
    logout () {
      this.$confirm('退出登录，继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push('./login')
        this.$message({
          message: '退出登录',
          type: 'success',
          duration: 800
        })
        localStorage.removeItem('token')
      }).catch(() => {
        this.$message({
          message: '取消退出登录',
          type: 'info',
          duration: 800
        })
      })
    },
    async loadNaviBarData () {
      let res = await this.$axios.get('menus')
      if (res.data.meta.status === 200) {
        this.NavBarData = res.data.data
      }
    }
  },
  computed: {
    path () {
      return this.$route.path.substring(1)
    }
  }
}
