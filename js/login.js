$("#main-wrapper").on("click", "#loginBtn", function () {
    var user = $("#loginUsername").val();
    $.ajax({
        url: "./login",
        type: "POST",
        data: {user: user}
    }).done(function (data) {
        var res = JSON.parse(data);
        alert(res.message);
        if(res.code === '200'){
            window.location.href = "./";
        }
    });

});