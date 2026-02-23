import {sortCollection, sortMap} from "../lib/sort.js";
export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = 'none';

        // 1. Определяем текущее поле и направление сортировки
        if (action?.name === 'sort' && action.element) {
            const element = action.element;

            const currentOrder = element.dataset.value || 'none';
            const nextOrder = sortMap[currentOrder];

            element.dataset.value = nextOrder;
            field = element.dataset.field;
            order = nextOrder;

            // Сбрасываем остальные колонки
            columns.forEach(column => {
                if (column !== element) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            // Если это обычный рендер, ищем активную колонку
            columns.forEach(column => {
                if (column.dataset.value && column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        // 2. ВАЖНО: Если сортировка не активна, ВСЕГДА возвращаем исходные данные
        if (!field || order === 'none') {
            return data;
        }
        // 3. Вызываем функцию сортировки (убедитесь, что она импортирована)
        // Если sortCollection вернет undefined, возвращаем data, чтобы не упала пагинация
        return sortCollection(data, field, order) || data;
    };
}
    /*
    return (data, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки
            const element = action.element;
            const nextOrder = sortMap[element.dataset.value] || 'asc';

            element.dataset.value = nextOrder;   // Сохраним и применим как текущее следующее состояние из карты
            field = action.dataset.field;                            // Информация о сортируемом поле есть также в кнопке
            order = nextOrder;                            // Направление заберём прямо из датасета для точности


            // @todo: #3.2 — сбросить сортировки остальных колонок
            columns.forEach(column => {                                    // Перебираем элементы (в columns у нас массив кнопок)
                if (column.dataset.field !== element.dataset.field) {    // Если это не та кнопка, что нажал пользователь
                    column.dataset.value = 'none';                        // тогда сбрасываем её в начальное состояние
                }
            });
            
        } else {
            // @todo: #3.3 — получить выбранный режим сортировки
            columns.forEach(column => {                        // Перебираем все наши кнопки сортировки
                if (column.dataset.value !== 'none') {        // Ищем ту, что находится не в начальном состоянии (предполагаем, что одна)
                    field = column.dataset.field;            // Сохраняем в переменных поле
                    order = column.dataset.value;            // и направление сортировки
                }
            });
        }

        return sortCollection(data, field, order);
    }
        */
