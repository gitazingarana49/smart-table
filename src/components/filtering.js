export function initFiltering(elements) {
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
        const target = action?.target || action;
    // @todo: #4.2 — обработать очистку поля
        if (target && (target.name === 'clear' || target.dataset?.name === 'clear')) {
            const fieldName = action.dataset?.field;

            if (fieldName && elements[fieldName]) {
                elements[fieldName].value = '';
                state[fieldName] = '';

                delete query[`filter[${fieldName}]`];
            }
        }

    // @todo: #4.5 — отфильтровать данные используя компаратор
        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                } else {
                    delete query[`filter[${elements[key].name}]`];
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    }

    document.addEventListener('click', (e) => {
    // Ищем кнопку очистки, даже если кликнули по иконке внутри неё
    const clearBtn = e.target.closest('button[name="clear"]');
    if (clearBtn) {
        e.preventDefault();
        
        // Находим поле, которое нужно очистить
        const fieldName = clearBtn.dataset.field;
        const input = document.querySelector(`[name="${fieldName}"]`);
        
        if (input) {
            input.value = ''; // Очищаем поле
            // Имитируем отправку формы, чтобы сработал onAction в table.js
            clearBtn.closest('form').dispatchEvent(new SubmitEvent('submit', {
                submitter: clearBtn,
                bubbles: true,
                cancelable: true
            }));
        }
    }
});

    return {
        updateIndexes,
        applyFiltering
    }
}