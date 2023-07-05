/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';
import process from 'process';

const dev_Port = 7566;
const prod_Port = 7577;

const port = process.env.NODE_ENV === 'development' ? dev_Port : prod_Port;
const host = 'http://127.0.0.1:';
const strPathApiV1 = '/api/v1';
const apiUrl = host + port + strPathApiV1;

export const createComponentDetailASMA = async (
  machineId,
  sectorASMAID,
  componentASMAID,
  input_name_de,
  input_name_en
) => {
  console.log('bin createComponentDetailASMA zum serverschicken');

  // console.log('machineId: ' + machineId);
  // console.log('sectorASMAID: ' + sectorASMAID);
  // console.log('componentASMAID: ' + componentASMAID);
  // console.log('input_name_de: ' + input_name_de);
  // console.log('input_name_en: ' + input_name_en);

  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/machinery/createSectorASMA/${machineId}/${sectorASMAID}/createComponentDetail/${componentASMAID}`,
      data: {
        componentDetailName_de: input_name_de,
        componentDetailName_en: input_name_en,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', res.data.message);
      window.setTimeout(() => {
        location.assign(
          `${strPathApiV1}/createASMAmachine/${machineId}/createComponents/${sectorASMAID}`
        );
      }, 5000);
    } else {
      console.log('not success');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateComponentDetailASMA = async (
  data,
  machineID,
  sectorASMAID,
  componentASMAID,
  componentDetailASMAID
) => {
  console.log('bin updateComponentDetailASMA in componentsDetailASMA.js');
  // console.log('machineID: ' + machineID);
  // console.log('sectorASMAID: ' + sectorASMAID);
  // console.log('componentASMAID: ' + componentASMAID);
  // console.log('componentDetailASMAID: ' + componentDetailASMAID);
  // console.log('data: ' + data);
  // console.log('data: ' + JSON.stringify(data));
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/machinery/${machineID}/${sectorASMAID}/${componentASMAID}/updateComponentDetailASMA/${componentDetailASMAID}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${res.data.message}`);
      window.setTimeout(() => {
        location.assign(
          `${strPathApiV1}/createASMAmachine/${machineID}/${sectorASMAID}/createComponentDetails/${componentASMAID}`
        );
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteComponentDetailASMA = async (
  machineID,
  sectorASMAID,
  componentASMAID,
  componentDetailASMAID
) => {
  console.log('bin deleteComponentDetailASMA in coponentsDetailASMA.js');
  // console.log('machineIDdelete: ' + machineID);
  // console.log('sectorASMAIDdelete: ' + sectorASMAID);
  // console.log('componentASMAID: ' + componentASMAID);

  try {
    const res = await axios({
      method: 'DELETE',
      url: `${apiUrl}/machinery/${machineID}/${sectorASMAID}/${componentASMAID}/updateComponentDetailASMA/${componentDetailASMAID}`,
    });

    if (res.status === 204) {
      showAlert('success', 'Component-detail successfully deleted');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/manage_ASMAmachine`);
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
