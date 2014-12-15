describe('Trie', function () {

  it('should convert array of strings into a trie tree', function() {
    var trie = new marexandre.Trie();
    trie.addFromArray(['test', 'tast', 'test2', '{0}', 'test12', 'test21']);

    var obj = {
      children: {
        't': {
          children: {
            'e': {
              children: {
                's': {
                  children: {
                    't': {
                      children: {
                        '2': {
                          children: {
                            '1': {
                              children: {},
                              value: '1',
                              is_end: true
                            }
                          },
                          value: '2',
                          is_end: true
                        },
                        '1': {
                          children: {
                            '2': {
                              children: {},
                              value: '2',
                              is_end: true
                            }
                          },
                          value: '1',
                          is_end: false
                        }
                      },
                      value: 't',
                      is_end: true
                    }
                  },
                  value: 's',
                  is_end: false
                }
              },
              value: 'e',
              is_end: false
            },
            'a': {
              children: {
                's': {
                  children: {
                    't': {
                      children: {},
                      value: 't',
                      is_end: true
                    }
                  },
                  value: 's',
                  is_end: false
                }
              },
              value: 'a',
              is_end: false
            }
          },
          value: 't',
          is_end: false
        },
        '{': {
          children: {
            '0': {
              children: {
                '}': {
                  children: {},
                  value: '}',
                  is_end: true
                }
              },
              value: '0',
              is_end: false
            }
          },
          value: '{',
          is_end: false
        }
      }
    };

    expect( trie.list ).toEqual(obj);
  });

  it('should return indecies from a trie and text', function() {
    var text = 'This is a test1 to test {0} content test12';
    var trie = new marexandre.Trie(['test', 'test1', 'test12', '{0}', 'hoge']);
    var indecies = trie.getIndecies(text);

    expect( indecies ).toEqual([
      { start: 10, end: 15 },
      { start: 19, end: 23 },
      { start: 24, end: 27 },
      { start: 36, end: 42 }
    ]);

    expect( text.slice(10, 15) ).toBe('test1');
    expect( text.slice(19, 23) ).toBe('test');
    expect( text.slice(24, 27) ).toBe('{0}');
    expect( text.slice(36, 42) ).toBe('test12');
  });

  it('should check if a word is in a trie', function() {
    var trie = new marexandre.Trie(['test', 'tast', 'test2', '{0}', 'test12', 'test21', 'test']);

    expect( trie.hasWord('test') ).toBe(true);
    expect( trie.hasWord('test12') ).toBe(true);
    expect( trie.hasWord('test21') ).toBe(true);
    expect( trie.hasWord('test2') ).toBe(true);

    expect( trie.hasWord('test1') ).toBe(false);
    expect( trie.hasWord('test3') ).toBe(false);
    expect( trie.hasWord('{1}') ).toBe(false);
  });

  it('should add a word to the trie', function() {
    var trie = new marexandre.Trie();
    trie.add('alex');
    expect( trie.hasWord('alex') ).toBe(true);

    trie.add('test');
    expect( trie.hasWord('test') ).toBe(true);
  });

});
