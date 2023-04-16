/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts.js';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  console.log('bin updateSettings in updateSettings.js');
  // data, type // name und email kommen von pug input
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:7566/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:7566/api/v1/users/updateMe';

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
