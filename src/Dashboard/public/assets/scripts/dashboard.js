const init = async (guildID) => {

    $(document).ready(async () => {

        const availabeGuilds = await fetch(`/api/users/@me/guilds`).then(res => res.json()).catch(err => {});

        if (!availabeGuilds) return handleError();

        const currentGuild = availabeGuilds.data.find(guild => guild.id == guildID);

        if (!currentGuild) return handleError();

        const currentGuildDB = await fetch(`/api/guilds/${guildID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ operation: 'getGuild' })
        })
        .then(res => res.json()).catch(err => {});

        if (!currentGuildDB || !currentGuildDB.data) return handleError();

        let guildIcon;
        if (currentGuild.icon) guildIcon = `https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.png`;
        else guildIcon = '/assets/images/defaultServer.png';

        if (currentGuild.name.length > 25) currentGuild.name = currentGuild.name.slice(0, 25) + '...';

        let displayLanguage;
        switch(currentGuildDB.data.preferences.language) {
            case 'en-US':
                displayLanguage = 'English';
                break;
            case 'tr-TR':
                displayLanguage = 'Türkçe';
                break;
        }

        await $('.spinner').remove();

        $('.container').append(`
            <div class="selectedServer"> 
                <img src="${guildIcon}" alt="${currentGuild.name}">
                <h5>${currentGuild.name}</h5> 
                <hr id="serverLine"> 
                <div class="details"> 
                    <p>Member Count: <span class="customCode">${currentGuild.memberCount}</span></p> 
                    <p>Channel Count: <span class="customCode">${currentGuild.channelCount}</span></p> 
                </div> 
            </div> 
            <div class="controlPart"> 
                <div class="configuration"> 
                    <h2 id="title">Configuration Settings</h2> 
                    <div class="forms"> 
                        <div class="prefixPart"> 
                            <h4>Change Prefix</h4> 
                            <input class="form-control" id="prefixInput" onkeydown="setPrefix(event, '${currentGuild.id}')" value="${currentGuildDB.data.preferences.prefix}" type="text" placeholder="Write the prefix you want then press ENTER!"> 
                        </div> 
                        
                        <div class="languagePart"> 
                            <h4>Change Language</h4> 
                            <p id="languageButton" onclick="openMenu()">${displayLanguage}</p> 
                            <ul class="languages"> 
                                <li onclick="selectLang('tr-TR', '${currentGuild.id}')" class="language">Türkçe</li> 
                                <li onclick="selectLang('en-US', '${currentGuild.id}')" class="language">English</li> 
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `)
        
    });
};

const handleError = () => {

    $('.container').children().remove();
    
    $('.spinner').remove();

    $('.container').append(`
        <div class="error">
            <h3>Oh no!</h3>
            <p>It looks like an error occured whihe trying to open the dashobard of your guild! Please try again later..</p>
        </div>
    `);
}

let menuOpened = false;
const openMenu = async () => {
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

const selectLang = async (language, id) => {

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

    fetch(`/api/guilds/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operation: 'setLanguage',  value: language, id: id }),
    })
    .then(res => res.json())
    .then(data => {

        if (data.status == 200) {

            $('#languageButton').text(display);

            $('#languageButton').css('border-color', 'green'); 
            addWarning('Successfully set server language!');
            setTimeout(() => {
                $('#languageButton').css('border-color', '#7289DA'); 
            }, 1500);
            return;
        }
        else if (data.code && data.code == 'same_language') {

            $('#languageButton').css('border-color', '#860606');
            addWarning('The language that you are trying to set is same as the current one!');
            setTimeout(() => {
                $('#languageButton').css('border-color', '#7289DA'); 
            }, 1500);
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

const setPrefix = async (event, id) => {

    if (event.key == 'Enter') {

        const prefix = $('#prefixInput').val().trim();

        if (prefix.length == 0) {
            $('#prefixInput').css('border-color', '#860606'); 
        }
        else {

            fetch(`/api/guilds/${id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ operation: 'setPrefix', value: prefix, id: id }),
            })
            .then(res => res.json())
            .then(data => {

                if (data.status == 200) {

                    $('#prefixInput').css('border-color', 'green');
                    addWarning('Successfully set server prefix!');
                    setTimeout(() => {
                        $('#prefixInput').css('border-color', '#7289DA'); 
                    }, 1500);
                    return;
                }
                else if (data.code && data.code == 'same_prefix') {

                    $('#prefixInput').css('border-color', '#860606');
                    addWarning('The prefix that you are trying to set is same as the current one!');
                    setTimeout(() => {
                        $('#prefixInput').css('border-color', '#7289DA'); 
                    }, 1500);
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
};

