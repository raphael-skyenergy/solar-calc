// common.js
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

export function formatNum(v,i) {
    return parseFloat(v).toFixed(i)
}

export function randomArray() {
    return Array.from({length: 8}, () => Math.floor(Math.random() * 1500));    
}

export const asyncLocalStorage = {
    setItem: async function (key, value) {
        await null;
        return localStorage.setObject(key, value);
    },
    getItem: async function (key) {
        await null;
        return localStorage.getObject(key);
    }
};
