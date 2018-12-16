// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  const wxContext = cloud.getWXContext()
  let like_openid = wxContext.OPENID;
  const _ = db.command
  db.collection("pages").doc(event.page_id).update({
    data: {
      likes: _.inc(1)
    }
  })
  .then(res => {
    //console.log(res)
    resolve(JSON.stringify(res))
  })
})