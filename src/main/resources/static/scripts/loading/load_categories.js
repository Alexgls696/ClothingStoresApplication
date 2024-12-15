class Category{
    constructor(categoryId,categoryName) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }
}


const ip = location.host;
async function getCategories(orderBy){
    try{
        const response = await fetch(`http://${ip}/api/categories${orderBy}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categoryData = await response.json();
        const data = categoryData.content;
        return data.map(category=>{
            return new Category(category.categoryId,category.categoryName);
        })
    }catch (error){
        console.log(error);
    }
}

function showCategories(categories){
    const categoriesTable = document.getElementById('categories-table ');
    while (categoriesTable.hasChildNodes()){
        categoriesTable.removeChild(categoriesTable.firstChild);
    }

    categoriesTable.innerHTML = '<thead class="table-dark"><tr><th id="category-id-header" class="header">ID</th><th id="category-name-header" class="header">Название</th</tr></thead>'
    let tbody = document.createElement('tbody');
    categories.forEach(category=>{
      tbody.innerHTML += `<tr><td>${category.categoryId}</td><td>${category.categoryName}</td></tr>`
    });
    categoriesTable.appendChild(tbody);
}


let sortCategory = {
    id: '/asc',
    name: '/asc'
};

async function showSortedCategories(orderBy){
    categories = await getCategories(orderBy);
    showCategories(categories);
    addHeadersListeners();
}

function addHeadersListeners() {
    const id = document.getElementById('category-id-header');
    const name = document.getElementById('category-name-header');

    id.addEventListener('click', async () => {
        sortCategory.id = sortCategory.id === '/asc' ? '/desc' : '/asc'; // Меняем порядок
        await showSortedCategories('/orderById'+sortCategory.id);
    });

    name.addEventListener('click', async () => {
        sortCategory.name = sortCategory.name=== '/asc' ? '/desc' : '/asc'; // Меняем порядок
        await showSortedCategories('/orderByName'+sortCategory.name);
    });
}


let categories = null;
(async() =>{
    categories = await getCategories('');
    showCategories(categories);
    addHeadersListeners();
})()
