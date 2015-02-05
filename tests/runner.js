if (window.location.search.indexOf("?test") !== -1) {
  document.write(
    '<div id="qunit"></div>' +
    '<div id="qunit-fixture"></div>' +
    '<link rel="stylesheet" href="tests/runner.css">' +
    '<link rel="stylesheet" href="tests/vendor/qunit-1.12.0.css">' +
    '<script src="tests/vendor/qunit-1.12.0.js"></script>' +
    //QUnit Helpers
    '<script src="tests/helpers/MethodExceptionHelper.js"></script>' +
    //Unit Tests
    '<script src="tests/tests.js"></script>'
  );
}
