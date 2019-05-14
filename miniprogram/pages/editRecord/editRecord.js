// pages/editRecord/editRecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todaydate: "",
    date: "",
    selectedDate: "",
    showYuan: true,
    remarks: "",
    usedeposit: "",
    money: "",
    type: "",
    selectedDate: "",
    recordid:"",
    categories: {
      desc:'',
      imgUrl:""
    },
    multiArray: [
      [
        {
          id: 0,
          desc: "支出"
        },
        {
          id: 1,
          desc: "存入"
        }
      ],
      [{
        id: 0,
        imgUrl: "../../images/eatting.png",
        desc: "餐饮"
      },
      {
        id: 1,
        imgUrl: "../../images/accommodation.png",
        desc: "住宿"
      },
      {
        id: 2,
        imgUrl: "../../images/traffic.png",
        desc: "交通"
      },
      {
        id: 3,
        imgUrl: "../../images/buy.png",
        desc: "购物"
      }
      ]
    ],
    multiIndex: [0, 0],
  },
  bindMultiPickerChange(e) {
    this.setData({
      multiIndex: e.detail.value
    });
    this.setData({
      categories: this.data.multiArray[1][e.detail.value[1]]
    })
  },
  changeDate(e) {
    if (e.detail.value == this.data.todaydate) {
      this.setData({
        date: e.detail.value
      })
      this.setData({
        selectedDate: "今天"
      })
      console.log(this.data.date);
    } else {
      this.setData({
        date: e.detail.value
      })
      var str = e.detail.value;
      var month = str.slice(5, 7)
      var day = str.slice(8);
      var selectedDate = month + "月" + day + "日"
      this.setData({
        selectedDate: selectedDate
      })
    }
  },
  bindMultiPickerColumnChange(e) {
    console.log(e.detail.value)
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            this.setData({
              type: "支出"
            })
            data.multiArray[1] = [{
              id: 0,
              imgUrl: "../../images/eatting.png",
              desc: "餐饮"
            },
            {
              id: 1,
              imgUrl: "../../images/accommodation.png",
              desc: "住宿"
            },
            {
              id: 2,
              imgUrl: "../../images/traffic.png",
              desc: "交通"
            },
            {
              id: 3,
              imgUrl: "../../images/buy.png",
              desc: "购物"
            }
            ]
            break
          case 1:
            this.setData({
              type: "存入"
            })
            data.multiArray[1] = [{ imgUrl: "../../images/salary.png", desc: "工资存入" }, { imgUrl: "../../images/extra.png", desc: "额外存入" }]
            break
        }
        data.multiIndex[1] = 0
        data.multiIndex[2] = 0
        break
    }
    this.setData(data)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date();
    var seperator = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator + month + seperator + strDate;
    this.setData({
      todaydate: currentdate,
      selectedDate: "今天",
      usedeposit: false,
    })
    var imgUrl
    switch (options.category) {
      case "餐饮":
       imgUrl="../../images/eatting.png"
        break;
      case "购物":
          imgUrl= "../../images/buy.png"
        break;
      case "工资存入":
          imgUrl= "../../images/salary.png"
        break;
      case "交通":
          imgUrl= "../../images/traffic.png"
        break;
      case "住宿":
          imgUrl= "../../images/accommodation.png"
        break;
      case "额外存入":
          imgUrl="../../images/salary.png"
        break;
    }
    var selectedDate=options.date.slice(5)
    this.setData({
      categories:{
        desc:options.category,
        imgUrl:imgUrl
      },
      selectedDate:selectedDate,
      money:options.money,
      remarks:options.remarks,
      usedeposit:options.usedeposit,
       id:options.id,
       type:options.type,
       date:options.date
    })
  },
  radioChange(e) {
    this.setData({
      usedeposit: e.detail.value
    })
  },
  formSubmit(e) {
    var str = this.data.date
    var year = str.slice(0, 4)
    var month = str.slice(5, 7)
    var day = str.slice(8)
    var date = parseInt(year + month + day)
    var money = parseFloat(this.data.money)
    const db = wx.cloud.database()
    db.collection("record").doc(this.data.id).update({
      data:{
        date: date,
        category: this.data.categories.desc,
        money: money,
        remarks: e.detail.value.remarks,
        type: this.data.type,
        usedeposit: this.data.usedeposit
      }
    })
    .then(res=>{
      wx.showToast({
        title: '更改成功',
      }),
        setTimeout(function () {
          wx.navigateBack({
            delta: 2
          })
        }, 1000)  
    }
     
    )
  .catch(err=>{
    console.log(err)
    wx.showToast({
      title: '更改失败',
    })
  }
  )
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