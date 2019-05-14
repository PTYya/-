// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('depositaim').where({
      openid:wxContext.OPENID,
    })
      .get()
    .then(res=>{
      var aim=res.data.aim
    })
  } catch (e) {
    console.error(e)
  }
  return {
    
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}