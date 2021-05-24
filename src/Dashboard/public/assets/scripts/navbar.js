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
          const doc = document.getElementById("profileDropdown");
          if (doc.style.display === 'block') return $('#profileDropdown').css('display', 'none');
          else return $('#profileDropdown').css('display', 'block');
        })
      });
}
