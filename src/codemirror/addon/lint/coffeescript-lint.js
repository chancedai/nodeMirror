var helperDefine = function(parRequire, parFactory){
  if (typeof define == "function"){
    // amd part
    define(parRequire, parFactory);
  }else{
    // commonjs part
    var parAr = [];
    var i = 0;
    for (i = 0; i < parRequire.length; ++i){
      parAr.push(require(parRequire[i]));
    };
    module.exports = parFactory.apply(undefined, parAr);
  };
};
helperDefine(["codemirror/CodeMirror", "codemirror/lint/coffeelint"], function(CodeMirror, coffeelint){
// Depends on coffeelint.js from http://www.coffeelint.org/js/coffeelint.js

// declare global: coffeelint

CodeMirror.registerHelper("lint", "coffeescript", function(text) {
  var found = [];
  var parseError = function(err) {
    var loc = err.lineNumber;
    found.push({from: CodeMirror.Pos(loc-1, 0),
                to: CodeMirror.Pos(loc, 0),
                severity: err.level,
                message: err.message});
  };
  try {
    var res = coffeelint.lint(text);
    for(var i = 0; i < res.length; i++) {
      parseError(res[i]);
    }
  } catch(e) {
    found.push({from: CodeMirror.Pos(e.location.first_line, 0),
                to: CodeMirror.Pos(e.location.last_line, e.location.last_column),
                severity: 'error',
                message: e.message});
  }
  return found;
});
CodeMirror.coffeeValidator = CodeMirror.lint.coffeescript; // deprecated

  return CodeMirror;
});
