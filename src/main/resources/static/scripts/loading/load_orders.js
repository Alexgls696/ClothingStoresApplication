class Order {
    constructor(id, date, store, status) {
        this.id = id;
        this.date = date;
        this.store = store;
        this.status = status;
    }
}

class Store {
    constructor(id, location) {
        this.id = id;
        this.location = location;
    }
}

class OrderStatus {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

const ip = location.host;

async function getOrderStatuses(findBy,findValue,sortBy,sortType) {
    try {
        const response = await fetch(`http://${ip}/api/orderStatuses/findBy?findBy=${findBy}&findValue=${findValue}&sortBy=${sortBy}&sortType=${sortType}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const orderStatusesData = await response.json();
        const data = orderStatusesData.content;
        return data.map(orderStatus => {
            return new OrderStatus(orderStatus.id, orderStatus.name);
        });
    } catch (error) {
        console.log(error);
    }
}

async function getStores(findBy,findValue,sortBy,sortType) {
    try {
        const response = await fetch(`http://${ip}/api/stores/findBy?findBy=${findBy}&findValue=${findValue}&sortBy=${sortBy}&sortType=${sortType}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const storesData = await response.json();
        const data = storesData.content;
        return data.map(store => {
            return new Store(store.id, store.location);
        });
    } catch (error) {
        console.log(error);
    }
}

async function getOrders(findBy,findValue,sortBy,sortType) {
    try {
        const response = await fetch(`http://${ip}/api/orders/findBy?findBy=${findBy}&findValue=${findValue}&sortBy=${sortBy}&sortType=${sortType}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const ordersData = await response.json();
        const data = ordersData.content;
        return data.map(order => {
            return new Order(order.id, order.date, order.store, order.status);
        });
    } catch (error) {
        console.log(error);
    }
}


async function addForeignKeysInEditorTable(){
    let stores  = await getStores('location','','location','asc');
    let statuses = await getOrderStatuses('statusName','','name','asc');
    orders.forEach(order=>{
        const storesEditContainer = document.getElementById(`store-edit-${order.id}`);
        stores.forEach(store=>{
            storesEditContainer.innerHTML+=`<option value='${JSON.stringify(store)}' 
            ${store.id===order.store.id ? `selected = "selected"` : ``}>${store.location} </option>`
        });

        const statusEditContainer = document.getElementById(`status-edit-${order.id}`);
        statuses.forEach(status=>{
            statusEditContainer.innerHTML+=`<option value='${JSON.stringify(status)}' 
            ${status.id===order.status.id ? `selected = "selected"` : ``}>${status.name} </option>`
        });
    });
}

async function addForeignKeysInEditorTableAndAddForm(){
    let stores = await getStores('location','','location','asc');
    let statuses = await getOrderStatuses('statusName','','name','asc');

    let storesContainer = document.getElementById('store');
    let statusesContainer = document.getElementById('status');
    stores.forEach(store=>{
        storesContainer.innerHTML+=`<option value='${JSON.stringify(store)}'>${store.location}</option>`
    })
    statuses.forEach(status=>{
        statusesContainer.innerHTML+=`<option value='${JSON.stringify(status)}'>${status.name}</option>`
    });
    await addForeignKeysInEditorTable();
}

async function showOrders(orders) {
    const ordersTable = document.getElementById('orders-table');
    let access = await checkRoleForDelete();

    ordersTable.innerHTML = '<thead class="table-dark"><tr>' +
        '<th id="order-id-header" class="header">ID</th>' +
        '<th id="order-date-header" class="header">Дата заказа</th>' +
        '<th id="order-store-header" class="header">Магазин</th>' +
        '<th id="order-status-header" class="header">Статус заказа</th>' +
        (access ? '<th>Удаление</th>' : '') +
        '</tr></thead>';

    let tbody = document.createElement('tbody');
    orders.forEach(order => {
        tbody.innerHTML += `<tr>
<td>${order.id}</td>
<td>${order.date}</td>
<td> <select id="store-edit-${order.id}" class="form-select"></select></div></td>
<td> <select id="status-edit-${order.id}" class="form-select"></select></div></td>
${access ? `<td>
<button class="btn btn-danger btn-sm delete-button" data-id="${order.id}">
Удалить
</button>
</td>` : ''}
</tr>`;
    });
    ordersTable.appendChild(tbody);
    addRowClickListeners();
}


let sortOrders = {
    id: 'asc',
    date: 'asc',
    store: 'asc',
    status: 'asc'
};

const FIND_BY = 'id';
let findBy = 'id';
let findValue = 0;

async function showSortedOrders(sortBy,sortType) {
    orders = await getOrders(findBy,findValue,sortBy,sortType);
    await showOrders(orders);
    addHeadersListeners();
    await addForeignKeysInEditorTable();
}

function addHeadersListeners() {
    const id = document.getElementById('order-id-header');
    const date = document.getElementById('order-date-header');
    const store = document.getElementById('order-store-header');
    const status = document.getElementById('order-status-header');

    id.addEventListener('click', async () => {
        sortOrders.id = sortOrders.id === 'asc' ? 'desc' : 'asc';
        await showSortedOrders('id' , sortOrders.id);
    });

    date.addEventListener('click', async () => {
        sortOrders.date = sortOrders.date === 'asc' ? 'desc' : 'asc';
        await showSortedOrders('date' , sortOrders.date);
    });

    store.addEventListener('click', async () => {
        sortOrders.store = sortOrders.store === 'asc' ? 'desc' : 'asc';
        await showSortedOrders('storeLocation' , sortOrders.store);
    });

    status.addEventListener('click', async () => {
        sortOrders.status = sortOrders.status === 'asc' ? 'desc' : 'asc';
        await showSortedOrders('statusName',  sortOrders.status);
    });
}

//---------------------------Редактирование строк--------------------------------------
function makeRowEditable(row) {
    const cells = Array.from(row.children);
    cells.forEach((cell, index) => {
        if (index > 0 && index < 2 ) { // Пропускаем ID
            const input = document.createElement('input');
            input.type = 'text';
            input.value = cell.textContent.trim();
            cell.innerHTML = '';
            cell.appendChild(input);
        }
    });
    row.classList.add('editable');
}

function makeRowReadOnly(row) {
    const cells = Array.from(row.children);
    cells.forEach((cell, index) => {
        if (index > 0) { // Пропускаем ID
            const input = cell.querySelector('input');
            if (input) {
                cell.textContent = input.value.trim();
            }
        }
    });
    row.classList.remove('editable');
}

function addRowClickListeners() {
    const rows = document.querySelectorAll('#orders-table tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            if (!row.classList.contains('editable')) {
                makeRowEditable(row);
            }
        });
    });
}

function collectEditedData() {
    const rows = document.querySelectorAll('#orders-table tbody tr.editable');
    const editedData = [];
    rows.forEach(row => {
        const id = row.children[0].textContent.trim();
        const date = row.children[1].querySelector('input').value.trim();
        const store = JSON.parse(document.getElementById(`store-edit-${id}`).value);
        const status = JSON.parse(document.getElementById(`status-edit-${id}`).value);
        editedData.push({id: id, date, store, status});
        makeRowReadOnly(row);
    });
    return editedData;
}

async function saveEditedData() {
    const editedData = collectEditedData();
    if (editedData.length > 0) {
        try {
            const response = await fetch(`http://${ip}/api/orders/updateAll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedData),
            });
            if (!response.ok) {
                let data =  await response.json()
                showError(data.message)
                return
            }
            console.log('Изменения успешно сохранены');
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
        }
    } else {
        console.log('Нет данных для сохранения');
    }
}

// Добавляем кнопку для сохранения изменений
document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.createElement('button');
    const container = document.getElementById('actions-container');
    saveButton.textContent = 'Сохранить изменения';
    saveButton.classList.add('btn', 'btn-primary', 'mt-3');
    saveButton.addEventListener('click', saveEditedData);
    container.appendChild(saveButton);
    addDeleteAllButton('api/orders/deleteAll')
});

//--------------------------------------------------------------------------------------

async function createOrderModal() {
    const modalHtml = `
    <div class="modal" id="addOrderModal" tabindex="-1" role="dialog" aria-labelledby="addOrderModalLabel" aria-hidden="true" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog" role="document" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 5px; padding: 20px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addOrderModalLabel">Добавить заказ</h5>
                    <button type="button" class="close" id="closeOrderModalButton" aria-label="Close" style="border: none; background: none; font-size: 1.5rem; cursor: pointer;">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addOrderForm">
                        <div class="form-group">
                            <label for="orderDateInput">Дата заказа</label>
                            <input type="date" class="form-control" id="orderDateInput" required>
                        </div>
                        <div class="form-group">
                            <label for="storeInput">Магазин</label>
                           <select id="store" class="form-select"></select>
                        </div>
                        <div class="form-group">
                            <label for="statusInput">Статус заказа</label>
                          <select id="status" class="form-select"></select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelOrderModalButton">Отмена</button>
                    <button type="button" class="btn btn-primary" id="saveOrderButton">Сохранить</button>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

   await addForeignKeysInEditorTableAndAddForm();
}

function showOrderModal() {
    const modal = document.getElementById('addOrderModal');
    modal.style.display = 'block';
}

function hideOrderModal() {
    const modal = document.getElementById('addOrderModal');
    modal.style.display = 'none';
}

function addOrderModalListener() {
    const saveButton = document.getElementById('saveOrderButton');
    const cancelButton = document.getElementById('cancelOrderModalButton');
    const closeButton = document.getElementById('closeOrderModalButton');

    saveButton.addEventListener('click', async () => {
        const date = document.getElementById('orderDateInput').value.trim();
        let store = document.getElementById('store').value;
        let status = document.getElementById('status').value;

        if (!date || !store || !status) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        store = JSON.parse(store);
        status = JSON.parse(status);
        const newOrder = {
            date,
            store,
            status
        };

        try {
            const response = await fetch(`http://${ip}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOrder),
            });

            if (!response.ok) {
                let data =  await response.json()
                showError(data.message)
                closeButton.click();
                return
            }

            const addedOrder = await response.json();
            orders.push(new Order(
                addedOrder.id,
                addedOrder.orderDate,
                addedOrder.store,
                addedOrder.status
            ));

            await showOrders(orders);
            addHeadersListeners();
            await addDeleteButtonListener('orders','заказ');
            hideOrderModal();
            await addForeignKeysInEditorTable();
            document.getElementById('addOrderForm').reset();
        } catch (error) {
            console.error('Ошибка при добавлении заказа:', error);
        }
    });

    cancelButton.addEventListener('click', hideOrderModal);
    closeButton.addEventListener('click', hideOrderModal);
}

function addOrderButton() {
    const addButton = document.createElement('button');
    const container = document.getElementById('actions-container');
    addButton.textContent = 'Добавить заказ';
    addButton.classList.add('btn', 'btn-primary', 'mt-3');
    addButton.addEventListener('click', showOrderModal);
    container.appendChild(addButton);
}

function addSearchButtonListener(sortBy){
    document.getElementById('searchButton').addEventListener('click', async function() {
        findBy = document.getElementById('searchField').value;
        findValue = document.getElementById('searchInput').value;
        categories = await getOrders(findBy,findValue,sortBy,'asc');
        await showOrders(categories);
        await addDeleteButtonListeners('заказ', 'orders');
        addHeadersListeners();
    });
}

let orders = null;
(async () => {
    orders = await getOrders(findBy,'0','id','asc');
    await showOrders(orders);
    addHeadersListeners();
    await addDeleteButtonListeners('заказ', 'orders');

    createOrderModal();
    addOrderModalListener();
    addOrderButton();
    addSearchButtonListener('id');
})();