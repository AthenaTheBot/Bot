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
