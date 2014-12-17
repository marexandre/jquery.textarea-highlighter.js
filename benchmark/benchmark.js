
var marexandre;
var pluginHelper = new marexandre.Helper();

var brackets = generateRandomBrackets(50);
var tags = generateRandomTags(30);
var misspelling = generateRandomMisspelling(20);
var random = [].concat.apply([], [brackets, tags, misspelling]);
random = shuffle(random);

suite('Test with 5 matches', function() {
  var b = random.slice(0, 5);
  var text = generateRandomFromListText(b);
  var matches = [{ 'matchClass': 'brackets', 'match': b }];

  console.log('matches: ' + b.length + ', text length: ' + text.length);

  benchmark('v0_6_0', function() {
    v0_6_0(text, matches);
  });

  benchmark('v0_4_8', function() {
    v0_4_8(text, matches).txt;
  });
});

suite('Test with 10 matches', function() {
  var b = brackets.slice(0, 5);
  var t = tags.slice(0, 3);
  var m = misspelling.slice(0, 2);
  var r = [].concat.apply([], [b, t, m]);
  var text = generateRandomFromListText( shuffle(r) );
  var matches = [
    { 'matchClass': 'brackets', 'match': b },
    { 'matchClass': 'tags', 'match': t },
    { 'matchClass': 'misspelling', 'match': m }
  ];

  console.log('matches: ' + r.length + ', text length: ' + text.length);

  benchmark('v0_6_0', function() {
    v0_6_0(text, matches);
  });

  benchmark('v0_4_8', function() {
    v0_4_8(text, matches).txt;
  });
});

suite('Test with 25 matches', function() {
  var b = brackets.slice(0, 15);
  var t = tags.slice(0, 5);
  var m = misspelling.slice(0, 5);
  var r = [].concat.apply([], [b, t, m]);
  var text = generateRandomFromListText( shuffle(r) );
  var matches = [
    { 'matchClass': 'brackets', 'match': b },
    { 'matchClass': 'tags', 'match': t },
    { 'matchClass': 'misspelling', 'match': m }
  ];

  console.log('matches: ' + r.length + ', text length: ' + text.length);

  benchmark('v0_6_0', function() {
    v0_6_0(text, matches);
  });

  benchmark('v0_4_8', function() {
    v0_4_8(text, matches).txt;
  });
});

suite('Test with 50 matches', function() {
  var b = brackets.slice(0, 25);
  var t = tags.slice(0, 15);
  var m = misspelling.slice(0, 10);
  var r = [].concat.apply([], [b, t, m]);
  var text = generateRandomFromListText( shuffle(r) );
  var matches = [
    { 'matchClass': 'brackets', 'match': b },
    { 'matchClass': 'tags', 'match': t },
    { 'matchClass': 'misspelling', 'match': m }
  ];

  console.log('matches: ' + r.length + ', text length: ' + text.length);

  benchmark('v0_6_0', function() {
    v0_6_0(text, matches);
  });

  benchmark('v0_4_8', function() {
    v0_4_8(text, matches).txt;
  });
});

// suite('Test with 75 matches', function() {
//   var b = brackets.slice(0, 25);
//   var t = tags.slice(0, 25);
//   var m = misspelling.slice(0.1, 25);
//   var r = [].concat.apply([], [b, t, m]);
//   r = shuffle(r);
//   var text = generateRandomFromListText(r);
//   var matches = [
//     { 'matchClass': 'brackets', 'match': b },
//     { 'matchClass': 'tags', 'match': t },
//     { 'matchClass': 'misspelling', 'match': m }
//   ];

//   console.log('matches: ' + r.length + ', text length: ' + text.length);

//   benchmark('v0_6_0', function() {
//     v0_6_0(text, matches);
//   });

//   benchmark('v0_4_8', function() {
//     v0_4_8(text, matches).txt;
//   });
// });

// suite('Test with 100 matches', function() {
//   var b = brackets.slice(0, 50);
//   var t = tags.slice(0, 30);
//   var m = misspelling.slice(0, 20);
//   var r = [].concat.apply([], [b, t, m]);
//   r = shuffle(r);
//   var text = generateRandomFromListText(r);
//   var matches = [
//     { 'matchClass': 'brackets', 'match': b },
//     { 'matchClass': 'tags', 'match': t },
//     { 'matchClass': 'misspelling', 'match': m }
//   ];

//   console.log('matches: ' + r.length + ', text length: ' + text.length);

//   benchmark('v0_6_0', function() {
//     v0_6_0(text, matches);
//   });

//   benchmark('v0_4_8', function() {
//     v0_4_8(text, matches).txt;
//   });
// });
