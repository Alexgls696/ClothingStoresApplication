//------------------------Удаление всех сущностей--------------------------------------------------------------------------------------------------------------------
async function deleteAllEntities(apiPath) {
    try {
        if (!confirm('Вы уверены, что хотите удалить все элементы? Это действие необратимо.')) {
            return;
        }
        const tableRows = document.querySelectorAll('tbody tr');
        const idsToDelete = Array.from(tableRows).map(row => row.children[0].textContent.trim()); // Первый столбец — это ID

        if (idsToDelete.length === 0) {
            alert('Нет данных для удаления.');
            return;
        }
        const response = await fetch(`http://${ip}/${apiPath}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(idsToDelete), // Отправляем список ID в теле запроса
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        alert('Все элементы успешно удалены.');

        const tableBody = document.querySelector('tbody');
        if (tableBody) {
            tableBody.innerHTML = '';
        }
    } catch (error) {
        console.error('Ошибка при удалении данных:', error);
        alert('Произошла ошибка при удалении элементов.');
    }
}

function addDeleteAllButton(apiPath) {
    const deleteAllButton = document.createElement('button');
    const container = document.getElementById('actions-container');
    deleteAllButton.textContent = 'Удалить все';
    deleteAllButton.classList.add('btn', 'btn-danger', 'mt-3');
    deleteAllButton.addEventListener('click', () => deleteAllEntities(apiPath));
    container.appendChild(deleteAllButton);
}

//------------------------Удаление по id-----------------------------------------------------------------------
async function deleteCategoryById(table,id) {
    try {
        const response = await fetch(`http://${ip}/api/${table}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const button = document.querySelector(`button[data-id="${id}"]`);
        console.log(button);
        if (button) {
            let td = button.parentNode;
            let tr = td.parentNode;
            let tbody = tr.parentNode;
            tbody.removeChild(tr);
        }
    } catch (error) {
        console.error(`Ошибка при удалении категории с ID ${id}:`, error);
        alert(`Не удалось удалить категорию с ID ${id}.`);
    }
}

function addDeleteButtonListeners(name,table) {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
            const id = event.target.getAttribute('data-id');
            if (confirm(`Вы уверены, что хотите удалить ${name} с ID ${id}?`)) {
                await deleteCategoryById(table,id);
            }
        });
    });
}

