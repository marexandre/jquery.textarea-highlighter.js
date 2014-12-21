console.dump = function(object) {
  if (window.JSON && window.JSON.stringify) {
    console.log(JSON.stringify(object));
  } else {
    console.log(object);
  }
};
