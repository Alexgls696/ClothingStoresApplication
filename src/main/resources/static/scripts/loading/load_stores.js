class Store{
    constructor(storeId,location) {
        this.storeId = storeId;
        this.location = location;
    }
}


const ip = location.host;
async function getStores(){
    try{
        const response = await fetch(`http://${ip}/api/stores`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const storesData = await response.json();
        return storesData.map(store=>{
            return new Store(store.storeId,store.location);
        })
    }catch (error){
        console.log(error);
    }
}

function showStores(stores){
    const storesTable = document.getElementById('stores-table');
    storesTable.innerHTML = '<thead class="table-dark"><tr>' +
        '<th>ID</th>' +
        '<th>Местоположение</th>' +
        '</tr></thead>>'
    let tbody = document.createElement('tbody');
    stores.forEach(store=>{
        tbody.innerHTML += `<tr>
<td>${store.storeId}</td>
<td>${store.location}</td>
</tr>`
    });
    storesTable.appendChild(tbody);
}

let stores = null;
(async() =>{
    stores = await getStores();
    showStores(stores);
})()