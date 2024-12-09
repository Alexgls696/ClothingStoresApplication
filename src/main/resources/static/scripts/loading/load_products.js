class Product{
    constructor(productId,productName,price,categoryId,typeId,supplierId) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.categoryId = categoryId;
        this.typeId = typeId;
        this.supplierId = supplierId;
    }
}


const ip = location.host;
async function getProducts(){
    try{
        const response = await fetch(`http://${ip}/api/products`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const productsData = await response.json();
        return productsData.map(product=>{
            return new Product(product.productId,product.productName,
                product.price,product.categoryId,
                product.typeId,product.supplierId);
        })
    }catch (error){
        console.log(error);
    }
}

function showProducts(products){
    const productsTable = document.getElementById('products-table ');
    productsTable.innerHTML = '<thead class="table-dark"><tr>' +
        '<th>ID</th>' +
        '<th>Название</th>' +
        '<th>Цена</th>' +
        '<th>ID Категории</th>' +
        '<th>ID Типа продукта</th>' +
        '<th>ID Производителя</th>' +
        '</tr></thead>>'
    let tbody = document.createElement('tbody');
    products.forEach(product=>{
        tbody.innerHTML += `<tr>
<td>${product.productId}</td>
<td>${product.productName}</td>
<td>${product.price}</td>
<td>${product.categoryId}</td>
<td>${product.typeId}</td>
<td>${product.supplierId}</td>
</tr>`
    });
    productsTable.appendChild(tbody);
}

let products = null;
(async() =>{
    products = await getProducts();
    showProducts(products);
})()