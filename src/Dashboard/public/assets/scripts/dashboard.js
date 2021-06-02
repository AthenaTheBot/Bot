$(document).ready(async () => {

    const currentGuildID = window.location.pathname.split('/dashboard/').pop();

    if (!currentGuildID || isNaN(currentGuildID) || currentGuildID.length != 18) return window.location.replace('/dashboard');

    const serverData = await fetch(`/api/users/@me/guilds`, {
        method: 'GET'
    })
    .then(res => res.json())
    .catch(err => {})

    const userData = await fetch('/api/users/@me', {
        method: 'GET'
    })
    .then(res => res.json())
    .catch(err => {})

    if (!serverData || !userData || serverData.status != 200 || userData.status != 200) {

        $('.loader').children().remove();
        $('.loader').append(`
            <div class="error">
                <h3>Oh, no!</h3>
                <p>It looks like we couldn't load your server's dashboard, please try agailn later. <br> TIP: If this error occurs again please inform us this error.</p>
            </div>
        `);
        return;
    }

    const currentGuild = serverData.data.find(guild => guild.id == currentGuildID);

    if (!currentGuild) return window.location.replace('/dashboard');

    if (currentGuild.name.length > 20) currentGuild.name = currentGuild.name.slice(0, 20) + '..';

    let guildIcon
    if (currentGuild.icon) guildIcon = `https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.png`;
    else guildIcon = '/assets/images/defaultServer.png';

    let userAvatar;
    if (userData.data.avatar) userAvatar = `https://cdn.discordapp.com/avatars/${userData.data.id}/${userData.data.avatar}.png`;
    else userAvatar = '/assets/images/defaultServer.png';

    $('.serverPart h4').text(currentGuild.name);
    $('.serverPart img').attr('src', guildIcon);

    $('.profile').children().remove();
    $('.profile').append(`
        <img src="${userAvatar}" alt="${userData.data.username}">
        <p id="user">${userData.data.username}</p>
        <p id="discriminator">#${userData.data.discriminator} <i id="profileButton" class="fas fa-chevron-down"></i></p>
    `)

    $('.loader').remove();

    $('.profile').click(() => {
        const doc = document.getElementById("profileDropdown");
        if (doc.style.display === 'block') { 
            $('#profileDropdown').css('display', 'none');
            $('#profileButton').css('transform', 'rotate(0deg)');
            return;
        }
        else {
            $('#profileDropdown').css('display', 'block');
            $('#profileButton').css('transform', 'rotate(180deg)');
            return;
        }
    })

});

const init = (currentGuildID) => {
    return new Promise(async () => {
        const serverDB = await fetch(`/api/guilds/${currentGuildID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operation: 'getGuild'
            })
        })
        .then(res => res.json())
        .catch(err => {})

        
    })
}