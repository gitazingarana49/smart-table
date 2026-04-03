import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = 'none';

        const clickedColumn = columns.find(col => col === action);

        if (clickedColumn) {
            field = clickedColumn.dataset.name.replace('sortBy', '').toLowerCase();

            const currentOrder = clickedColumn.dataset.order || 'none';
            order = sortMap[currentOrder];

            clickedColumn.dataset.order = order;

            columns.forEach(col => {
                if (col !== clickedColumn) col.dataset.order = 'none';
            });
            } else {
                const activeCol = columns.find(c => c.dataset.order && c.dataset.order !== 'none');

                if (activeCol) {
                    field = activeCol.dataset.name.replace('sortBy', '').toLowerCase();
                    order = activeCol.dataset.order;
                }
            }

        const sort = (field && order !== 'none') ? `${field}:${order}` : null; // сохраним в переменную параметр сортировки в виде field:direction

        return sort ? Object.assign({}, query, { sort }) : query; // по общему принципу, если есть сортировка, добавляем, если нет, то не трогаем query 
    };
}
