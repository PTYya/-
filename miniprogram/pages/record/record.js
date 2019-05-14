// pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMonth:"",
    selectedMonth:"",
    selectedYear:"",
    income:"",
    expand:"",
    recordLists:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var date = new Date();
    var seperator = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    var currentdate = year + seperator + month;
    this.setData({
      currentMonth: currentdate,
      selectedMonth: month,
      selectedYear: year
    })
  },
  toRecordDetail:function(options){
    let currentDate = this.data.selectedYear+'年'+options.currentTarget.dataset.date;
    let currentMoney = options.currentTarget.dataset.money;
    let currentCategory = options.currentTarget.dataset.category;
    let currentRemarks = options.currentTarget.dataset.remarks;
    let currentType=options.currentTarget.dataset.type;
    let id=options.currentTarget.dataset.id;
    let usedeposit=options.currentTarget.dataset.usedeposit;
    wx.navigateTo({
      url: '../../pages/recordDetail/recordDetail?date='+currentDate+'&money='+currentMoney+'&category='+currentCategory
        + '&remarks=' + currentRemarks + '&type=' + currentType + '&id=' + id +'&usedeposit='+usedeposit,
      fail:function(){
        wx.showToast({
          title: '跳转失败',
          icon:'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    
  },

  changeDate(e){
    var str=e.detail.value;
    var year=str.slice(0,4);
    var month=str.slice(5,7);
    this.setData({
      selectedYear:year,
      selectedMonth:month
    })
  this.showdata();
  },
  
  showdata:function(){
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
    var startDate = parseInt(this.data.selectedYear + this.data.selectedMonth + "01")
    var endDate = parseInt(this.data.selectedYear + this.data.selectedMonth + "31")
    db.collection('record').where({
      _openid: _.eq(openid),
      date: _.gte(startDate).and(_.lte(endDate))
    }).get().then(res => {
      var incomesum = 0;
      var expandsum = 0;
      var recordLists = [];
      for (var i = 0; i < res.data.length; i++) {
        const date = res.data[i].date.toString()
        var month = date.slice(4, 6)
        var day = date.slice(6, 8)
        var showdate = month + "月" + day + "日"
        recordLists.push({
          date: showdate,
          type: res.data[i].type,
          category: res.data[i].category,
          money: res.data[i].money,
          remarks: res.data[i].remarks,
          id: res.data[i]._id,
          usedeposit: res.data[i].usedeposit
        })
        if (res.data[i].type == "支出") {
          expandsum += res.data[i].money
        }
        else {
          incomesum += res.data[i].money
        }
      }
      this.setData({
        recordLists: recordLists
      })
      incomesum = incomesum.toFixed(2);
      expandsum = expandsum.toFixed(2);
      this.setData({
        income: incomesum,
        expand: expandsum
      })
  
    }).catch(err => {
      console.log(err);
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.showdata();
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