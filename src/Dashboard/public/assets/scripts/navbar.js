const userNotLoggedIn = () => {

    $('.loginButton').css('visibility', 'visible');
    $('.profilePart').css('display', 'none');
    return;
}

const userLoggedIn = () => {

    $('.profilePart').css('visibility', 'visible');
    $('#loginButtonCollapsed').css('display', 'none');
    $('.navbar-brand').css('margin-top', '6.rem');
  
      $(document).ready(() => {
          $('.profilePart').click(() => {
            const doc = document.getElementById("profileDropdown");

            if (doc.style.display === 'block') { 

                $('#profileDropdown').css('display', 'none');
                $('#profileButton').css('transform', 'rotate(0deg)');
                return;
            }
            else {
  
                $('#profileDropdown').css('display', 'block');
                $('#profileButton').css('transform', 'rotate(180deg)');
                return;
            }
          })
      });
}
