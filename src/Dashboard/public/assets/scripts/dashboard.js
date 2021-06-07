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

    $('.categoryName').click(function() {
        const display = $(this).siblings().css('display');
        if (display == 'list-item') {
            $(this).siblings().css('display', 'none');
            $(this).children().css('transform', 'rotate(0deg)');
        }
        else {
            $(this).siblings().css('display', 'list-item');
            $(this).children().css('transform', 'rotate(180deg)');
        }
    })

    $('.categoryElement').click(function() {
        const className = $(this).attr('data-class');
        $('.main').children().removeClass('active');
        $('.category').children().removeClass('btnActive');
        $(this).addClass('btnActive');
        $(`.${className}`).addClass('active');
    })

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
    });

    $('#playBtn').click(async function() {
        const btnClasses = $(this).attr('class').split(' ');
        if (btnClasses.includes('fa-play')) {
            await fetch(`/api/guilds/${currentGuildID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    operation: 'updateMusicState',
                    value: 'pause'
                })
            })
            .then(res => res.json()).then(res => { return res.data; }).catch(err => { return null; });

            $(this).removeClass('fa-play');
            $(this).addClass('fa-pause');
        }
        else {
            await fetch(`/api/guilds/${currentGuildID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    operation: 'updateMusicState',
                    value: 'resume'
                })
            })
            .then(res => res.json()).then(res => { return res.data; }).catch(err => { return null; });

            $(this).removeClass('fa-pause');
            $(this).addClass('fa-play');
        }
    });

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
    `);

    $('.loader').remove();

    return;
}

let warnCount = 0;
let warnRemoved = 0;
let lastWarn;
const warn = async (msg) => {

    if (lastWarn == msg) return;
    else if ($('.warn').length >= 2) {
        await wait(6);
    }

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

const wait = (second) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, second * 1000)
    })
}

const musicInit = async (passiveCheck) => {
  
    const currentGuildID = window.location.pathname.split('/dashboard/').pop();

    if (passiveCheck) {

        const guildMusicState = await fetch(`/api/guilds/${currentGuildID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                operation: 'getMusicState',
            })
        })
        .then(res => res.json()).then(res => { return res.data; }).catch(err => { return null; });

        if (!guildMusicState || guildMusicState.queue.length == 0) {

            $('#songTitle').text('Song Name');
            $('#songArtist').attr('href', '#')
    
            $('#songArtist').text('Song Artist');
            $('#songArtist').attr('href', '#')
    
            $('#songThumbnail').attr('src', '/assets/images/defaultServer.png');
    
            $('.queueSong').remove();
        }
        else {

            $('#songTitle').text(guildMusicState.queue[0].title);
            $('#songArtist').attr('href', guildMusicState.queue[0].url)
    
            $('#songArtist').text(guildMusicState.queue[0].artist.name);
            $('#songArtist').attr('href', guildMusicState.queue[0].artist.url)
    
            $('#songThumbnail').attr('src', guildMusicState.queue[0].thumbnail);
    
            $('.queueSong').remove();
    
            guildMusicState.queue.forEach((song) => {
                if (song.title.length >= 25) song.title = song.title.slice(0, 25) + '..';
                $('.queue').append(`
                    <div class="queueSong">
                        <img src="${song.thumbnail || '/assets/images/defaultServer.png'}" alt="${song.title}">
                        <div class="textPart">
                            <a id="queueSongName" href="${song.url}">${song.title}</a>
                            <a id="queueSongArtist" href="${song.artist.url || '#'}">${song.artist.name}</a>
                        </div>
                    </div>
                `);
            });
        }

    } else {

        $('.general').append(`    
        <div class="loader">
            <div class="spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
                <div class="bounce4"></div>
            </div>
        </div>`);

        const guildMusicState = await fetch(`/api/guilds/${currentGuildID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                operation: 'getMusicState',
            })
        })
        .then(res => res.json()).then(res => { return res.data; }).catch(err => { return null; });
    
        if (!guildMusicState) return handleError();
        else {
    
            if (!guildMusicState.playing) {
    
                $('.loader').remove();
            }
            else {

                $('#songTitle').text(guildMusicState.queue[0].title);
                $('#songArtist').attr('href', guildMusicState.queue[0].url)
        
                $('#songArtist').text(guildMusicState.queue[0].artist.name);
                $('#songArtist').attr('href', guildMusicState.queue[0].artist.url)
        
                $('#songThumbnail').attr('src', guildMusicState.queue[0].thumbnail);
        
                guildMusicState.queue.forEach((song) => {
                    if (song.title.length >= 15) song.title = song.title.slice(0, 15) + '..';
                    $('.queue').append(`
                        <div class="queueSong">
                            <img src="${song.thumbnail || '/assets/images/defaultServer.png'}" alt="${song.title}">
                            <div class="textPart">
                                <a id="queueSongName" href="${song.url}">${song.title}</a>
                                <a id="queueSongArtist" href="${song.artist.url || '#'}">${song.artist.name}</a>
                            </div>
                        </div>
                    `);
                })
        
                $('.loader').remove();
            }
    
            setInterval(() => {
    
                musicInit(true);
            }, 3000)
        }
    }    
};