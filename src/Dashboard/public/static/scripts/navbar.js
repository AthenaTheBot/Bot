function userNotLoggedIn() {

    $('.loginButton').css('visibility', 'visible');
    $('.profilePart').css('display', 'none');
    return;
}

function userLoggedIn() {
    $('.profilePart').css('visibility', 'visible');
    $('#loginButtonCollapsed').css('display', 'none');
    $('.navbar-brand').css('margin-top', '6.rem');
  
      $(document).ready(function() {
        $('.profilePart').click(() => {
          const doc = document.getElementById("logoutButton");
          if (doc.style.display === 'inline') return $('#logoutButton').fadeOut();
          else return $('#logoutButton').fadeIn('medium');
        })
      });
}
