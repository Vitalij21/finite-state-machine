class TransactionHistory {
    constructor(previousState, currentTransaction, currentState, isUndo, isRedo) {
        this.previousState = previousState;
        this.currentTransaction = currentTransaction;
        this.currentState = currentState;
        this.isUndo = false;
        this.isRedo = false;
    }
}

class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */

    constructor(config) {

        this.activeState = config.initial;
        this.config = config;
        this.arrayOfTransactions = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {

        return this.activeState;

    }

    /**
     * Goes to specified state.
     * @param state
     */

    changeState(state) {

        if (this.getStates(null).includes(state, 0)) {

            let newTransactionHistory = new TransactionHistory;
            newTransactionHistory.previousState = this.activeState;
            newTransactionHistory.currentState = state;
            this.arrayOfTransactions.push(newTransactionHistory);
            this.activeState = state;

        } else {
            throw new Error();
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {

        let transactionHistory = new TransactionHistory;
        transactionHistory.previousState = this.config.activeState;
        transactionHistory.currentTransaction = event;

        let statesObject = this.config.states;
        let checkArray = [];

        for (let prop in statesObject) {

            let arrayOfProperties = Object.values(statesObject[prop]);

            for (let i = 0; i < arrayOfProperties.length; i++) {

                for (let innerProp in arrayOfProperties[i]) {
                    checkArray.push(innerProp);
                }
            }
        }

        for (let prop in statesObject) {

            let arrayOfProperties = Object.values(statesObject[prop]);

            for (let i = 0; i < arrayOfProperties.length; i++) {

                for (let innerProp in arrayOfProperties[i]) {

                    if (checkArray.includes(event, 0)) {
                        if (innerProp === event) {

                        console.log(JSON.stringify(arrayOfProperties[i]));
                        console.log(this.activeState);

                        if(this.activeState!==this.config.initial){
                                if(JSON.stringify(arrayOfProperties[i]).indexOf(this.activeState)===-1){
                                    throw new Error;
                        }
                        }
                        transactionHistory.currentState = arrayOfProperties[i][innerProp];
                        this.arrayOfTransactions.push(transactionHistory);
                        this.activeState = arrayOfProperties[i][innerProp];
                        }
                    } else throw new Error();
                }
            }
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {

        this.activeState = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {

        if (event == null) {

            let statesObject = this.config.states;
            return Object.keys(statesObject);

        } else {
            let resultArray = [];
            let statesObject = this.config.states;

            for (let prop in statesObject) {

                let arrayOfProperties = Object.values(statesObject[prop]);

                arrayOfProperties.forEach(function (element) {

                let keysArray = Object.keys(element);

                if (keysArray.includes(event, 0)) {
                        resultArray.push(prop);
                }
                });
            }
            return resultArray;
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {

        let transactionsAmount = this.arrayOfTransactions.length;
        if (transactionsAmount >= 2) {

            //   console.log(this.arrayOfTransactions);

            let transactionToRollBack = this.arrayOfTransactions[transactionsAmount - 3];
            let lastTransaction = this.arrayOfTransactions[transactionsAmount - 1];
            lastTransaction.isUndo = true;
            let newTransactionHistory = new TransactionHistory();

            if (transactionToRollBack && transactionToRollBack.previousState) {
                newTransactionHistory.previousState = transactionToRollBack.previousState;
                newTransactionHistory.currentState = transactionToRollBack.currentState;
                newTransactionHistory.currentTransaction = transactionToRollBack.currentTransaction;
                this.activeState = transactionToRollBack.currentState;
                this.arrayOfTransactions.push(newTransactionHistory);
                return true;
            } else return false;

        } else if (transactionsAmount === 1) {
            let lastTransaction = this.arrayOfTransactions[transactionsAmount - 1];
            lastTransaction.isUndo = true;
            let newTransactionHistory = new TransactionHistory();
            newTransactionHistory.currentState = this.config.initial;
            newTransactionHistory.previousState = this.config.initial;
            this.activeState = this.config.initial;
            this.arrayOfTransactions.push(newTransactionHistory);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {

        let transactionsAmount = this.arrayOfTransactions.length;

        if(transactionsAmount>=1){
            for (let i = transactionsAmount - 1; i >= 0; i--) {
                if(this.arrayOfTransactions[i].isUndo===true ){

                    if(this.arrayOfTransactions[i].isRedo===false){

                        this.arrayOfTransactions[i].isRedo=true;

                        let newTransactionHistory = new TransactionHistory();
                        newTransactionHistory.currentState = this.arrayOfTransactions[i].currentState;
                        newTransactionHistory.previousState = this.arrayOfTransactions[i].previousState;
                        this.activeState = newTransactionHistory.currentState;
                        this.arrayOfTransactions.push(newTransactionHistory);
                        return true;
                    } else return false;
                }
            }
            return true;
        } else return false;


    }

    /**
     * Clears transition history
     */
    clearHistory() {

        this.arrayOfTransactions = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/