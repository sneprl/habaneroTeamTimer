$("#main-wrapper").on("click", "#loginBtn", function () {
    var username = $("#loginUsername").val();
    $.ajax({
        url: "./login",
        type: "POST",
        data: {username: username}
    }).done(function () {
        window.location.href = "./";
    });

});