

async function checkRoleForDelete(){
    let role = await getRole();
    return role === 'role_admin';
}

async function getRole(){
    try{
        const ip = location.host;
        const response = await fetch(`http://${ip}/database/getRole`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    }catch (error){
        console.error(error);
    }
}


let role;
