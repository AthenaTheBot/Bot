// Styling
import './Command.css';

const Command = ({ name, usage, description, reqPerms, reqBotPerms }) => {

    const expandCommand = (e) => {
        const classList = e.currentTarget.lastChild.classList.value.toString().split(' ');
        if (classList.includes('disabled')) {
            e.currentTarget.lastChild.classList = ['command-expand'];
        }
        else {

            e.currentTarget.lastChild.classList += ' disabled';
        }
    }

    return (
        <div className="command" onClick={expandCommand}>
            <h5>at! <span id="command-name">{name}</span> <code>{usage}</code></h5>
            <div className="command-expand disabled">
                <p>Description: <span id="command-desc">{description}</span></p>
                <p>Required Perms: <code id="command-req-perms">{reqPerms.join(', ')}</code></p>
                <p>Required Bot Perms: <code id="command-req-bot-perms">{reqBotPerms.join(', ')}</code></p>
            </div>
        </div>
    )
}

export default Command
