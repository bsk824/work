"use strict";

var device = {
  agent: navigator.userAgent.toLocaleLowerCase(),
  os: null,
  ver: null,
  init: function init() {
    if (device.agent.indexOf('iphone') > -1 || device.agent.indexOf('ipad') > -1) {
      var str = device.agent.substring(device.agent.indexOf('os') + 3);
      var ver = str.substring(0, str.indexOf(' like'));
      device.os = 'ios';
      device.ver = device.os + ver;
    }

    if (device.agent.indexOf('android') > -1) {
      var _str = device.agent.substring(device.agent.indexOf('android') + 8);

      var strSub = _str.substring(0, _str.indexOf(';'));

      var _ver = strSub.replace(/[.]/gi, '_');

      device.os = 'android';
      device.ver = device.os + _ver;
    }

    device.set();
  },
  set: function set() {
    var html = document.querySelector('html');
    var htmlClass = html.getAttribute('class');
    var trash = '';
    if (device.agent.indexOf('samsung') > -1) trash += ' samsung';
    if (device.agent.indexOf('naver') > -1) trash += ' naver';
    htmlClass ? html.setAttribute('class', htmlClass + ' ' + device.ver + trash) : html.setAttribute('class', device.ver + trash);
  }
};
var findEl = {
  obj: null,
  parent: function parent(el, str) {
    var tag = el.parentNode.tagName.toLowerCase();
    var cls = el.parentNode.classList;
    var id = el.parentNode.getAttribute('id');
    findEl.obj = el.parentNode;

    if (str !== tag && !cls.contains(str) && str != id) {
      if (tag != 'body') {
        findEl.parent(findEl.obj, str);
      } else {
        findEl.obj = null;
      }
    }

    return findEl.obj;
  },
  child: function child(el, str) {
    var arr = [];
    [].forEach.call(el.childNodes, function (obj) {
      if (obj.nodeType == 1) {
        var tag = obj.tagName.toLowerCase();
        var cls = obj.classList;
        var id = obj.getAttribute('id');

        if (str === tag || cls.contains(str) || str === id) {
          arr.push(obj);
        }
      }
    });

    if (arr.length > 0) {
      return arr;
    } else {
      return null;
    }
  },
  prevNode: function prevNode(str) {
    if (str.previousSibling != null) {
      if (str.previousSibling.nodeType == 1) {
        findEl.obj = str.previousSibling;
      } else {
        findEl.prevNode(str.previousSibling);
      }

      return findEl.obj;
    }
  },
  nextNode: function nextNode(str) {
    if (str.nextSibling != null) {
      if (str.nextSibling.nodeType == 1) {
        findEl.obj = str.nextSibling;
      } else {
        findEl.nextNode(str.nextSibling);
      }

      return findEl.obj;
    }
  }
};

var getUrlParams = function getUrlParams() {
  var params = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
    params[key] = value;
  });
  return params;
};

window.addEventListener('DOMContentLoaded', function () {
  device.init();
});
//# sourceMappingURL=ui.js.map
