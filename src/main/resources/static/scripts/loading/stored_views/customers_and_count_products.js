class CustomersAndCountProducts {
    constructor(id, firstName, lastName, count) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.count = count;
    }
}

const ip = location.host;

async function getCustomersAndCountProducts(findBy, findValue) {
    try {
        const response = await fetch(`http://${ip}/api/storedViews/customersAndCountProducts`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const customerCountData = await response.json();
        return customerCountData.map(entry => {
            return new CustomersAndCountProducts(
                entry.id,
                entry.first_name,
                entry.last_name,
                entry.count
            );
        });
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

async function showCustomersAndCountProducts(customersAndCount) {
    const table = document.getElementById('customers-count-table');

    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }

    table.innerHTML = '<thead class="table-dark"><tr>' +
        '<th>ID клиента</th>' +
        '<th>Имя</th>' +
        '<th>Фамилия</th>' +
        '<th>Количество товаров</th>' +
        '</tr></thead>';

    let tbody = document.createElement('tbody');
    customersAndCount.forEach(entry => {
        tbody.innerHTML += `<tr>
<td>${entry.id}</td>
<td>${entry.firstName}</td>
<td>${entry.lastName}</td>
<td>${entry.count}</td>
</tr>`;
    });

    table.appendChild(tbody);
}

function addSearchButtonListener() {
    document.getElementById('searchButton').addEventListener('click', async function() {
        const findBy = document.getElementById('searchField').value;
        const findValue = document.getElementById('searchInput').value.trim();
        const customersAndCount = await getCustomersAndCountProducts(findBy, findValue);
        await showCustomersAndCountProducts(customersAndCount);
    });
}

(async () => {
    const customersAndCount = await getCustomersAndCountProducts('', '');
    await showCustomersAndCountProducts(customersAndCount);
    addSearchButtonListener();
})();