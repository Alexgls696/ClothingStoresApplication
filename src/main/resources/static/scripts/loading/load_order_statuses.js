class OrderStatus{
    constructor(statusId,statusName) {
        this.statusId = statusId;
        this.statusName = statusName;
    }
}


const ip = location.host;
async function getOrderStatuses(){
    try{
        const response = await fetch(`http://${ip}/api/orderStatuses`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const orderStatusesData = await response.json();
        console.log(orderStatusesData);
        return orderStatusesData.map(orderStatus=>{
            return new OrderStatus(orderStatus.statusId,orderStatus.statusName);
        })
    }catch (error){
        console.log(error);
    }
}

function showOrderStatuses(orderStatuses){
    const orderStatusesTable = document.getElementById('order-statuses-table');
    orderStatusesTable.innerHTML = '<thead class="table-dark"><tr>' +
        '<th>ID</th>' +
        '<th>Статус</th>' +
        '</tr></thead>>'
    let tbody = document.createElement('tbody');
    orderStatuses.forEach(orderStatus=>{
        tbody.innerHTML += `<tr>
<td>${orderStatus.statusId}</td>
<td>${orderStatus.statusName}</td>
</tr>`
    });
    orderStatusesTable.appendChild(tbody);
}

let orderStatuses = null;
(async() =>{
    orderStatuses = await getOrderStatuses();
    showOrderStatuses(orderStatuses);
})()