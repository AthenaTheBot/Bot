class BaseCommand {
    constructor(cmd) {

        this.name = cmd.name || null;
        this.aliases = cmd.aliases || [];

        this.description = cmd.description || 'None';
        this.category = cmd.category || null;
        this.usage = cmd.usage || 'None';

        this.options = cmd.options || [];

        this.cooldown = cmd.cooldown || 1;

        this.required_perms = cmd.required_perms || [];
        this.required_bot_perms = cmd.required_bot_perms || [];

        this.locales = [];
    }
}

module.exports = BaseCommand;