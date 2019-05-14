// pages/recordDetail/recordDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category:"",
    money:"",
    remarks:"",
    date:"",
    type:"",
    picUrl:"",
    id:"",
    usedeposit:''
  },

  /**
   * 生命周期函数--监听页面加载+
   */
  onLoad: function (options) {
    this.setData({
      category:options.category,
      money:options.money,
      date:options.date,
      remarks:options.remarks,
      type:options.type,
      id:options.id,
      usedeposit:options.usedeposit
    })
    console.log(this.data.usedeposit);
    switch(options.category){
      case "餐饮":
        this.setData({
          picUrl:"../../images/eatting.png"
        })
        break;
      case "购物":
        this.setData({
          picUrl:"../../images/buy.png"
        })
        break;
      case "工资存入":
        this.setData({
          picUrl:"../../images/salary.png"
        })
        break;
      case "交通" :
        this.setData({
          picUrl:"../../images/traffic.png"
        })
        break;
      case "住宿":
        this.setData({
          picUrl:"../../images/accommodation.png"
        })
        break;
      case "额外存入":
        this.setData({
          picUrl:"../../images/salary.png"
        })
        break;
    }
  },
  removeRecord:function(){
    const db = wx.cloud.database()
    db.collection('record').doc(this.data.id).remove()
    .then(res=>{
      wx.showToast({
        title: '删除成功',
      })
      setTimeout( function(){
        wx.navigateBack({
          delta: 1
        })
      }
     ,  
      1000);   
    })
    .catch(err=>{
      console.log(err)
    })
  },
  toEdit:function(){
    wx.navigateTo({
      url: '../../pages/editRecord/editRecord?category='+this.data.category+'&type='+this.data.type+'&money='+this.data.money+'&date='+this.data.date+'&remarks='+this.data.remarks+'&id='+this.data.id+'&usedeposit='+this.data.usedeposit,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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