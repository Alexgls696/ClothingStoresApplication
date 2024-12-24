class Error{
    constructor(id,error,error_date) {
        this.id = id;
        this.error = error;
        this.error_date = error_date;
    }
}

const ip = location.host;

async function getAll(sortBy, sortType,pageNumber) {
    try {
        const response = await fetch(`http://${ip}/api/errors/sort?sortBy=${sortBy}&sortType=${sortType}&pageNumber=${pageNumber}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const errorData = await response.json();
        const data =  errorData.content;
        return data.map(entry => {
            return new Error(
                entry.id,
                entry.error,
                entry.timestamp
            );
        });
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

async function showAll(errors) {
    const table = document.getElementById('errors-table');

    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }

    table.innerHTML = '<thead class="table-dark"><tr>' +
        '<th class="header" id="id-header">ID</th>' +
        '<th class="header" id="error-header">Ошибка</th>' +
        '<th class="header" id="error-date-header">Дата</th>' +
        '</tr></thead>';
    let tbody = document.createElement('tbody');
    errors.forEach(entry => {
        tbody.innerHTML += `<tr>
<td>${entry.id}</td>
<td>${entry.error}</td>
<td>${entry.error_date}</td>
</tr>`;
    });
    table.appendChild(tbody);
    addHeadersListeners();
}


async function getAllCount(){
    try{
        const response  = await fetch(`http://${ip}/api/errors/count`);
        const data = await response.json();
        console.log(data);
        return data;
    }catch (error){
        console.log(error);
    }
}

let selected;
const ROWS_ON_SCREEN = 40;

const paginationContainer = document.getElementById('pagination-container');

async function showAllWithPagination(sortBy,sortType){
    let allCount = await getAllCount();
    let pageCount = Math.ceil(allCount/ROWS_ON_SCREEN);
    for(let i = 0; i < pageCount; i++){
        const page = document.createElement('p');
        page.addEventListener('click',async ()=>{
            selected.removeAttribute('id');
            selected = page;
            page.setAttribute('id','selected-page');
            errors = await getAll(sortBy,sortType,i);
            await showAll(errors);
        });
        page.textContent = i+1+'';
        if(i===0){
            selected = page;
            page.setAttribute('id','selected-page');
            errors = await getAll(sortBy,sortType,i);
            await showAll(errors);
        }
        paginationContainer.appendChild(page);
    }
}


let sortCustomerProducts = {
    id: 'asc',
    error: 'asc',
    timestamp: 'asc'
};


async function showSortedCustomersAndProducts(sortBy, sortType) {
    while (paginationContainer.hasChildNodes()){
        paginationContainer.removeChild(paginationContainer.firstChild);
    }
    selected.removeAttribute("id");
    await showAllWithPagination(sortBy,sortType);
}

function addHeadersListeners() {
    const headers = {
        id: document.getElementById('id-header'),
        error: document.getElementById('error-header'),
        timestamp: document.getElementById('error-date-header')
    };

    let keys = Object.keys(headers);
    keys.forEach(key => {
        headers[key].addEventListener('click', async () => {
            sortCustomerProducts[key] = sortCustomerProducts[key] === 'asc' ? 'desc' : 'asc';
            await showSortedCustomersAndProducts(key, sortCustomerProducts[key]);
        });
    });
}

let errors = null;
(async () => {
    await showAllWithPagination('id','asc');
    await addDeleteAllButton('api/errors/deleteAll')
})();
