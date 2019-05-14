// pages/newchart/newchart.js
import * as echarts from '../../ec-canvas/echarts';
var chart=null
function setOption(chart, data) {
  const option = {
    title: {
      text: '支出类别占比',
      left: 'center',
      top: 20,
      textStyle: {
        color: 'black'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: " {b} : {c} \n({d}%)"
    },
    legend: {
      orient: 'horizontal',
      bottom: '10%',
      data: ['餐饮', '住宿', '交通', '购物']
    },
    series: [
      {
        name: '支出',
        type: 'pie',
        radius: '50%',
        center: ['50%', '50%'],
        data: [
          { value: data[0], name: '餐饮' },
          { value: data[1], name: '交通' },
          { value: data[2], name: "购物" },
          { value: data[3], name: '住宿' },
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  } ;
  chart.setOption(option)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ecOne: {
      lazyLoad: true
    },
   second_height:'',
   balance:'0',
   income:0,
   pay:0,
    buttonHeight:"",
    background:"#777",
    background1:"",
    ismonth:false,
    selectedMonth:'',
    selectedYear:"",
    currentMonth:'',
    currentYear:'',
    selectedMonthYear:"",
    currentDate:""
  },
//按钮点击事件
tomonth:function(){
  if(this.data.ismonth==false){
    this.setData({
      background1: "#777",
      background: '',
      ismonth: true
    })
    this.getMonthOption();
    console.log(this.data.selectedMonth)
  }
},
toyear:function(){
  if(this.data.ismonth==true){
    this.setData({
      background:"#777",
      background1:'',
      ismonth:false
    })
    this.getOneOption();
  }
},
  changeDate(e) {
    var str = e.detail.value;
    var year = str.slice(0, 4);
    var month = str.slice(5, 7);
    this.setData({
      selectedMonthYear: year,
      selectedMonth: month
    })
    this.getMonthOption();
  },
  changeYear(e) {
    this.setData({
      selectedYear:e.detail.value
    })
    console.log(this.data.selectedYear)
    this.getOneOption();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var seperator = "-";
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    var currentdate = year + seperator + month;
    this.setData({
      selectedMonth: month,
      selectedYear: year,
      currentMonth:month,
      currentYear:year,
      selectedMonthYear:year,
      currentdate:currentdate
    })
    var that = this
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 可使用窗口宽度、高度
        // console.log('height=' + res.windowHeight);
        // console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        that.setData({
    // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          second_height: res.windowHeight - res.windowWidth / 750 * 300
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.oneComponent = this.selectComponent('#mychart-one');
  },
  init_one: function (data) { 
        //初始化第一个图表
    this.oneComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
        setOption(chart, data)
      this.chart = chart;
      return chart;
    })
  },
  

  getOneOption:function(){
    var openid = "";
    wx.cloud.callFunction({
      name: "login"
    }).then(res => {
      openid = res.result.openid
    }).catch(err => {
      console.log(err)
    })
    const db = wx.cloud.database()
    const _ = db.command
    var startDate = parseInt(this.data.selectedYear+"0101");
    var endDate = parseInt(this.data.selectedYear+"1231");
   var that=this
    db.collection('record').where({
      _openid: _.eq(openid),
      date: _.gte(startDate).and(_.lte(endDate))
    }).get({
      success(res){
        let incomesum=0;
        let expandsum=0;
        let eatting=0;
        let traffic=0;
        let accommodation=0;
        let buy=0;
        let data=res.data;
        data.filter(item=>item.type=="存入")
        .map(item=>{
          incomesum+=item.money
        })
        data.filter(item=>item.type=="支出")
        .map(item=>{
          expandsum+=item.money
        })
        incomesum = incomesum.toFixed(2);
        expandsum = expandsum.toFixed(2);
         let balance=incomesum-expandsum
        that.setData({
          income:incomesum,
          pay:expandsum,
          balance:balance
        })
        data.filter(item=>item.category=="餐饮")
        .map(item=>{eatting+=item.money})
        data.filter(item => item.category == "交通")
          .map(item => { traffic += item.money })
        data.filter(item => item.category == "住宿")
          .map(item => { accommodation += item.money })
        data.filter(item => item.category == "购物")
          .map(item => { buy += item.money })
        that.init_one([eatting,traffic,buy,accommodation])
      }
    })
  },
  
  getMonthOption: function () {
    var openid = "";
    wx.cloud.callFunction({
      name: "login"
    }).then(res => {
      openid = res.result.openid
    }).catch(err => {
      console.log(err)
    })
    const db = wx.cloud.database()
    const _ = db.command
    var startDate = parseInt(this.data.selectedMonthYear+this.data.selectedMonth+'01');
    var endDate = parseInt(this.data.selectedMonthYear + this.data.selectedMonth + '31');
    var that = this
    db.collection('record').where({
      _openid: _.eq(openid),
      date: _.gte(startDate).and(_.lte(endDate))
    }).get({
      success(res) {
        let incomesum = 0;
        let expandsum = 0;
        let eatting = 0;
        let traffic = 0;
        let accommodation = 0;
        let buy = 0;
        let data = res.data;
        data.filter(item => item.type == "存入")
          .map(item => {
            incomesum += item.money
          })
        data.filter(item => item.type == "支出")
          .map(item => {
            expandsum += item.money
          })
        incomesum = incomesum.toFixed(2);
        expandsum = expandsum.toFixed(2);
        let balance = incomesum - expandsum
        that.setData({
          income: incomesum,
          pay: expandsum,
          balance: balance
        })
        data.filter(item => item.category == "餐饮")
          .map(item => { eatting += item.money })
        data.filter(item => item.category == "交通")
          .map(item => { traffic += item.money })
        data.filter(item => item.category == "住宿")
          .map(item => { accommodation += item.money })
        data.filter(item => item.category == "购物")
          .map(item => { buy += item.money })
        that.init_one([eatting, traffic, buy, accommodation])
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.ismonth==true){
      this.getMonthOption()
    }
    else{
      this.getOneOption()
    }
     
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})