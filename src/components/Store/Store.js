export const transaction = require('../../data/transaction.json');
export const group = require('../../data/group.json');
export const user = require('../../data/user.json');



export const dataStore = (amount, paid_by, owes, desc, groupName) => {
    const lastTransaction = +transaction.last + 1;
    transaction[lastTransaction] = {
        amount,
        paid_by,
        owes,
        desc
    }
    if (groupName === 'No group') {
        for (let name of owes) {

            user[paid_by] = {
                [name]: user[paid_by].name ?? [],
                owes: user[paid_by].owes ?? []
            }
            user[paid_by] = {
                [name]: [...user[paid_by][name], lastTransaction]
            }

            user[name] = user[name] ?? {};
            user[name] = {
                owes: user[name].owes ?? []
            }
            user[name] = {
                owes: [...user[name].owes, paid_by]
            }
        }
    }
    else {
        group[groupName] = {
            transaction: [...group[groupName].transaction, lastTransaction]
        }
    }

}