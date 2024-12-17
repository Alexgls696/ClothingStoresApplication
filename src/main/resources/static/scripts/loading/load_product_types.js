class ProductType {
    constructor(typeId, typeName) {
        this.typeId = typeId;
        this.typeName = typeName;
    }
}

const ip = location.host;

async function getProductTypes(findBy,findValue,sortBy,sortType) {
    try {
        const response = await fetch(`http://${ip}/api/productTypes/findBy?findBy=${findBy}&findValue${findValue}&sortBy=${sortBy}&sortType=${sortType}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const productTypesData = await response.json();
        const data = productTypesData.content;
        return data.map(productType => {
            return new ProductType(productType.typeId, productType.typeName);
        });
    } catch (error) {
        console.log(error);
    }
}

async function showProductTypes(productTypes) {
    const productTypesTable = document.getElementById('product-types-table');
    let access = await checkRoleForDelete();

    productTypesTable.innerHTML = '<thead class="table-dark"><tr>' +
        '<th id="product-type-id-header" class="header">ID</th>' +
        '<th id="product-type-type-name-header" class="header">Название</th>' +
        (access ? '<th>Удаление</th>' : '') +
        '</tr></thead>';

    let tbody = document.createElement('tbody');
    productTypes.forEach(productType => {
        tbody.innerHTML += `<tr>
<td>${productType.typeId}</td>
<td>${productType.typeName}</td>
${access ? `<td>
<button class="btn btn-danger btn-sm delete-button" data-id="${productType.typeId}">
Удалить
</button>
</td>` : ''}
</tr>`;
    });
    productTypesTable.appendChild(tbody);
    addRowClickListeners();
}



let sortProductTypes = {
    id: 'asc',
    typeName: 'asc'
};

const FIND_BY = 'typeId';
let findBy = 'typeId';
let findValue = 0;

async function showSortedProductTypes(sortBy,sortType) {
    productTypes = await getProductTypes(findBy,findValue,sortBy,sortType);
    await showProductTypes(productTypes);
    addHeadersListeners();
}

function addHeadersListeners() {
    const id = document.getElementById('product-type-id-header');
    const typeName = document.getElementById('product-type-type-name-header');

    id.addEventListener('click', async () => {
        sortProductTypes.id = sortProductTypes.id === 'asc' ? 'desc' : 'asc';
        await showSortedProductTypes('typeId' , sortProductTypes.id);
    });

    typeName.addEventListener('click', async () => {
        sortProductTypes.typeName = sortProductTypes.typeName === 'asc' ? 'desc' : 'asc';
        await showSortedProductTypes('typeName' , sortProductTypes.typeName);
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
    const rows = document.querySelectorAll('#product-types-table tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            if (!row.classList.contains('editable')) {
                makeRowEditable(row);
            }
        });
    });
}

function collectEditedData() {
    const rows = document.querySelectorAll('#product-types-table tbody tr.editable');
    const editedData = [];
    rows.forEach(row => {
        const id = row.children[0].textContent.trim();
        const typeName = row.children[1].querySelector('input').value.trim();
        editedData.push({ typeId: id, typeName });
        makeRowReadOnly(row);
    });
    return editedData;
}

async function saveEditedData() {
    const editedData = collectEditedData();
    if (editedData.length > 0) {
        try {
            const response = await fetch(`http://${ip}/api/productTypes/updateAll`, {
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
    addDeleteAllButton('api/productTypes/deleteAll')
});
//--------------------------------------------------------------------------------------

function createProductTypeModal() {
    const modalHtml = `
    <div class="modal" id="addProductTypeModal" tabindex="-1" role="dialog" aria-labelledby="addProductTypeModalLabel" aria-hidden="true" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog" role="document" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 5px; padding: 20px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addProductTypeModalLabel">Добавить тип продукта</h5>
                    <button type="button" class="close" id="closeProductTypeModalButton" aria-label="Close" style="border: none; background: none; font-size: 1.5rem; cursor: pointer;">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addProductTypeForm">
                        <div class="form-group">
                            <label for="typeNameInput">Название типа</label>
                            <input type="text" class="form-control" id="typeNameInput" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelProductTypeModalButton">Отмена</button>
                    <button type="button" class="btn btn-primary" id="saveProductTypeButton">Сохранить</button>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function showProductTypeModal() {
    const modal = document.getElementById('addProductTypeModal');
    modal.style.display = 'block';
}

function hideProductTypeModal() {
    const modal = document.getElementById('addProductTypeModal');
    modal.style.display = 'none';
}

function addProductTypeModalListener() {
    const saveButton = document.getElementById('saveProductTypeButton');
    const cancelButton = document.getElementById('cancelProductTypeModalButton');
    const closeButton = document.getElementById('closeProductTypeModalButton');

    saveButton.addEventListener('click', async () => {
        const typeName = document.getElementById('typeNameInput').value.trim();

        if (!typeName) {
            alert('Пожалуйста, заполните название типа.');
            return;
        }

        const newProductType = {
            typeName
        };

        try {
            const response = await fetch(`http://${ip}/api/productTypes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProductType),
            });

            if (!response.ok) {
                throw new Error(`Ошибка при добавлении типа продукта: ${response.status}`);
            }

            const addedProductType = await response.json();
            productTypes.push(new ProductType(
                addedProductType.typeId,
                addedProductType.typeName
            ));

            await showProductTypes(productTypes);
            addHeadersListeners();

            hideProductTypeModal();
            document.getElementById('addProductTypeForm').reset();
        } catch (error) {
            console.error('Ошибка при добавлении типа продукта:', error);
        }
    });

    cancelButton.addEventListener('click', hideProductTypeModal);
    closeButton.addEventListener('click', hideProductTypeModal);
}

function addProductTypeButton() {
    const addButton = document.createElement('button');
    const container = document.getElementById('actions-container');
    addButton.textContent = 'Добавить тип продукта';
    addButton.classList.add('btn', 'btn-primary', 'mt-3');
    addButton.addEventListener('click', showProductTypeModal);
    container.appendChild(addButton);
}

let productTypes = null;
(async () => {
    productTypes = await getProductTypes(findBy, '0', 'typeId', 'asc');
    await showProductTypes(productTypes);
    addHeadersListeners();
    await addDeleteButtonListeners('тип товара', 'productTypes');

    createProductTypeModal();
    addProductTypeModalListener();
    addProductTypeButton();
})();