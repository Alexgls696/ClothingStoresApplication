class ProductType{
    constructor(typeId, typeName) {
        this.typeId = typeName;
        this.typeName = typeName;
    }
}


const ip = location.host;
async function getProductTypes(){
    try{
        const response = await fetch(`http://${ip}/api/productTypes`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const productTypesData = await response.json();
        return productTypesData.map(productType=>{
            return new ProductType(productType.typeId,productType.typeName);
        })
    }catch (error){
        console.log(error);
    }
}

function showProductTypes(productTypes){
    const orderStatusesTable = document.getElementById('product_types-table ');
    orderStatusesTable.innerHTML = '<thead class="table-dark"><tr>' +
        '<th>ID</th>' +
        '<th>Название</th>' +
        '</tr></thead>>'
    let tbody = document.createElement('tbody');
    productTypes.forEach(productType=>{
        tbody.innerHTML += `<tr>
<td>${productType.typeId}</td>
<td>${productType.typeName}</td>
</tr>`
    });
    orderStatusesTable.appendChild(tbody);
}

let productTypes = null;
(async() =>{
    productTypes = await getProductTypes();
    showProductTypes(productTypes);
})()