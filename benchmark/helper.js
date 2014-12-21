
var randomText = function(imax) {
  var p = '1234567890 -=[]/\/|;,./~!@#$%^&*()_+{}:"<>?? ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var a = [], c;

  imax = parseInt(imax, 10);
  for (var i = 0; i < imax; i++) {
    c = p.charAt(Math.floor(Math.random() * p.length));
    if (c === '') {
      c = 'test';
    }
    a.push(c);
  }

  return a.join('');
}

// http://stackoverflow.com/a/6274398
var shuffle = function(array) {
  var counter = array.length, temp, index;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

var generateRandomFromListText = function(b) {
  var a = [];
  for (var i = 0, imax = b.length; i < imax; i++) {
    a.push(randomText(10) + ' ' + b[i] + ' ' + randomText(10));
  }
  return a.join(' ');
}

var generateRandomBrackets = function(imax) {
  imax = imax || 10;
  var a = [];

  for (var i = 0; i < imax; i++) {
    a.push('[[[' + randomText(Math.random() * 20) + ']]]');
  }

  return a;
}

var generateRandomTags = function(imax) {
  imax = imax || 10;
  var a = [];

  for (var i = 0; i < imax; i++) {
    a.push('{' + i + '}');
  }

  return a;
}

var generateRandomMisspelling = function(imax) {
  imax = imax || 10;
  var a = [];

  for (var i = 0; i < imax; i++) {
    a.push(randomText(Math.random() * 10));
  }

  return a;
}
