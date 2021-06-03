let menuExpanded = false;

$(document).ready(() => {

    $('.profile').click(() => {
        if (menuExpanded) {

            $('#profileDropdown').css('display', 'none');
            menuExpanded = false;
        }
        else {

            $('#profileDropdown').css('display', 'block');
            menuExpanded = true;
        }
    }) 
})