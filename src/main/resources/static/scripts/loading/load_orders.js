class Order {
    constructor(orderId, orderDate, storeId, statusId) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.storeId = storeId;
        this.statusId = statusId;
    }
}

const ip = location.host;

async function getOrders(findBy,findValue,sortBy,sortType) {
    try {
        const response = await fetch(`http://${ip}/api/orders/findBy?findBy=${findBy}&findValue${findValue}&sortBy=${sortBy}&sortType=${sortType}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const ordersData = await response.json();
        const data = ordersData.content;
        return data.map(order => {
            return new Order(order.orderId, order.orderDate, order.storeId, order.statusId);
        });
    } catch (error) {
        console.log(error);
    }
}




async function showOrders(orders) {
    const ordersTable = document.getElementById('orders-table');
    let access = await checkRoleForDelete();

    ordersTable.innerHTML = '<thead class="table-dark"><tr>' +
        '<th id="order-id-header" class="header">ID</th>' +
        '<th id="order-date-header" class="header">Дата заказа</th>' +
        '<th id="order-store-header" class="header">ID Магазина</th>' +
        '<th id="order-status-header" class="header">ID Статуса</th>' +
        (access ? '<th>Удаление</th>' : '') +
        '</tr></thead>';

    let tbody = document.createElement('tbody');
    orders.forEach(order => {
        tbody.innerHTML += `<tr>
<td>${order.orderId}</td>
<td>${order.orderDate}</td>
<td>${order.storeId}</td>
<td>${order.statusId}</td>
${access ? `<td>
<button class="btn btn-danger btn-sm delete-button" data-id="${order.orderId}">
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
    storeId: 'asc',
    statusId: 'asc'
};

const FIND_BY = 'orderId';
let findBy = 'orderId';
let findValue = 0;

async function showSortedOrders(sortBy,sortType) {
    orders = await getOrders(findBy,findValue,sortBy,sortType);
    await showOrders(orders);
    addHeadersListeners();
}

function addHeadersListeners() {
    const id = document.getElementById('order-id-header');
    const date = document.getElementById('order-date-header');
    const storeId = document.getElementById('order-store-header');
    const statusId = document.getElementById('order-status-header');

    id.addEventListener('click', async () => {
        sortOrders.id = sortOrders.id === 'asc' ? 'desc' : 'asc';
        await showSortedOrders('orderId' , sortOrders.id);
    });

    date.addEventListener('click', async () => {
        sortOrders.date = sortOrders.date === 'asc' ? 'desc' : 'asc';
        await showSortedOrders('orderDate' , sortOrders.date);
    });

    storeId.addEventListener('click', async () => {
        sortOrders.storeId = sortOrders.storeId === 'asc' ? 'desc' : 'asc';
        await showSortedOrders('storeId' , sortOrders.storeId);
    });

    statusId.addEventListener('click', async () => {
        sortOrders.statusId = sortOrders.statusId === 'asc' ? 'desc' : 'asc';
        await showSortedOrders('statusId',  sortOrders.statusId);
    });
}

//---------------------------Редактирование строк--------------------------------------
function makeRowEditable(row) {
    const cells = Array.from(row.children);
    cells.forEach((cell, index) => {
        if (index > 0 && index < 4) { // Пропускаем ID
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
        const orderDate = row.children[1].querySelector('input').value.trim();
        const storeId = row.children[2].querySelector('input').value.trim();
        const statusId = row.children[3].querySelector('input').value.trim();
        editedData.push({orderId: id, orderDate, storeId, statusId});
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

function createOrderModal() {
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
                            <label for="storeIdInput">ID магазина</label>
                            <input type="number" class="form-control" id="storeIdInput" required>
                        </div>
                        <div class="form-group">
                            <label for="statusIdInput">ID статуса</label>
                            <input type="number" class="form-control" id="statusIdInput" required>
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
        const orderDate = document.getElementById('orderDateInput').value.trim();
        const storeId = document.getElementById('storeIdInput').value.trim();
        const statusId = document.getElementById('statusIdInput').value.trim();

        if (!orderDate || !storeId || !statusId) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        const newOrder = {
            orderDate,
            storeId,
            statusId
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
                addedOrder.orderId,
                addedOrder.orderDate,
                addedOrder.storeId,
                addedOrder.statusId
            ));

            await showOrders(orders);
            addHeadersListeners();
            await addDeleteButtonListener('orders','заказ');
            hideOrderModal();
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

let orders = null;
(async () => {
    orders = await getOrders(findBy,'0','orderId','asc');
    await showOrders(orders);
    addHeadersListeners();
    await addDeleteButtonListeners('заказ', 'orders');

    createOrderModal();
    addOrderModalListener();
    addOrderButton();
})();