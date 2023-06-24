/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts.js';
import process from 'process';

const dev_Port = 7566;
const prod_Port = 7577;

const port = process.env.NODE_ENV === 'development' ? dev_Port : prod_Port;
const host = 'http://127.0.0.1:';
const strPathApiV1 = '/api/v1';
const apiUrl = host + port + strPathApiV1;

export const login = async (employeeNumber, password) => {
  console.log(employeeNumber, password);

  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/users/login`,
      data: {
        employeeNumber: employeeNumber,
        password: password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/overview`);
      }, 1500);
    }
  } catch (err) {
    console.log(JSON.stringify(err.response.data) + ' bin login in login.js');
    console.log(
      JSON.stringify(err.response.data.message) + ' bin login in login.js'
    );

    if (
      err.response.data.message ===
      "Cannot read properties of null (reading 'password')"
    ) {
      showAlert(
        'error',
        JSON.stringify(err.response.data.message) +
          ' employeeNumber not found in db'
      );
    } else if (err.response.data.message === 'isBcrypt is not defined') {
      showAlert(
        'error',
        JSON.stringify(err.response.data.message) +
          ' password is wrong, employeeNumber is found'
      );
    } else {
      showAlert(
        'error',
        JSON.stringify(err.response.data.message) + ' bin login in login.js'
      );
    }
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/users/logout`,
    });

    if (res.data.status === 'success') location.assign('/');
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try agein.');
  }
};
