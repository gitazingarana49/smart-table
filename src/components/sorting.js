import { sortMap } from "../lib/sort.js";
export function initSorting(columns, render) {
    Object.values(columns).forEach(column => {
        column.addEventListener('click', () => {
            if (typeof render === 'function') {
                render(column);
            }
        });
    });
        return (query, state, action) => {
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
        } else { // Если это обычный рендер, ищем активную колонку
            columns.forEach(column => {
                if (column.dataset.value && column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        const sort = (field && order !== 'none') ? `${field}:${order}` : null; // сохраним в переменную параметр сортировки в виде field:direction

        return sort ? Object.assign({}, query, { sort }) : query; // по общему принципу, если есть сортировка, добавляем, если нет, то не трогаем query 
    };
}







/*
    return (query, state, action) => {
        let field = null;
        let order = 'none';

        if (action && action.tagName === 'TH') {
            field = action.dataset.name;

            const currentOrder = action.dataset.order || 'none';
            order = sortMap[currentOrder];

            action.dataset.order = order;

            Object.values(columns).forEach(col => {
                if (col !== action) col.dataset.order = 'none';
            });
        }
        else {
            const activeCol = Object.values(columns).find(c => c.dataset.order && c.dataset.order !== 'none');
                if(activeCol) {
                    field = activeCol.dataset.name;
                    order =activeCol.dataset.order;
                }
            }

            const apiOrder = order === 'up' ? 'asc' : (order === 'down' ? 'desc' : null);

    */