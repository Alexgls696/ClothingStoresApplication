class Supplier {
    constructor(supplierId, supplierName) {
        this.supplierId = supplierId;
        this.supplierName = supplierName;
    }
}

const ip = location.host;

async function getSuppliers(findBy,findValue,sortBy,sortType) {
    try {
        const response = await fetch(`http://${ip}/api/suppliers/findBy?findBy=${findBy}&findValue=${findValue}&sortBy=${sortBy}&sortType=${sortType}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const suppliersData = await response.json();
        const data = suppliersData.content;
        return data.map(supplier => {
            return new Supplier(supplier.supplierId, supplier.supplierName);
        });
    } catch (error) {
        console.log(error);
    }
}

let sortSuppliers = {
    id: 'asc',
    name: 'asc',
};

const FIND_BY = 'supplierId';
let findBy = 'supplierId';
let findValue = 0;

async function showSortedSuppliers(sortBy,sortType) {
    suppliers = await getSuppliers(findBy,findValue,sortBy,sortType);
    await showSuppliers(suppliers);
    addHeadersListeners();
}

function addHeadersListeners() {
    const id = document.getElementById('supplier-id-header');
    const name = document.getElementById('supplier-name-header');

    id.addEventListener('click', async () => {
        sortSuppliers.id = sortSuppliers.id === 'asc' ? 'desc' : 'asc';
        await showSortedSuppliers('supplierId',  sortSuppliers.id);
    });

    name.addEventListener('click', async () => {
        sortSuppliers.name = sortSuppliers.name === 'asc' ? 'desc' : 'asc';
        await showSortedSuppliers('supplierName' , sortSuppliers.name);
    });
}

async function showSuppliers(suppliers) {
    const suppliersTable = document.getElementById('suppliers-table');
    let access = await checkRoleForDelete();

    suppliersTable.innerHTML = `
        <thead class="table-dark">
            <tr>
                <th id="supplier-id-header" class="header">ID</th>
                <th id="supplier-name-header" class="header">Название</th>
                ${access ? '<th>Удаление</th>' : ''}
            </tr>
        </thead>`;

    let tbody = document.createElement('tbody');
    suppliers.forEach(supplier => {
        tbody.innerHTML += `
            <tr>
                <td>${supplier.supplierId}</td>
                <td>${supplier.supplierName}</td>
                ${access ? `<td>
                 <button class="btn btn-danger btn-sm delete-button" data-id="${supplier.supplierId}">
                    Удалить
                </button>
                </td>` : ''}
            </tr>`;
    });

    suppliersTable.appendChild(tbody);
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
        if (index > 0 && index < 2) { // Пропускаем ID
            const input = cell.querySelector('input');
            if (input) {
                cell.textContent = input.value.trim();
            }
        }
    });
    row.classList.remove('editable');
}

function addRowClickListeners() {
    const rows = document.querySelectorAll('#suppliers-table tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            if (!row.classList.contains('editable')) {
                makeRowEditable(row);
            }
        });
    });
}

function collectEditedData() {
    const rows = document.querySelectorAll('#suppliers-table tbody tr.editable');
    const editedData = [];
    rows.forEach(row => {
        const id = row.children[0].textContent.trim();
        const name = row.children[1].querySelector('input').value.trim();
        editedData.push({ supplierId: id, supplierName: name });
        makeRowReadOnly(row);
    });
    return editedData;
}

async function saveEditedData() {
    const editedData = collectEditedData();
    if (editedData.length > 0) {
        try {
            const response = await fetch(`http://${ip}/api/suppliers/updateAll`, {
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
    addDeleteAllButton('api/suppliers/deleteAll')
});
//--------------------------------------------------------------------------------------

function createSupplierModal() {
    const modalHtml = `
    <div class="modal" id="addSupplierModal" tabindex="-1" role="dialog" aria-labelledby="addSupplierModalLabel" aria-hidden="true" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog" role="document" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 5px; padding: 20px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addSupplierModalLabel">Добавить поставщика</h5>
                    <button type="button" class="close" id="closeSupplierModalButton" aria-label="Close" style="border: none; background: none; font-size: 1.5rem; cursor: pointer;">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addSupplierForm">
                        <div class="form-group">
                            <label for="supplierIdInput">ID поставщика</label>
                            <input type="number" class="form-control" id="supplierIdInput" required>
                        </div>
                        <div class="form-group">
                            <label for="supplierNameInput">Название поставщика</label>
                            <input type="text" class="form-control" id="supplierNameInput" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelSupplierModalButton">Отмена</button>
                    <button type="button" class="btn btn-primary" id="saveSupplierButton">Сохранить</button>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function showSupplierModal() {
    const modal = document.getElementById('addSupplierModal');
    modal.style.display = 'block';
}

function hideSupplierModal() {
    const modal = document.getElementById('addSupplierModal');
    modal.style.display = 'none';
}

function addSupplierModalListener() {
    const saveButton = document.getElementById('saveSupplierButton');
    const cancelButton = document.getElementById('cancelSupplierModalButton');
    const closeButton = document.getElementById('closeSupplierModalButton');

    saveButton.addEventListener('click', async () => {
        const supplierName = document.getElementById('supplierNameInput').value.trim();

        if (!supplierName) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        const newSupplier = {
            supplierName
        };

        try {
            const response = await fetch(`http://${ip}/api/suppliers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSupplier),
            });

            if (!response.ok) {
                let data =  await response.json()
                showError(data.message)
                closeButton.click();
                return
            }

            const addedSupplier = await response.json();
            suppliers.push(new Supplier(addedSupplier.supplierId, addedSupplier.supplierName));

            await showSuppliers(suppliers);
            addHeadersListeners();
            await addDeleteButtonListener('suppliers',supplierName);
            hideSupplierModal();
            document.getElementById('addSupplierForm').reset();
        } catch (error) {
            console.error('Ошибка при добавлении поставщика:', error);
        }
    });
    cancelButton.addEventListener('click', hideSupplierModal);
    closeButton.addEventListener('click', hideSupplierModal);
}

function addSupplierButton() {
    const addButton = document.createElement('button');
    const container = document.getElementById('actions-container');
    addButton.textContent = 'Добавить поставщика';
    addButton.classList.add('btn', 'btn-primary', 'mt-3');
    addButton.addEventListener('click', showSupplierModal);
    container.appendChild(addButton);
}

function addSearchButtonListener(sortBy){
    document.getElementById('searchButton').addEventListener('click', async function() {
        findBy = document.getElementById('searchField').value;
        findValue = document.getElementById('searchInput').value;
        categories = await getSuppliers(findBy,findValue,sortBy,'asc');
        await showSuppliers(categories);
        await addDeleteButtonListeners('производителя','suppliers');
        addHeadersListeners();
    });
}

let suppliers = null;
(async () => {
    suppliers = await getSuppliers(findBy, '0', 'supplierId', 'asc');
    await showSuppliers(suppliers);
    addHeadersListeners();
    await addDeleteButtonListeners('производителя','suppliers');

    createSupplierModal();
    addSupplierModalListener();
    addSupplierButton();
    addSearchButtonListener('supplierId');
})();