class Category{
    constructor(categoryId,categoryName) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }
}


const ip = location.host;
async function getCategories(){
    try{
        const response = await fetch(`http://${ip}/api/categories`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categoryData = await response.json();
        return categoryData.map(category=>{
            return new Category(category.categoryId,category.categoryName);
        })
    }catch (error){
        console.log(error);
    }
}

function showCategories(categories){
    const categoriesTable = document.getElementById('categories-table ');
    categoriesTable.innerHTML = '<thead class="table-dark"><tr><th>ID</th><th>Название</th</tr></thead>>'
    let tbody = document.createElement('tbody');
    categories.forEach(category=>{
      tbody.innerHTML += `<tr><td>${category.categoryId}</td><td>${category.categoryName}</td></tr>`
    });
    categoriesTable.appendChild(tbody);
}

let categories = null;
(async() =>{
    categories = await getCategories();
    showCategories(categories);
})()