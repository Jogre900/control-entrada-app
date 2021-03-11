const messages = {
require: 'El campo es requerido',
minLength: 'El valor es muy corto'
}

export function validateForm(datos, rules){
    console.log(datos)
    console.log(rules)
    let rulesArray = []
    let errors = {
        message: ''
    }
    Object.values(rules).map((value) => {
        switch (value) {
            case 'email':
                console.log("es un email")
                if(email === ''){
                    return errors.message= messages.require
                }else if(email.length <= 3){
                    return errors.message = messages.minLength 
                }
                console.log(errors)
                break;
        case 'password':
            console.log("es un password")
            break
            default:
                break;
        }
})

    
    
}