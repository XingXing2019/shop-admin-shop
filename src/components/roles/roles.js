export default {
  data () {
    return {
      roleData: []
    }
  },
  created () {
    this.loadRolesData()
  },
  methods: {
    async loadRolesData () {
      let res = await this.$axios.get(`roles`)
      if (res.data.meta.status === 200) {
        this.roleData = res.data.data
      }
    }
  }
}
