
var state = {
  register:true,
  longitude:0,
  latitude:0,
  owner:"",
  sailboats:[],
  ownedSailboats:[]
};

$(document).ready(function() {

  showCurrentPage("landing-page");

  $("#btn-signup").click(function(e) {
    e.preventDefault();
    showCurrentPage("home-page", "navbar");
  });

  $("#nav-home").click(function(e) {
    e.preventDefault();
    showCurrentPage("home-page", "navbar");
  });

  $("#nav-search").click(function(e) {
    e.preventDefault();
    showCurrentPage("search-page", "navbar");
  });

  $("#nav-edit").click(function(e) {
    e.preventDefault();
    showCurrentPage("edit-page", "navbar");
  });  

  $("#nav-profile").click(function(e) {
    e.preventDefault();
    showCurrentPage("profile-page", "navbar");
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

  $("#search").submit(function(e) {
    e.preventDefault();
    var search = $("#search").val().trim();
    findSailboats(search);
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
      handleError(err);
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
      state.owner = user.username;
      getSailboats();
    },
    error: function(err) {
      handleError(err);
    }
  };
  $.ajax(settings);
}

function createSailboat(sailboat) {
  var token = localStorage.getItem("authToken");
  var settings = {
    url: "/sailboats",
    contentType: 'application/json',
    type: 'POST',
    data: JSON.stringify(sailboat),
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function (data) {}, 
    error: function(err) {
      handleError(err);
    }
  };
  $.ajax(settings);
}

function editSailboat(sailboat) {
  var token = localStorage.getItem("authToken");
  var settings = {
    url: "/sailboats",
    contentType: 'application/json',
    type: 'POST',
    data: JSON.stringify(sailboat),
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function (data) {}, 
    error: function(err) {
      handleError(err);
    }  
  };
  $.ajax(settings);
}

function getSailboats() {
  var token = localStorage.getItem("authToken");
  var settings = {
    url: "/sailboats",
    contentType: 'application/json',
    type: 'GET',
    // data: JSON.stringify(sailboat),
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function (data) {
      state.sailboats = data;
      for(i=0; i<state.sailboats.length; i++) {
        if (state.sailboats[i].owner == state.owner) {
          state.ownedSailboats.push(state.sailboats[i]);
        }
      }
      showCurrentPage("home-page", "navbar");
    }, 
    error: function(err) {
      handleError(err);
    }  
  };
  $.ajax(settings);
}


function showCurrentPage() {
  $("#signup-page").hide();
  $("#home-page").hide();
  $("#register-page").hide();
  $("#navbar").hide();
  $("#landing-page").hide();
  $("#search-page").hide();
  for (i=0; i<arguments.length; i++) {
    $(`#${arguments[i]}`).show();
  }
}

function handleError(err) {
  console.log(err);
  // make onscreen error message 
}