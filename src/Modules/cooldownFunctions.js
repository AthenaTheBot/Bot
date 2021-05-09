module.exports.inCooldown = (base, user, commandName) => {

    const userCooldownData = base.cooldowns.get(user);

    if (userCooldownData) {

        const updatedData = userCooldownData.find(x => x.commandName == commandName);

        if (!updatedData) return false;
        else {

            return true;
        }
    }
    else {

        return false;
    }
};

module.exports.add = (base, user, commandName, cooldownAmount) => {

    const userCooldownData = base.cooldowns.get(user);

    if (!userCooldownData) {

        base.cooldowns.set(user, [{ commandName: commandName, warnSent: false }]);
    }
    else {

        userCooldownData.push({ commandName: commandName, warnSent: false });
        base.cooldowns.set(user, userCooldownData);
    }

    setTimeout(() => {

        const userCooldownDataUpdated = base.cooldowns.get(user);

        if (!userCooldownDataUpdated) return;
        else {

            const filteredCooldownArray = userCooldownDataUpdated.filter(x => x.commandName != commandName);

            if (!filteredCooldownArray || filteredCooldownArray.length == 0) {

                base.cooldowns.delete(user);
                return;
            }
            else {

                base.cooldowns.set(user, filteredCooldownArray);
                return;
            }
        }

    }, cooldownAmount * 1000);
};

module.exports.updateState = (base, user, commandName, state) => {

    const userCooldownData = base.cooldowns.get(user);

    if (userCooldownData) {

        for (var i = 0; i < userCooldownData.length; i++) {

            if (userCooldownData[i].commandName == commandName) {

                userCooldownData[i].warnSent = state;
                break;
            };
        };
    };
};