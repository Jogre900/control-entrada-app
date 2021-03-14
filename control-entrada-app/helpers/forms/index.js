const messages = {
  require: "El campo es requerido.",
  minLength: "Formato de email erroneo.",
  passMinLength: 'La clave es muy corta.',
  wrongName: "El nombre solo debe incluir letras.",
  maxLength: "Formato de email erroneo.",
  nameMinLength: "El nombre es muy corto.",
  nameMaxLength: 'El nombre es muy largo.',
  wrongPhoneNumber: 'El telefono solo debe contener numeros.',
  phoneMinLength: "El numero de telefono es muy corto.",
  phoneMaxLength: 'El numero de telefono es muy largo.',
  wrongDni: 'Ingrese un dni correcto'
};

const regEx = {
  name: /^[a-zA-Z]+$/gi, //PRIMER NOMBRE
  fullName: /^[a-zA-Z]+\s[a-zA-Z]+$/gi, //DOS NOMBRE CON ESPACIO EN MEDIO
  dni: /^[A-Z]/g, //SOLO LETRAS
  phoneNumber: /^[0-9]+$/g, //SOLO NUMBEROS
  dni: /^[A-Z]{1}\-[0-9]{1,3}\.?[0-9]{1,3}\.?[0-9]{1,3}$/gi  // DNI FORMATO LETRA-100.000.000 PUNTO OPCIONAL
};

export function validateEmail(email) {
  let errors = null;
  if (!email) {
    errors = messages.require;
    return errors;
  }
  if (email.length < 4) {
    errors = messages.minLength;
    return errors;
  }
  if (email.length > 15) {
    errors = messages.maxLength;
    return errors;
  }
  return errors;
}

export function validatePass(pass) {
  let errors = null;
  if (!pass) {
    errors = messages.require;
    return errors;
  }
  if (pass.length < 4) {
    errors = messages.passMinLength;
    return errors;
  }
  return errors;
}
export function validateRepPass(pass) {
    let errors = null;
    if (!pass) {
      errors = messages.require;
      return errors;
    }
    if (pass.length < 4) {
      errors = messages.passMinLength;
      return errors;
    }
    return errors;
  }
export function validateName(name) {
  console.log("nombre---",name)
    console.log("reg name-----",regEx.name.test(name))
    let errors = {};
  if (!name) {
    errors = messages.require;
  } else if (!regEx.name.test(name) || !regEx.fullName.test(name)) {
    errors = messages.wrongName;
  } else if (name.length < 3) {
    errors = messages.nameMinLength;
  } else if (name.length > 15) {
    errors = messages.nameMaxLength;
  }
  return errors;
}
export function validateLastName(lastName) {
    //console.log("nombre---",lastName)
      //console.log("reg lastName-----",regEx.lastName.test(lastName))
      let errors = {};
    if (!lastName) {
      errors = messages.require;
    } else if (!regEx.name.test(lastName) || !regEx.fullName.test(lastName)) {
      errors = messages.wrongName;
    } else if (lastName.length < 3) {
      errors = messages.nameMinLength;
    } else if (lastName.length > 15) {
      errors = messages.nameMaxLength;
    }
    return errors;
  }
export function validatePhone(phone){
    let errors = {}
    if (!phone) {
        errors = messages.require;
      } else if (!regEx.phoneNumber.test(phone)) {
        errors = messages.wrongPhoneNumber;
      } else if (phone.length < 3) {
        errors = messages.phoneMinLength;
      } else if (phone.length > 15) {
        errors = messages.phoneMaxLength;
      } 
    return errors
}
export function validateDni(dni){
    let errors = {}
    if(!dni){
        errors = messages.require
    }else if(!regEx.dni.test(dni)){
        erros = messages.wrongDni
    }
    return errors
}

export function validateCompany(company) {
    //console.log("nombre---",company)
      //console.log("reg company-----",regEx.name.test(company))
      let errors = {};
    if (!company) {
      errors = messages.require;
    } else if (!regEx.name.test(company) || !regEx.fullName.test(company)) {
      errors = messages.wrongName;
    } else if (company.length < 3) {
      errors = messages.nameMinLength;
    } else if (company.length > 15) {
      errors = messages.nameMaxLength;
    }
    return errors;
  }

  export function validateBusiness(businessName) {
    //console.log("nombre---",businessName)
      //console.log("reg businessName-----",regEx.name.test(businessName))
      let errors = {};
    if (!businessName) {
      errors = messages.require;
    } else if (!regEx.name.test(businessName) || !regEx.fullName.test(businessName)) {
      errors = messages.wrongName;
    } else if (businessName.length < 3) {
      errors = messages.nameMinLength;
    } else if (businessName.length > 15) {
      errors = messages.nameMaxLength;
    }
    return errors;
  }

