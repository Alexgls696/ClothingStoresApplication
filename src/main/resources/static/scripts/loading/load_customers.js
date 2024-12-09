class Customer{
    constructor(customerId,firstName,lastName,email,phoneNumber,orderId) {
        this.customerId = customerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.orderId = orderId;
    }
}


const ip = location.host;
async function getCustomers(){
    try{
        const response = await fetch(`http://${ip}/api/customers`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const customersData = await response.json();
        return customersData.map(customer=>{
            return new Customer(customer.customerId,customer.firstName,customer.lastName,customer.email,customer.phoneNumber,customer.orderId);
        })
    }catch (error){
        console.log(error);
    }
}

function showCustomers(customers){
    const customersTable = document.getElementById('customers-table ');
    customersTable.innerHTML = '<thead class="table-dark"><tr><th>ID</th><th>Имя</th><th>Фамилия</th><th>Почта</th><th>Номер телефона</th><th>ID заказа</th></tr></thead>>'
    let tbody = document.createElement('tbody');
    customers.forEach(customer=>{
        tbody.innerHTML += `<tr>
<td>${customer.customerId}</td>
<td>${customer.firstName}</td>
<td>${customer.lastName}</td>
<td>${customer.email}</td>
<td>${customer.phoneNumber}</td>
<td>${customer.orderId}</td>
</tr>`
    });
    customersTable.appendChild(tbody);
}

let customers = null;
(async() =>{
    customers = await getCustomers();
    showCustomers(customers);
})()