describe('Helper', function() {
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
    it('should remove empty string and dupes from an array', function() {
      var list = ['1', '2', '1', '3', '', '1', '4', '5', '', '1', '4', '2'];
      expect( helper.getUniqueArray(list) ).toEqual([ '1', '2', '3', '4', '5' ]);
    });
  });

  describe('test removeOverlapingIndecies', function() {
    it('should remove overlayied indecies', function() {
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

  describe('test removeOverlapingIndeciesByPriority', function() {

    it('should order overlayed indecies based on priority', function() {
      var list = [
        { start: 10, end: 12, priority: 0 },
        { start: 11, end: 12, priority: 1 },

        { start: 12, end: 20, priority: 1 },
        { start: 13, end: 14, priority: 2 },
        { start: 14, end: 15, priority: 0 },
        { start: 14, end: 16, priority: 3 },

        { start: 24, end: 27, priority: 0 },
        { start: 24, end: 26, priority: 0 },

        { start: 30, end: 40, priority: 0 },
        { start: 33, end: 38, priority: 1 },

        { start: 50, end: 60, priority: 5 },
        { start: 50, end: 60, priority: 4 }
      ];

      expect( helper.removeOverlapingIndeciesByPriority(list) ).toEqual([
        { start: 11, end: 12, priority: 1 },
        { start: 13, end: 14, priority: 2 },
        { start: 14, end: 16, priority: 3 },
        { start: 24, end: 27, priority: 0 },
        { start: 33, end: 38, priority: 1 },
        { start: 50, end: 60, priority: 5 }
      ]);
    });

    it('non-overlapping', function() {
      var list = [
        { start: 0, end: 1, priority: 0 },
        { start: 1, end: 2, priority: 99 },
        { start: 2, end: 4, priority: 1 },
        { start: 8, end: 10, priority: 2 }
      ];
      expect( helper.removeOverlapingIndeciesByPriority(list) ).toEqual([
        { start: 0, end: 1, priority: 0 },
        { start: 1, end: 2, priority: 99 },
        { start: 2, end: 4, priority: 1 },
        { start: 8, end: 10, priority: 2 }
      ]);

    });
    it('overlapping, higher priority token should remain', function() {
      var list = [
        { start: 0, end: 1, priority: 0 },
        { start: 0, end: 1, priority: 99 },
        { start: 1, end: 1, priority: 1 },
        { start: 1, end: 2, priority: 2 }
      ];
      expect( helper.removeOverlapingIndeciesByPriority(list) ).toEqual([
        { start: 0, end: 1, priority: 99 }
      ]);
    });

    it('overlapping, lower index token "a" should remain (priorities are equal)', function() {});
    it('tokens in random order should be ordered', function() {});
    it('case with token that starts where first token ends', function() {});
    it('case with empty tokens', function() {
      var indecies = [];
      expect( helper.removeOverlapingIndeciesByPriority(indecies) ).toEqual( [] );
      expect( helper.removeOverlapingIndeciesByPriority('') ).toEqual( [] );
      expect( helper.removeOverlapingIndeciesByPriority() ).toEqual( [] );
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

    function generateIndecies(text, list) {
      var indeciesList = [];

      for (var i = 0, imax = list.length; i < imax; i++) {
        var item = list[i];
        var trie = new marexandre.Trie(item.match);
        var trieIndecies = trie.getIndecies(text);
        trieIndecies = helper.removeOverlapingIndecies(trieIndecies);

        indeciesList.push({ 'indecies': trieIndecies, 'type': item.class });
      }

      var flattened = helper.flattenIndeciesList(indeciesList);
      flattened = helper.orderBy(flattened, 'start');
      flattened = helper.removeOverlapingIndecies(flattened);

      return flattened;
    }

    it('should format not word base languages', function() {
      var text = 'ウィキペディアは誰でも{0}編集できる[[[フリー百科事典]]][[[てすと]]]です';
      var list = [
        { 'class': 'brackets',    'match': ['[[[フリー百科事典]]]', '[[[てすと]]]'] },
        { 'class': 'tags',        'match': ['{0}'] },
        { 'class': 'misspelling', 'match': ['は', '誰'] }
      ];

      var _indecies = [
        { start: 7, end: 8, type: 'misspelling' }, // は
        { start: 8, end: 9, type: 'misspelling' }, // 誰
        { start: 11, end: 14,type: 'tags' },       // {0}
        { start: 19, end: 32, type: 'brackets' },  // [[[フリー百科事典]]]
        { start: 32, end: 41, type: 'brackets' }   // [[[てすと]]]
      ]

      var indecies = generateIndecies(text, list);
      indecies = helper.cleanupOnWordBoundary(text, indecies, false);
      expect(indecies).toEqual( _indecies );

      var html = '';
      html += 'ウィキペディア';
      html += '<span class="misspelling">は</span>';
      html += '<span class="misspelling">誰</span>';
      html += 'でも';
      html += '<span class="tags">{0}</span>';
      html += '編集できる';
      html += '<span class="brackets">[[[フリー百科事典]]]</span>';
      html += '<span class="brackets">[[[てすと]]]</span>';
      html += 'です';

      var tokenized = helper.makeTokenized(text, indecies);
      expect( helper.createHTML(tokenized) ).toEqual( html );
    });


    it('should create HTML from tokenized correctly', function() {

      var text = 'Hi [[[test1]]] this is a {0} test ハゲ THiss [[[{0}]]] and 日本 is some　アホ more [[[tast]]],[[[test2]]] tests. Some more [[[aaa]] and[[[tast]]][[[alex]]] aa a';
      var list = [
        { 'class': 'brackets',       'match': ['[[[test1]]]', '[[[tast]]]', '[[[test2]]]', '[[[{0}]]]', '[[[alex]]]'] },
        { 'class': 'brackets error', 'match': ['[[[aaa]]'] },
        { 'class': 'tags',           'match': ['{0}'] },
        { 'class': 'misspelling',    'match': ['THiss', 'est', 'a'] }
      ];

      var indecies = generateIndecies(text, list);
      indecies = helper.cleanupOnWordBoundary(text, indecies, true);

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
      html += ' aa ';
      html += '<span class="misspelling">a</span>';

      var tokenized = helper.makeTokenized(text, indecies);
      expect( helper.createHTML(tokenized) ).toBe(html);
    });
  });

});
