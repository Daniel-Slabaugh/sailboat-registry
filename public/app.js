
$(document).ready(function() {

  $("#signup-page").hide();
  $("#home-page").hide();


  $("#btn-signup").click(function(e) {
    e.preventDefault();
    $("#landing-page").hide();
    $("#signup-page").show();
  });

  $("#start").submit(function(e) {
    e.preventDefault();
    $("#home-page").show();
    $("#landing-page").hide();   
  });

  $("#signup").submit(function(e) {
    e.preventDefault();
    let user = {};
    user.firstName = $("#firstName").val().trim();
    user.lastName = $("#lastName").val().trim();
    // user.email = $("#email").val();
    user.name = $("#userName").val().trim();
    user.password = $("#password").val().trim();
    serverRequest(user);
  });
});

function serverRequest(user) {
  console.log(JSON.stringify(user));
  var settings = {
    url: "/users",
    data: JSON.stringify(user),
    dataType: 'json',
    type: 'POST',
    success: function() {
      $("#signup-page").hide();
      $("#home-page").show();
    }
  };
  $.ajax(settings);
}
