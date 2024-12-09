class Employee{
    constructor(employeeId,firstName,lastName,storeId,position,email) {
       this.employeeId = employeeId;
       this.firstName = firstName;
       this.lastName = lastName;
       this.storeId = storeId;
       this.position = position;
       this.email = email;
    }
}


const ip = location.host;
async function getEmployees(){
    try{
        const response = await fetch(`http://${ip}/api/employees`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const employeesData = await response.json();
        return employeesData.map(employee=>{
            return new Employee(employee.employeeId,employee.firstName,
                employee.lastName,employee.storeId,employee.position,employee.email);
        })
    }catch (error){
        console.log(error);
    }
}

function showEmployees(employees){
    const employeesTable = document.getElementById('employees-table ');
    employeesTable.innerHTML = '<thead class="table-dark"><tr><th>ID</th>' +
        '<th>Имя</th>' +
        '<th>Фамилия</th>' +
        '<th>ID Магазина</th>' +
        '<th>Должность</th>' +
        '<th>Почта</th></tr></thead>>'
    let tbody = document.createElement('tbody');
    employees.forEach(employee=>{
        tbody.innerHTML += `<tr>
<td>${employee.employeeId}</td>
<td>${employee.firstName}</td>
<td>${employee.lastName}</td>
<td>${employee.storeId}</td>
<td>${employee.position}</td>
<td>${employee.email}</td>
</tr>`
    });
    employeesTable.appendChild(tbody);
}

let employees = null;
(async() =>{
    employees = await getEmployees();
   showEmployees(employees);
})()