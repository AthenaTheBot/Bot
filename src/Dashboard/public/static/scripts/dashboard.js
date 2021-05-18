let menuOpened = false;
const openMenu = () => {
    if (menuOpened) {
        $('.languages').css('display', 'none');
        menuOpened = false;
        return;
    }
    else {
        $('.languages').css('display', 'block');
        menuOpened = true;
        return;
    }
};

const selectLang = (language) => {

    $('.languages').css('display', 'none');
    menuOpened = false;

    switch(language) {
        case 'en-US':
            language = 'English';
            break;
        case 'tr-TR':
            language = 'Türkçe';
            break;
        case 'defaultLang':
            language = 'Select Language';
            break;
        default:
            language = null;
            break;
    }

    if (!language) return;

    $('#languageButton').text(language);
}

const setPrefix = (event) => {

    if (event.key == 'Enter') {

        const prefix = $('#prefixInput').val().trim();

        if (prefix.length == 0) {
            $('#prefixInput').css('border-color', '#860606'); 
        }
        else {

            $('#prefixInput').css('border-color', 'green');
        }
    }
    else {

        return;
    }
}