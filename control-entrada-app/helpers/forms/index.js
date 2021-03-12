const messages = {
require: 'El campo es requerido',
minLength: 'Formato de email erroneo',
maxLength: 'Formato de email erroneo'
}

export function validateEmail(email){
    let errors = null    
    if(!email){
        errors = messages.require
        return errors
    }
    if(email.length < 4){
        errors = messages.minLength
        return errors
    }
    if(email.length > 15){
        errors = messages.maxLength
        return errors
    }
    return errors
}

export function validatePass(pass){
    let errors = null
    if(pass.length === 0){
        errors = messages.require
        return errors
    }
    if(pass.length < 4){
        errors = messages.minLength
        return errors
    }
    return errors
}