$(document).ready(async () => {

    const commandData = await fetch('/api/commands').then(res => res.json()).catch(err => {});

    $('.categories').append(`<h5 id="All" class="category">All</h5>`);
    $('#All').click(() => { loadCategory('All') });

    commandData.data.forEach(data => {

        $('.categories').append(`<h5 id="${data.category}" class="category">${data.category}</h5>`);
        $(`#${data.category}`).click(() => { loadCategory(data.category) });
    });

    loadCategory('All');
});

const loadCategory = async (category) => {

    if (category == 'All') {

        const categoryCommnads = await fetch('/api/commands').then(res => res.json()).catch(err => {})

        $('.command').remove();
    
        categoryCommnads.data.forEach(categories => {
    
            categories.commands.forEach(command => {

                if (command.required_perms.length == 0) command.required_perms = 'None';
                if (command.required_bot_perms.length == 0) command.required_bot_perms = 'None';
 
                $('.commands').append(`
                <div class="command" id="${command.name}">
                    <h5 id="title">at! ${command.name} <code id="customCode">${command.usage}</code></h5>
                    <p style="display: none;" class="description" id="description_${command.name}">Description: ${command.description}<br> Required Perms for Users: <code id="customCode">${command.required_perms}</code> <br> Required Perms for Bot: <code id="customCode">${command.required_bot_perms}</code></p>
                </div> 
            `)

                $(`#${command.name}`).click(() => { expandCommand(command.name) });
            })
        })

        $('.categories').children().removeClass('active');
        $(`#All`).addClass('active');
    }
    else {

        const categoryCommnads = await fetch('/api/commands?category=' + category).then(res => res.json()).catch(err => {})

        $('.command').remove();
    
        categoryCommnads.data[0].commands.forEach(command => {
    
            if (command.required_perms.length == 0) command.required_perms = 'None';
            if (command.required_bot_perms.length == 0) command.required_bot_perms = 'None';

            $('.commands').append(`
                <div class="command" id="${command.name}">
                    <h5 id="title">at! ${command.name} <code id="customCode">${command.usage}</code></h5>
                    <p style="display: none;" class="description" id="description_${command.name}">Description: ${command.description}<br> Required Perms for Users: <code id="customCode">${command.required_perms}</code> <br> Required Perms for Bot: <code id="customCode">${command.required_bot_perms}</code></p>
                </div> 
            `);

            $(`#${command.name}`).click(() => { expandCommand(command.name) });
        })

        $('.categories').children().removeClass('active');
        $(`#${category}`).addClass('active');
    }
};

let commandsExpanded = new Array();
let menuExpanded = false;

const expandCommand = async (commandName) => {
    if (commandsExpanded.includes(commandName)) {

        await $(`#description_${commandName}`).animate({ height: 'hide' }, 'fast');

        commandsExpanded = commandsExpanded.filter(x => x != commandsExpanded);
        return;
    }
    else {

        $(`#description_${commandName}`).animate({ height: 'show' }, 'fast');

        commandsExpanded.push(commandName);
        return;
    };
};
