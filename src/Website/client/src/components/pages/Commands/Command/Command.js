// Modules
import $ from 'jquery'

// Styling
import './Command.css';

const Command = ({ name, usage, description, reqPerms, reqBotPerms }) => {

    const expandCommand = (e) => {
        if ($(e.currentTarget).children('.command-expand').hasClass('command-active')) {
            $(e.currentTarget).children('.command-expand').removeClass('command-active')
        }
        else {
            $(e.currentTarget).children('.command-expand').addClass('command-active')
        }
    }

    return (
        <div className="command" onClick={expandCommand}>
            <h5>at! <span id="command-name">{name}</span> <code>{usage}</code></h5>
            <div className="command-expand">
                <p>Description: <span id="command-desc">{description}</span></p>
                <p>Required Perms: <code id="command-req-perms">{reqPerms.join(', ')}</code></p>
                <p>Required Bot Perms: <code id="command-req-bot-perms">{reqBotPerms.join(', ')}</code></p>
            </div>
        </div>
    )
}

export default Command
