class Supplier{
    constructor(supplierId, supplierName) {
        this.supplierId = supplierId;
        this.supplierName = supplierName;
    }
}


const ip = location.host;
async function getSuppliers(){
    try{
        const response = await fetch(`http://${ip}/api/suppliers`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const suppliersData = await response.json();
        return  suppliersData.map(supplier=>{
            return new Supplier(supplier.supplierId,supplier.supplierName);
        })
    }catch (error){
        console.log(error);
    }
}

function showSuppliers(suppliers){
    const suppliersTable = document.getElementById('suppliers-table');
    suppliersTable.innerHTML = '<thead class="table-dark"><tr>' +
        '<th>ID</th>' +
        '<th>Название</th>' +
        '</tr></thead>>'
    let tbody = document.createElement('tbody');
    suppliers.forEach(supplier=>{
        tbody.innerHTML += `<tr>
<td>${supplier.supplierId}</td>
<td>${supplier.supplierName}</td>
</tr>`
    });
    suppliersTable.appendChild(tbody);
}

let supplier = null;
(async() =>{
    supplier = await getSuppliers();
    showSuppliers(supplier);
})()