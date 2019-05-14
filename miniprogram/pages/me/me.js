// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deposit:0,
    aim:"",
    newAim:"",
    percent:"",
    showinput:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ishide:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //加载目标金额
    this.loadAim()
    this.showDeposit()
     
    // 判断用户授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              wx.login({
                success:res=>{

                }
              })
            }
          })
        }
        else{
          that.setData({
            isHide: true
          })
        }
      }
    })
  },
  //加载已存金额
  showDeposit:function(){
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
    db.collection("record").where({
      _openid:_.eq(openid),
    }).get()
    .then(res=>{
      var expendsum=0;
      var incomesum=0;
      for(var i=0;i<res.data.length;i++){
        if(res.data[i].type=='存入'){
          incomesum+=res.data[i].money
        }
        else if(res.data[i].usedeposit=='true'){
          expendsum+=res.data[i].money
        }
        var depositsum=incomesum-expendsum;      
      }
      var aim = this.data.aim
      var percent = Math.ceil(depositsum / aim * 100);
      this.setData({
        percent: percent,
        deposit: depositsum
      })
    })
    .catch(err=>{
      console.log(err)
    })
  },
  //更新目标金额
  updateaim:function(){
    var myDate = new Date();
    var date=myDate.toLocaleString();
    var aim=parseInt(this.data.newAim);
     wx.cloud.callFunction({
       name: "updateaim",
       data: {
         date: date,
         aim: aim
       }
     })
       .then(res => {
         console.log(res)
       })
       .catch(err => {
         console.log(err)
       })
  },
  //加载目标金额
  loadAim:function(){
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
    
    db.collection("depositaim").where({
      _openid:openid
    })
    .get()
    .then(res=>{
      this.setData({
        aim:res.data[0].aim
        })
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
},
  setComplete(){
    this.setData({ showinput:false});
    var deposit = this.data.deposit;
    var newAim=this.data.newAim;
    var myDate = new Date();
    var date = myDate.toLocaleString();

    if(newAim<this.data.deposit){
      wx.showToast({
        title: "目标过小请重新设置",
        icon:"none"
      })
      return false
    }
    else{
      if(this.data.aim==""){
        const db = wx.cloud.database()
        const _ = db.command
        db.collection('depositaim').add({
          data: {
            aim: newAim,
            date: date
          }
        })
          .then(
            res => {
              console.log(res + "add")
            }
          )
      }
      else{
        this.updateaim()
      }
      var newPercent = Math.ceil(deposit / newAim * 100);
      this.setData({
        aim:newAim,
        percent: newPercent,
      })
    }
    

    
  },
  changeAim(e){
    this.setData({ newAim: e.detail.value }); 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  showinput(e){
    this.setData({showinput:true});
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadAim()
   //调用计算存款的函数
  this.showDeposit()
  if(this.data.aim<this.data.deposit&&this.data.aim!==''){
    wx.showToast({
      title: '达成目标请重新设置',
      icon:"none"
    })
    this.setData({
      aim:""
    })
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