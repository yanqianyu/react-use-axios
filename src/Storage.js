// localStorage的封装类

const localStorage = typeof window === 'undefined' ? null : window.localStorage;
export default class Storage {
    getItem(key) {
        return localStorage.getItem(key) || null;
    }

    removeItem(key) {
        localStorage.removeItem(key);
    }

    setItem(key, value) {
        localStorage.setItem(key, value);
    }

    getAllKeys() {
        return new Array(localStorage.length).fill('').map((_, index) => localStorage.key(index) || '');
    }
}
