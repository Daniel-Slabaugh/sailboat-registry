
var state = {
  register:true,
  longitude:0,
  latitude:0,
  sailboats:[]
};

$(document).ready(function() {

  $("#signup-page").hide();
  $("#home-page").hide();
  $("#register-sailboat-page").hide();
  $("#topnav").hide();

  $("#btn-signup").click(function(e) {
    e.preventDefault();
    $("#landing-page").hide();
    $("#signup-page").show();
  });

  $("#login").submit(function(e) {
    e.preventDefault();
    let user = {};
    user.username = $("#emailLogin").val().trim();
    user.password = $("#passwordLogin").val().trim();
    loginUser(user);
  });

  $("#signup").submit(function(e) {
    e.preventDefault();
    let user = {};
    user.name = $("#name").val().trim();
    user.username = $("#email").val().trim();
    user.password = $("#password").val().trim();
    registerUser(user);
  });

  $("#register-sailboat").submit(function(e) {
    e.preventDefault();
    let sailboat = {};
    sailboat.name = $("#name").val().trim();
    sailboat.owner = $("#owner").val().trim();
    sailboat.description = $("#description").val().trim();
    sailboat.condition = $("#condition").val().trim();
    sailboat.year = $("#year").val().trim();
    createSailboat(sailboat);
  }); 
});

//original function
function registerUser(user) {
  console.log(JSON.stringify(user));
  var settings = {
    url: "/users",
    data: JSON.stringify(user),
    contentType: 'application/json',
    type: 'POST',
    success: function(test) {
      loginUser(user);
    }, 
    error: function(err) {
      console.log(err);
      // make onscreen error message 
    }

  };
  $.ajax(settings);
}

function loginUser(user) {
  var token = btoa (`${user.username}:${user.password}`);
  var settings = {
    url: "/auth/login",
    contentType: 'application/json',
    type: 'POST',
    headers: {
      Authorization: `Basic ${token}`
    },
    success: function(test) {
      localStorage.setItem("authToken", test.authToken);
      $("#signup-page").hide();
      $("#home-page").show();
    }
    error: function(err) {
      console.log(err);
      // make onscreen error message 
    }
  };
  $.ajax(settings);
}

function createSailboat(sailboat) {
  var token = localStorage.getItem("authToken");
  var settings = {
    url: "/sailboat",
    contentType: 'application/json',
    type: 'POST',
    data: JSON.stringify(sailboat),
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function (data) {}, 
    error: function(err) {
      console.log(err);
      // make onscreen error message 
    }
  };
  $.ajax(settings);
}

function editSailboat(sailboat) {
  var token = localStorage.getItem("authToken");
  var settings = {
    url: "/sailboat",
    contentType: 'application/json',
    type: 'POST',
    data: JSON.stringify(sailboat),
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function (data) {}, 
    error: function(err) {
      console.log(err);
      // make onscreen error message 
    }  
  };
  $.ajax(settings);
}