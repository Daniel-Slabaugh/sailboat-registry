
$(document).ready(function() {

  $("#signup-page").hide();

  $("#btn-signup").click(function(e) {
    e.preventDefault();
    $("#landing-page").hide();
    $("#signup-page").show();
  });
});
