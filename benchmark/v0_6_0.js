
var marexandre;
var helper = new marexandre.Helper();

var v0_6_0 = function(text, list, useWordBase) {
  useWordBase = useWordBase || true;

  var indeciesList = [];
  var item, trie, trieIndecies;

  for (var i = 0, imax = list.length; i < imax; i++) {
    item = list[i];

    if (item._trie) {
      trie = item._trie;
    } else {
      trie = new marexandre.Trie(item.match);
      item._trie = trie;
    }

    trieIndecies = trie.getIndecies(text);
    trieIndecies = helper.removeOverlapingIndecies(trieIndecies);

    indeciesList.push({ 'indecies': trieIndecies, 'type': item.matchClass });
  }

  var flattened = helper.flattenIndeciesList(indeciesList);
  flattened = helper.orderBy(flattened, 'start');
  flattened = helper.removeOverlapingIndecies(flattened);
  flattened = helper.cleanupOnWordBoundary(text, flattened, useWordBase);

  var tokenized = helper.makeTokenized(text, flattened);

  return helper.createHTML(tokenized);
};
