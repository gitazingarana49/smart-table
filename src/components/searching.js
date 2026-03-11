import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    return (data, state, _action) => {
        // @todo: #5.2 — применить компаратор
        const searchValue = state[searchField];
        if (!searchValue || searchValue.trim() === '') {
            return data;
        }
    // @todo: #5.1 — настроить компаратор
     const ruleNames = [];
     const searchRules = [
        rules.searchMultipleFields (searchValue, ['date', 'customer', 'seller'], false)
     ];

    // Передаем настройки вторым аргументом, как и планировалось
    const compare = createComparison(ruleNames, searchRules);

        return data.filter(row => compare(row, searchValue));
    };
}