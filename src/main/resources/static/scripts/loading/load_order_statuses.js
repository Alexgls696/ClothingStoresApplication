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




async function showOrderStatuses(orderStatuses) {
    const orderStatusesTable = document.getElementById('order-statuses-table');
    let access = await checkRoleForDelete();

    orderStatusesTable.innerHTML = '<thead class="table-dark"><tr>' +
        '<th id="order-status-id-header" class="header">ID</th>' +
        '<th id="order-status-status-name-header" class="header">Статус</th>' +
        (access ? '<th>Удаление</th>' : '') +
        '</tr></thead>';

    let tbody = document.createElement('tbody');
    orderStatuses.forEach(orderStatus => {
        tbody.innerHTML += `<tr>
<td>${orderStatus.id}</td>
<td>${orderStatus.name}</td>
${access ? `<td>
<button class="btn btn-danger btn-sm delete-button" data-id="${orderStatus.id}">
Удалить
</button>
</td>` : ''}
</tr>`;
    });

    orderStatusesTable.appendChild(tbody);
    addRowClickListeners();
}


const FIND_BY = 'id';
let findBy = 'id';
let findValue = 0;

let sortOrderStatuses = {
    id: 'asc',
    name: 'asc',
};

async function showSortedOrderStatuses(sortBy,sortType) {
    orderStatuses = await getOrderStatuses(findBy,findValue,sortBy,sortType);
    await showOrderStatuses(orderStatuses);
    addHeadersListeners();
}

function addHeadersListeners() {
    const id = document.getElementById('order-status-id-header');
    const name = document.getElementById('order-status-status-name-header');

    id.addEventListener('click', async () => {
        sortOrderStatuses.id = sortOrderStatuses.id === 'asc' ? 'desc' : 'asc';
        await showSortedOrderStatuses('id'  ,sortOrderStatuses.id);
    });

    name.addEventListener('click', async () => {
        sortOrderStatuses.name = sortOrderStatuses.name === 'asc' ? 'desc' : 'asc';
        await showSortedOrderStatuses('name'  ,sortOrderStatuses.name);
    });
}

//---------------------------Редактирование строк--------------------------------------
function makeRowEditable(row) {
    const cells = Array.from(row.children);
    cells.forEach((cell, index) => {
        if (index > 0 && index < 2) { // Пропускаем ID
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
    const rows = document.querySelectorAll('#order-statuses-table tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            if (!row.classList.contains('editable')) {
                makeRowEditable(row);
            }
        });
    });
}

function collectEditedData() {
    const rows = document.querySelectorAll('#order-statuses-table tbody tr.editable');
    const editedData = [];
    rows.forEach(row => {
        const id = row.children[0].textContent.trim();
        const name = row.children[1].querySelector('input').value.trim();
        editedData.push({ id: id, name });
        makeRowReadOnly(row);
    });
    return editedData;
}

async function saveEditedData() {
    const editedData = collectEditedData();
    if (editedData.length > 0) {
        try {
            const response = await fetch(`http://${ip}/api/orderStatuses/updateAll`, {
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
    addDeleteAllButton('api/orderStatuses/deleteAll')
});
//--------------------------------------------------------------------------------------

function createOrderStatusModal() {
    const modalHtml = `
    <div class="modal" id="addOrderStatusModal" tabindex="-1" role="dialog" aria-labelledby="addOrderStatusModalLabel" aria-hidden="true" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog" role="document" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 5px; padding: 20px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addOrderStatusModalLabel">Добавить статус заказа</h5>
                    <button type="button" class="close" id="closeOrderStatusModalButton" aria-label="Close" style="border: none; background: none; font-size: 1.5rem; cursor: pointer;">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addOrderStatusForm">
                        <div class="form-group">
                            <label for="nameInput">Название статуса</label>
                            <input type="text" class="form-control" id="nameInput" placeholder="Введите название статуса" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelOrderStatusModalButton">Отмена</button>
                    <button type="button" class="btn btn-primary" id="saveOrderStatusButton">Сохранить</button>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function showOrderStatusModal() {
    const modal = document.getElementById('addOrderStatusModal');
    modal.style.display = 'block';
}

function hideOrderStatusModal() {
    const modal = document.getElementById('addOrderStatusModal');
    modal.style.display = 'none';
}

function addOrderStatusModalListener() {
    const saveButton = document.getElementById('saveOrderStatusButton');
    const cancelButton = document.getElementById('cancelOrderStatusModalButton');
    const closeButton = document.getElementById('closeOrderStatusModalButton');

    saveButton.addEventListener('click', async () => {
        const name = document.getElementById('nameInput').value.trim();

        if (!name) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        const newOrderStatus = {
            name
        };

        try {
            const response = await fetch(`http://${ip}/api/orderStatuses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOrderStatus),
            });



            if (!response.ok) {
                let data =  await response.json()
                console.log(response);
                showError(data.message)
                closeButton.click();
                return
            }

            const addedOrderStatus = await response.json();
            orderStatuses.push(new OrderStatus(
                addedOrderStatus.id,
                addedOrderStatus.name
            ));

            await showOrderStatuses(orderStatuses);
            addHeadersListeners();
            await addDeleteButtonListener('orderStatuses',name);
            hideOrderStatusModal();
            document.getElementById('addOrderStatusForm').reset();
        } catch (error) {
            console.error('Ошибка при добавлении статуса заказа:', error);
        }
    });

    cancelButton.addEventListener('click', hideOrderStatusModal);
    closeButton.addEventListener('click', hideOrderStatusModal);
}

function addOrderStatusButton() {
    const addButton = document.createElement('button');
    const container = document.getElementById('actions-container');
    addButton.textContent = 'Добавить статус заказа';
    addButton.classList.add('btn', 'btn-primary', 'mt-3');
    addButton.addEventListener('click', showOrderStatusModal);
    container.appendChild(addButton);
}

function addSearchButtonListener(sortBy){
    document.getElementById('searchButton').addEventListener('click', async function() {
        findBy = document.getElementById('searchField').value;
        findValue = document.getElementById('searchInput').value;
        categories = await getOrderStatuses(findBy,findValue,sortBy,'asc');
        await showOrderStatuses(categories);
        await addDeleteButtonListeners('статус заказа', 'orderStatuses');
        addHeadersListeners();
    });
}

let orderStatuses = null;
(async () => {
    orderStatuses = await getOrderStatuses(findBy,'0','id','asc');
    await showOrderStatuses(orderStatuses);
    addHeadersListeners();
    await addDeleteButtonListeners('статус заказа', 'orderStatuses');

    createOrderStatusModal();
    addOrderStatusModalListener();
    addOrderStatusButton();
    addSearchButtonListener('id');
})();