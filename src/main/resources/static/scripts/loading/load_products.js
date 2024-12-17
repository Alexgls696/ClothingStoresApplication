class Product {
    constructor(productId, productName, price, categoryId, typeId, supplierId) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.categoryId = categoryId;
        this.typeId = typeId;
        this.supplierId = supplierId;
    }
}

const ip = location.host;

async function getProducts(findBy,findValue,sortBy,sortType) {
    try {
        const response = await fetch(`http://${ip}/api/products/findBy?findBy=${findBy}&findValue${findValue}&sortBy=${sortBy}&sortType=${sortType}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const productsData = await response.json();
        const data = productsData.content;
        return data.map(product => {
            return new Product(
                product.productId,
                product.productName,
                product.price,
                product.categoryId,
                product.typeId,
                product.supplierId
            );
        });
    } catch (error) {
        console.log(error);
    }
}

let sortProducts = {
    id: 'asc',
    productName: 'asc',
    price: 'asc',
    categoryId: 'asc',
    typeId: 'asc',
    supplierId: 'asc'
};


const FIND_BY = 'productId';
let findBy = 'productId';
let findValue = 0;

async function showSortedProducts(sortBy,sortType) {
    products = await getProducts(findBy,findValue,sortBy,sortType)
    await showProducts(products);
    addHeadersListeners();
}

function addHeadersListeners() {
    const id = document.getElementById('product-id-header');
    const productName = document.getElementById('product-name-header');
    const price = document.getElementById('product-price-header');
    const categoryId = document.getElementById('product-categoryId-header');
    const typeId = document.getElementById('product-typeId-header');
    const supplierId = document.getElementById('product-supplierId-header');

    id.addEventListener('click', async () => {
        sortProducts.id = sortProducts.id === 'asc' ? 'desc' : 'asc';
        await showSortedProducts('productId',  sortProducts.id);
    });

    productName.addEventListener('click', async () => {
        sortProducts.productName = sortProducts.productName === 'asc' ? 'desc' : 'asc';
        await showSortedProducts('productName' , sortProducts.productName);
    });

    price.addEventListener('click', async () => {
        sortProducts.price = sortProducts.price === 'asc' ? 'desc' : 'asc';
        await showSortedProducts('price' , sortProducts.price);
    });

    categoryId.addEventListener('click', async () => {
        sortProducts.categoryId = sortProducts.categoryId === 'asc' ? 'desc' : 'asc';
        await showSortedProducts('categoryId',  sortProducts.categoryId);
    });

    typeId.addEventListener('click', async () => {
        sortProducts.typeId = sortProducts.typeId === 'asc' ? 'desc' : 'asc';
        await showSortedProducts('typeId' , sortProducts.typeId);
    });

    supplierId.addEventListener('click', async () => {
        sortProducts.supplierId = sortProducts.supplierId === '/asc' ? '/desc' : '/asc';
        await showSortedProducts('supplierId' , sortProducts.supplierId);
    });
}

async function showProducts(products) {
    const productsTable = document.getElementById('products-table');
    let access = await checkRoleForDelete();

    productsTable.innerHTML = `
        <thead class="table-dark">
            <tr>
                <th id="product-id-header" class="header">ID</th>
                <th id="product-name-header" class="header">Название</th>
                <th id="product-price-header" class="header">Цена</th>
                <th id="product-categoryId-header" class="header">ID Категории</th>
                <th id="product-typeId-header" class="header">ID Типа продукта</th>
                <th id="product-supplierId-header" class="header">ID Производителя</th>
                ${access ? '<th>Удаление</th>' : ''}
            </tr>
        </thead>`;

    let tbody = document.createElement('tbody');
    products.forEach(product => {
        tbody.innerHTML += `
            <tr>
                <td>${product.productId}</td>
                <td>${product.productName}</td>
                <td>${product.price}</td>
                <td>${product.categoryId}</td>
                <td>${product.typeId}</td>
                <td>${product.supplierId}</td>
                ${access ? `<td>
<button class="btn btn-danger btn-sm delete-button" data-id="${product.productId}">
Удалить
</button>
</td>` : ''}
            </tr>`;
    });

    productsTable.appendChild(tbody);
    addRowClickListeners();
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
    const rows = document.querySelectorAll('#products-table tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            if (!row.classList.contains('editable')) {
                makeRowEditable(row);
            }
        });
    });
}

function collectEditedData() {
    const rows = document.querySelectorAll('#products-table tbody tr.editable');
    const editedData = [];
    rows.forEach(row => {
        const id = row.children[0].textContent.trim();
        const productName = row.children[1].querySelector('input').value.trim();
        const price = row.children[2].querySelector('input').value.trim();
        const categoryId = row.children[3].querySelector('input').value.trim();
        const typeId = row.children[4].querySelector('input').value.trim();
        const supplierId = row.children[5].querySelector('input').value.trim();
        editedData.push({ productId: id, productName, price, categoryId, typeId, supplierId });
        makeRowReadOnly(row);
    });
    return editedData;
}

async function saveEditedData() {
    const editedData = collectEditedData();
    if (editedData.length > 0) {
        try {
            const response = await fetch(`http://${ip}/api/products/updateAll`, {
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
    addDeleteAllButton('api/products/deleteAll')
});
//--------------------------------------------------------------------------------------
function createProductModal() {
    const modalHtml = `
    <div class="modal" id="addProductModal" tabindex="-1" role="dialog" aria-labelledby="addProductModalLabel" aria-hidden="true" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog" role="document" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 5px; padding: 20px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addProductModalLabel">Добавить продукт</h5>
                    <button type="button" class="close" id="closeProductModalButton" aria-label="Close" style="border: none; background: none; font-size: 1.5rem; cursor: pointer;">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addProductForm">
                        <div class="form-group">
                            <label for="productNameInput">Название продукта</label>
                            <input type="text" class="form-control" id="productNameInput" required>
                        </div>
                        <div class="form-group">
                            <label for="priceInput">Цена</label>
                            <input type="number" class="form-control" id="priceInput" required>
                        </div>
                        <div class="form-group">
                            <label for="categoryIdInput">ID категории</label>
                            <input type="number" class="form-control" id="categoryIdInput" required>
                        </div>
                        <div class="form-group">
                            <label for="typeIdInput">ID типа</label>
                            <input type="number" class="form-control" id="typeIdInput" required>
                        </div>
                        <div class="form-group">
                            <label for="supplierIdInput">ID поставщика</label>
                            <input type="number" class="form-control" id="supplierIdInput" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelProductModalButton">Отмена</button>
                    <button type="button" class="btn btn-primary" id="saveProductButton">Сохранить</button>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function showProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.style.display = 'block';
}

function hideProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.style.display = 'none';
}

function addProductModalListener() {
    const saveButton = document.getElementById('saveProductButton');
    const cancelButton = document.getElementById('cancelProductModalButton');
    const closeButton = document.getElementById('closeProductModalButton');

    saveButton.addEventListener('click', async () => {
        const productName = document.getElementById('productNameInput').value.trim();
        const price = document.getElementById('priceInput').value.trim();
        const categoryId = document.getElementById('categoryIdInput').value.trim();
        const typeId = document.getElementById('typeIdInput').value.trim();
        const supplierId = document.getElementById('supplierIdInput').value.trim();

        if (!productName || !price || !categoryId || !typeId || !supplierId) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        const newProduct = {
            productName,
            price,
            categoryId,
            typeId,
            supplierId
        };

        try {
            const response = await fetch(`http://${ip}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });

            if (!response.ok) {
                throw new Error(`Ошибка при добавлении продукта: ${response.status}`);
            }

            const addedProduct = await response.json();
            products.push(new Product(
                addedProduct.productId,
                addedProduct.productName,
                addedProduct.price,
                addedProduct.categoryId,
                addedProduct.typeId,
                addedProduct.supplierId
            ));

            await showProducts(products);
            addHeadersListeners();

            hideProductModal();
            document.getElementById('addProductForm').reset();
        } catch (error) {
            console.error('Ошибка при добавлении продукта:', error);
        }
    });

    cancelButton.addEventListener('click', hideProductModal);
    closeButton.addEventListener('click', hideProductModal);
}

function addProductButton() {
    const addButton = document.createElement('button');
    const container = document.getElementById('actions-container');
    addButton.textContent = 'Добавить продукт';
    addButton.classList.add('btn', 'btn-primary', 'mt-3');
    addButton.addEventListener('click', showProductModal);
    container.appendChild(addButton);
}

let products = null;
(async () => {
    products = await getProducts(findBy,'0','productId','asc');
    await showProducts(products);
    addHeadersListeners();
    await addDeleteButtonListeners('товар', 'products');

    createProductModal();
    addProductModalListener();
    addProductButton();
})();