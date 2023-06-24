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

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  console.log('bin updateSettings in updateSettings.js');
  try {
    const url =
      type === 'password'
        ? `${apiUrl}/users/updateMyPassword`
        : `${apiUrl}/users/updateMe`;

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/me`);
      }, 500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
