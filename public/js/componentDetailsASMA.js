/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';
import process from 'process';

// const process = require("process");
//const port = 7566;
// const port = process.env.PORT_NUMBER || 3000;
//const apiUrl = 'http://127.0.0.1:' + port + '/api/v1';

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

export const createComponentDetailASMA = async (
  machineId,
  sectorASMAID,
  componentASMAID,
  input_name_de,
  input_name_en
) => {
  console.log('bin createComponentDetailASMA zum serverschicken');

  console.log('machineId: ' + machineId);
  console.log('sectorASMAID: ' + sectorASMAID);
  console.log('componentASMAID: ' + componentASMAID);
  console.log('input_name_de: ' + input_name_de);
  console.log('input_name_en: ' + input_name_en);

  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/machinery/createSectorASMA/${machineId}/${sectorASMAID}/createComponentDetail/${componentASMAID}`,
      data: {
        //machineId: machineId,
        componentDetailName_de: input_name_de,
        componentDetailName_en: input_name_en,
      },
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        res.data.message
        //'New component has been successfully added to the machine'
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

export const updateComponentDetailASMA = async (
  data,
  machineID,
  sectorASMAID,
  componentASMAID,
  componentDetailASMAID
) => {
  console.log('bin updateComponentDetailASMA in componentsDetailASMA.js');
  console.log('machineID: ' + machineID);
  console.log('sectorASMAID: ' + sectorASMAID);
  console.log('componentASMAID: ' + componentASMAID);
  console.log('componentDetailASMAID: ' + componentDetailASMAID);
  console.log('data: ' + data);
  console.log('data: ' + JSON.stringify(data));
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/machinery/${machineID}/${sectorASMAID}/${componentASMAID}/updateComponentDetailASMA/${componentDetailASMAID}`, // +
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
  console.log('machineIDdelete: ' + machineID);
  console.log('sectorASMAIDdelete: ' + sectorASMAID);
  console.log('componentASMAID: ' + componentASMAID);
  //const WarummachineID = machineID;
  // const sectorASMAID = sectorASMAID;

  try {
    const res = await axios({
      method: 'DELETE', //${apiUrl}/machinery/${machineID}/${sectorASMAID}/updateComponentASMA/${componentASMAID}
      url: `${apiUrl}/machinery/${machineID}/${sectorASMAID}/${componentASMAID}/updateComponentDetailASMA/${componentDetailASMAID}`,
    });

    if (res.status === 204) {
      //console.log(machineID);
      //alert('success', 'SectorASMA in machine successfully deleted');
      showAlert('success', 'Component-detail successfully deleted');
      //alert(WarummachineID);
      //console.log(machineID);
      //console.log(${machineID})
      window.setTimeout(() => {
        //location.assign(`/api/v1/createASMAmachine/${WarummachineID}`);
        location.assign(`${strPathApiV1}/manage_ASMAmachine`);
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
