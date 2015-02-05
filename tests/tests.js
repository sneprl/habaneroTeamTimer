

// QUnit test case
test("index page", function(assert) {
    assert.ok( $, "jQuery is loaded");
    assert.ok( $("#main-wrapper").length > 0 && $("#main-wrapper").hasClass("container"), "bootstrap container ready");
});