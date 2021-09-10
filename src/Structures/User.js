class User {
    constructor(userID) {
        if (userID) {
            this._id = userID
        }
        else {

            throw new Error('Cannot create a user instance without a user id.');
        }
        
        this.preferences = {
            language: null,
            tips: true,
            notifications: true
        };
        
    }
}

module.exports = User;