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

    $('.login_button').css('visibility', 'visible');
    $('.profile_part').css('display', 'none');
    return;
}

function userLoggedIn() {

    $('.profile_part').css('visibility', 'visible');
    $('#login_button_collapsed').css('display', 'none');
    $('#support-link').css('margin-bottom', 112 + 'px');
    $('.navbar-brand').css('margin-top', -6.5 + 'rem')
  
      $(document).ready(function() {
        $('.profile_part').click(() => {
          const doc = document.getElementById("profile_dropdown");
          if (doc.style.display === 'inline') return $('#profile_dropdown').fadeOut();
          else return $('#profile_dropdown').fadeIn('medium');
        })
      });
}

$(document).ready(function() {
  $('#cookie_warn_close').click(() => {
      $('.cookie_warning').fadeOut();
      setCookie('readCookieWarn', true, 7);
  })

  if (!getCookie('readCookieWarn')) return $('.cookie_warning').css('display', 'block');
})
