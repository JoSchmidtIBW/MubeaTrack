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

export const createComponentASMA = async (
  machineId,
  sectorASMAID,
  input_name_de,
  input_name_en,
  input_description_de,
  input_description_en
) => {
  console.log('bin createSectorASMA zum serverschicken');

  console.log('machineId: ' + machineId);
  console.log('sectorASMAID: ' + sectorASMAID);
  console.log('input_name_de: ' + input_name_de);
  console.log('input_name_en: ' + input_name_en);
  console.log('input_description_de: ' + input_description_de);
  console.log('input_description_en: ' + input_description_en);

  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/machinery/createSectorASMA/${machineId}/createComponent/${sectorASMAID}`,
      data: {
        componentName_de: input_name_de,
        componentName_en: input_name_en,
        componentDescription_de: input_description_de,
        componentDescription_en: input_description_en,
      },
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'New component has been successfully added to the machine'
      );
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

export const updateComponentASMA = async (
  data,
  machineID,
  sectorASMAID,
  componentASMAID
) => {
  console.log('bin updateComponentASMA in componentsASMA.js');
  console.log('machineID: ' + machineID);
  console.log('sectorASMAID: ' + sectorASMAID);
  console.log('componentASMAID: ' + componentASMAID);
  console.log('data: ' + data);
  console.log('data: ' + JSON.stringify(data));
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/machinery/${machineID}/${sectorASMAID}/updateComponentASMA/${componentASMAID}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${res.data.message}`);
      window.setTimeout(() => {
        location.assign(
          `${strPathApiV1}/createASMAmachine/${machineID}/createComponents/${sectorASMAID}`
        );
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteComponentASMA = async (
  machineID,
  sectorASMAID,
  componentASMAID
) => {
  console.log('bin deleteComponentASMA in coponentsASMA.js');
  console.log('machineIDdelete: ' + machineID);
  console.log('sectorASMAIDdelete: ' + sectorASMAID);
  console.log('componentASMAID: ' + componentASMAID);

  try {
    const res = await axios({
      method: 'DELETE',
      url: `${apiUrl}/machinery/${machineID}/${sectorASMAID}/updateComponentASMA/${componentASMAID}`,
    });

    if (res.status === 204) {
      showAlert('success', 'Component successfully deleted');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/manage_ASMAmachine`);
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
