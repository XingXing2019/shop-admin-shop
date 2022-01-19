export default {
  data () {
    return {
      rightData: []
    }
  },
  created () {
    this.loadRightData()
  },
  methods: {
    async loadRightData () {
      let res = await this.$axios.get(`rights/list`)
      if (res.data.meta.status === 200) {
        this.rightData = res.data.data
      }
    },
    indexMethod (index) {
      return index
    }
  }
}
