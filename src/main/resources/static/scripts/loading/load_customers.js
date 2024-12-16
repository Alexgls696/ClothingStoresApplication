class Customer {
    constructor(customerId, firstName, lastName, email, phoneNumber, orderId) {
        this.customerId = customerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.orderId = orderId;
    }
}

const ip = location.host;

async function getCustomers(orderBy) {
    try {
        const response = await fetch(`http://${ip}/api/customers${orderBy}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const customersData = await response.json();
        const data = customersData.content;
        return data.map(customer => {
            return new Customer(
                customer.customerId,
                customer.firstName,
                customer.lastName,
                customer.email,
                customer.phoneNumber,
                customer.orderId
            );
        });
    } catch (error) {
        console.log(error);
    }
}

function showCustomers(customers) {
    const customersTable = document.getElementById('customers-table');
    customersTable.innerHTML = `
        <thead class="table-dark">
            <tr>
                <th id="customer-id-header" class="header">ID</th>
                <th id="customer-name-header" class="header">Имя</th>
                <th id="customer-surname-header" class="header">Фамилия</th>
                <th id="customer-email-header" class="header">Почта</th>
                <th id="customer-phoneNumber-header" class="header">Номер телефона</th>
                <th id="customer-orderId-header" class="header">ID заказа</th>
                <th>Удаление</th>
            </tr>
        </thead>`;
    let tbody = document.createElement('tbody');
    customers.forEach(customer => {
        tbody.innerHTML += `
            <tr>
                <td>${customer.customerId}</td>
                <td>${customer.firstName}</td>
                <td>${customer.lastName}</td>
                <td>${customer.email}</td>
                <td>${customer.phoneNumber}</td>
                <td>${customer.orderId}</td>
                <td>
                <button class="btn btn-danger btn-sm delete-button" data-id="${customer.customerId}">
                    Удалить
                </button>
            </td>
            </tr>`;
    });
    customersTable.appendChild(tbody);
    addRowClickListeners();
}

let sortCustomers = {
    id: '/asc',
    name: '/asc',
    surname: '/asc',
    email: '/asc',
    phoneNumber: '/asc',
    orderId: '/asc',
};

async function showSortedCustomers(orderBy) {
    customers = await getCustomers(orderBy);
    showCustomers(customers);
    addHeadersListeners();
}

function addHeadersListeners() {
    const id = document.getElementById('customer-id-header');
    const firstName = document.getElementById('customer-name-header');
    const lastName = document.getElementById('customer-surname-header');
    const email = document.getElementById('customer-email-header');
    const phoneNumber = document.getElementById('customer-phoneNumber-header');
    const orderId = document.getElementById('customer-orderId-header');

    id.addEventListener('click', async () => {
        sortCustomers.id = sortCustomers.id === '/asc' ? '/desc' : '/asc';
        await showSortedCustomers('/orderById' + sortCustomers.id);
    });

    firstName.addEventListener('click', async () => {
        sortCustomers.name = sortCustomers.name === '/asc' ? '/desc' : '/asc';
        await showSortedCustomers('/orderByFirstName' + sortCustomers.name);
    });

    lastName.addEventListener('click', async () => {
        sortCustomers.surname = sortCustomers.surname === '/asc' ? '/desc' : '/asc';
        await showSortedCustomers('/orderByLastName' + sortCustomers.surname);
    });

    email.addEventListener('click', async () => {
        sortCustomers.email = sortCustomers.email === '/asc' ? '/desc' : '/asc';
        await showSortedCustomers('/orderByEmail' + sortCustomers.email);
    });

    phoneNumber.addEventListener('click', async () => {
        sortCustomers.phoneNumber = sortCustomers.phoneNumber === '/asc' ? '/desc' : '/asc';
        await showSortedCustomers('/orderByPhoneNumber' + sortCustomers.phoneNumber);
    });

    orderId.addEventListener('click', async () => {
        sortCustomers.orderId = sortCustomers.orderId === '/asc' ? '/desc' : '/asc';
        await showSortedCustomers('/orderByOrderId' + sortCustomers.orderId);
    });
}

//---------------------------Редактирование строк--------------------------------------
function makeRowEditable(row) {
    const cells = Array.from(row.children);
    cells.forEach((cell, index) => {
        if (index > 0 && index < 6) { // Пропускаем ID
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
    const rows = document.querySelectorAll('#customers-table tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            if (!row.classList.contains('editable')) {
                makeRowEditable(row);
            }
        });
    });
}

function collectEditedData() {
    const rows = document.querySelectorAll('#customers-table tbody tr.editable');
    const editedData = [];
    rows.forEach(row => {
        const id = row.children[0].textContent.trim();
        const firstName = row.children[1].querySelector('input').value.trim();
        const lastName = row.children[2].querySelector('input').value.trim();
        const email = row.children[3].querySelector('input').value.trim();
        const phoneNumber = row.children[4].querySelector('input').value.trim();
        const orderId = row.children[5].querySelector('input').value.trim();
        editedData.push({ customerId: id, firstName, lastName, email, phoneNumber, orderId });
        makeRowReadOnly(row);
    });
    return editedData;
}

async function saveEditedData() {
    const editedData = collectEditedData();
    if (editedData.length > 0) {
        try {
            const response = await fetch(`http://${ip}/api/customers/updateAll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log('Изменения успешно сохранены');
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
        }
    } else {
        console.log('Нет данных для сохранения');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.createElement('button');
    const container = document.getElementById('actions-container');
    saveButton.textContent = 'Сохранить изменения';
    saveButton.classList.add('btn', 'btn-primary', 'mt-3');
    saveButton.addEventListener('click', saveEditedData);
    container.appendChild(saveButton);
    addDeleteAllButton('api/customers/deleteAll')
});

//Добавление-----------------------------------------------------------------------------------------------------------------------
function createCustomerModal() {
    const modalHtml = `
    <div class="modal" id="addCustomerModal" tabindex="-1" role="dialog" aria-labelledby="addCustomerModalLabel" aria-hidden="true" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog" role="document" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 5px; padding: 20px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addCustomerModalLabel">Добавить клиента</h5>
                    <button type="button" class="close" id="closeCustomerModalButton" aria-label="Close" style="border: none; background: none; font-size: 1.5rem; cursor: pointer;">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addCustomerForm">
                        <div class="form-group">
                            <label for="firstNameInput">Имя</label>
                            <input type="text" class="form-control" id="firstNameInput" placeholder="Введите имя клиента" required>
                        </div>
                        <div class="form-group">
                            <label for="lastNameInput">Фамилия</label>
                            <input type="text" class="form-control" id="lastNameInput" placeholder="Введите фамилию клиента" required>
                        </div>
                        <div class="form-group">
                            <label for="emailInput">Email</label>
                            <input type="email" class="form-control" id="emailInput" placeholder="Введите email клиента" required>
                        </div>
                        <div class="form-group">
                            <label for="phoneNumberInput">Номер телефона</label>
                            <input type="text" class="form-control" id="phoneNumberInput" placeholder="Введите номер телефона клиента" required>
                        </div>
                        <div class="form-group">
                            <label for="orderIdInput">ID заказа</label>
                            <input type="number" class="form-control" id="orderIdInput" placeholder="Введите ID заказа (опционально)">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelCustomerModalButton">Отмена</button>
                    <button type="button" class="btn btn-primary" id="saveCustomerButton">Сохранить</button>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Показ модального окна
function showCustomerModal() {
    const modal = document.getElementById('addCustomerModal');
    modal.style.display = 'block';
}

// Закрытие модального окна
function hideCustomerModal() {
    const modal = document.getElementById('addCustomerModal');
    modal.style.display = 'none';
}

// Логика добавления клиента
function addCustomerModalListener() {
    const saveButton = document.getElementById('saveCustomerButton');
    const cancelButton = document.getElementById('cancelCustomerModalButton');
    const closeButton = document.getElementById('closeCustomerModalButton');

    saveButton.addEventListener('click', async () => {
        const firstName = document.getElementById('firstNameInput').value.trim();
        const lastName = document.getElementById('lastNameInput').value.trim();
        const email = document.getElementById('emailInput').value.trim();
        const phoneNumber = document.getElementById('phoneNumberInput').value.trim();
        const orderId = document.getElementById('orderIdInput').value.trim();

        if (!firstName || !lastName || !email || !phoneNumber) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        const newCustomer = {
            firstName,
            lastName,
            email,
            phoneNumber,
            orderId: orderId || null, // Если ID заказа пустой, отправляем null
        };

        try {
            const response = await fetch(`http://${ip}/api/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCustomer),
            });

            if (!response.ok) {
                throw new Error(`Ошибка при добавлении клиента: ${response.status}`);
            }

            const addedCustomer = await response.json();
            customers.push(new Customer(
                addedCustomer.customerId,
                addedCustomer.firstName,
                addedCustomer.lastName,
                addedCustomer.email,
                addedCustomer.phoneNumber,
                addedCustomer.orderId
            ));

            showCustomers(customers);
            addHeadersListeners();

            hideCustomerModal(); // Закрытие модального окна
            document.getElementById('addCustomerForm').reset(); // Очистка формы
        } catch (error) {
            console.error('Ошибка при добавлении клиента:', error);
        }
    });

    // Закрытие модального окна при нажатии "Отмена" или "×"
    cancelButton.addEventListener('click', hideCustomerModal);
    closeButton.addEventListener('click', hideCustomerModal);
}

// Кнопка "Добавить"
function addCustomerButton() {
    const addButton = document.createElement('button');
    const container = document.getElementById('actions-container');
    addButton.textContent = 'Добавить клиента';
    addButton.classList.add('btn', 'btn-primary', 'mt-3');
    addButton.addEventListener('click', showCustomerModal); // Открытие модального окна
    container.appendChild(addButton);
}

//--------------------------------------------------------------------------------------

let customers = null;
(async () => {
    customers = await getCustomers('/orderById/asc');
    showCustomers(customers);
    addHeadersListeners();
    addDeleteButtonListeners('клиента','customers');

    createCustomerModal();
    addCustomerModalListener();
    addCustomerButton();
})();