import './fonts/ys-display/fonts.css'
import './style.css'

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";
import {initTable} from "./components/table.js";
import { initSearching } from './components/searching.js';
import { initSorting } from './components/sorting.js';
import {initFiltering} from './components/filtering.js';
import { initPagination } from './components/pagination.js';

/**Собирает текующее состояние полей поиска, всех фильтров и пагинации из DOM-дерева.
 * Преобразует строковые значения (FromData) в числа для корректной работы API.
 * @returns {Object} объект состояния {rowPerPage: number, page: number...}
 */
function collectState() {
   // const formElement = document.querySelector('form.table') || sampleTable.querySelector.container()
    const state = processFormData(new FormData(sampleTable.container));

    const rowsPerPage = parseInt(state.rowsPerPage);    // приведём количество страниц к числу
    const page = parseInt(state.page ?? 1);            // номер страницы по умолчанию 1 и тоже число

    return {                                          
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Инициализация компонента таблицы
 * Регестрирует шаблны и порядок отображения самостоятельных блоков: поиск, фильтры, пагинация
 */
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);                                 // передаем функцию перерисовки как колбэк на любые изменения в таблице

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);


//Инициализация слоя данных используемых в render()
const API = initData();

/**
 * Инициализация модулей логики
 * Каждый модуль возвращает функцию по типу applyNameOfAction, которая модифицурует объект запроса (query) перед отправкой на сервер
 */
const applySearch = initSearching('search', render);

const applySorting = initSorting([        // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
], render);

const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);

const { applyPagination, updatePagination } = initPagination(
    sampleTable.pagination.elements,             // передаём сюда элементы пагинации, найденные в шаблоне
    (el, page, isCurrent) => {                    // и колбэк, чтобы заполнять кнопки страниц данными
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

/**Главная функция отрисовки
 * Вызывается при любом действии пользователя (клик по странице, ввод в поиской строке, смена фильтра)
 * @param {HTMLButtonElement?} action Перерисовка состояния таблицы при любых изменениях
 */
async function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let query = {
        limit: state.rowsPerPage || 10,
        page: state.page || 1
    };            // инициализация объекта для GET-параметров запроса
    
    //напоняем объект данными о странице
    query = applyPagination(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySearch(query, state, action);
    query = applySorting(query, state, action);

    // ЛОГ 1: Смотрим, какой запрос улетает на сервер
    //запрос к серверу через обертку API
    const { total, items } = await API.getRecords(query);
    //обнавляем визуальное состояние пагинации и отрисовываем строки таблицы
    updatePagination(total, query);
    sampleTable.render(items);
}

/**
 * Начальная загрузка данных, необходимая для работы интерфейса
 */

async function init() {
    const indexes = await API.getIndexes();

    //заполняем фильтры данными, полученными с сервера
    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
}

//запуск приложения: сначала загружаются индексы, потом отрисовывается таблица
document.addEventListener('DOMContentLoaded', () => {
    init().then(render);
});

