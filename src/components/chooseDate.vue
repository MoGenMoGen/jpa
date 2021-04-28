<template>
  <div>
    <!-- 多列选择：年月日时分秒 -->
    <picker mode="multiSelector" :value="multiIndex" :range="multiArray" @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnchange">
      <view class="date"><span style="color: grey;">{{time || placeholder}}</span><image mode="widthFix" :src="date"></image></view>
    </picker>
  </div>
</template>
<script>
  import date from '../../static/my/date.png'
  export default {
    data () {
      return {
        date,
        multiIndex: [],
        multiArray: [],
        placeholder: '请选择日期时间',
        time: '',
        dateNum: 31 // 天数
      }
    },
    onReady () {
      this.newMultiArray()

    },
    created () {},
    watch: {
      multiIndex (val, oldVal) {
        if ((val !== oldVal)) {
          this.multiIndex = val
        }
      }
    },
    computed: {},
    methods: {
      setTime(val){
        console.log('---------')
         if(val){
           this.getCurrentTime(val)
         }else {
           this.getCurrentTime()
         }
      },
      // rang数组
      newMultiArray () {
        this.multiArray = [this.years(), this.months(), this.days('', ''), this.hours(), this.minutes(), this.seconds()]
      },
      years () {
        const date = new Date()
        const years = []
        for (let i = 1970; i <= date.getFullYear() + 100; i++) {
          years.push('' + i)
        }
        return years
      },
      months () {
        const months = []
        for (let i = 1; i <= 12; i++) {
          if (i < 10) {
            i = '0' + i
          }
          months.push('' + i)
        }
        return months
      },
      days (year, month) {
        if (year && month) {
          switch (parseInt(month)) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
              this.dateNum = 31
              break
            case 4:
            case 6:
            case 9:
            case 11:
              this.dateNum = 30
              break
            // 对于2月份需要判断是否为闰年
            case 2:
              if (((year % 400 === 0) || (year % 100 !== 0)) && (year % 4 === 0)) {
                this.dateNum = 29
                break
              } else {
                this.dateNum = 28
                break
              }
          }
        }
        const days = []
        for (let i = 1; i <= Number(this.dateNum); i++) {
          if (i < 10) {
            i = '0' + i
          }
          days.push('' + i)
        }
        if (year && month) this.multiArray[2] = days
        return days
      },
      hours () {
        const hours = []
        for (let i = 0; i < 24; i++) {
          if (i < 10) {
            i = '0' + i
          }
          hours.push('' + i)
        }
        return hours
      },
      minutes () {
        const minutes = []
        for (let i = 0; i < 60; i++) {
          if (i < 10) {
            i = '0' + i
          }
          minutes.push('' + i)
        }
        return minutes
      },
      seconds () {
        const seconds = []
        for (let i = 0; i < 60; i++) {
          if (i < 10) {
            i = '0' + i
          }
          seconds.push('' + i)
        }
        return seconds
      },
      // 获取当前时间
      getCurrentTime (val) {
        this.formTime = val
        let data = new Date()
        let year = ''
        let month = ''
        let day = ''
        let hour = ''
        let minute = ''
        let second = ''
        let yearNum = 0
        let monthNum = 0
        let dayNum = 0
        let hourNum = 0
        let minuteNum = 0
        let secondNum = 0
        if (!this.formTime) {
          // 获取当前时间
          year = data.getFullYear()
          month = data.getMonth() + 1
          day = data.getDate()
          hour = data.getHours()
          minute = data.getMinutes()
          second = data.getSeconds()
        } else {
          let timeArr = this.formTime.replace(' ', ':').replace(/:/g, '-').split('-')
          year = Number(timeArr[0])
          month = Number(timeArr[1])
          day = Number(timeArr[2])
          hour = Number(timeArr[3])
          minute = Number(timeArr[4])
          second = Number(timeArr[5])
        }
        this.days(year, month) // 判断当前年月的天数
        for (let i = 1970; i <= data.getFullYear() + 100; i++) {
          yearNum = yearNum + 1
          if (i === year) break
        }
        for (let i = 1; i <= 12; i++) {
          monthNum = monthNum + 1
          if (i === month) break
        }
        for (let i = 1; i <= 31; i++) {
          dayNum = dayNum + 1
          if (i === day) break
        }
        for (let i = 0; i <= 24; i++) {
          hourNum = hourNum + 1
          if (i === hour) break
        }
        for (let i = 0; i <= 60; i++) {
          minuteNum = minuteNum + 1
          if (i === minute) break
        }
        for (let i = 0; i <= 60; i++) {
          secondNum = secondNum + 1
          if (i === second) break
        }
        this.multiIndex = [yearNum - 1, monthNum - 1, dayNum - 1, hourNum - 1, minuteNum - 1, secondNum - 1]
        this.time = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second
      },
      // 监听滚动事件
      bindMultiPickerColumnchange (e) {
        let value = e.mp.detail.value
        let column = e.mp.detail.column
        var dayChange = {
          multiArray: this.multiArray,
          multiIndex: this.multiIndex,
          year: '',
          month: ''
        }
        dayChange.multiIndex[column] = value
        switch (column) {
          // 年
          case 0:
            dayChange.year = this.multiArray[column][value]
            if (dayChange.year === this.multiArray[0][this.multiIndex[0]]) {
              dayChange.month = this.multiArray[1][this.multiIndex[1]]
            } else {
              dayChange.month = 1
            }
            break
          // 月
          case 1:
            dayChange.year = this.multiArray[0][this.multiIndex[0]]
            dayChange.month = this.multiArray[column][value]
            break
        }
        this.days(dayChange.year, dayChange.month)
      },
      // 选择
      bindMultiPickerChange (e) {
        this.multiIndex = e.mp.detail.value
        const index = this.multiIndex
        const year = this.multiArray[0][index[0]]
        const month = this.multiArray[1][index[1]]
        const day = this.multiArray[2][index[2]]
        const hour = this.multiArray[3][index[3]]
        const minute = this.multiArray[4][index[4]]
        const second = this.multiArray[5][index[5]]
        this.time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
        this.$emit('setTime',this.time)
      }
    }
  }
</script>
<style lang="less" scoped>
.date{
  display: flex;
  display: -webkit-flex;
  align-items: center;
  width:100%;
  span{
    width: 55vw;
  }
  image{
    width: 40rpx;
    height: 40rpx;
  }
}
</style>
