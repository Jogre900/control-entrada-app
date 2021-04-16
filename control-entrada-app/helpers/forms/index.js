const messages = {
  require: "El campo es requerido.",
  minLength: "Formato de email erroneo.",
  passMinLength: "La clave es muy corta.",
  wrongName: "El nombre solo debe incluir letras.",
  maxLength: "Formato de email erroneo.",
  nameMinLength: "El nombre es muy corto.",
  nameMaxLength: "El nombre es muy largo.",
  wrongPhoneNumber: "El telefono solo debe contener numeros.",
  phoneMinLength: "El numero de telefono es muy corto.",
  phoneMaxLength: "El numero de telefono es muy largo.",
  wrongDni: "Ingrese un dni correcto",
};

const regEx = {
  name: /^[a-zA-Z]+$/gi, //PRIMER NOMBRE
  fullName: /^[a-zA-Z]+\s[a-zA-Z]+$/gi, //DOS NOMBRE CON ESPACIO EN MEDIO
  phoneNumber: /^[0-9]+$/g, //SOLO NUMBEROS
  dni: /^[A-Z]{1}\-[0-9]{1,3}\.?[0-9]{1,3}\.?[0-9]{1,3}$/gi, // DNI FORMATO LETRA-100.000.000 PUNTO OPCIONAL
};

export function validateEmail(email) {
  console.log("EMAIL VALUE FROM VALIDATE --", email);

  if (email.length === 0) {
    return messages.require;
  }
  if (email.length < 4) {
    return messages.minLength;
  }
  if (email.length > 15) {
    return messages.maxLength;
  }
  return "";
}

export function validatePass(pass) {
  if (!pass) {
    return messages.require;
  }
  if (pass.length < 4) {
    return messages.passMinLength;
  }
  return "";
}
export function validateRepPass(pass) {
  if (!pass) {
    return messages.require;
  }
  if (pass.length < 4) {
    return messages.passMinLength;
  }
  return "";
}
export function validateName(name) {
  console.log(name)
  if (!name) {
    return messages.require;
  }
  let nameMatch = name.match(regEx.name)
  console.log(nameMatch)
  if (!nameMatch) {
    return messages.wrongName;
  }
  if (name.length < 3) {
    return messages.nameMinLength;
  }
  if (name.length > 15) {
    return messages.nameMaxLength;
  }
  return "";
}
export function validateLastName(lastName) {
  if (!lastName) {
    return messages.require;
  }
  let lastNameMatch = lastName.match(regEx.name)
  if (!lastNameMatch) {
    return messages.wrongName;
  }
  if (lastName.length < 3) {
    return messages.nameMinLength;
  }
  if (lastName.length > 15) {
    return messages.nameMaxLength;
  }
  return "";
}
export function validatePhone(phone) {
  if (!phone) {
    return messages.require;
  }
  let phoneMatch = phone.match(regEx.phoneNumber)
  if (!phoneMatch) {
    return messages.wrongPhoneNumber;
  }
  if (phone.length < 3) {
    return messages.phoneMinLength;
  }
  if (phone.length > 15) {
    return messages.phoneMaxLength;
  }
  return "";
}
export function validateDni(dni) {
  if (!dni) {
    return messages.require;
  }
  let dniMatch = dni.match(regEx.dni)
  if (!dniMatch) {
    return messages.wrongDni;
  }
  return "";
}

export function validateCompany(company) {
  //console.log("nombre---",company)
  //console.log("reg company-----",regEx.name.test(company))

  if (!company) {
    return messages.require;
  }
  let companyMatch = company.match(regEx.name)
  if (!companyMatch) {
    return messages.wrongName;
  }
  if (company.length < 3) {
    return messages.nameMinLength;
  }
  if (company.length > 15) {
    return messages.nameMaxLength;
  }
  return "";
}

export function validateBusiness(businessName) {
  if (!businessName) {
    return messages.require;
  }
  let businessNameMatch = businessName.match(regEx.name)
  if (!businessNameMatch) {
    return messages.wrongName;
  }
  if (businessName.length < 3) {
    return messages.nameMinLength;
  }
  if (businessName.length > 15) {
    return messages.nameMaxLength;
  }
  return "";
}

export function validateNic(nic){
  if (!nic) {
    return messages.require;
  }
  if (nic.length < 3) {
    return messages.nameMinLength;
  }
  if (nic.length > 15) {
    return messages.nameMaxLength;
  }
  return "";
}