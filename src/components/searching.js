import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
     const ruleNames = [];
     const searchRules = [ 
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'])
    ];

    // Передаем настройки вторым аргументом, как и планировалось
    const compare = createComparison(ruleNames, searchRules);

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        const searchValue = state[searchField];
        if (searchValue) return data;
        
        return data.filter(row => compare(row, state));
    }
}