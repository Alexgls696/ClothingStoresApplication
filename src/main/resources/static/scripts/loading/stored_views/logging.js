class Log{
    constructor(id,log,time) {
        this.id = id;
        this.log = log;
        this.time = time;
    }
}

const ip = location.host;

async function getAll(sortBy, sortType,pageNumber) {
    try {
        const response = await fetch(`http://${ip}/api/logs/sort?sortBy=${sortBy}&sortType=${sortType}&pageNumber=${pageNumber}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const logData = await response.json();
        const data =  logData.content;
        return data.map(entry => {
            return new Log(
                entry.id,
                entry.log,
                entry.time
            );
        });
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

async function showAll(logs) {
    const table = document.getElementById('logs-table');

    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }

    table.innerHTML = '<thead class="table-dark"><tr>' +
        '<th class="header" id="id-header">ID</th>' +
        '<th class="header" id="log-header">Запись</th>' +
        '<th class="header" id="log-date-header">Дата</th>' +
        '</tr></thead>';
    let tbody = document.createElement('tbody');
    logs.forEach(entry => {
        tbody.innerHTML += `<tr>
<td>${entry.id}</td>
<td>${entry.log}</td>
<td>${entry.time}</td>
</tr>`;
    });
    table.appendChild(tbody);
    addHeadersListeners();
}


async function getAllCount(){
    try{
        const response  = await fetch(`http://${ip}/api/logs/count`);
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
            logs = await getAll(sortBy,sortType,i);
            await showAll(logs);
        });
        page.textContent = i+1+'';
        if(i===0){
            selected = page;
            page.setAttribute('id','selected-page');
            logs = await getAll(sortBy,sortType,i);
            await showAll(logs);
        }
        paginationContainer.appendChild(page);
    }
}


let sortCustomerProducts = {
    id: 'asc',
    log: 'asc',
    time: 'asc'
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
        log: document.getElementById('log-header'),
        time: document.getElementById('log-date-header')
    };

    let keys = Object.keys(headers);
    keys.forEach(key => {
        headers[key].addEventListener('click', async () => {
            sortCustomerProducts[key] = sortCustomerProducts[key] === 'asc' ? 'desc' : 'asc';
            await showSortedCustomersAndProducts(key, sortCustomerProducts[key]);
        });
    });
}

let logs = null;
(async () => {
    await showAllWithPagination('id','asc');
    await addDeleteAllButton('api/logs/deleteAll')
})();
