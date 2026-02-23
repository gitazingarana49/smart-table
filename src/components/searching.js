import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
   /*  const ruleNames = [];
     const searchRules = [
        rules.searchMultipleFields(['data', 'customer', 'seller'])
     ];

    // Передаем настройки вторым аргументом, как и планировалось
    const compare = createComparison(ruleNames, searchRules);

    return (data, state, _action) => {
        // @todo: #5.2 — применить компаратор
        const searchValue = state[searchField];
        if (!searchValue || searchValue.trim() === '') return data;
        
        return data.filter(row => compare(row, searchValue));
    }*/
   return (data, state, _action) => {
        // @todo: #5.2 — применить компаратор
        const searchValue = state[searchField];

        if (!searchValue || searchValue.trim() === '') return data;

        const searchRules = [
        rules.searchMultipleFields(searchValue, ['data', 'customer', 'seller'], false)
     ];

     const compare = createComparison([], searchRules);
        
        return data.filter(row => compare(row, searchValue));
    };
}