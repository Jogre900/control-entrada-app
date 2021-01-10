// Esto es para registrar un id de la base de datos al dispositivo
OneSignal.setExternalUserId(responseApi.userId, (results) => {
// The results will contain push and email success statuses
console.log('Results of setting external user id');
console.log(results);

                  // Push can be expected in almost every situation with a success status, but
                  // as a pre-caution its good to verify it exists
                  if (results.push && results.push.success) {
                    console.log(
                      'Results of setting external user id push status:',
                    );
                    console.log(results.push.success);
                  }

                  // Verify the email is set or check that the results have an email success status
                  if (results.email && results.email.success) {
                    console.log(
                      'Results of setting external user id email status:',
                    );
                    console.log(results.email.success);
                  }
                });

//esta elimina el id del usuario del dispositivo
OneSignal.removeExternalUserId((results) => {
// The results will contain push and email success statuses
console.log('Results of removing external user id');
console.log(results);
// Push can be expected in almost every situation with a success status, but
// as a pre-caution its good to verify it exists
if (results.push && results.push.success) {
console.log('Results of removing external user id push status:');
console.log(results.push.success);
}

            // Verify the email is set or check that the results have an email success status
            if (results.email && results.email.success) {
              console.log(
                'Results of removoing external user id email status:',
              );
              console.log(results.email.success);
            }
          });
