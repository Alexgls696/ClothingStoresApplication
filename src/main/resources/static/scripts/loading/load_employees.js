class Employee {
    constructor(id, firstName, lastName, store, position, email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.store = store;
        this.position = position;
        this.email = email;
    }
}

const ip = location.host;

async function getEmployees(findBy, findValue, sortBy, sortType) {
    try {
        const response = await fetch(`http://${ip}/api/employees/findBy?findBy=${findBy}&findValue=${findValue}&sortBy=${sortBy}&sortType=${sortType}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const employeesData = await response.json();
        const data = employeesData.content;
        return data.map(employee => {
            return new Employee(employee.id, employee.firstName,
                employee.lastName, employee.store, employee.position, employee.email);
        });
    } catch (error) {
        console.log(error);
    }
}

let sortEmployees = {
    id: 'asc',
    name: 'asc',
    surname: 'asc',
    email: 'asc',
    storeId: 'asc',
    position: 'asc'
};


async function addForeignKeysInEditorTable(){
    let stores  = await getStores('location','','location','asc');
    employees.forEach(employee=>{
        const storesEditContainer = document.getElementById(`store-edit-${employee.id}`);
        stores.forEach(store=>{
            storesEditContainer.innerHTML+=`<option value='${JSON.stringify(store)}' 
            ${store.id===employee.store.id ? `selected = "selected"` : ``}>${store.location} </option>`
        })
    });
}

async function addForeignKeysInEditorTableAndAddForm(){
    let stores = await getStores('location','','location','asc');
    let storeContainer = document.getElementById('store');

    stores.forEach(store=>{
        storeContainer.innerHTML+=`<option value='${JSON.stringify(store)}'>${store.location}</option>`
    })

    await addForeignKeysInEditorTable();
}

async function showEmployees(employees) {
    const employeesTable = document.getElementById('employees-table');
    let access = await checkRoleForDelete();
    employeesTable.innerHTML = '<thead class="table-dark"><tr>' +
        '<th id="employee-id-header" class="header">ID</th>' +
        '<th id="employee-name-header" class="header">Имя</th>' +
        '<th id="employee-surname-header" class="header">Фамилия</th>' +
        '<th id="employee-storeId-header" class="header">Магазин</th>' +
        '<th id="employee-position-header" class="header">Должность</th>' +
        '<th id="employee-email-header" class="header">Почта</th>' +
        (access ? '<th>Удаление</th>' : '') + // Условно добавляем заголовок столбца
        '</tr></thead>';
    let tbody = document.createElement('tbody');
    employees.forEach(employee => {
        tbody.innerHTML += `<tr>
<td>${employee.id}</td>
<td>${employee.firstName}</td>
<td>${employee.lastName}</td>
<td> <select id="store-edit-${employee.id}" class="form-select"></select></div></td>
<td>${employee.position}</td>
<td>${employee.email}</td>
${access ? `<td>
<button class="btn btn-danger btn-sm delete-button" data-id="${employee.id}">
Удалить
</button>
</td>` : ''} 
</tr>`;
    });
    employeesTable.appendChild(tbody);
    addRowClickListeners();
}


const FIND_BY = 'id';

let findBy = 'id';
let findValue = 0;

async function showSortedEmployees(sortBy,sortType) {
    employees = await getEmployees(findBy,findValue,sortBy,sortType);
    await showEmployees(employees);
    await addForeignKeysInEditorTable();
    addHeadersListeners();
}

function addHeadersListeners() {
    const id = document.getElementById('employee-id-header');
    const firstName = document.getElementById('employee-name-header');
    const lastName = document.getElementById('employee-surname-header');
    const email = document.getElementById('employee-email-header');
    const storeId = document.getElementById('employee-storeId-header');
    const position = document.getElementById('employee-position-header');

    id.addEventListener('click', async () => {
        sortEmployees.id = sortEmployees.id === 'asc' ? 'desc' : 'asc';
        await showSortedEmployees('id', sortEmployees.id);
    });

    firstName.addEventListener('click', async () => {
        sortEmployees.name = sortEmployees.name === 'asc' ? 'desc' : 'asc';
        await showSortedEmployees('firstName', sortEmployees.name);
    });

    lastName.addEventListener('click', async () => {
        sortEmployees.surname = sortEmployees.surname === 'asc' ? 'desc' : 'asc';
        await showSortedEmployees('lastName', sortEmployees.surname);
    });

    email.addEventListener('click', async () => {
        sortEmployees.email = sortEmployees.email === 'asc' ? 'desc' : 'asc';
        await showSortedEmployees('email', sortEmployees.email);
    });

    storeId.addEventListener('click', async () => {
        sortEmployees.storeId = sortEmployees.storeId === 'asc' ? 'desc' : 'asc';
        await showSortedEmployees('storeLocation', sortEmployees.storeId);
    });

    position.addEventListener('click', async () => {
        sortEmployees.position = sortEmployees.position === 'asc' ? 'desc' : 'asc';
        await showSortedEmployees('position', sortEmployees.position);
    });
}

//---------------------------Редактирование строк--------------------------------------
function makeRowEditable(row) {
    const cells = Array.from(row.children);
    cells.forEach((cell, index) => {
        if (index > 0 && index < 6 && index !==3) { // Пропускаем ID
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
    const rows = document.querySelectorAll('#employees-table tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            if (!row.classList.contains('editable')) {
                makeRowEditable(row);
            }
        });
    });
}

function collectEditedData() {
    const rows = document.querySelectorAll('#employees-table tbody tr.editable');
    const editedData = [];
    rows.forEach(row => {
        const id = row.children[0].textContent.trim();
        const firstName = row.children[1].querySelector('input').value.trim();
        const lastName = row.children[2].querySelector('input').value.trim();
        const store = JSON.parse(document.getElementById(`store-edit-${id}`).value);
        const position = row.children[4].querySelector('input').value.trim();
        const email = row.children[5].querySelector('input').value.trim();
        editedData.push({id: id, firstName, lastName, store, position, email});
        makeRowReadOnly(row);
    });
    return editedData;
}

async function saveEditedData() {
    const editedData = collectEditedData();
    if (editedData.length > 0) {
        try {
            const response = await fetch(`http://${ip}/api/employees/updateAll`, {
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
    addDeleteAllButton('api/employees/deleteAll')
});
//--------------------------------------------------------------------------------------

class Store {
    constructor(id, location) {
        this.id = id;
        this.location = location;
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

// Создание модального окна для добавления сотрудника
async function createEmployeeModal() {
    const modalHtml = `
    <div class="modal" id="addEmployeeModal" tabindex="-1" role="dialog" aria-labelledby="addEmployeeModalLabel" aria-hidden="true" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog" role="document" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 5px; padding: 20px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addEmployeeModalLabel">Добавить сотрудника</h5>
                    <button type="button" class="close" id="closeEmployeeModalButton" aria-label="Close" style="border: none; background: none; font-size: 1.5rem; cursor: pointer;">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addEmployeeForm">
                        <div class="form-group">
                            <label for="firstNameInput">Имя</label>
                            <input type="text" class="form-control" id="firstNameInput" placeholder="Введите имя сотрудника" required>
                        </div>
                        <div class="form-group">
                            <label for="lastNameInput">Фамилия</label>
                            <input type="text" class="form-control" id="lastNameInput" placeholder="Введите фамилию сотрудника" required>
                        </div>
                        <div class="form-group">
                            <label for="storeIdInput">Магазин</label>
                             <select id="store" class="form-select"></select>
                        </div>
                        <div class="form-group">
                            <label for="positionInput">Должность</label>
                            <input type="text" class="form-control" id="positionInput" placeholder="Введите должность сотрудника" required>
                        </div>
                        <div class="form-group">
                            <label for="emailInput">Email</label>
                            <input type="email" class="form-control" id="emailInput" placeholder="Введите email сотрудника" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelEmployeeModalButton">Отмена</button>
                    <button type="button" class="btn btn-primary" id="saveEmployeeButton">Сохранить</button>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

   await addForeignKeysInEditorTableAndAddForm();
}

// Показ модального окна
function showEmployeeModal() {
    const modal = document.getElementById('addEmployeeModal');
    modal.style.display = 'block';
}

// Закрытие модального окна
function hideEmployeeModal() {
    const modal = document.getElementById('addEmployeeModal');
    modal.style.display = 'none';
}

// Логика добавления сотрудника
function addEmployeeModalListener() {
    const saveButton = document.getElementById('saveEmployeeButton');
    const cancelButton = document.getElementById('cancelEmployeeModalButton');
    const closeButton = document.getElementById('closeEmployeeModalButton');

    saveButton.addEventListener('click', async () => {
        const firstName = document.getElementById('firstNameInput').value.trim();
        const lastName = document.getElementById('lastNameInput').value.trim();
        let store = document.getElementById('store').value;
        const position = document.getElementById('positionInput').value.trim();
        const email = document.getElementById('emailInput').value.trim();

        if (!firstName || !lastName || !position || !email) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        store = JSON.parse(store);

        const newEmployee = {
            firstName,
            lastName,
            store,
            position,
            email
        };

        try {
            const response = await fetch(`http://${ip}/api/employees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEmployee),
            });

            if (!response.ok) {
                let data =  await response.json()
                showError(data.message)
                closeButton.click();
                return
            }

            const addedEmployee = await response.json();
            employees.push(new Employee(
                addedEmployee.id,
                addedEmployee.firstName,
                addedEmployee.lastName,
                addedEmployee.store,
                addedEmployee.position,
                addedEmployee.email
            ));

            await showEmployees(employees);
            addHeadersListeners();
            await addForeignKeysInEditorTable();
            await addDeleteButtonListener('employees',firstName+" "+lastName);
            hideEmployeeModal(); // Закрытие модального окна
            document.getElementById('addEmployeeForm').reset(); // Очистка формы
        } catch (error) {
            console.error('Ошибка при добавлении сотрудника:', error);
        }
    });

    // Закрытие модального окна при нажатии "Отмена" или "×"
    cancelButton.addEventListener('click', hideEmployeeModal);
    closeButton.addEventListener('click', hideEmployeeModal);
}

function addEmployeeButton() {
    const addButton = document.createElement('button');
    const container = document.getElementById('actions-container');
    addButton.textContent = 'Добавить сотрудника';
    addButton.classList.add('btn', 'btn-primary', 'mt-3');
    addButton.addEventListener('click', showEmployeeModal); // Открытие модального окна
    container.appendChild(addButton);
}

function addSearchButtonListener(sortBy){
    document.getElementById('searchButton').addEventListener('click', async function() {
        findBy = document.getElementById('searchField').value;
        findValue = document.getElementById('searchInput').value;
        categories = await getEmployees(findBy,findValue,sortBy,'asc');
        await showEmployees(categories);
        await addDeleteButtonListeners('сотрудника', 'employees');
        addHeadersListeners();
    });
}

let employees = null;
(async () => {
    employees = await getEmployees('id', '0', 'id', 'asc');
    await showEmployees(employees);
    addHeadersListeners();
    await addDeleteButtonListeners('сотрудника', 'employees');

    createEmployeeModal();
    addEmployeeModalListener();
    addEmployeeButton();
    addSearchButtonListener('id');
})();