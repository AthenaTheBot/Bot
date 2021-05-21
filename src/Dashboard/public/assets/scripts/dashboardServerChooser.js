$(document).ready(() => {

    const guildsText = window.localStorage.getItem("_ug");
    const guilds = JSON.parse(guildsText);

    if (!guilds) {
        window.location.replace('/oauth/login');
    }
    else {
    
        for (var i = 0; i < guilds.length; i++) {
    
            let guildIcon;
            if (guilds[i].icon) guildIcon = `https://cdn.discordapp.com/icons/${guilds[i].id}/${guilds[i].icon}.png`;
            else guildIcon = '/assets/images/defaultServer.png';
    
            if (guilds[i].name.length > 25) guilds[i].name = guilds[i].name.slice(0, 25) + '...';

            let cardDescription;
            if (guilds[i].memberCount == 'Unknown') cardDescription = `<a id="dashButton" href="/dashboard/${guilds[i].id}">Go To Dashboard</a>`;
            else cardDescription = `<a id="dashButton" href="/invite">Invite Athena!</a>`;

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
    };
});


/* 
                    <% if (userGuilds[i].available) { %>
                        <a id="dashButton" href="<%= userGuilds[i].dashURL %>">Go To Dashboard</a>
                    <% } else { %>
                        <a id="dashButton" href="/invite">Invite Athena!</a>
                    <% } %>   

*/