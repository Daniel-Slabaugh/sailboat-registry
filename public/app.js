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

  $("#btnSignup").click(function(e) {
    e.preventDefault();
    showCurrentPage("signup-page");
  });

  $("#nav-home").click(function(e) {
    e.preventDefault();
    showCurrentPage("home-page", "navbar");
  });

  $("#nav-search").click(function(e) {
    e.preventDefault();
    clearSearch();
    showCurrentPage("search-page", "navbar");
  });

  $("#nav-edit").click(function(e) {
    e.preventDefault();
    showCurrentPage("edit-page", "navbar");
  });  

  $("#nav-profile").click(function(e) {
    e.preventDefault();
    displaySailboats(state.ownedSailboats, "profile-page", "owned-sailboats-table");
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
    sailboat.owner = state.owner;
    sailboat.description = $("#description").val().trim();
    sailboat.condition = $("#condition").val().trim();
    sailboat.year = $("#year").val().trim();
    sailboat.picture = $("#picture").val().trim();
    createSailboat(sailboat);
  }); 

  $("#search-form").submit(function(e) {
    e.preventDefault();
    var search = $("#search").val().trim();
    findSailboats(search);
  }); 

  $("#btnCreate").click(function(e) {
    e.preventDefault();
    showCurrentPage("register-page", "navbar");
  });

  $(document).on("click", ".btnDelete", function() {
    console.log("delete clicked");
    var id = $(this).attr("name");
    deleteSailboat(id);
  })
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
    success: function (data) {
      getSailboats();
    }, 
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

function deleteSailboat(id) {
  console.log("delete called")
  var token = localStorage.getItem("authToken");
  var settings = {
    url: `/sailboats/${id}`,
    contentType: 'application/json',
    type: 'DELETE',
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

function getSailboats(message) {
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
        }
      }
      $("#success-message").html("<h3>" +  message + "</h3>");
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
  $("#profile-page").hide();
  for (i=0; i<arguments.length; i++) {
    $(`#${arguments[i]}`).show();
  }
}

function displaySailboats(sailboats, page, container) {
  var resultElement = '';
  if (sailboats.length > 0) {
    sailboats.forEach(function(object, index) {
      resultElement +=  ('<tr>' + 
                        '<td>' + 
                          '<p><img src="' + object.picture + '" alt="Invalid Picture URL" style="width:500px;height:400px;"></p>' +
                        '</td>' + 
                        '<td><h3>Owner:</h3><p>' + object.owner + '</p><br>' + 
                          '<h3>Name:</h3><p>' + object.name + '</p><br>' + 
                          '<h3>Description:</h3><p>' + object.description + '</p><br>' + 
                          '<h3>Condition:</h3><p>' + object.condition + '</p><br>' + 
                          '<h3>Year:</h3><p>' + object.year + '</p><br>' + 
                        '</td>' + 
                        '<td>' +     
                          '<button class="btn btnEdit" id="btnEditSailboat' + index + 
                              '" name="' + object.id + '" type="button">Edit</button>' +
                          '<button class="btn btnDelete" id="btnDeleteSailboat' + index + 
                              '" name="' + object.id + '"type="button">Delete</button>' +
                        '</td>' + 
                        '</tr>');
        console.log(index);
      });
      $()
  } else {
      resultElement += '<h2>No sailboats here</h2>';
  }
  console.log(resultElement);
  $(`#${container}`).html(resultElement);
  showCurrentPage(page, "navbar");
}

function handleError(err) {
  console.log(err);
  var resultElement = '';
  resultElement +=  ('<div id="myModal" class="modal">' +
                      '<div class="modal-content">' + 
                        '<span class="close">&times;</span>' +
                        '<p>Error! Your call failed with error:</p>' +
                        '<p>' + err.status + ' ' + err.responseText + '</p>' +
                      '</div>' +
                    '</div>')
  $("#modal").html(resultElement);
  $("#modal").click(function(e) {
    e.preventDefault();
    $("#modal").html('');
  });
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
        if(!itemExists(state.searchedSailboats, state.sailboats[i])) state.searchedSailboats.push(state.sailboats[i]);
      }
    }
  }
  console.log(JSON.stringify(state.searchedSailboats));
  displaySailboats(state.searchedSailboats, "search-page", "search-results-table");
}

function clearSearch() {
  state.searchedSailboats = [];
  $("#search-results-table").html('');
}