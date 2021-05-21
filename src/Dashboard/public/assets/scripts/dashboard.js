const init = async (guildID) => {

    $(document).ready(async () => {

        const guildsText = window.localStorage.getItem("_ug");
        const guilds = JSON.parse(guildsText);

        // Encrtpt all data
    
        if (!guilds) {
            window.location.replace('/oauth/login');
        }
        else {
        
            for (var i = 0; i < guilds.length; i++) {

                if (guilds[i].id == guildID) {

                    let guildIcon;
                    if (guilds[i].icon) guildIcon = `https://cdn.discordapp.com/icons/${guilds[i].id}/${guilds[i].icon}.png`;
                    else guildIcon = '/assets/images/defaultServer.png';
            
                    if (guilds[i].name.length > 25) guilds[i].name = guilds[i].name.slice(0, 25) + '...';

                    const prefixData = await fetch('/dashboard/actions', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ operation: 'getPrefix',  guildID: guildID }),
                    })
                    .then(response => response.json());

                    const languageData = await fetch('/dashboard/actions', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ operation: 'getLanguage',  guildID: guildID }),
                    })
                    .then(response => response.json());

                    guilds[i].language = languageData.data;
                    guilds[i].prefix = prefixData.data;

                    let displayLanguage;
                    switch(guilds[i].language) {
                        case 'en-US':
                            displayLanguage = 'English';
                            break;
                        case 'tr-TR':
                            displayLanguage = 'Türkçe';
                            break;
                    }

                    $('.containter').append(`
                        <div class="selectedServer"> 
                            <img src="${guildIcon}" alt="${guilds[i].name}">
                            <h5>${guilds[i].name}</h5> 
                            <hr id="serverLine"> 
                            <div class="details"> 
                                <p>Member Count: <span class="customCode">${guilds[i].memberCount}</span></p> 
                                <p>Channel Count: <span class="customCode">${guilds[i].channelCount}</span></p> 
                            </div> 
                        </div> 
                        <div class="controlPart"> 
                            <div class="configuration"> 
                                <h2 id="title">Configuration Settings</h2> 
                                <div class="forms"> 
                                    <div class="prefixPart"> 
                                        <h4>Change Prefix</h4> 
                                        <input class="form-control" id="prefixInput" onkeydown="setPrefix(event, '${guilds[i].id}')" value="${guilds[i].prefix}" type="text" placeholder="Write the prefix you want then press ENTER!"> 
                                    </div> 
                                    
                                    <div class="languagePart"> 
                                        <h4>Change Language</h4> 
                                        <p id="languageButton" onclick="openMenu()">${displayLanguage}</p> 
                                        <ul class="languages"> 
                                            <li onclick="selectLang('tr-TR', '${guilds[i].id}')" class="language">Türkçe</li> 
                                            <li onclick="selectLang('en-US', '${guilds[i].id}')" class="language">English</li> 
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `)

                    break;
                };
            };
        };
    
        /*
                <div class="selectedServer">
                <img src="<%= selectedGuild.icon %> " alt="<%= selectedGuild.name %> ">
                <h5><%= selectedGuild.displayName %></h5>
                <hr id="serverLine">
                <div class="details">
                    <p>Member Count: <span class="customCode"><%= selectedGuild.memberCount %></span></p>
                    <p>Channel Count: <span class="customCode"><%= selectedGuild.channelCount %></span></p> 
                </div>
            </div>
            <div class="controlPart">
                <div class="configuration">
                    <h2 id="title">Configuration Settings</h2>
                    <div class="forms">
                        <div class="prefixPart">
                            <h4>Change Prefix</h4>
                            <input class="form-control" id="prefixInput" onkeydown="setPrefix(event, '<%= selectedGuild.id %>')" value="<%= selectedGuild.prefix %>" type="text" placeholder="Write the prefix you want then press ENTER!">
                        </div>
    
                        <div class="languagePart">
                            <h4>Change Language</h4>
                            <p id="languageButton" onclick="openMenu()"><%= selectedGuild.language %></p>
                            <ul class="languages">
                                <li onclick="selectLang('tr-TR', '<%= selectedGuild.id %>')" class="language">Türkçe</li>
                                <li onclick="selectLang('en-US', '<%= selectedGuild.id %>')" class="language">English</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
    
        */
    })
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

    $('#languageButton').text(display);

    let canRun = true;
    await fetch('/dashboard/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operation: 'getLanguage',  guildID: id }),
    })
    .then(response => response.json())
    .then(data => {

        if (data.status == 200) {

            if (data.data == language) {

                $('#languageButton').css('border-color', '#860606'); 
                addWarning('The language that you are trying to set is same as the current one!');
                return canRun = false;
            }
        }
    })
    .catch(error => {

        console.log(error);
        addWarning('An unexpected error occured while trying to make changes!');
        return
    });

    if (!canRun) return;

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

            $('#languageButton').css('border-color', 'green'); 
            addWarning('Successfully set server language!');
            setTimeout(() => {
                $('#languageButton').css('border-color', '#7289DA'); 
            }, 1500);
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

const setPrefix = async (event, id) => {

    if (event.key == 'Enter') {

        const prefix = $('#prefixInput').val().trim();

        if (prefix.length == 0) {
            $('#prefixInput').css('border-color', '#860606'); 
        }
        else {

            let canRun = true;
            await fetch('/dashboard/actions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ operation: 'getPrefix',  guildID: id }),
            })
            .then(response => response.json())
            .then(data => {

                if (data.status == 200) {

                    if (data.data == prefix) {

                        $('#prefixInput').css('border-color', '#860606'); 
                        addWarning('The prefix that you are trying to set is same as the current one!');
                        return canRun = false;
                    }
                }
            })
            .catch(error => {

                addWarning('An unexpected error occured while trying to make changes!');
                return
            });

            if (!canRun) return;

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

                    $('#prefixInput').css('border-color', 'green');
                    addWarning('Successfully set server prefix!');
                    setTimeout(() => {
                        $('#prefixInput').css('border-color', '#7289DA'); 
                    }, 1500);
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
};

