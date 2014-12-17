
var marexandre;
var pluginHelper = new marexandre.Helper();

suite('Test with 5 matches', function() {
  var brackets = generateRandomBrackets(5);
  var text = generateRandomFromListText(brackets);
  var matches = [{ 'matchClass': 'brackets', 'match': brackets }];

  console.log('matches: ' + brackets.length + ', text length: ' + text.length);


  benchmark('v0_6_0', function() {
    v0_6_0(text, matches);
  });

  benchmark('v0_4_8', function() {
    v0_4_8(text, matches).txt;
  });
});

suite('Test with 10 matches', function() {
  var brackets = generateRandomBrackets(2);
  var tags = generateRandomTags(5);
  var misspelling = generateRandomMisspelling(3);
  var random = [].concat.apply([], [brackets, tags, misspelling]);
  random = shuffle(random);
  var text = generateRandomFromListText(random);
  var matches = [
    { 'matchClass': 'brackets', 'match': brackets },
    { 'matchClass': 'tags', 'match': tags },
    { 'matchClass': 'misspelling', 'match': misspelling }
  ];

  console.log('matches: ' + random.length + ', text length: ' + text.length);

  var matches = [
    { 'matchClass': 'brackets', 'match': brackets },
    { 'matchClass': 'tags', 'match': tags },
    { 'matchClass': 'misspelling', 'match': misspelling }
  ];

  benchmark('v0_6_0', function() {
    v0_6_0(text, matches);
  });

  benchmark('v0_4_8', function() {
    v0_4_8(text, matches).txt;
  });
});

suite('Test with 25 matches', function() {
  var brackets = generateRandomBrackets(10);
  var tags = generateRandomTags(8);
  var misspelling = generateRandomMisspelling(7);
  var random = [].concat.apply([], [brackets, tags, misspelling]);
  random = shuffle(random);
  var text = generateRandomFromListText(random);
  var matches = [
    { 'matchClass': 'brackets', 'match': brackets },
    { 'matchClass': 'tags', 'match': tags },
    { 'matchClass': 'misspelling', 'match': misspelling }
  ];

  console.log('matches: ' + random.length + ', text length: ' + text.length);

  benchmark('v0_6_0', function() {
    v0_6_0(text, matches);
  });

  benchmark('v0_4_8', function() {
    v0_4_8(text, matches).txt;
  });
});

suite('Test with 50 matches', function() {
  var brackets = generateRandomBrackets(25);
  var tags = generateRandomTags(15);
  var misspelling = generateRandomMisspelling(10);
  var random = [].concat.apply([], [brackets, tags, misspelling]);
  random = shuffle(random);
  var text = generateRandomFromListText(random);
  var matches = [
    { 'matchClass': 'brackets', 'match': brackets },
    { 'matchClass': 'tags', 'match': tags },
    { 'matchClass': 'misspelling', 'match': misspelling }
  ];

  console.log('matches: ' + random.length + ', text length: ' + text.length);

  benchmark('v0_6_0', function() {
    v0_6_0(text, matches);
  });

  benchmark('v0_4_8', function() {
    v0_4_8(text, matches).txt;
  });
});

suite('Test with 75 matches', function() {
  var brackets = generateRandomBrackets(25);
  var tags = generateRandomTags(25);
  var misspelling = generateRandomMisspelling(15);
  var random = [].concat.apply([], [brackets, tags, misspelling]);
  random = shuffle(random);
  var text = generateRandomFromListText(random);
  var matches = [
    { 'matchClass': 'brackets', 'match': brackets },
    { 'matchClass': 'tags', 'match': tags },
    { 'matchClass': 'misspelling', 'match': misspelling }
  ];

  console.log('matches: ' + random.length + ', text length: ' + text.length);

  benchmark('v0_6_0', function() {
    v0_6_0(text, matches);
  });

  benchmark('v0_4_8', function() {
    v0_4_8(text, matches).txt;
  });
});

suite('Test with 100 matches', function() {
  var brackets = generateRandomBrackets(50);
  var tags = generateRandomTags(30);
  var misspelling = generateRandomMisspelling(20);
  var random = [].concat.apply([], [brackets, tags, misspelling]);
  random = shuffle(random);
  var text = generateRandomFromListText(random);
  var matches = [
    { 'matchClass': 'brackets', 'match': brackets },
    { 'matchClass': 'tags', 'match': tags },
    { 'matchClass': 'misspelling', 'match': misspelling }
  ];

  console.log('matches: ' + random.length + ', text length: ' + text.length);

  benchmark('v0_6_0', function() {
    v0_6_0(text, matches);
  });

  benchmark('v0_4_8', function() {
    v0_4_8(text, matches).txt;
  });
});
