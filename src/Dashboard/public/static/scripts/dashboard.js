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

const selectLang = (language, id) => {

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
            language = null;
            break;
        default:
            language = null;
            break;
    }

    if (!language) return;

    $('#languageButton').text(language);

    console.log(language);

    return;
}

const setPrefix = (event, id) => {

    if (event.key == 'Enter') {

        const prefix = $('#prefixInput').val().trim();

        if (prefix.length == 0) {
            $('#prefixInput').css('border-color', '#860606'); 
        }
        else {

            $('#prefixInput').css('border-color', 'green');

            fetch('/dashboard/actions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ operation: 'setPrefix',  guildID: id, prefix: prefix }),
            })
            .then(response => response.json())
            .then(data => {

                if (data.status == 200) return console.log('Operation successfull!');
                else {

                    return console.error('An error occured!');
                }
            })
            .catch((error) => {
                  console.error('Error:', error);
            });
        }
    }
    else {

        return;
    };
};
