
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
    user.firstName = $("#firstName").val();
    user.lastName = $("#lastName").val();
    user.email = $("#email").val();
    user.name = $("#userName").val();
    user.password = $("#password").val();
    serverRequest(user);
  });
});

function serverRequest(user) {
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

//copied over
function getDataFromFacebookApi(longitude, latitude, dist) {
  var settings = {
    url: "/sailboats",
    data: {
      center: latitude  + ',' + longitude,
      distance: dist,
      type: 'place',
      access_token: '1865110520443713|TNN7qd7qh7o1HdfMF8GL4Ar6dUw',
      q: 'swing_dance'
    },
    dataType: 'json',
    type: 'POST',
    success: function(data) {
      var resultElement = '';
      if (data.data.length > 0) {
          data.data.forEach(function(object) {
              resultElement += '<tr><td><a href="https://www.facebook.com/' + object.id + '">' + object.name + '</a></td></tr>';
          });
      } else {
          resultElement += '<p>No results</p>';
      }
      $('#results').html(resultElement);
      $("#search-page").hide();
      $("#results-page").show();
    },
  };
  $.ajax(settings);
}