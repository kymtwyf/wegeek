// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

var color_map = {
  "-3": { '0': "#767676", '1': "#AEAEAE" },
  "-2": { '0': '#8486A5', '1': '#9F9BAC' },
  '-1': { '0': '#8D95AC', '1': '#A0A9BA' },
  '0': { '0': '#C7B7A6', '1': '#988D81' },
  '1': { '0': '#858C7C', '1': '#B0B8A9' },
  '2': { '0': '#CEA6A1', '1': '#E4B8B2' },
  '3': { '0': '#B26B76', '1': '#D39CA3' }
}

function get_color(chunk) {
  if (chunk['ret'] == 0) {
    var polar = chunk['data']['polar'];
    var confd = chunk['data']['confd'];
    if (polar != 0) {
      if (polar == 1) {
        if (confd > 0.8) {
          return { 'color': color_map['3'] };
        } else if (confd > 0.5) {
          return { 'color': color_map['2'] };
        } else {
          return { 'color': color_map['1'] };
        }
      } else {
        if (confd > 0.8) {
          return { 'color': color_map['-3'] };
        } else if (confd > 0.5) {
          return { 'color': color_map['-2'] };
        } else {
          return { 'color': color_map['-1'] };
        }
      }
    }
  }
  return { 'color': color_map['0'] };
}

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  console.log(event.page_content);
  const wxContext = cloud.getWXContext()

  var appkey = 'LHGNH0usjUTRRRSA';
  var qs = require('querystring');
  var now = parseInt(Date.now() / 1000), rdm = parseInt(Math.random() * Math.pow(2, 32));

  var str = event.page_content;
  let publish_time = event.publish_time;
  str = str.split(' ').join('');
  var text = new Buffer(str, 'utf8').toString();
  console.log(text);
  var params = {
    'app_id': '2107823355',
    'nonce_str': rdm,
    'text': text,
    'time_stamp': now,
    'app_key': appkey
  }

  var request_str = qs.stringify(params);
  var crypto = require('crypto');
  var md5 = crypto.createHash('md5');
  var sign = md5.update(request_str).digest('hex');
  params['sign'] = sign.toUpperCase()

  var content = qs.stringify(params)
  // 执行API调用
  var url = 'api.ai.qq.com';
  var https = require('https');
  var options = {
    hostname: url,
    method: 'POST',
    path: '/fcgi-bin/nlp/nlp_textpolar',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(content)
    }
  };

  var req = https.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
      console.log(text);
      let color_json = get_color(chunk);
      //resolve(JSON.stringify(chunk));
      db.collection("pages").add({
        data: {
          page_content: event.page_content,
          publish_time: event.publish_time,
          color: color_json.color
        },
      })
      .then(res => {
        console.log(chunk);
        console.log(res);
        let tmp = get_color(chunk);
        data = {'_id': res._id, 'color': color_json.color}
        resolve(JSON.stringify(data));
      })
    });
  });

  req.on('error', function (e) {
    console.log('Error: ' + e.message);
  });
  // write data to request body
  req.write(content);
  req.end();
})