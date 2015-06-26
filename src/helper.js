var marexandre;
(function (marexandre) {
  'use strict';

  var Helper = (function() {
    function Helper() {}

    /**
     * orderBy sorts an array by a given object key
     * @param  {Array} list  Array containing objects
     * @param  {String} type Object key
     * @return {Array}
     */
    Helper.prototype.orderBy = function(list, type) {
      return list.sort(function(a, b) {
        return parseInt(a[type], 10) - parseInt(b[type], 10);
      });
    };

    /**
     * removeOverlapingIndecies removes duplicate indecies from an trie indecies array
     * trie indecies array looks somehting like this: [{start: 1, end: 3}, ...]
     * @param  {Array} list Array of trie indecies
     * @return {Array}      Array with out overlaping trie indecies
     */
    Helper.prototype.removeOverlapingIndecies = function(list) {
      var a = [], item, next;

      // Check for overlapping items
      for (var i = 0, imax = list.length; i < imax; i++) {
        item = list[i];

        for (var j = i + 1; j < imax; j++) {
          next = list[j];

          if (this.isOverlap(item, next)) {
            a.push(j);
          }
        }
      }
      // Remove overlapping items from the list
      return list.slice(0).filter(function(elem, pos) {
        if (a.indexOf(pos) !== -1) {
          return false;
        }
        return true;
      });
    };

    /**
     * removeOverlapingIndeciesByPriority removes duplicate indecies from an trie indecies array by priority
     * trie indecies array looks somehting like this: [{start: 1, end: 3}, ...]
     * @param  {Array} list Array of trie indecies
     * @return {Array}      Array with out overlaping trie indecies
     */
    Helper.prototype.removeOverlapingIndeciesByPriority = function(list) {
      list = list || [];
      list = this.orderBy(list, 'priority');

      var a = [], item, next;
      // Remove overlap based on priority
      for (var i = 0, imax = list.length; i < imax; i++) {
        item = list[i];

        for (var j = i + 1; j < imax; j++) {
          next = list[j];
          if (this.isOverlap(item, next)) {
            if (item.priority < next.priority) {
              a.push(i);
              break;
            } else if (item.priority === next.priority) {
              if (item.end > next.end || item.start < next.start) {
                a.push(j);
              } else {
                a.push(i);
                break;
              }
            } else {
              a.push(j);
            }
          }
        }
      }
      // Remove overlapping items from the list
      return list.slice(0).filter(function(elem, pos) {
        if (a.indexOf(pos) !== -1) {
          return false;
        }
        return true;
      });
    };

    /**
     * isOverlap checks if two trie indecies objects overlap
     * @param  {Object} x Trie indecies object A
     * @param  {Object} y Trie indecies object B
     * @return {boolean}   If overlapping or not
     */
    Helper.prototype.isOverlap = function(x, y) {
      return x.start < y.end && y.start < x.end;
    };

    /**
     * flattenIndeciesList
     * @param  {Array} list [description]
     * @return {Array}      [description]
     */
    Helper.prototype.flattenIndeciesList = function(list) {
      var a = [], type, obj;

      for (var i = 0, imax = list.length; i < imax; i++) {
        type = list[i].type;
        for (var j = 0, jmax = list[i].indecies.length; j < jmax; j++) {
          obj = list[i].indecies[j];
          a.push({ 'start': obj.start, 'end': obj.end, 'type': type });
        }
      }

      return a;
    };

    /**
     * cleanupOnWordBoundary
     * @param  {String} text            [description]
     * @param  {Array} list            [description]
     * @param  {boolean} useWordBoundary [description]
     * @return {Array}                 [description]
     */
    Helper.prototype.cleanupOnWordBoundary = function(text, list, useWordBoundary) {
      useWordBoundary = useWordBoundary || true;

      var a = [], o, w, ww, wws;

      for (var i = 0, imax = list.length; i < imax; i++) {
        o = list[i];
        w = text.slice(o.start, o.end);
        wws = o.start - 1 < 0 ? 0 : o.start - 1;
        ww = text.slice(wws, o.end + 1);

        if (useWordBoundary && this.isWrappedByASCII(w) && !this.checkWordBoundary(w, ww)) {
          a.push(i);
        }
      }
      // Remove overlapping items from the list
      return list.slice(0).filter(function(elem, pos) {
        if (a.indexOf(pos) !== -1) {
          return false;
        }
        return true;
      });
    };

    /**
     * makeTokenized
     * @param  {String} text     Some text string
     * @param  {Array} indecies  Array of trie indecies
     * @return {Array}           Array with tokenized content
     */
    Helper.prototype.makeTokenized = function(text, indecies) {
      var a = [], o, s = 0, ss = 0;

      for (var i = 0, imax = indecies.length; i < imax; i++) {
        o = indecies[i];
        ss = o.start;

        if (ss > s) {
          a.push({ 'value': text.slice(s, ss), 'type': 'text' });
        }

        a.push({ 'value': text.slice(ss, o.end), 'type': o.type });

        s = o.end;
      }

      if (s < text.length) {
        a.push({ 'value': text.slice(s, text.length), 'type': 'text' });
      }

      return a;
    };

    Helper.prototype.checkWordBoundary = function(w, ww) {
      return new RegExp('\\b' + this.escapeRegExp(w) + '\\b').test(ww);
    };

    Helper.prototype.isWrappedByASCII = function(str) {
      return /^\w.*\w$|^\w+$/.test(str);
    };

    Helper.prototype.escapeHTML = function(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    Helper.prototype.escapeRegExp = function(str) {
      return str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
    };

    Helper.prototype.sanitizeBreakLines = function(str) {
      return str
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');
    };

    Helper.prototype.getUniqueArray = function(a) {
      return a.filter(function(elem, pos, self) {
        if (elem === '') {
          return false;
        }
        return self.indexOf(elem) === pos;
      });
    };

    /**
     * createHTML returns an string with HTML tags around tokenized.value content
     * @param  {Object} tokenized Tokenized object
     * @return {String}           [description]
     */
    Helper.prototype.createHTML = function(tokenized) {
      var a = [];

      for (var i = 0, imax = tokenized.length; i < imax; i++) {
        if (tokenized[i].type === 'text') {
          a.push(tokenized[i].value);
        } else {
          a.push(this.getTextInSpan(tokenized[i].type, tokenized[i].value));
        }
      }

      return a.join('');
    };

    /**
     * getTextInSpan wraps a given text and class name with <span>'s
     * @param  {String} className
     * @param  {String} text
     * @return {String}
     */
    Helper.prototype.getTextInSpan = function(className, text) {
      return '<span class="' + className + '">' + text + '</span>';
    };

    /**
     * browser returns an Object containing browser information
     * @return {Object}
     */
    Helper.prototype.browser = function() {
      var userAgent = navigator.userAgent,
          msie    = /(msie|trident)/i.test( userAgent ),
          chrome  = /chrome/i.test( userAgent ),
          firefox = /firefox/i.test( userAgent ),
          safari  = /safari/i.test( userAgent ) && !chrome,
          iphone  = /iphone/i.test( userAgent );

      if ( msie ) { return { msie: true }; }
      if ( chrome ) { return { chrome: true }; }
      if ( firefox ) { return { firefox: true }; }
      if ( iphone ) { return { iphone: true }; }
      if ( safari ) { return { safari: true }; }

      return {
        msie   : false,
        chrome : false,
        firefox: false,
        safari : false,
        iphone : false
      };
    };

    return Helper;
  })();

  marexandre.Helper = Helper;
})(marexandre || (marexandre = {}));
