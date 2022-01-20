export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async login () {
      let res = await this.$axios.post('/login', this.loginForm)
      if (res.data.meta.status === 200) {
        localStorage.setItem('token', res.data.data.token)
        this.$message({
          message: '登录成功',
          type: 'success',
          duration: 1200
        })
        this.$router.push('/users')
      } else {
        this.$message({
          message: res.data.meta.msg,
          type: 'error',
          duration: 1200
        })
      }
    },
    resetForm () {
      this.$refs.loginForm.resetFields()
    }
  }
}
