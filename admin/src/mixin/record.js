// import api from "../utils/axios";
import apis from '../api/api'
export const record = {
    data () {
        return {
            total: 0,
            pageSizeArr: [20, 50, 100, 200, 300, 400],
            loading: false,
            timeout: null,
            table: [],
            queryPar: {
                pageNum: 1,
                pageSize: 20
            }
        }
    },
    methods: {
        queryCoupon (queryString, cb) {
            if (queryString !== '') {
                this.loading = true
                clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    apis.getCouponNames({couponName: queryString, isNeedChildCoupon: true}).then(res => {
                        this.loading = false
                        if (res.data.data && res.data.data.length > 0) {
                            for (let val of res.data.data) {
                                val.value = val.couponName
                            }
                            cb(res.data.data)
                        } else {
                            cb([])
                        }
                    }).catch(res => {
                        this.loading = false
                    })
                }, 500)
            }
        },
        handleSizeChange (val) {
            this.queryPar.pageSize = val
            this.getTableList()
        },
        handleCurrentChange (val) {
            this.queryPar.pageNum = val
            this.getTableList()
        }
    },
    created () {
        this.init()
    }
}