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

    let display;
    switch(language) {
        case 'en-US':
            display = 'English';
            break;
        case 'tr-TR':
            display = 'Türkçe';
            break;
        case 'defaultLang':
            display = null;
            break;
        default:
            display = null;
            break;
    }

    if (!display) return;

    $('#languageButton').text(display);

    fetch('/dashboard/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operation: 'setLanguage',  guildID: id, language: language }),
    })
    .then(response => response.json())
    .then(data => {

        if (data.status == 200) {

            addWarning('Successfully made changes!');
            return;
        }
        else {

            addWarning('An unexpected error occured while trying to make changes!');
            return;
        }
    })
    .catch(error => {

        addWarning('An unexpected error occured while trying to make changes!');
        return;
    });

    return;
}

let warnCount = 0;
let warnRemoved = 0;

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

                if (data.status == 200) {

                    addWarning('Successfully made changes!');
                    return;
                }
                else {

                    addWarning('An unexpected error occured while trying to make changes!');
                    return;
                }
            })
            .catch(error => {

                addWarning('An unexpected error occured while trying to make changes!');
                return
            });
        }
    }
    else {

        return;
    };
};

const addWarning = (text) => {

    $('.warnings').append(`
    <p id="warn_` + warnCount + `" class="warn">${text}</p>
    `)

    $(`#warn_${warnCount}`).fadeIn();

    warnCount = warnCount + 1;

    setTimeout(() => {
        
        $(`#warn_${warnRemoved}`).fadeOut();

        setTimeout(() => {
            $(`#warn_${warnRemoved}`).remove();
        }, 1000);

        warnRemoved = warnRemoved + 1;

        if (warnRemoved == warnCount) {
            warnCount = 0;
            warnRemoved = 0;
        }

    }, 5000);
}