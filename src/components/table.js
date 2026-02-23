import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    before.reverse().forEach(subNAme => {
        root[subNAme] = cloneTemplate(subNAme);
        root.container.append(root[subNAme].container);
    });

    after.forEach(subNAme => {
        root[subNAme] = cloneTemplate(subNAme);
        root.container.append(root[subNAme].container);
    });


    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', () => {
        setTimeout(() => {
        onAction();
    });
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);

            Object.keys(item).forEach(key => {
                if (row.elements && key in row.elements) {
                    const element = row.elements[key];

                    const tagName = element.tagName.toLowerCase();
                    const isInput = tagName === 'input' || tagName === 'select' || tagName === 'textarea';

                    if (isInput) {
                        element.value = item[key];
                    } else {
                        element.textContent = item[key];
                    }
                }
            });
            
            return row.container;
        });
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}