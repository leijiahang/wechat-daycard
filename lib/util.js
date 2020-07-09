
const request = require("request");

var Req = {
  r: function(err, resp, body, callback) {
    if (!err && resp.statusCode == 200) {
      try {
        if (
          (body.indexOf('{') !== -1 && body.indexOf('}') !== -1) ||
          (body.indexOf('[') !== -1 && body.indexOf(']') !== -1)
        ) {
          callback(JSON.parse(body));
        } else {
          callback(body);
        }
      } catch(e) {
        callback(body);
      }
    } else {
      var data = {};
      data.timeoutmsg = "旅途太远，找不到答案。";
      callback(data);
    }
  },
  get: function(url, callback) {
    var self = this;
    request(
      url,
      {
        timeout: 2500
      },
      function(err, resp, body) {
        self.r(err, resp, body, callback);
      }
    );
  },
  post: function(url, body, callback) {
    callback =
      callback ||
      function() {
        console.log("postRequest default callback invoked");
      };

    var self = this;
    let encoding = body.encoding;
    delete body.encoding;
    var options = {
      url: url,
      method: "post",
      body: JSON.stringify(body)
    };

    if (encoding) {
      options.encoding = encoding;
    }

    request(options, function(err, resp, body) {
      self.r(err, resp, body, callback);
    });
  }
};

exports.Req = Req;