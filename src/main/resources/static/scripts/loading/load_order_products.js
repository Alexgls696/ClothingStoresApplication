class OrderProduct {
    constructor(id, product, order, count) {
        this.id = id;
        this.product = product;
        this.order = order;
        this.count = count;
    }
}

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
class Order {
    constructor(id, orderDate, storeId, statusId) {
        this.id = id;
        this.orderDate = orderDate;
        this.storeId = storeId;
        this.statusId = statusId;
    }
}


async function getOrders(findBy,findValue,sortBy,sortType) {
    try {
        const response = await fetch(`http://${ip}/api/orders/findBy?findBy=${findBy}&findValue=${findValue}&sortBy=${sortBy}&sortType=${sortType}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const ordersData = await response.json();
        const data = ordersData.content;
        return data.map(order => {
            return new Order(order.id, order.orderDate, order.storeId, order.statusId);
        });
    } catch (error) {
        console.log(error);
    }
}


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


const ip = location.host;

async function getOrderProducts(findBy,findValue,sortBy,sortType) {
    try {
        const response = await fetch(`http://${ip}/api/orderProducts/findBy?findBy=${findBy}&findValue=${findValue}&sortBy=${sortBy}&sortType=${sortType}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const orderProductsData = await response.json();
        const data = orderProductsData.content;
        return data.map(orderProduct => {
            return new OrderProduct(orderProduct.id,
                orderProduct.product,
                orderProduct.order,
                orderProduct.count);
        });
    } catch (error) {
        console.log(error);
    }
}

const FIND_BY = 'id';

let findBy = 'id';
let findValue = 0;

let sortOrderProducts = {
    id: 'asc',
    productId: 'asc',
    orderId: 'asc',
    count: 'asc'
};

async function showOrderProducts(orderProducts) {
    const orderProductsTable = document.getElementById('order-products-table');
    let access = await checkRoleForDelete();

    orderProductsTable.innerHTML = '<thead class="table-dark"><tr>' +
        '<th id="order-product-id-header" class="header">ID</th>' +
        '<th id="order-product-productId-header" class="header">Продукт</th>' +
        '<th id="order-product-orderId-header" class="header">ID Заказа</th>' +
        '<th id="order-product-count-header" class="header">Количество</th>' +
        (access ? '<th>Удаление</th>' : '') +
        '</tr></thead>';

    let tbody = document.createElement('tbody');
    orderProducts.forEach(orderProduct => {
        tbody.innerHTML += `<tr>
<td>${orderProduct.id}</td>
<td>${orderProduct.product.name}</td>
<td>${orderProduct.order.id}</td>
<td>${orderProduct.count}</td>
${access ? `<td>
<button class="btn btn-danger btn-sm delete-button" data-id="${orderProduct.id}">
Удалить
</button>
</td>` : ''}
</tr>`;
    });

    orderProductsTable.appendChild(tbody);
    addRowClickListeners();
}

async function showSortedOrderProducts(sortBy,sortType) {
    orderProducts = await getOrderProducts(findBy,findValue,sortBy,sortType);
    await showOrderProducts(orderProducts);
    addHeadersListeners();
}

function addHeadersListeners() {
    const id = document.getElementById('order-product-id-header');
    const productId = document.getElementById('order-product-productId-header');
    const orderId = document.getElementById('order-product-orderId-header');
    const count = document.getElementById('order-product-count-header');

    id.addEventListener('click', async () => {
        sortOrderProducts.id = sortOrderProducts.id === 'asc' ? 'desc' : 'asc';
        await showSortedOrderProducts('id' , sortOrderProducts.id);
    });

    productId.addEventListener('click', async () => {
        sortOrderProducts.productId = sortOrderProducts.productId === 'asc' ? 'desc' : 'asc';
        await showSortedOrderProducts('productName' , sortOrderProducts.productId);
    });

    orderId.addEventListener('click', async () => {
        sortOrderProducts.orderId = sortOrderProducts.orderId === 'asc' ? 'desc' : 'asc';
        await showSortedOrderProducts('orderId' , sortOrderProducts.orderId);
    });

    count.addEventListener('click', async () => {
        sortOrderProducts.count = sortOrderProducts.count === 'asc' ? 'desc' : 'asc';
        await showSortedOrderProducts('count'  ,sortOrderProducts.count);
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
    const rows = document.querySelectorAll('#order-products-table tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            if (!row.classList.contains('editable')) {
                makeRowEditable(row);
            }
        });
    });
}

function collectEditedData() {
    const rows = document.querySelectorAll('#order-products-table tbody tr.editable');
    const editedData = [];
    rows.forEach(row => {
        const id = row.children[0].textContent.trim();
        const productId = row.children[1].querySelector('input').value.trim();
        const orderId = row.children[2].querySelector('input').value.trim();
        const count = row.children[3].querySelector('input').value.trim();
        editedData.push({ id: id, productId, orderId, count });
        makeRowReadOnly(row);
    });
    return editedData;
}

async function saveEditedData() {
    const editedData = collectEditedData();
    if (editedData.length > 0) {
        try {
            const response = await fetch(`http://${ip}/api/orderProducts/updateAll`, {
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
    addDeleteAllButton('api/orderProducts/deleteAll')
});
//--------------------------------------------------------------------------------------
// Создание модального окна для добавления OrderProduct
async function createOrderProductModal() {
    const modalHtml = `
    <div class="modal" id="addOrderProductModal" tabindex="-1" role="dialog" aria-labelledby="addOrderProductModalLabel" aria-hidden="true" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog" role="document" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 5px; padding: 20px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addOrderProductModalLabel">Добавить продукт в заказ</h5>
                    <button type="button" class="close" id="closeOrderProductModalButton" aria-label="Close" style="border: none; background: none; font-size: 1.5rem; cursor: pointer;">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addOrderProductForm">
                        <div class="form-group">
                            <label for="productIdInput">Товар</label>
                           <select id="product" class="form-select"></select>
                        </div>
                        <div class="form-group">
                            <label for="orderIdInput">ID заказа</label>
                             <select id="order" class="form-select"></select>
                        </div>
                        <div class="form-group">
                            <label for="countInput">Количество</label>
                            <input type="number" class="form-control" id="countInput" placeholder="Введите количество" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelOrderProductModalButton">Отмена</button>
                    <button type="button" class="btn btn-primary" id="saveOrderProductButton">Сохранить</button>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    let products = await getProducts('productName','','name','asc');
    let orders = await getOrders('id','','id','asc');
    let categoryContainer = document.getElementById('product');
    let orderContainer = document.getElementById('order');
    products.forEach(product=>{
        categoryContainer.innerHTML+=`<option value='${JSON.stringify(product)}'>${product.name}</option>`
    })
    orders.forEach(order=>{
        orderContainer.innerHTML+=`<option value='${JSON.stringify(order)}'>${order.id}</option>`
    })
}

function showOrderProductModal() {
    const modal = document.getElementById('addOrderProductModal');
    modal.style.display = 'block';
}

function hideOrderProductModal() {
    const modal = document.getElementById('addOrderProductModal');
    modal.style.display = 'none';
}

function addOrderProductModalListener() {
    const saveButton = document.getElementById('saveOrderProductButton');
    const cancelButton = document.getElementById('cancelOrderProductModalButton');
    const closeButton = document.getElementById('closeOrderProductModalButton');

    saveButton.addEventListener('click', async () => {
        let product = document.getElementById('product').value;
        let order = document.getElementById('order').value.trim();
        const count = document.getElementById('countInput').value.trim();

        if ( !count) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        product = JSON.parse(product);
        order = JSON.parse(order);
        const newOrderProduct = {
            product,
            order,
            count
        };

        try {
            const response = await fetch(`http://${ip}/api/orderProducts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOrderProduct),
            });

            if (!response.ok) {
                let data =  await response.json()
                showError(data.message)
                closeButton.click();
                return
            }

            const addedOrderProduct = await response.json();
            orderProducts.push(new OrderProduct(
                addedOrderProduct.id,
                addedOrderProduct.productId,
                addedOrderProduct.orderId,
                addedOrderProduct.count
            ));

            await showOrderProducts(orderProducts);
            addHeadersListeners();
            await addDeleteButtonListener('orderProducts','элемент');
            hideOrderProductModal(); // Закрытие модального окна
            document.getElementById('addOrderProductForm').reset(); // Очистка формы
        } catch (error) {
            console.error('Ошибка при добавлении продукта в заказ:', error);
        }
    });

    cancelButton.addEventListener('click', hideOrderProductModal);
    closeButton.addEventListener('click', hideOrderProductModal);
}

function addOrderProductButton() {
    const addButton = document.createElement('button');
    const container = document.getElementById('actions-container');
    addButton.textContent = 'Добавить продукт в заказ';
    addButton.classList.add('btn', 'btn-primary', 'mt-3');
    addButton.addEventListener('click', showOrderProductModal); // Открытие модального окна
    container.appendChild(addButton);
}

function addSearchButtonListener(sortBy){
    document.getElementById('searchButton').addEventListener('click', async function() {
        findBy = document.getElementById('searchField').value;
        findValue = document.getElementById('searchInput').value;
        orderProducts = await getOrderProducts(findBy,findValue,sortBy,'asc');
        await showOrderProducts(orderProducts);
        await addDeleteButtonListeners('товар-заказ', 'orderProducts');
        addHeadersListeners();
    });
}

let orderProducts = null;
(async () => {
    orderProducts = await getOrderProducts(findBy,'0','id','asc');
    await showOrderProducts(orderProducts);
    addHeadersListeners();
    await addDeleteButtonListeners('товар-заказ', 'orderProducts');

    createOrderProductModal();
    addOrderProductModalListener();
    addOrderProductButton();
    addSearchButtonListener('id');
})();