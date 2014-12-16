describe('jquery.textarea-highlighter', function() {
  var $segment;
  beforeEach(function() {
    $segment = setFixtures('<div class="segment"><textarea id="target-fixture" class="target"></textarea></div>')
  });

  it('should add divs on initialize', function() {
    var $target = $segment.find('#target-fixture');

    $target.textareaHighlighter();

    expect( $segment.find('.background-div').length ).toBe(1);
    expect( $segment.find('.autosize').length ).toBe(1);

    // Check is textarea's classes were added to the extra divs
    expect( $segment.find('.background-div').hasClass('target') ).toBe(true);
    expect( $segment.find('.autosize').parent().hasClass('target') ).toBe(true);
  });

  it('should remove extra divs on destroy', function() {
    var $target = $segment.find('#target-fixture');

    $target.textareaHighlighter();
    $target.textareaHighlighter('destroy');

    expect( $segment.find('.background-div').length ).toBe(0);
    expect( $segment.find('.autosize').length ).toBe(0);
  });

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

  it('should highlight over max char limit content correctly', function() {
    var $target = $segment.find('#target-fixture');

    $target
      .val('This is a stupid test to max char limitation...')
      .textareaHighlighter({
        matches: [{ 'matchClass': 'test', 'match': ['test'] }],
        maxlength        : 30,
        maxlengthWarning : 'error'
      });

    var html = '';
    html += 'This is a stupid ';
    html += '<span class="test">test</span>';
    html += ' to max c';
    html += '<span class="error">har limitation...</span>';

    expect( $segment.find('.background-div').html() ).toBe(html);
  });

  it('should update matches', function() {
    var $target = $segment.find('#target-fixture');

    $target
      .val('This is a stupid test to :)')
      .textareaHighlighter();

    // There should be no highlights
    expect( $segment.find('.background-div').html() ).toBe('This is a stupid test to :)');

    // Update match list
    $target.textareaHighlighter('updateMatches', [{ 'matchClass': 'test', 'match': ['test'] }]);

    expect( $segment.find('.background-div').html() ).toBe('This is a stupid <span class="test">test</span> to :)');
  });

});
