let commandExpanded = false;
function expandCommand(commandName) {
    if (commandExpanded) {
        $(`#description_${commandName}`).css('display', 'none');
        commandExpanded = false;
        return;
    }
    else {
        $(`#description_${commandName}`).css('display', 'block');
        commandExpanded = true;
        return; 
    }
}