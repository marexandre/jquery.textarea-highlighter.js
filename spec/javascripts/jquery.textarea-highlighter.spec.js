describe('jquery.textarea-highlighter', function() {
  var $segment;
  beforeEach(function() {
    $segment = setFixtures(
      '<div class="segment">' +
        '<textarea id="target-fixture" class="target"></textarea>' +
        '<div class="max-char"></div>' +
      '</div>'
    );
  });

  var options = {
    matches: [{ 'matchClass': 'test', 'match': ['test'] }]
  };

  it('should add divs on initialize', function() {
    var $target = $segment.find('#target-fixture');

    $target.textareaHighlighter(options);

    expect( $segment.find('.background-div').length ).toBe(1);
    expect( $segment.find('.autosize').length ).toBe(1);

    // Check is textarea's classes were added to the extra divs
    expect( $segment.find('.background-div').hasClass('target') ).toBe(true);
    expect( $segment.find('.autosize').parent().hasClass('target') ).toBe(true);
  });

  it('should not initialize when called with only string parameter', function() {
    var $target = $segment.find('#target-fixture');

    $target.textareaHighlighter('updateHeight');

    expect( $segment.find('.background-div').length ).toBe(0);
    expect( $segment.find('.autosize').length ).toBe(0);
  });

  it('should remove extra divs on destroy', function() {
    var $target = $segment.find('#target-fixture');

    $target.textareaHighlighter(options);
    $target.textareaHighlighter('destroy');

    expect( $segment.find('.background-div').length ).toBe(0);
    expect( $segment.find('.autosize').length ).toBe(0);
  });

  it('should update matches', function() {
    var $target = $segment.find('#target-fixture');

    $target
      .val('This is a stupid hoge to :)')
      .textareaHighlighter(options);

    // There should be no highlights
    expect( $segment.find('.background-div').html() ).toBe('This is a stupid hoge to :)');

    // Update match list
    $target.textareaHighlighter('updateMatches', [{ 'matchClass': 'hoge', 'match': ['hoge'] }]);

    expect( $segment.find('.background-div').html() ).toBe('This is a stupid <span class="hoge">hoge</span> to :)');
  });

  describe('test highlighting', function() {

    it('should highlight content correctly', function() {
      var $target = $segment.find('#target-fixture');

      $target
        .val('Hi [[[test1]]] this is a {0} test ハゲ THiss [[[{0}]]] and 日本 is some　アホ more [[[tast]]],[[[test2]]] tests. Some more [[[aaa]] and[[[tast]]][[[alex]]] aa')
        .textareaHighlighter({
          matches: [
            { 'matchClass': 'brackets',       'match': ['[[[test1]]]', '[[[tast]]]', '[[[test2]]]', '[[[{0}]]]', '[[[alex]]]'] },
            { 'matchClass': 'brackets error', 'match': ['[[[aaa]]'] },
            { 'matchClass': 'tags',           'match': ['{0}'] },
            { 'matchClass': 'misspelling',    'match': ['THiss', 'est', 'a'] }
          ]
        });

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

      expect( $segment.find('.background-div').html() ).toBe(html);
    });

    it('should not error with RegExp as matches, and when there is no matching text in the target', function() {
      var $target = $segment.find('#target-fixture');

      $target
        .val('Hi ')
        .textareaHighlighter({
          matches: [
            { 'matchClass': 'tags', 'match': /\{\/?\d+\}/g }
          ]
        });

      var html = '';
      html += 'Hi ';

      expect( $segment.find('.background-div').html() ).toBe(html);
    });

    it('should highlight case sensitive content correctly', function() {
      var $target = $segment.find('#target-fixture');

      $target
        .val('Hi there and hi there and Hi There')
        .textareaHighlighter({
          caseSensitive: false,
          matches: [
            { 'matchClass': 'test', 'match': ['Hi there'] }
          ]
        });

      var html = '';
      html += '<span class="test">Hi there</span>';
      html += ' and ';
      html += '<span class="test">hi there</span>';
      html += ' and ';
      html += '<span class="test">Hi There</span>';

      expect( $segment.find('.background-div').html() ).toBe(html);
    });

    it('should escape & highlight HTML content in bacground-div', function() {
      var $target = $segment.find('#target-fixture');
      var text = 'This is a <a href="#">stupid</a> test to <br/> :)';

      $target
        .val(text)
        .textareaHighlighter({
          matches: [{ 'matchClass': 'test', 'match': ['test', '<br/>'] }]
        });

      expect( $segment.find('.background-div').html() ).toBe( 'This is a &lt;a href="#"&gt;stupid&lt;/a&gt; <span class="test">test</span> to <span class="test">&lt;br/&gt;</span> :)' );
    });

    it('should highlight content using RegEx', function() {
      var $target = $segment.find('#target-fixture');

      $target
        .val('This [[[a {1} test1]]] is a {1}test{/1} to test {2} some {3}RegEx{/3} content')
        .textareaHighlighter({
          matches: [
            { 'matchClass': 'brackets', 'match': ['[[[a {1} test1]]]'], 'priority': 1 },
            { 'matchClass': 'tags',     'match': /\{\/?\d+\}/g, 'priority': 0 }
          ]
        });

      var html = '';
      html += 'This ';
      html += '<span class="brackets">[[[a {1} test1]]]</span>';
      html += ' is a ';
      html += '<span class="tags">{1}</span>';
      html += 'test';
      html += '<span class="tags">{/1}</span>';
      html += ' to test ';
      html += '<span class="tags">{2}</span>';
      html += ' some ';
      html += '<span class="tags">{3}</span>';
      html += 'RegEx';
      html += '<span class="tags">{/3}</span>';
      html += ' content';

      expect( $segment.find('.background-div').html() ).toBe(html);
    });
  });

  describe('test max length', function() {
    var $target;
    var $maxChar;
    beforeEach(function() {
      $target = $segment.find('#target-fixture');
      $maxChar = $segment.find('.max-char');

      $target
        .textareaHighlighter({
          matches: [{ 'matchClass': 'test', 'match': ['test'] }],
          maxlength        : 30,
          maxlengthWarning : 'error',
          maxlengthElement : $segment.find('.max-char')
        });
    });

    it('should not highlight when not over max char limitation', function(done) {
      $target.val('This is a stupid test to').trigger('input');

      var html = '';
      html += 'This is a stupid ';
      html += '<span class="test">test</span>';
      html += ' to';

      setTimeout(function() {
        expect( $segment.find('.background-div').html() ).toBe(html);
        expect( $maxChar.hasClass('error') ).toBe(false);
        expect( $maxChar.html() ).toBe('6');

        done();
      }, 200);
    });

    it('should highlight when over max char limitation', function(done) {
      $target.val('This is a stupid test to max char limitation...').trigger('input');

      var html = '';
      html += 'This is a stupid ';
      html += '<span class="test">test</span>';
      html += ' to max c';
      html += '<span class="error">har limitation...</span>';

      setTimeout(function() {
        expect( $segment.find('.background-div').html() ).toBe(html);
        expect( $maxChar.hasClass('error') ).toBe(true);
        expect( $maxChar.html() ).toBe('-17');

        $target.val('This').trigger('input');
        setTimeout(function() {
          expect( $maxChar.hasClass('error') ).toBe(false);
          expect( $maxChar.html() ).toBe('26');

          done();
        }, 200);
      }, 200);
    });
  });

  it('should throw an message when calling an unknown method', function() {
    var $target = $segment.find('#target-fixture');
    $target.textareaHighlighter(options);

    expect(function() { $target.textareaHighlighter('test'); }).toThrow('Unknown method: test');
  });


});
