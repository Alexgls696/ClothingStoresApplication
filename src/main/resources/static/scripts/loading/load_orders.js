class Order{
    constructor(orderId,orderDate,storeId,statusId) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.storeId = storeId;
        this.statusId = statusId;
    }
}


const ip = location.host;
async function getOrders(){
    try{
        const response = await fetch(`http://${ip}/api/orders`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const ordersData = await response.json();
        return ordersData.map(order=>{
            return new Order(order.orderId,order.orderDate,order.storeId,order.statusId);
        })
    }catch (error){
        console.log(error);
    }
}

function showOrders(orders){
    const ordersTable = document.getElementById('orders-table ');
    ordersTable.innerHTML = '<thead class="table-dark"><tr>' +
        '<th>ID</th>' +
        '<th>Дата заказа</th>' +
        '<th>ID Магазина</th>' +
        '<th>ID Статуса</th></tr></thead>>'
    let tbody = document.createElement('tbody');
    orders.forEach(order=>{
        tbody.innerHTML += `<tr>
<td>${order.orderId}</td>
<td>${order.orderDate}</td>
<td>${order.storeId}</td>
<td>${order.statusId}</td>
</tr>`
    });
    ordersTable.appendChild(tbody);
}

let orders = null;
(async() =>{
    orders = await getOrders();
    showOrders( orders);
})()