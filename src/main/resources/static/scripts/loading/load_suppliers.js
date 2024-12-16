class Supplier {
    constructor(supplierId, supplierName) {
        this.supplierId = supplierId;
        this.supplierName = supplierName;
    }
}

const ip = location.host;

async function getSuppliers(orderBy) {
    try {
        const response = await fetch(`http://${ip}/api/suppliers${orderBy}`);
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
    id: '/asc',
    name: '/asc',
};

async function showSortedSuppliers(orderBy) {
    suppliers = await getSuppliers(orderBy);
    showSuppliers(suppliers);
    addHeadersListeners();
}

function addHeadersListeners() {
    const id = document.getElementById('supplier-id-header');
    const name = document.getElementById('supplier-name-header');

    id.addEventListener('click', async () => {
        sortSuppliers.id = sortSuppliers.id === '/asc' ? '/desc' : '/asc';
        await showSortedSuppliers('/orderById' + sortSuppliers.id);
    });

    name.addEventListener('click', async () => {
        sortSuppliers.name = sortSuppliers.name === '/asc' ? '/desc' : '/asc';
        await showSortedSuppliers('/orderBySupplierName' + sortSuppliers.name);
    });
}

function showSuppliers(suppliers) {
    const suppliersTable = document.getElementById('suppliers-table');
    suppliersTable.innerHTML = `
        <thead class="table-dark">
            <tr>
                <th id="supplier-id-header" class="header">ID</th>
                <th id="supplier-name-header" class="header">Название</th>
                <th>Удаление</th>
            </tr>
        </thead>`;
    let tbody = document.createElement('tbody');
    suppliers.forEach(supplier => {
        tbody.innerHTML += `
            <tr>
                <td>${supplier.supplierId}</td>
                <td>${supplier.supplierName}</td>
                <td>
                 <button class="btn btn-danger btn-sm delete-button" data-id="${supplier.supplierId}">
                    Удалить
                </button>
                </td>
            </tr>`;
    });
    suppliersTable.appendChild(tbody);
    addRowClickListeners();
}

//---------------------------Редактирование строк--------------------------------------
function makeRowEditable(row) {
    const cells = Array.from(row.children);
    cells.forEach((cell, index) => {
        if (index > 0) { // Пропускаем ID
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
                throw new Error(`Ошибка при добавлении поставщика: ${response.status}`);
            }

            const addedSupplier = await response.json();
            suppliers.push(new Supplier(addedSupplier.supplierId, addedSupplier.supplierName));

            showSuppliers(suppliers);
            addHeadersListeners();

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

let suppliers = null;
(async () => {
    suppliers = await getSuppliers('/orderById/asc');
    showSuppliers(suppliers);
    addHeadersListeners();
    addDeleteButtonListeners('производителя','suppliers');

    createSupplierModal();
    addSupplierModalListener();
    addSupplierButton();
})();