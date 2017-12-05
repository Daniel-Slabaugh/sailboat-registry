
var state = {
  register:true,
  longitude:0,
  latitude:0,
  owner:"",
  sailboats:[],
  ownedSailboats:[],
  searchedSailboats:[]
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

  $("#search-form").submit(function(e) {
    e.preventDefault();
    var search = $("#search").val().trim();
    findSailboats(search);
  }); 

});

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
      console.log(JSON.stringify(state.sailboats));
      for(i=0; i<state.sailboats.length; i++) {
        if (state.sailboats[i].owner == state.owner) {
          state.ownedSailboats.push(state.sailboats[i]);
          console.log(JSON.stringify(state.ownedSailboats));

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

function displaySailboats(sailboats, page) {
  var resultElement = '';
  if (sailboats.length > 0) {
    console.log("did this");
    resultElement +=  '<th>' + 
                      '<td><p>Owner</p></td>' +         
                      '<td><p>Name</p></td>' + 
                      '<td><p>Description</p></td>' + 
                      '<td><p>Condition</p></td>' + 
                      '<td><p>Year</p></td>' + 
                      '</th>';
    sailboats.forEach(function(object) {
      resultElement +=  '<tr>' + 
                        '<td><p>' + object.owner + '</p></td>' + 
                        '<td><p>' + object.name + '</p></td>' + 
                        '<td><p>' + object.description + '</p></td>' + 
                        '<td><p>' + object.condition + '</p></td>' + 
                        '<td><p>' + object.year + '</p></td>' + 
                        '</tr>';
      });
  } else {
      resultElement += '<p>No sailboats here</p>';
  }
  console.log(resultElement);
  $(`#${page}`).html(resultElement);
  showCurrentPage(page, "navbar");
}

function handleError(err) {
  console.log(err);
  // make onscreen error message 
}






//search function 
function trimString(s) {
  var l=0, r=s.length -1;
  while(l < s.length && s[l] == ' ') l++;
  while(r > l && s[r] == ' ') r-=1;
  return s.substring(l, r+1);
}

function compareObjects(o1, o2) {
  var k = '';
  for(k in o1) if(o1[k] != o2[k]) return false;
  for(k in o2) if(o1[k] != o2[k]) return false;
  return true;
}

function itemExists(haystack, needle) {
  for(var i=0; i<haystack.length; i++) if(compareObjects(haystack[i], needle)) return true;
  return false;
}

function findSailboats(toSearch) {
  state.searchedSailboats = [];
  toSearch = trimString(toSearch); // trim it
  for(var i=0; i<state.sailboats.length; i++) {
    for(var key in state.sailboats[i]) {
      if(state.sailboats[i][key].indexOf(toSearch)!=-1) {
        if(!itemExists(state.searchedSailboats, state.sailboats[i])) results.push(state.sailboats[i]);
      }
    }
  }
  console.log(JSON.stringify(state.searchedSailboats));
  displaySailboats(state.searchedSailboats, "search-results-table");
}