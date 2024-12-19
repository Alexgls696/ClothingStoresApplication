class Product {
    constructor(id, name, price, category, type, supplier) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.type = type;
        this.supplier = supplier;
    }
}

const ip = location.host;

async function getProducts(findBy,findValue,sortBy,sortType) {
    try {
        const response = await fetch(`http://${ip}/api/products/findBy?findBy=${findBy}&findValue=${findValue}&sortBy=${sortBy}&sortType=${sortType}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const productsData = await response.json();
        const data = productsData.content;
        return data.map(product => {
            return new Product(
                product.id,
                product.name,
                product.price,
                product.category,
                product.type,
                product.supplier
            );
        });
    } catch (error) {
        console.log(error);
    }
}

let sortProducts = {
    id: 'asc',
    name: 'asc',
    price: 'asc',
    categoryId: 'asc',
    typeId: 'asc',
    supplierId: 'asc'
};


const FIND_BY = 'id';
let findBy = 'id';
let findValue = 0;

async function showSortedProducts(sortBy,sortType) {
    products = await getProducts(findBy,findValue,sortBy,sortType)
    await showProducts(products);
    addHeadersListeners();
}

function addHeadersListeners() {
    const id = document.getElementById('product-id-header');
    const name = document.getElementById('product-name-header');
    const price = document.getElementById('product-price-header');
    const categoryId = document.getElementById('product-categoryId-header');
    const typeId = document.getElementById('product-typeId-header');
    const supplierId = document.getElementById('product-supplierId-header');

    id.addEventListener('click', async () => {
        sortProducts.id = sortProducts.id === 'asc' ? 'desc' : 'asc';
        await showSortedProducts('id',  sortProducts.id);
    });

    name.addEventListener('click', async () => {
        sortProducts.name = sortProducts.name === 'asc' ? 'desc' : 'asc';
        await showSortedProducts('name' , sortProducts.name);
    });

    price.addEventListener('click', async () => {
        sortProducts.price = sortProducts.price === 'asc' ? 'desc' : 'asc';
        await showSortedProducts('price' , sortProducts.price);
    });

    categoryId.addEventListener('click', async () => {
        sortProducts.categoryId = sortProducts.categoryId === 'asc' ? 'desc' : 'asc';
        await showSortedProducts('categoryName',  sortProducts.categoryId);
    });

    typeId.addEventListener('click', async () => {
        sortProducts.typeId = sortProducts.typeId === 'asc' ? 'desc' : 'asc';
        await showSortedProducts('typeName' , sortProducts.typeId);
    });

    supplierId.addEventListener('click', async () => {
        sortProducts.supplierId = sortProducts.supplierId === 'asc' ? 'desc' : 'asc';
        await showSortedProducts('supplierName' , sortProducts.supplierId);
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
                <th id="product-categoryId-header" class="header">Категория</th>
                <th id="product-typeId-header" class="header">Тип продукта</th>
                <th id="product-supplierId-header" class="header">Производитель</th>
                ${access ? '<th>Удаление</th>' : ''}
            </tr>
        </thead>`;

    let tbody = document.createElement('tbody');
    products.forEach(product => {
        tbody.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.category.name}</td>
                <td>${product.type.name}</td>
                <td>${product.supplier.name}</td>
                ${access ? `<td>
<button class="btn btn-danger btn-sm delete-button" data-id="${product.id}">
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
        if (index > 0 && index < 3) { // Пропускаем ID
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
        let id = parseInt(row.children[0].textContent.trim());
        const name = row.children[1].querySelector('input').value.trim();
        let price = row.children[2].querySelector('input').value.trim();
        let category = products[id].category;
        let type = products[id].type;
        const supplier = products[id].supplier;
        editedData.push({ id: id, name, price, category, type, supplier });
        makeRowReadOnly(row);
    });
    return editedData;
}

async function saveEditedData() {
    const editedData = collectEditedData();
    if (editedData.length > 0) {
        try {
            const response = await fetch(`http://${ip}/api/products/updateAllByParams`, {
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
    addDeleteAllButton('api/products/deleteAll')
});
//--------------------------------------------------------------------------------------

class Supplier {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class Category {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class ProductType {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

async function getCategories(findBy,findValue,sortBy,sortType) {
    try {
        const response = await fetch(`http://${ip}/api/categories/findBy?findBy=${findBy}&findValue=${findValue}&sortBy=${sortBy}&sortType=${sortType}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categoryData = await response.json();
        const data = categoryData.content;
        return categoryData.map(category => {
            return new Category(category.id, category.name);
        })
    } catch (error) {
    }
}

async function getProductTypes(findBy,findValue,sortBy,sortType) {
    try {
        const response = await fetch(`http://${ip}/api/productTypes/findBy?findBy=${findBy}&findValue=${findValue}&sortBy=${sortBy}&sortType=${sortType}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const productTypesData = await response.json();
        const data = productTypesData.content;
        return data.map(productType => {
            return new ProductType(productType.id, productType.name);
        });
    } catch (error) {
        console.log(error);
    }
}

async function getSuppliers(findBy,findValue,sortBy,sortType) {
    try {
        const response = await fetch(`http://${ip}/api/suppliers/findBy?findBy=${findBy}&findValue=${findValue}&sortBy=${sortBy}&sortType=${sortType}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const suppliersData = await response.json();
        const data = suppliersData.content;
        return data.map(supplier => {
            return new Supplier(supplier.id, supplier.name);
        });
    } catch (error) {
        console.log(error);
    }
}



async function createProductModal() {
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
                            <label for="nameInput">Название товара</label>
                            <input type="text" class="form-control" id="nameInput" required>
                        </div>
                        <div class="form-group">
                            <label for="priceInput">Цена</label>
                            <input type="number" class="form-control" id="priceInput" required>
                        </div>
                        <div class="form-group">
                         <label for="categoryInput">Категория</label>
                             <select id="category" class="form-select"></select>
                        </div>
                        <div class="form-group">
                         <label for="typeInput">Тип товара</label>
                            <select id="type" class="form-select"></select>
                        </div>
                        <div class="form-group">
                         <label for="supplierInput">Производитель</label>
                            <select id="supplier" class="form-select"></select>
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
    let categories = await getCategories('name','','name','asc');
    let types = await getProductTypes('name','','name','asc');
    let suppliers = await getSuppliers('name','','name','asc');

    let categoryContainer = document.getElementById('category');
    let typeContainer = document.getElementById('type');
    let supplierContainer = document.getElementById('supplier');
    categories.forEach(category=>{
        categoryContainer.innerHTML+=`<option value='${JSON.stringify(category)}'>${category.name}</option>`
    })
    types.forEach(type=>{
        typeContainer.innerHTML+=`<option value='${JSON.stringify(type)}'>${type.name}</option>`
    })
    suppliers.forEach(supplier=>{
        supplierContainer.innerHTML+=`<option value='${JSON.stringify(supplier)}'>${supplier.name}</option>`
    })

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
        const name = document.getElementById('nameInput').value.trim();
        const price = document.getElementById('priceInput').value.trim();
        let category = document.getElementById('category').value;
        let type = document.getElementById('type').value;
        let supplier = document.getElementById('supplier').value;

        if (!name || !price || !category || !type || !supplier) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }
        category = JSON.parse(category);
        type = JSON.parse(type);
        supplier = JSON.parse(supplier);
        const newProduct = {
            name,
            price,
            category,
            type,
            supplier
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
                let data =  await response.json()
                showError(data.message)
                closeButton.click();
                return
            }

            const addedProduct = await response.json();
            products.push(new Product(
                addedProduct.id,
                addedProduct.name,
                addedProduct.price,
                addedProduct.category,
                addedProduct.type,
                addedProduct.supplier
            ));

            await showProducts(products);
            addHeadersListeners();
            await addDeleteButtonListener('products',name);
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

function addSearchButtonListener(sortBy){
    document.getElementById('searchButton').addEventListener('click', async function() {
        findBy = document.getElementById('searchField').value;
        findValue = document.getElementById('searchInput').value;
        categories = await getProducts(findBy,findValue,sortBy,'asc');
        await showProducts(categories);
        await addDeleteButtonListeners('товар', 'products');
        addHeadersListeners();
    });
}


async function createProductAndSupplierModal() {
    const modalHtml = `
    <div class="modal" id="addProductAndSupplierModal" tabindex="-1" role="dialog" aria-labelledby="addProductAndSupplierModalLabel" aria-hidden="true" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog" role="document" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 5px; padding: 20px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addProductAndSupplierModalLabel">Добавить продукт</h5>
                    <button type="button" class="close" id="closeProductAndSupplierModalButton" aria-label="Close" style="border: none; background: none; font-size: 1.5rem; cursor: pointer;">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addProductAndSupplierForm">
                        <div class="form-group">
                            <label for="nameInput1">Название продукта</label>
                            <input type="text" class="form-control" id="nameInput1" required>
                        </div>
                        <div class="form-group">
                            <label for="priceInput1">Цена</label>
                            <input type="number" class="form-control" id="priceInput1" required>
                        </div>
                         <div class="form-group">
                         <label for="categoryInput">Категория</label>
                             <select id="category1" class="form-select"></select>
                        </div>
                        <div class="form-group">
                         <label for="typeInput">Тип товара</label>
                            <select id="type1" class="form-select"></select>
                        </div>
                        <div class="form-group">
                            <label for="nameInput1">Название производителя</label>
                            <input type="text" class="form-control" id="nameInput1" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelProductAndSupplierModalButton">Отмена</button>
                    <button type="button" class="btn btn-primary" id="saveProductAndSupplierButton">Сохранить</button>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    let categories = await getCategories('name','','name','asc');
    let types = await getProductTypes('name','','name','asc');

    let categoryContainer = document.getElementById('category1');
    let typeContainer = document.getElementById('type1');

    categories.forEach(category=>{
        categoryContainer.innerHTML+=`<option value='${JSON.stringify(category)}'>${category.name}</option>`
    })
    types.forEach(type=>{
        typeContainer.innerHTML+=`<option value='${JSON.stringify(type)}'>${type.name}</option>`
    })
}

function showProductAndSupplierModal() {
    const modal = document.getElementById('addProductAndSupplierModal');
    modal.style.display = 'block';
}

function hideProductAndSupplierModal() {
    const modal = document.getElementById('addProductAndSupplierModal');
    modal.style.display = 'none';
}

function addProductAndSupplierModalListener() {
    const saveButton = document.getElementById('saveProductAndSupplierButton');
    const cancelButton = document.getElementById('cancelProductAndSupplierModalButton');
    const closeButton = document.getElementById('closeProductAndSupplierModalButton');

    saveButton.addEventListener('click', async () => {
        const name = document.getElementById('nameInput1').value.trim();
        const price = document.getElementById('priceInput1').value.trim();
        let category = document.getElementById('category').value;
        let type = document.getElementById('type').value;
        const supplierName = document.getElementById('nameInput1').value.trim();
        const supplier = new Supplier(0,supplierName);

        if (!name || !price || !name) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        category = JSON.parse(category);
        type = JSON.parse(type);
        const newProduct = {
            name,
            price,
            category,
            type,
            supplier
        };

        try {
            const response = await fetch(`http://${ip}/api/products/addProductAndCustomer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });

            hideProductAndSupplierModal();
            if (response.ok) {
                showError("Обновите страницу")
                closeButton.click();
            }else{
                let data = await response.json()
                showError(data.message);
                closeButton.click()
            }
        } catch (error) {
            console.error('Ошибка при добавлении продукта:', error);
        }
    });

    cancelButton.addEventListener('click', hideProductAndSupplierModal);
    closeButton.addEventListener('click', hideProductAndSupplierModal);
}

async function addAddProductAndSupplierNameButton(){
    let role = await getRole();
    if(role==='role_admin'){
        const addProductAndSupplierButton = document.createElement('button');
        const container = document.getElementById('actions-container');
        addProductAndSupplierButton.textContent = 'Добавить продукт и производителя';
        addProductAndSupplierButton.classList.add('btn', 'btn-primary', 'mt-3');
        addProductAndSupplierButton.addEventListener('click', showProductAndSupplierModal);
        container.appendChild(addProductAndSupplierButton);
    }
}

let products = null;
(async () => {
    products = await getProducts(findBy,'0','id','asc');
    await showProducts(products);
    addHeadersListeners();
    await addDeleteButtonListeners('товар', 'products');

    createProductModal();
    createProductAndSupplierModal();


    addProductModalListener();
    addProductAndSupplierModalListener();

    addProductButton();
    await addAddProductAndSupplierNameButton();
    addSearchButtonListener('id');

})();