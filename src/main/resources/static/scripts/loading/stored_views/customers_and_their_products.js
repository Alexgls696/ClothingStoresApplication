class CustomerAndHisProduct {
    constructor(customerId, firstName, lastName, orderId, productId, productName) {
        this.customerId = customerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.orderId = orderId;
        this.productId = productId;
        this.productName = productName;
    }
}

const ip = location.host;

async function getCustomersAndProducts(findBy, findValue, sortBy, sortType) {
    try {
        const response = await fetch(`http://${ip}/api/storedViews/customersAndTheirProducts`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const customerProductData = await response.json();
        return customerProductData.map(entry => {
            return new CustomerAndHisProduct(
                entry.id,
                entry.firstName,
                entry.lastName,
                entry.orderId,
                entry.productId,
                entry.productName
            );
        });
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

async function showCustomersAndProducts(customersAndProducts) {
    const table = document.getElementById('customers-products-table');

    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }

    table.innerHTML = '<thead class="table-dark"><tr>' +
        '<th id="customer-id-header">ID клиента</th>' +
        '<th id="first-name-header">Имя</th>' +
        '<th id="last-name-header">Фамилия</th>' +
        '<th id="order-id-header">ID заказа</th>' +
        '<th id="product-id-header">ID товара</th>' +
        '<th id="product-name-header">Название товара</th>' +
        '</tr></thead>';

    let tbody = document.createElement('tbody');
    customersAndProducts.forEach(entry => {
        tbody.innerHTML += `<tr>
<td>${entry.customerId}</td>
<td>${entry.firstName}</td>
<td>${entry.lastName}</td>
<td>${entry.orderId}</td>
<td>${entry.productId}</td>
<td>${entry.productName}</td>
</tr>`;
    });

    table.appendChild(tbody);
    addHeadersListeners();
}

let sortCustomerProducts = {
    customerId: 'asc',
    firstName: 'asc',
    lastName: 'asc',
    orderId: 'asc',
    productId: 'asc',
    productName: 'asc'
};

async function showSortedCustomersAndProducts(sortBy, sortType) {
    const findBy = document.getElementById('searchField').value;
    const findValue = document.getElementById('searchInput').value.trim();
    const customersAndProducts = await getCustomersAndProducts(findBy, findValue, sortBy, sortType);
    await showCustomersAndProducts(customersAndProducts);
}

function addHeadersListeners() {
    const headers = {
        customerId: document.getElementById('customer-id-header'),
        firstName: document.getElementById('first-name-header'),
        lastName: document.getElementById('last-name-header'),
        orderId: document.getElementById('order-id-header'),
        productId: document.getElementById('product-id-header'),
        productName: document.getElementById('product-name-header')
    };

    Object.keys(headers).forEach(key => {
        headers[key].addEventListener('click', async () => {
            sortCustomerProducts[key] = sortCustomerProducts[key] === 'asc' ? 'desc' : 'asc';
            await showSortedCustomersAndProducts(key, sortCustomerProducts[key]);
        });
    });
}

function addSearchButtonListener() {
    document.getElementById('searchButton').addEventListener('click', async function() {
        const sortBy = 'customerId'; // Default sort by customerId
        const sortType = 'asc';
        await showSortedCustomersAndProducts(sortBy, sortType);
    });
}

(async () => {
    const customersAndProducts = await getCustomersAndProducts('', '', 'customerId', 'asc');
    await showCustomersAndProducts(customersAndProducts);
    addSearchButtonListener();
    console.log(1);
})();
