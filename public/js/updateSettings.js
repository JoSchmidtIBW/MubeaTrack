/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts.js';
import process from 'process';

//const port = 7566;

//const port = 7566;
const dev_Port = 7566;
const prod_Port = 7577;

const port = process.env.NODE_ENV === 'development' ? dev_Port : prod_Port;
const host = 'http://127.0.0.1:';
const strPathApiV1 = '/api/v1';
const apiUrl = host + port + strPathApiV1;

// const port =
//   process.env.NODE_ENV === 'development'
//     ? process.env.DEV_PORT
//     : process.env.PROD_PORT;
// const apiUrl = `http://127.0.0.1:${port}/api/v1`;

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  console.log('bin updateSettings in updateSettings.js');
  // data, type // name und email kommen von pug input
  try {
    const url =
      type === 'password'
        ? `${apiUrl}/users/updateMyPassword`
        : `${apiUrl}/users/updateMe`;

    const res = await axios({
      method: 'PATCH',
      url, //: url,
      data, //: {
      //     data, //das schicken wir der API
      // }
    });

    //testen, ob das gesendete zum server angekommen ist
    if (res.data.status === 'success') {
      // status bei API request
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/me`);
      }, 500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message); //err.responce.data.message) //testen, zb falsche email bei /me eingeben
  }
};

// update Name und Email    weil Pw update genau gleich wie diese funktion, wird zwei in eins gemacht
// updateUser   wenn API call, dann muss method=POST in pug darf nicht stehen
// export const updateData = async(name, email) => { // name und email kommen von pug input
//     try {
//         const res = await axios({
//             method: 'PATCH',
//             url: 'http://127.0.0.1:4301/api/v1/users/updateMe',
//             data: {
//                 name, //das schicken wir der API
//                 email,
//             }
//         })

//         //testen, ob das gesendete zum server angekommen ist
//         if (res.data.status === 'success') { // status bei API request
//             showAlert('success', 'Data updated successfully!')
//         }

//     } catch (err) {
//         console.log(err)
//         showAlert('error', err.response.data.message) //err.responce.data.message) //testen, zb falsche email bei /me eingeben
//     }
// }
