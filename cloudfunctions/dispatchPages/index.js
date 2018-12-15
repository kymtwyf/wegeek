// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
// 随机拿最新的100页里的20页
const db = cloud.database();
exports.main = async (event, context) => new Promise((resolve, reject) => {
  // Promise 风格
  const _ = db.command
  console.log('openid=' + event.openid)
  db.collection('pages').where({
    _openid: _.neq(event.openid)
  }).orderBy('publish_time', 'desc')
    .limit(20)
    .get()
    .then(res => {
      console.log('return')
      console.log(res.data)
      var data = res.data
      resolve(JSON.stringify(data))
    })
    .catch(err => {
      console.error(err)
    })
});