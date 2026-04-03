export function initSearching(searchField) {
    return (query, state, _action) => {
        if (state[searchField]) {
            return  Object.assign({}, query, { // проверяем, что в поле поиска было что-то введено
            search: state[searchField],
            page: 1 // устанавливаем в query параметр
            }); // если поле с поиском пустое, просто возвращаем query без изменений
        } 
    return query; 
    };
}