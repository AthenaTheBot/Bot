let commandsExpanded = new Array();

function expandCommand(commandName) {
    if (commandsExpanded.includes(commandName)) {

        $(`#description_${commandName}`).css('display', 'none');
        commandsExpanded = commandsExpanded.filter(x => x != commandName);
        return;
    }
    else {

        $(`#description_${commandName}`).css('display', 'block');
        commandsExpanded.push(commandName);
        return; 
    }
}
