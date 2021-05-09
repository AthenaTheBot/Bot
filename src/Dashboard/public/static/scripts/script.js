function setCookie(name,value,days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function userNotLoggedIn() {

    $('.loginButton').css('visibility', 'visible');
    $('.profilePart').css('display', 'none');
    return;
}

function userLoggedIn() {

    $('.profilePart').css('visibility', 'visible');
    $('#loginButtonCollapsed').css('display', 'none');
    $('#support-link').css('margin-bottom', 112 + 'px');
    $('.navbar-brand').css('margin-top', -6.5 + 'rem')
  
      $(document).ready(function() {
        $('.profilePart').click(() => {
          const doc = document.getElementById("profileDropdown");
          if (doc.style.display === 'inline') return $('#profileDropdown').fadeOut();
          else return $('#profileDropdown').fadeIn('medium');
        })
      });
}

$(document).ready(function() {
  $('#cookieWarningButton').click(() => {
      $('.cookieWarning').fadeOut();
      setCookie('readCookieWarn', true, 7);
  })

  if (!getCookie('readCookieWarn')) return $('.cookieWarning').css('display', 'block');
})
