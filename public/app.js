
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
});
