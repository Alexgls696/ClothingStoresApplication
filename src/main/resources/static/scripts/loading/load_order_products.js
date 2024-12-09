class OrderProduct{
    constructor(orderProductId,productId,orderId,count) {
        this.orderProductId = orderProductId;
        this.productId = productId;
        this.orderId = orderId;
        this.count = count;
    }
}


const ip = location.host;
async function getOrderProducts(){
    try{
        const response = await fetch(`http://${ip}/api/orderProducts`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const orderProductsData = await response.json();
        return orderProductsData.map(orderProduct=>{
            return new OrderProduct(orderProduct.orderProductId,
                orderProduct.productId,
                orderProduct.orderId,
                orderProduct.count);
        })
    }catch (error){
        console.log(error);
    }
}

function showOrderProducts(orderProducts){
    const orderProductsTable = document.getElementById('order-products-table');
    orderProductsTable.innerHTML = '<thead class="table-dark"><tr>' +
        '<th>ID</th>' +
        '<th>ID Продукта</th>' +
        '<th>ID Заказа</th>' +
        '<th>Количество</th></tr></thead>>'
    let tbody = document.createElement('tbody');
    orderProducts.forEach(orderProduct=>{
        tbody.innerHTML += `<tr>
<td>${orderProduct.orderProductId}</td>
<td>${orderProduct.productId}</td>
<td>${orderProduct.orderId}</td>
<td>${orderProduct.count}</td>
</tr>`
    });
    orderProductsTable.appendChild(tbody);
}

let orderProducts = null;
(async() =>{
    orderProducts = await getOrderProducts();
    showOrderProducts(orderProducts);
})()