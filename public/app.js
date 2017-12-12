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
  var backgroundColors = ["rgba(253, 242, 202, 1)", 
                "rgba(172, 60, 48, 1)", 
                "rgba(20, 24, 42, 1)",
                "rgba(101, 150, 143, 1)",
                "rgba(198, 233, 229, 1)"];
  var textColors = ["rgba(20, 24, 42, 1)", 
                    "rgba(20, 24, 42, 1)", 
                    "rgba(253, 242, 202, 1)", 
                    "rgba(172, 60, 48, 1)",
                    "rgba(172, 60, 48, 1)"]

  colorRotator(backgroundColors, textColors);
  showCurrentPage("landing-page");

  $("#btnSignup").click(function(e) {
    e.preventDefault();
    showCurrentPage("signup-page");
  });

  $("#signup").submit(function(e) {
    e.preventDefault();
    let user = {};
    user.name = $("#name").val().trim();
    user.username = $("#email").val().trim();
    user.password = $("#password").val().trim();
    var confirmPass = $("#confirmPass").val().trim();
    if(user.password == confirmPass) {
      registerUser(user);
    } else {
      window.confirm('Your passwords must match');
    }
  });

  $("#login").submit(function(e) {
    e.preventDefault();
    let user = {};
    user.username = $("#emailLogin").val().trim();
    user.password = $("#passwordLogin").val().trim();
    loginUser(user);
  });

  $("#nav-home").click(function(e) {
    e.preventDefault();
    $(".container").css("background-color", backgroundColors[1]);
    $(".container").css("color", textColors[1]);
    displaySailboats(state.sailboats, "home-page", "home-sailboats");
  });

  $("#nav-search").click(function(e) {
    e.preventDefault();
    $(".container").css("background-color", backgroundColors[3]);
    $(".container").css("color", textColors[3]);
    clearSearch();
    showCurrentPage("search-page", "navbar");
  });

  $("#search-form").submit(function(e) {
    e.preventDefault();
    var search = $("#search").val().trim();
    findSailboats(search);
  }); 

  $("#nav-profile").click(function(e) {
    e.preventDefault();
    $(".container").css("background-color", backgroundColors[0]);
    $(".container").css("color", textColors[0]);
    displaySailboats(state.ownedSailboats, "profile-page", "owned-sailboats");
  });

  $("#btnCreate").click(function(e) {
    e.preventDefault();
    $(".container").css("background-color", backgroundColors[3]);
    $(".container").css("color", textColors[3]);
    showCurrentPage("register-page", "navbar");
  });

  $("#register-sailboat").submit(function(e) {
    e.preventDefault();
    let sailboat = {};
    sailboat.name = $("#name").val().trim();
    sailboat.owner = state.owner;
    sailboat.description = $("#description").val().trim();
    sailboat.condition = $("#condition").val().trim();
    sailboat.year = $("#year").val().trim();
    sailboat.state = $("#state").val().trim();
    sailboat.picture = $("#picture").val().trim();
    createSailboat(sailboat);
  }); 

  $(document).on("click", ".btnEdit", function() {
    var id = $(this).attr("name");
    $(".container").css("background-color", backgroundColors[4]);
    $(".container").css("color", textColors[4]);
    changeSailboat(id);
  });

  $("#edit-sailboat").submit(function(e) {
    e.preventDefault();
    $(".container").css("background-color", backgroundColors[5]);
    $(".container").css("color", textColors[5]);
    let sailboat = {};
    sailboat.name = $("#nameE").val().trim();
    sailboat.owner = state.owner;
    sailboat.description = $("#descriptionE").val().trim();
    sailboat.condition = $("#conditionE").val().trim();
    sailboat.year = $("#yearE").val().trim();
    sailboat.state = $("#stateE").val().trim();
    sailboat.picture = $("#pictureE").val().trim();
    sailboat.id = $("#edit-sailboat").attr("name");
    editSailboat(sailboat);
  }); 

  $(document).on("click", ".btnDelete", function() {
    var id = $(this).attr("name");
    if (window.confirm("Are you sure you want to delete this Sailboat?")) {
      deleteSailboat(id);
    }
  });
});

function registerUser(user) {
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
      $("#userInfo").html(user.username);
      getSailboats("Welcome to paradise");
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
      getSailboats("Sailboat registered!");
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
    url: `/sailboats/${sailboat.id}`,
    contentType: 'application/json',
    type: 'PUT',
    data: JSON.stringify(sailboat),
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function (data) {
      getSailboats("Sailboat Successfully Edited");
    }, 
    error: function(err) {
      handleError(err);
    }  
  };
  $.ajax(settings);
}

function deleteSailboat(id) {
  var token = localStorage.getItem("authToken");
  var settings = {
    url: `/sailboats/${id}`,
    contentType: 'application/json',
    type: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function (data) {
      getSailboats("Sailboat Deleted")
    }, 
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
      state.sailboats = [];
      state.sailboats = data;
      state.ownedSailboats = [];
      for(i=0; i<state.sailboats.length; i++) {
        if(state.sailboats[i].owner == state.owner) {
          state.ownedSailboats.push(state.sailboats[i]);
        }
      }
      $("#success-message").html("<h2>" +  message + "</h2>");
      $(".container").removeClass("color-rotate");      //remove background rotate
      $(".container").css("background-color", "rgba(172, 60, 48, 1)"); // set home background color
      $(".container").css("color", "rgba(20, 24, 42, 1)"); // set home text color
      displaySailboats(state.sailboats, "home-page", "home-sailboats");
    }, 
    error: function(err) {
      handleError(err);
    }  
  };
  $.ajax(settings);
}

function showCurrentPage() {
  $("#signup-page").hide();
  $("#register-page").hide();
  $("#navbar").hide();
  $("#landing-page").hide();
  $("#home-page").hide();
  $("#search-page").hide();
  $("#profile-page").hide();
  $("#edit-page").hide();
  for (i=0; i<arguments.length; i++) {
    $(`#${arguments[i]}`).show();
    if(arguments[i] == "home-page" || arguments[i] == "search-page" || arguments[i] == "profile-page") {
      selectNavbarBtn(arguments[i]);
    }
  }
}

function displaySailboats(sailboats, page, container) {
  var resultElement = '';
  if (sailboats.length > 0) {
    sailboats.forEach(function(object, index) {
      if(page != "home-page") {
        resultElement += ('<div class="row">' + 
                          '<div class="col-6">' + 
                            '<img src="' + object.picture + '" alt="Invalid Picture URL" style="height:300px;">' +
                          '</div>' + 
                          '<div class="col-3">' +
                            '<h4>Owner:</h4><p>' + object.owner + '</p>' + 
                            '<h4>Name:</h4><p>' + object.name + '</p>' + 
                            '<h4>Description:</h4><p>' + object.description + '</p>' + 
                            '<h4>Condition:</h4><p>' + object.condition + '</p>' + 
                            '<h4>State:</h4><p>' + object.state + '</p>' + 
                            '<h4>Year:</h4><p>' + object.year + '</p>' + 
                          '</div>');
        if(page != "search-page") {
          resultElement +=  ('<div class="col-3">' +     
                              '<button class="btn btnEdit" id="btnEditSailboat' + index + 
                                  '" name="' + object.id + '" type="button">Edit</button>' +
                              '<button class="btn btnDelete" id="btnDeleteSailboat' + index + 
                                  '" name="' + object.id + '"type="button">Delete</button>' + '<br><br><br><br><br><br>' +
                            '</div>');
        }
        resultElement +=  '</div>'
      } else if(index < 16) {
        console.log(index%2 ==1);
        resultElement +=   ('<div class="col-6">' + 
                              '<img src="' + object.picture + '" alt="Invalid Picture URL" style="height:150px;">' +
                            '</div>'); 
      }
    });
  } else {
      resultElement += '<h2>No sailboats here</h2>';
  }
  $(`#${container}`).empty();
  $(`#${container}`).html(resultElement);
  showCurrentPage(page, "navbar");
}

function handleError(err) {
  console.log(err);
  window.confirm('Your call failed with error: ' + err.status + ' ' + err.responseText);
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
  displaySailboats(state.searchedSailboats, "search-page", "search-results");
}

function clearSearch() {
  state.searchedSailboats = [];
  $("#search-results").html('');
}

function selectNavbarBtn(btn) {
  $("#nav-home").removeClass("selected");
  $("#nav-search").removeClass("selected");
  $("#nav-profile").removeClass("selected");
  if(btn == "home-page") {
    $(`#nav-home`).addClass("selected")
  } else if(btn == "search-page") {
    $(`#nav-search`).addClass("selected")
  } else if(btn == "profile-page") {
    $(`#nav-profile`).addClass("selected")
  }
}

function changeSailboat(id) {
  var sailboat = {};
  for(var i=0; i<state.sailboats.length; i++) {
    if(state.sailboats[i].id == id) {
      sailboat = state.sailboats[i];
    }
  }
  $("#nameE:text").val(sailboat.name);
  $("#descriptionE").val(sailboat.description);
  $("#conditionE").val(sailboat.condition);
  $("#yearE").val(sailboat.year);
  $("#stateE").val(sailboat.state);
  $("#pictureE").val(sailboat.picture);
  $("#edit-sailboat").attr("name", id);
  showCurrentPage("edit-page", "navbar");
}

function colorRotator(backgroundColors, textColors)  {

  var itemInterval = 5000;
  var numberOfItems = backgroundColors.length;
  var currentItem = 0;

  var background = $('.color-rotate')
  background.css("background-color", backgroundColors[currentItem]);
  background.css("color", textColors[currentItem]);
  var infiniteLoop = setInterval(function() {
    console.log(background.attr("class"));
    if(background.attr("class") == "container color-rotate") {
      if (currentItem == numberOfItems - 1) {
        currentItem = 0;
      } else {
        currentItem++;
      }
      background.css("background-color", backgroundColors[currentItem]);
      background.css("color", textColors[currentItem]);    
    }   
  }, itemInterval);
}