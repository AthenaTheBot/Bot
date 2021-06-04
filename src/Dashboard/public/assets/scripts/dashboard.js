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

    })

    const currentServer = window.location.pathname.split('/dashboard/').pop();

    const user = await fetch('/api/users/@me').then(res => res.json()).catch(err => {});
    const userGuilds = await fetch('/api/users/@me/guilds').then(res => res.json()).catch(err => {});

    if (!user || !userGuilds || user.status != 200 || userGuilds.status != 200) return handleError();

    const currentServerData = userGuilds.data.find(guild => guild.id == currentServer);

    if (!currentServerData) return window.location.replace('/dashboard');

    const currentServerDB = fetch(`/api/guilds/${currentServer}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            operation: 'getGuild'
        })
    })
    .then(res => res.json()).catch(err => {});

    if (!currentServerDB) return handleError();

    let displayServerName;
    if (currentServerData.name.length > 15) displayServerName = currentServerData.name.slice(0, 15) + '..';
    else displayServerName = currentServerData.name;

    let displayServerIcon;
    if (currentServerData.icon) displayServerIcon = `https://cdn.discordapp.com/icons/${currentServerData.id}/${currentServerData.icon}.png`;
    else displayServerIcon = '/assets/images/defaultServer.png';

    $('.server').children().remove();
    $('.server').append(`
        <img src="${displayServerIcon}" alt="${currentServerData.name}">
        <h3>${displayServerName}</h3>
        <hr>
        <div class="stats">
            <p><span style="font-weight: bold;">${currentServerData.memberCount}</span> Members</p>
            <p><span style="font-weight: bold;">${currentServerData.channelCount}</span> Channels</p>
        </div>
    `);

    let displayUserName;
    if (user.data.username.length > 10) displayUserName = user.data.username.slice(0, 10) + '..';
    else displayUserName = user.data.username;
 
    let displayAvatar;
    if (user.data.avatar) displayAvatar = `https://cdn.discordapp.com/avatars/${user.data.id}/${user.data.avatar}.png`;
    else displayAvatar = '/assets/images/defaultServer.png';

    $('.profile').children().remove();
    $('.profile').append(`
        <img src="${displayAvatar}" alt="User">
        <p id="username">${displayUserName}</p>
        <p id="discriminator">#${user.data.discriminator} <i id="profileButton" class="fas fa-chevron-down"></i></p>
    `)

    $('.loader').remove();
})

const handleError = () => {

    $('.loader').remove();
    $('.general').append(`Error`);
}