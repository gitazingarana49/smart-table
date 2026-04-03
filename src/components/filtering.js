export function initFiltering(elements, option, render) {
    //Повесить событие на каждое поле фильтра
        Object.values(elements).forEach(el => {
            el.addEventListener('change', () => {
                if (typeof render === 'function') render(el);
            });
        });

    const updateIndexes = (elements, indexes) => {
    // @todo: #4.1 — заполнить выпадающие списки опциями
        Object.keys(indexes)                                    // Получаем ключи из объекта
        .forEach((elementName) => {                            // Перебираем по именам
           if (elements[elementName]) {
            const defaultOption = document.createElement('option');
            defaultOption.value = '';

            elements[elementName].replaceChildren(defaultOption);

            const options = Object.values(indexes[elementName])        // формируем массив имён, значений опций
                .map(name => {                           // используйте name как значение и текстовое содержимое
                    const option = document.createElement('option');// @todo: создать и вернуть тег опции
                    option.value = name;
                    option.textContent = name;

                    return option;
                });
                
                elements[elementName].append(...options);
            }
        })
    }

    const applyFiltering = (query, state, action) => {
    // @todo: #4.2 — обработать очистку поля
        if (action?.name === 'clear') {
            const fieldName = action.element?.dataset?.field;
            if (elements[fieldName]) {
                elements[fieldName].value = '';
                state[fieldName] = '';
            }
        }

    // @todo: #4.5 — отфильтровать данные используя компаратор
        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    }

    return {
        updateIndexes,
        applyFiltering
    }
}