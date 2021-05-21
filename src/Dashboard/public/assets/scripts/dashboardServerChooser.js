$(document).ready(async() => {

    await fetch('/api/users/@me/guilds')
    .then(res => res.json())
    .then(async (data) => {

        if (!data) window.location.replace('/');
        else {

            await $('.spinner').css('display', 'none');

            loadServers(data.data);
        }
    })
    .catch(err => {});

});

const loadServers = (guilds) => {

    for (var i = 0; i < guilds.length; i++) {
    
        let guildIcon;
        if (guilds[i].icon) guildIcon = `https://cdn.discordapp.com/icons/${guilds[i].id}/${guilds[i].icon}.png`;
        else guildIcon = '/assets/images/defaultServer.png';

        if (guilds[i].name.length > 25) guilds[i].name = guilds[i].name.slice(0, 25) + '...';

        let cardDescription;
        if (guilds[i].memberCount == 'Unknown') cardDescription = `<a id="dashButton" href="/invite">Invite Athena!</a>`;
        else cardDescription = `<a id="dashButton" href="/dashboard/${guilds[i].id}">Go To Dashboard</a>`;

        $('.servers').append(`
            <div class="server">
                <img src="${guildIcon}" alt="${guilds[i].name}">
                <h5>${guilds[i].name}</h5>
                <hr id="serverLine">
                <div class="details">
                    <p>Member Count: <span class="customCode">${guilds[i].memberCount}</span></p>
                    <p>Channel Count: <span class="customCode">${guilds[i].channelCount}</span></p>
                    ${cardDescription}
                </div>
            </div>
        `);
    };
}