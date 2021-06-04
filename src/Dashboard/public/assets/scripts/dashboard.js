let menuExpanded = false;

$(document).ready(() => {

    $('.profile').click(() => {
        if (menuExpanded) {

            $('#profileDropdown').css('display', 'none');
            $('#profileButton').css('transform', 'rotate(0deg)');
            menuExpanded = false;
        }
        else {

            $('#profileDropdown').css('display', 'block');
            $('#profileButton').css('transform', 'rotate(180deg)');
            menuExpanded = true;
        }
    });

    $('.icon').click(() => {
        const controlDiv = document.getElementById('control');

        if (controlDiv.className == 'control') {

            controlDiv.className += ' collapsed';

            $('#expand').css('display', 'block');
            $('#collapse').css('display', 'none');
        }
        else {

            controlDiv.className = 'control';
            $('#expand').css('display', 'none');
            $('#collapse').css('display', 'block');
        }

    })

    $('.loader').remove();
})