describe('Helper', function () {

  var helper = new marexandre.Helper();

  describe('test orderBy', function () {
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

  describe('test removeOverlapingIndecies', function () {
    it('should order Array by given key', function() {
      var indecies = [
        { start: 10, end: 15 },
        { start: 11, end: 15 },
        { start: 12, end: 14 },
        { start: 14, end: 20 },
        { start: 11, end: 20 },
        { start: 24, end: 27 },
        { start: 24, end: 26 }
      ];

      expect( helper.removeOverlapingIndecies(indecies) ).toEqual([
        { start: 10, end: 15 },
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
        // { start: 8, end: 14, type: 'misspelling' },
        // { start: 11, end: 15, type: 'brackets' },
        { start: 20, end: 25, type: 'misspelling' }
      ]);
    });
  });

  describe('test flattenIndeciesList', function () {
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

});
