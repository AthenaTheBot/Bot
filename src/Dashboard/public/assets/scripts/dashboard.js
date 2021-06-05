let menuExpanded = false;

$(document).ready(async () => {

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

    });

    const currentGuildID = window.location.pathname.split('/dashboard/').pop();

    $('#prefixButton').click(async () => {

        const prefix = $('#prefixInput').val();

        if (!prefix) warn('Invalid prefix was specified!');

        const serverResponse = await fetch(`/api/guilds/${currentGuildID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                operation: 'setPrefix',
                value: prefix
            })
        })
        .then(res => res.json()).catch(err => {})

        if (serverResponse && serverResponse.status == 200) return warn('Successfully set server prefix.');
        else {

            if (serverResponse && serverResponse.status == 401) return warn('The prefix that you are trying to set is the same as the current one.');
            else return warn('An unexpected error occured while setting the server prefix.');
        }
    })

    $('#languageButton').click(async () => {

        const language = $('#languageSelect').val();

        const serverResponse = await fetch(`/api/guilds/${currentGuildID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                operation: 'setLanguage',
                value: language
            })
        })
        .then(res => res.json()).catch(err => {})

        if (serverResponse && serverResponse.status == 200) return warn('Successfully set server language.');
        else {

            if (serverResponse && serverResponse.status == 401) return warn('The language that you are trying to set is the same as the current one.');
            else return warn('An unexpected error occured while setting the server language.');
        }
    })

    const user = await fetch('/api/users/@me').then(res => res.json()).then(res => {
        if (res.status != 200) return null;
        else return res.data;
    }).catch(err => { return null; });

    const userGuilds = await fetch('/api/users/@me/guilds').then(res => res.json()).then(res => {
        if (res.status != 200) return null;
        else return res.data;
    }).catch(err => { return null; });

    if (!user || !userGuilds) return handleError();

    const currentGuild = userGuilds.find(guild => guild.id == currentGuildID);

    if (!currentGuild) return window.location.replace('/dashboard');

    const currentGuildDB = await fetch(`/api/guilds/${currentGuildID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            operation: 'getGuild'
        })
    })
    .then(res => res.json()).then(res => {
        if (res.status != 200) return null;
        else return res.data;
    }).catch(err => { return null; });

    if (!currentGuildDB) return handleError();

    let guildDisplayName;
    if (currentGuild.name.length > 15) guildDisplayName = currentGuild.name.slice(0, 15) + '..';
    else guildDisplayName = currentGuild.name;

    let guildDisplayIcon;
    if (currentGuild.icon) guildDisplayIcon = `https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.png`;
    else guildDisplayIcon = '/assets/images/defaultServer.png';

    $('.server').children().remove();
    $('.server').append(`
        <img src="${guildDisplayIcon}" alt="${currentGuild.name}">
        <h3>${guildDisplayName}</h3>
        <hr>
        <div class="stats">
            <p><span style="font-weight: bold;">${currentGuild.memberCount}</span> Members</p>
            <p><span style="font-weight: bold;">${currentGuild.channelCount}</span> Channels</p>
        </div>
    `);

    let userDisplayName;
    if (user.username.length > 10) userDisplayName = user.username.slice(0, 10) + '..';
    else userDisplayName = user.username;
 
    let userDisplayAvatar;
    if (user.avatar) userDisplayAvatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    else userDisplayAvatar = '/assets/images/defaultServer.png';

    $('.profile').children().remove();
    $('.profile').append(`
        <img src="${userDisplayAvatar}" alt="User">
        <p id="username">${userDisplayName}</p>
        <p id="discriminator">#${user.discriminator} <i id="profileButton" class="fas fa-chevron-down"></i></p>
    `);

    $('#prefixInput').val(currentGuildDB.preferences.prefix);
    $("#languageSelect").val(currentGuildDB.preferences.language);

    $('.loader').remove();
})

const handleError = () => {

    $('.general').children().remove();
    $('.general').append(`
        <div class="error">
            <h3>Ooops!</h3>
            <p>It looks like an unexpected error occured while we are loading your dashboard, please try again later. <br> Btw, pls report this issue occurs again : - )</p>
            <a href="/dashboard">Return to menu</a>
        </div>
    `)
    $('.loader').remove();

    return;
}

let warnCount = 0;
let warnRemoved = 0;
let lastWarn;
const warn = (msg) => {

    if (lastWarn == msg) return;

    $('.warnings').append(`
    <div class="warn" id="warn_${warnCount}">${msg}</div>
    `);

    $(`#warn_${warnCount}`).hide().fadeIn();

    warnCount = warnCount + 1;
    lastWarn = msg;

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

        lastWarn = null;

    }, 5000);
}