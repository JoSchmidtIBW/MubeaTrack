/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts.js';

export const createUser = async (email, password) => {
  //alert(email)
  console.log(email, password);
  //alert(`${email}, ${password}`);
  //alert(` ${password}`);

  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:7566/api/v1/users/login', //http://127.0.0.1:3000/api/v1/users/login => http://localhost:3000/api/v1/users/login
      data: {
        email: email,
        password: password,
      },
    });

    if (res.data.status === 'success') {
      // das ist der gesendete status in data
      //alert('Logged in successfully!');
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/overview'); //wie redirect
      }, 1500);
    }

    //console.log(res)
  } catch (err) {
    console.log(JSON.stringify(err.response.data) + ' bin login in login.js'); // kommt von axios documentation
    console.log(
      JSON.stringify(err.response.data.message) + ' bin login in login.js'
    );
    // alert(JSON.stringify(err.response.data.message) + " bin login in login.js") // data ist data-responce

    if (
      err.response.data.message ===
      "Cannot read properties of null (reading 'password')"
    ) {
      showAlert(
        'error',
        JSON.stringify(err.response.data.message) + ' email not found in db'
      );
    } else if (err.response.data.message === 'isBcrypt is not defined') {
      showAlert(
        'error',
        JSON.stringify(err.response.data.message) +
          ' password is wrong, email is found'
      );
    } else {
      showAlert(
        'error',
        JSON.stringify(err.response.data.message) + ' bin login in login.js'
      );
    }

    //console.log(JSON.parse(err.response.data) + " bin login in login.js")
    //console.log(err.response.data + " bin login in login.js")
  }
};
