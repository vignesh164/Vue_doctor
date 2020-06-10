/* eslint-disable */

module.exports = {

  request: function (req, token) {
    this.http.setHeaders.call(this, req, {Authorization: 'Bearer ' + token});
  },

  response: function (res) {
    return (res.data || {}).token;
  }
};
