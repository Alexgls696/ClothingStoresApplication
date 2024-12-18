class StoresAndEmployeesCount {
    constructor(id, location, count) {
        this.id = id;
        this.location = location;
        this.count = count;
    }
}

const ip = location.host;

async function getStoresAndEmployeesCount(findValue) {
    try {
        const response = await fetch(`http://${ip}/api/storedViews/storesAndEmployeesCount`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const storeEmployeeData = await response.json();
        return storeEmployeeData.map(entry => {
            return new StoresAndEmployeesCount(
                entry.id,
                entry.location,
                entry.count
            );
        });
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

async function showStoresAndEmployeesCount(storesAndCount) {
    const table = document.getElementById('stores-employees-table');

    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }

    table.innerHTML = '<thead class="table-dark"><tr>' +
        '<th>ID магазина</th>' +
        '<th>Локация</th>' +
        '<th>Количество сотрудников</th>' +
        '</tr></thead>';

    let tbody = document.createElement('tbody');
    storesAndCount.forEach(entry => {
        tbody.innerHTML += `<tr>
<td>${entry.id}</td>
<td>${entry.location}</td>
<td>${entry.count}</td>
</tr>`;
    });

    table.appendChild(tbody);
}

function addSearchButtonListener() {
    document.getElementById('searchButton').addEventListener('click', async function() {
        const findValue = document.getElementById('searchInput').value.trim();
        const storesAndCount = await getStoresAndEmployeesCount(findValue);
        await showStoresAndEmployeesCount(storesAndCount);
    });
}

(async () => {
    const storesAndCount = await getStoresAndEmployeesCount('');
    await showStoresAndEmployeesCount(storesAndCount);
    addSearchButtonListener();
})();