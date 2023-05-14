/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

// const process = require("process");
const port = 7566;
// const port = process.env.PORT_NUMBER || 3000;
const apiUrl = 'http://127.0.0.1:' + port + '/api/v1';

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
        //machineId: machineId,
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
          `/api/v1/createASMAmachine/${machineId}/createComponents/${sectorASMAID}`
        );
      }, 5000);
    } else {
      console.log('nichts');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// updateComponentASMA(
//   { componentASMAName_de, componentASMAName_en, componentASMADescription_de, componentASMADescription_en },

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
      url: `${apiUrl}/machinery/${machineID}/${sectorASMAID}/updateComponentASMA/${componentASMAID}`, // +
      //id,
      //127.0.0.1:7566/api/v1/createASMAmachine/6444566c830afd3adeba2d38/updateSectorASMA/645e7f222f0b54507c6859ae
      //http: data,
      data,
    });

    if (res.data.status === 'success') {
      // console.log('------------');
      // console.log(res.data.status);
      showAlert('success', `${res.data.message}`);
      // console.log('machineIDddddddddd: ' + machineID);
      window.setTimeout(() => {
        location.assign(
          `/api/v1/createASMAmachine/${machineID}/createComponents/${sectorASMAID}`
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
  //const WarummachineID = machineID;
  // const sectorASMAID = sectorASMAID;

  try {
    const res = await axios({
      method: 'DELETE', //${apiUrl}/machinery/${machineID}/${sectorASMAID}/updateComponentASMA/${componentASMAID}
      url: `${apiUrl}/machinery/${machineID}/${sectorASMAID}/updateComponentASMA/${componentASMAID}`,
    });

    if (res.status === 204) {
      //console.log(machineID);
      //alert('success', 'SectorASMA in machine successfully deleted');
      showAlert('success', 'Component successfully deleted');
      //alert(WarummachineID);
      //console.log(machineID);
      //console.log(${machineID})
      window.setTimeout(() => {
        //location.assign(`/api/v1/createASMAmachine/${WarummachineID}`);
        location.assign(`/api/v1/manage_ASMAmachine`);
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
