
export function initSearching(searchField, render) {
    const input = document.querySelector(`[data-name="${searchField}"] input`);

    if (input && render) {
        input.addEventListener('input', () => {
            render(input);
        });
    }

    return (query, state, _action) => {
        return state[searchField] ? Object.assign({}, query, { // проверяем, что в поле поиска было что-то введено
            search: state[searchField] // устанавливаем в query параметр
        }) : query; // если поле с поиском пустое, просто возвращаем query без изменений
    }
}