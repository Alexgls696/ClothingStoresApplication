class OrderProduct {
    constructor(orderProductId, productId, orderId, count) {
        this.orderProductId = orderProductId;
        this.productId = productId;
        this.orderId = orderId;
        this.count = count;
    }
}

const ip = location.host;

async function getOrderProducts(orderBy) {
    try {
        const response = await fetch(`http://${ip}/api/orderProducts${orderBy}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const orderProductsData = await response.json();
        const data = orderProductsData.content;
        return data.map(orderProduct => {
            return new OrderProduct(orderProduct.orderProductId,
                orderProduct.productId,
                orderProduct.orderId,
                orderProduct.count);
        });
    } catch (error) {
        console.log(error);
    }
}

let sortOrderProducts = {
    id: '/asc',
    productId: '/asc',
    orderId: '/asc',
    count: '/asc',
};

async function showOrderProducts(orderProducts) {
    const orderProductsTable = document.getElementById('order-products-table');
    let access = await checkRoleForDelete();

    orderProductsTable.innerHTML = '<thead class="table-dark"><tr>' +
        '<th id="order-product-id-header" class="header">ID</th>' +
        '<th id="order-product-productId-header" class="header">ID Продукта</th>' +
        '<th id="order-product-orderId-header" class="header">ID Заказа</th>' +
        '<th id="order-product-count-header" class="header">Количество</th>' +
        (access ? '<th>Удаление</th>' : '') +
        '</tr></thead>';

    let tbody = document.createElement('tbody');
    orderProducts.forEach(orderProduct => {
        tbody.innerHTML += `<tr>
<td>${orderProduct.orderProductId}</td>
<td>${orderProduct.productId}</td>
<td>${orderProduct.orderId}</td>
<td>${orderProduct.count}</td>
${access ? `<td>
<button class="btn btn-danger btn-sm delete-button" data-id="${orderProduct.orderProductId}">
Удалить
</button>
</td>` : ''}
</tr>`;
    });

    orderProductsTable.appendChild(tbody);
    addRowClickListeners();
}

async function showSortedOrderProducts(orderBy) {
    orderProducts = await getOrderProducts(orderBy);
    await showOrderProducts(orderProducts);
    addHeadersListeners();
}

function addHeadersListeners() {
    const id = document.getElementById('order-product-id-header');
    const productId = document.getElementById('order-product-productId-header');
    const orderId = document.getElementById('order-product-orderId-header');
    const count = document.getElementById('order-product-count-header');

    id.addEventListener('click', async () => {
        sortOrderProducts.id = sortOrderProducts.id === '/asc' ? '/desc' : '/asc';
        await showSortedOrderProducts('/orderById' + sortOrderProducts.id);
    });

    productId.addEventListener('click', async () => {
        sortOrderProducts.productId = sortOrderProducts.productId === '/asc' ? '/desc' : '/asc';
        await showSortedOrderProducts('/orderByProductId' + sortOrderProducts.productId);
    });

    orderId.addEventListener('click', async () => {
        sortOrderProducts.orderId = sortOrderProducts.orderId === '/asc' ? '/desc' : '/asc';
        await showSortedOrderProducts('/orderByOrderId' + sortOrderProducts.orderId);
    });

    count.addEventListener('click', async () => {
        sortOrderProducts.count = sortOrderProducts.count === '/asc' ? '/desc' : '/asc';
        await showSortedOrderProducts('/orderByCount' + sortOrderProducts.count);
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
        editedData.push({ orderProductId: id, productId, orderId, count });
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
    addDeleteAllButton('api/orderProducts/deleteAll')
});
//--------------------------------------------------------------------------------------
// Создание модального окна для добавления OrderProduct
function createOrderProductModal() {
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
                            <label for="productIdInput">ID продукта</label>
                            <input type="number" class="form-control" id="productIdInput" placeholder="Введите ID продукта" required>
                        </div>
                        <div class="form-group">
                            <label for="orderIdInput">ID заказа</label>
                            <input type="number" class="form-control" id="orderIdInput" placeholder="Введите ID заказа" required>
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
}

// Показ модального окна
function showOrderProductModal() {
    const modal = document.getElementById('addOrderProductModal');
    modal.style.display = 'block';
}

// Закрытие модального окна
function hideOrderProductModal() {
    const modal = document.getElementById('addOrderProductModal');
    modal.style.display = 'none';
}

function addOrderProductModalListener() {
    const saveButton = document.getElementById('saveOrderProductButton');
    const cancelButton = document.getElementById('cancelOrderProductModalButton');
    const closeButton = document.getElementById('closeOrderProductModalButton');

    saveButton.addEventListener('click', async () => {
        const productId = document.getElementById('productIdInput').value.trim();
        const orderId = document.getElementById('orderIdInput').value.trim();
        const count = document.getElementById('countInput').value.trim();

        if (!productId || !orderId || !count) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        const newOrderProduct = {
            productId,
            orderId,
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
                throw new Error(`Ошибка при добавлении продукта в заказ: ${response.status}`);
            }

            const addedOrderProduct = await response.json();
            orderProducts.push(new OrderProduct(
                addedOrderProduct.orderProductId,
                addedOrderProduct.productId,
                addedOrderProduct.orderId,
                addedOrderProduct.count
            ));

            await showOrderProducts(orderProducts);
            addHeadersListeners();

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

let orderProducts = null;
(async () => {
    orderProducts = await getOrderProducts('/orderById/asc');
    await showOrderProducts(orderProducts);
    addHeadersListeners();
    await addDeleteButtonListeners('товар-заказ', 'orderProducts');

    createOrderProductModal();
    addOrderProductModalListener();
    addOrderProductButton();
})();