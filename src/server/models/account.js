/**
 * This file is the model of the Account
 * --------------------------------
 * @module domain.Account
 */
class Account {
    constructor(id, email, name, state) {
        // The account id
        this.id = id;

        // The email associated with the account
        this.email = email;

        // The name of the account holder
        this.name = name;

        // The state or region associated with the account
        this.state = state;
    }
}

export default Account;
