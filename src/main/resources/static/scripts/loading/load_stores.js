class Store {
    constructor(storeId, location) {
        this.storeId = storeId;
        this.location = location;
    }
}

const ip = location.host;

async function getStores(findBy,findValue,sortBy,sortType) {
    try {
        const response = await fetch(`http://${ip}/api/stores/findBy?findBy=${findBy}&findValue=${findValue}&sortBy=${sortBy}&sortType=${sortType}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const storesData = await response.json();
        const data = storesData.content;
        return data.map(store => {
            return new Store(store.storeId, store.location);
        });
    } catch (error) {
        console.log(error);
    }
}

let sortStores = {
    id: 'asc',
    location: 'asc',
};

const FIND_BY = 'storeId';
let findBy = 'storeId';
let findValue = 0;

async function showSortedStores(sortBy,sortType) {
    stores = await getStores(findBy,findValue,sortBy,sortType);
    await showStores(stores);
    addHeadersListeners();
}

function addHeadersListeners() {
    const id = document.getElementById('stores-id-header');
    const location = document.getElementById('stores-location-header');

    id.addEventListener('click', async () => {
        sortStores.id = sortStores.id === 'asc' ? 'desc' : 'asc';
        await showSortedStores('storeId' , sortStores.id);
    });

    location.addEventListener('click', async () => {
        sortStores.location = sortStores.location === 'asc' ? 'desc' : 'asc';
        await showSortedStores('location' , sortStores.location);
    });
}

async function showStores(stores) {
    const storesTable = document.getElementById('stores-table');
    let access = await checkRoleForDelete();

    storesTable.innerHTML = `
        <thead class="table-dark">
            <tr>
                <th id="stores-id-header" class="header">ID</th>
                <th id="stores-location-header" class="header">Местоположение</th>
                ${access ? '<th>Удаление</th>' : ''}
            </tr>
        </thead>`;

    let tbody = document.createElement('tbody');
    stores.forEach(store => {
        tbody.innerHTML += `
            <tr>
                <td>${store.storeId}</td>
                <td>${store.location}</td>
                ${access ? `<td>
                <button class="btn btn-danger btn-sm delete-button" data-id="${store.storeId}">
                    Удалить
                </button>
                </td>` : ''}
            </tr>`;
    });

    storesTable.appendChild(tbody);
    addRowClickListeners();
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
    const rows = document.querySelectorAll('#stores-table tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            if (!row.classList.contains('editable')) {
                makeRowEditable(row);
            }
        });
    });
}

function collectEditedData() {
    const rows = document.querySelectorAll('#stores-table tbody tr.editable');
    const editedData = [];
    rows.forEach(row => {
        const id = row.children[0].textContent.trim();
        const location = row.children[1].querySelector('input').value.trim();
        editedData.push({ storeId: id, location });
        makeRowReadOnly(row);
    });
    return editedData;
}

async function saveEditedData() {
    const editedData = collectEditedData();
    if (editedData.length > 0) {
        try {
            const response = await fetch(`http://${ip}/api/stores/updateAll`, {
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
    addDeleteAllButton('api/stores/deleteAll')
});
//--------------------------------------------------------------------------------------
function createStoreModal() {
    const modalHtml = `
    <div class="modal" id="addStoreModal" tabindex="-1" role="dialog" aria-labelledby="addStoreModalLabel" aria-hidden="true" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog" role="document" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 5px; padding: 20px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addStoreModalLabel">Добавить магазин</h5>
                    <button type="button" class="close" id="closeStoreModalButton" aria-label="Close" style="border: none; background: none; font-size: 1.5rem; cursor: pointer;">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addStoreForm">
                        <div class="form-group">
                            <label for="locationInput">Местоположение</label>
                            <input type="text" class="form-control" id="locationInput" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelStoreModalButton">Отмена</button>
                    <button type="button" class="btn btn-primary" id="saveStoreButton">Сохранить</button>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function showStoreModal() {
    const modal = document.getElementById('addStoreModal');
    modal.style.display = 'block';
}

function hideStoreModal() {
    const modal = document.getElementById('addStoreModal');
    modal.style.display = 'none';
}

function addStoreModalListener() {
    const saveButton = document.getElementById('saveStoreButton');
    const cancelButton = document.getElementById('cancelStoreModalButton');
    const closeButton = document.getElementById('closeStoreModalButton');

    saveButton.addEventListener('click', async () => {
        const location = document.getElementById('locationInput').value.trim();

        if (!location) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        const newStore = {
            location
        };

        try {
            const response = await fetch(`http://${ip}/api/stores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStore),
            });

            if (!response.ok) {
                let data =  await response.json()
                showError(data.message)
                return
            }

            const addedStore = await response.json();
            stores.push(new Store(addedStore.storeId, addedStore.location));

            await showStores(stores);
            addHeadersListeners();
            await addDeleteButtonListener('stores',location);
            hideStoreModal();
            document.getElementById('addStoreForm').reset();
        } catch (error) {
            console.error('Ошибка при добавлении магазина:', error);
        }
    });

    cancelButton.addEventListener('click', hideStoreModal);
    closeButton.addEventListener('click', hideStoreModal);
}

function addStoreButton() {
    const addButton = document.createElement('button');
    const container = document.getElementById('actions-container');
    addButton.textContent = 'Добавить магазин';
    addButton.classList.add('btn', 'btn-primary', 'mt-3');
    addButton.addEventListener('click', showStoreModal);
    container.appendChild(addButton);
}

function addSearchButtonListener(sortBy){
    document.getElementById('searchButton').addEventListener('click', async function() {
        findBy = document.getElementById('searchField').value;
        findValue = document.getElementById('searchInput').value;
        categories = await getStores(findBy,findValue,sortBy,'asc');
        await showStores(categories);
        await addDeleteButtonListeners('магазин','stores');
        addHeadersListeners();
    });
}

let stores = null;
(async () => {
    stores = await getStores(findBy, '0', 'storeId', 'asc');
    await showStores(stores);
    addHeadersListeners();
    await addDeleteButtonListeners('магазин','stores');

    createStoreModal();
    addStoreModalListener();
    addStoreButton();
    addSearchButtonListener('storeId');
})();