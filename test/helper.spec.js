describe('Helper', function() {

  console.dump = function(object) {
    if (window.JSON && window.JSON.stringify) {
      console.log(JSON.stringify(object));
    } else {
      console.log(object);
    }
  };
  var helper = new marexandre.Helper();

  describe('test orderBy', function() {
    it('should order Array by given key', function() {
      var obj = [
        { id: 3, val: 'test3' },
        { id: 4, val: 'test4' },
        { id: 2, val: 'test2' },
        { id: 1, val: 'test1' },
        { id: 0, val: 'test0' }
      ];

      expect( helper.orderBy(obj, 'id') ).toEqual([
        { id: 0, val: 'test0' },
        { id: 1, val: 'test1' },
        { id: 2, val: 'test2' },
        { id: 3, val: 'test3' },
        { id: 4, val: 'test4' }
      ]);
    });
  });

  describe('test getUniqueArray', function() {
    it('should remove Int dupes from an array', function() {
      var list = [1, 2, 1, 3, 1, 4, 5, 1, 4, 2];
      expect( helper.getUniqueArray(list) ).toEqual([ 1, 2, 3, 4, 5 ]);
    });
    it('should remove String dupes from an array', function() {
      var list = ['1', '2', '1', '3', '1', '4', '5', '1', '4', '2'];
      expect( helper.getUniqueArray(list) ).toEqual([ '1', '2', '3', '4', '5' ]);
    });
    it('should remove Int + String dupes from an array', function() {
      var list = [1, '2', '1', 3, 1, '4', '5', '1', '4', '2'];
      expect( helper.getUniqueArray(list) ).toEqual([ 1, '2', '1',  3, '4', '5' ]);
    });
  });

  describe('test removeOverlapingIndecies', function() {
    it('should order Array by given key', function() {
      var indecies = [
        { start: 10, end: 12 },
        { start: 11, end: 12 },

        { start: 12, end: 20 },
        { start: 13, end: 14 },
        { start: 14, end: 15 },
        { start: 15, end: 16 },

        { start: 24, end: 27 },
        { start: 24, end: 26 }
      ];

      expect( helper.removeOverlapingIndecies(indecies) ).toEqual([
        { start: 10, end: 12 },
        { start: 12, end: 20 },
        { start: 24, end: 27 }
      ]);
    });

    it('should order Array by given key', function() {
      var indecies = [
        { start: 2, end: 5,type: 'tags' },
        { start: 6, end: 10, type: 'brackets' },
        { start: 8, end: 14, type: 'misspelling' },
        { start: 11, end: 15, type: 'brackets' },
        { start: 20, end: 25, type: 'misspelling' }
      ];

      expect( helper.removeOverlapingIndecies(indecies) ).toEqual([
        { start: 2, end: 5,type: 'tags' },
        { start: 6, end: 10, type: 'brackets' },
        { start: 20, end: 25, type: 'misspelling' }
      ]);
    });
  });

  describe('test flattenIndeciesList', function() {
    it('should order Array by given key', function() {
      var list = [
        {
          type: 'brackets',
          indecies: [
            { start: 6, end: 10 },
            { start: 11, end: 15 }
          ]
        },
        {
          type: 'tags',
          indecies: [
            { start: 2, end: 5 }
          ]
        },
        {
          type: 'misspelling',
          indecies: [
            { start: 20, end: 25 },
            { start: 8, end: 14 }
          ]
        }
      ];

      expect( helper.flattenIndeciesList(list) ).toEqual([
        { start: 6, end: 10, type: 'brackets' },
        { start: 11, end: 15, type: 'brackets' },
        { start: 2, end: 5,type: 'tags' },
        { start: 20, end: 25, type: 'misspelling' },
        { start: 8, end: 14, type: 'misspelling' }
      ]);
    });
  });

  describe('test makeTokenized', function() {
    it('should create HTML from tokenized correctly', function() {

      var text = 'Hi [[[test1]]] this is a {0} test ハゲ THiss [[[{0}]]] and 日本 is some　アホ more [[[tast]]],[[[test2]]] tests. Some more [[[aaa]] and[[[tast]]][[[alex]]] aa';
      var list = [
        { 'class': 'brackets',       'match': ['[[[test1]]]', '[[[tast]]]', '[[[test2]]]', '[[[{0}]]]', '[[[alex]]]'] },
        { 'class': 'brackets error', 'match': ['[[[aaa]]'] },
        { 'class': 'tags',           'match': ['{0}'] },
        { 'class': 'misspelling',    'match': ['THiss', 'est', 'a'] }
      ];

      var indeciesList = [];
      var trieList = {};
      for (var i = 0, imax = list.length; i < imax; i++) {
        var item = list[i];
        var trie = new marexandre.Trie(item.match);
        var trieIndecies = trie.getIndecies(text);
        // console.log( trieIndecies );
        trieIndecies = helper.removeOverlapingIndecies(trieIndecies);
        // console.dump( trieIndecies );

        indeciesList.push({ 'indecies': trieIndecies, 'type': item.class });

        trieList[ item.class ] = trie;
      }

      var flattened = helper.flattenIndeciesList(indeciesList);
      // console.dump(flattened);
      flattened = helper.orderBy(flattened, 'start');
      // console.dump(flattened);
      flattened = helper.removeOverlapingIndecies(flattened);
      // console.dump(flattened);

      var tokenized = helper.makeTokenized(text, flattened);
      // console.log(tokenized);
      // console.log( helper.createHTML(tokenized) );

      var html = '';
      html += 'Hi ';
      html += '<span class="brackets">[[[test1]]]</span>';
      html += ' this is ';
      html += '<span class="misspelling">a</span>';
      html += ' ';
      html += '<span class="tags">{0}</span>';
      html += ' test ハゲ ';
      html += '<span class="misspelling">THiss</span>';
      html += ' ';
      html += '<span class="brackets">[[[{0}]]]</span>';
      html += ' and 日本 is some　アホ more ';
      html += '<span class="brackets">[[[tast]]]</span>';
      html += ',';
      html += '<span class="brackets">[[[test2]]]</span>';
      html += ' tests. Some more ';
      html += '<span class="brackets error">[[[aaa]]</span>';
      html += ' and';
      html += '<span class="brackets">[[[tast]]]</span>';
      html += '<span class="brackets">[[[alex]]]</span>';
      html += ' aa';

      expect( helper.createHTML(tokenized) ).toBe(html);
    });
  });

});
