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
