class Category {
    constructor(categoryId, categoryName) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }
}


const ip = location.host;

async function getCategories(findBy,findValue,sortBy,sortType) {
    try {
        const response = await fetch(`http://${ip}/api/categories/findBy?findBy=${findBy}&findValue=${findValue}&sortBy=${sortBy}&sortType=${sortType}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categoryData = await response.json();
        const data = categoryData.content;
        return data.map(category => {
            return new Category(category.categoryId, category.categoryName);
        })
    } catch (error) {
        console.log(error);
    }
}

async function showCategories(categories) {
    const categoriesTable = document.getElementById('categories-table');
    let access = await checkRoleForDelete();

    while (categoriesTable.hasChildNodes()) {
        categoriesTable.removeChild(categoriesTable.firstChild);
    }

    categoriesTable.innerHTML = '<thead class="table-dark"><tr>' +
        '<th id="category-id-header" class="header">ID</th>' +
        '<th id="category-name-header" class="header">Название</th>' +
        (access ? '<th>Удаление</th>' : '') + // Условно добавляем заголовок столбца
        '</tr></thead>';

    let tbody = document.createElement('tbody');
    categories.forEach(category => {
        tbody.innerHTML += `<tr>
<td>${category.categoryId}</td>
<td>${category.categoryName}</td>
${access ? `<td>
<button class="btn btn-danger btn-sm delete-button" data-id="${category.categoryId}">
Удалить
</button>
</td>` : ''} 
</tr>`;
    });

    categoriesTable.appendChild(tbody);
    addRowClickListeners();
}


let sortCategory = {
    id: 'asc',
    name: 'asc'
};

const FIND_BY = 'id';
let findBy = 'id';
let findValue = 0;

async function showSortedCategories(sortBy,sortType) {
    categories = await getCategories(findBy,findValue,sortBy,sortType);
    await showCategories(categories);
    addHeadersListeners();
}

function addHeadersListeners() {
    const id = document.getElementById('category-id-header');
    const name = document.getElementById('category-name-header');

    id.addEventListener('click', async () => {
        sortCategory.id = sortCategory.id === 'asc' ? 'desc' : 'asc'; // Меняем порядок
        await showSortedCategories('categoryId',sortCategory.id);
    });

    name.addEventListener('click', async () => {
        sortCategory.name = sortCategory.name === 'asc' ? 'desc' : 'asc'; // Меняем порядок
        await showSortedCategories('categoryName', sortCategory.name);
    });
}

//-------------------------------------------------------Изменение товара-------------------------------------------------------
function makeRowEditable(row) {
    const cells = Array.from(row.children);
    cells.forEach((cell, index) => {
        if (index > 0 && index < 2) { // Пропускаем первую ячейку (ID)
            const input = document.createElement('input');
            input.type = 'text';
            input.value = cell.textContent.trim();
            cell.innerHTML = '';
            cell.appendChild(input);
        }
    });
    row.classList.add('editable'); // Добавляем класс, чтобы отметить редактируемую строку
}

function makeRowReadOnly(row) {
    const cells = Array.from(row.children);
    cells.forEach((cell, index) => {
        if (index > 0) { // Пропускаем первую ячейку (ID)
            const input = cell.querySelector('input');
            if (input) {
                cell.textContent = input.value.trim();
            }
        }
    });
    row.classList.remove('editable'); // Убираем класс
}

function addRowClickListeners() {
    const rows = document.querySelectorAll('#categories-table tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            if (!row.classList.contains('editable')) {
                makeRowEditable(row);
            }
        });
    });
}

function collectEditedData() {
    const rows = document.querySelectorAll('#categories-table tbody tr.editable');
    const editedData = [];
    rows.forEach(row => {
        const id = row.children[0].textContent.trim();
        const nameInput = row.children[1].querySelector('input');
        if (nameInput) {
            const name = nameInput.value.trim();
            editedData.push({categoryId: id, categoryName: name});
        }
        makeRowReadOnly(row); // Приводим строку обратно в "только для чтения"
    });
    return editedData;
}

async function saveEditedData() {
    const editedData = collectEditedData();
    if (editedData.length > 0) {
        try {
            const response = await fetch(`http://${ip}/api/categories/updateAll`, {
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
            console.log('Данные успешно сохранены');
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
        }
    } else {
        console.log('Нет данных для сохранения');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.createElement('button');
    const container = document.getElementById('actions-container');
    saveButton.textContent = 'Сохранить изменения';
    saveButton.classList.add('btn', 'btn-primary', 'mt-3');
    saveButton.addEventListener('click', saveEditedData);
    container.appendChild(saveButton);
    addDeleteAllButton('api/categories/deleteAll')
});

//Добавление-----------------------------------------------------------------------------------------------------------------------


function createModal() {
    const modalHtml = `
    <div class="modal" id="addModal" tabindex="-1" role="dialog" aria-labelledby="addModalLabel" aria-hidden="true" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog" role="document" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 5px; padding: 20px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addModalLabel">Добавить категорию</h5>
                    <button type="button" class="close" id="closeModalButton" aria-label="Close" style="border: none; background: none; font-size: 1.5rem; cursor: pointer;">
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addCategoryForm">
                        <div class="form-group">
                            <label for="categoryNameInput">Название категории</label>
                            <input type="text" class="form-control" id="categoryNameInput" placeholder="Введите название категории" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelModalButton">Отмена</button>
                    <button type="button" class="btn btn-primary" id="saveCategoryButton">Сохранить</button>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function showModal() {
    const modal = document.getElementById('addModal');
    modal.style.display = 'block';
}

function hideModal() {
    const modal = document.getElementById('addModal');
    modal.style.display = 'none';
}

function addCategoryModalListener() {
    const saveButton = document.getElementById('saveCategoryButton');
    const cancelButton = document.getElementById('cancelModalButton');
    const closeButton = document.getElementById('closeModalButton');

    saveButton.addEventListener('click', async () => {
        const categoryNameInput = document.getElementById('categoryNameInput');
        const categoryName = categoryNameInput.value.trim();

        if (!categoryName) {
            alert('Название категории не может быть пустым.');
            return;
        }

        const newCategory = {categoryName};

        try {
            const response = await fetch(`http://${ip}/api/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCategory),
            });

            if (!response.ok) {
                let data =  await response.json()
                showError(data.message)
                closeButton.click();
                return
            }

            const addedCategory = await response.json();
            categories.push(new Category(addedCategory.categoryId, addedCategory.categoryName));
            await showCategories(categories);
            addHeadersListeners();
            await addDeleteButtonListener('categories',categoryName);

            hideModal(); // Закрытие модального окна
            document.getElementById('addCategoryForm').reset(); // Очистка формы
        } catch (error) {
            console.error('Ошибка при добавлении категории:', error);
        }
    });

    cancelButton.addEventListener('click', hideModal);
    closeButton.addEventListener('click', hideModal);
}

function addAddObjectButton() {
    const addButton = document.createElement('button');
    const container = document.getElementById('actions-container');
    addButton.textContent = 'Добавить';
    addButton.classList.add('btn', 'btn-primary', 'mt-3');
    container.appendChild(addButton);
    addButton.addEventListener('click', showModal); // Открытие модального окна
}

function addSearchButtonListener(sortBy){
    document.getElementById('searchButton').addEventListener('click', async function() {
         findBy = document.getElementById('searchField').value;
        findValue = document.getElementById('searchInput').value;
        categories = await getCategories(findBy,findValue,sortBy,'asc');
        await showCategories(categories);
        await addDeleteButtonListeners('категорию', 'categories');
        addHeadersListeners();
    });
}

let categories = null;
(async () => {
    categories = await getCategories(findBy, '0', 'categoryId', 'asc');
    await showCategories(categories);
    addHeadersListeners();
    await addDeleteButtonListeners('категорию', 'categories');

    createModal();
    addCategoryModalListener();
    addAddObjectButton();
    addSearchButtonListener('categoryId');
})()