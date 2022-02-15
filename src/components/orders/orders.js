import Vue from 'vue'
import moment from 'moment'
import cityData from './citydata.js'

Vue.filter('dateFilter', res => {
  return moment(res).format('YYYY-MM-DD hh:mm:ss')
})

export default {
  data () {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 5,
        query: ''
      },
      orderData: [],
      totalOrders: 0,
      editAddressDialogVisble: false,
      progressDialogVisble: false,
      addressForm: {
        address: [],
        addressDetail: ''
      },
      addressRules: {
        address: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        addressDetail: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      orderId: 0
    }
  },
  created () {
    this.loadOrderData()
  },
  methods: {
    async loadOrderData () {
      let res = await this.$axios.get(`orders`, {
        params: this.queryInfo
      })
      console.log(res);
      if (res.data.meta.status === 200) {
        this.orderData = res.data.data.goods
        this.totalOrders = res.data.data.total
      }
    },
    async submitEditOrder () { },
    searchOrder () {
      this.loadOrderData()
    },
    changePage (curPage) {
      this.queryInfo.pagenum = curPage
      this.loadOrderData()
    },
    changeSize (curSize) {
      this.queryInfo.pagesize = curSize
      this.loadOrderData()
    },
    showEditAddressDialog (row) {
      this.orderId = row.order_id
      this.editAddressDialogVisble = true
    },
    hideEditAddressDialog () {
      this.$refs.addressForm.resetFields()
      this.editAddressDialogVisble = false
    }
  }
}
