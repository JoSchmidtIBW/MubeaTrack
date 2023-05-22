/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

// const process = require("process");
const port = 7566;
// const port = process.env.PORT_NUMBER || 3000;
const apiUrl = 'http://127.0.0.1:' + port + '/api/v1';

export const updateASMAMachine = async (
  data,
  //currentUserID,
  machineID,
  departmentName,
  machineName
) => {
  console.log('bin updateASMAMachine in ASMAmachine.js');
  //console.log('currentUserID: ' + currentUserID);
  console.log('machineID: ' + machineID);
  console.log('departmentName: ' + departmentName);
  console.log('machineName: ' + machineName);
  console.log('data: ' + data);
  console.log('data: ' + JSON.stringify(data));

  const nameMachine = machineName;
  const nameDepartment = departmentName;
  console.log('nameMachine: ' + nameMachine);
  console.log('nameDepartment: ' + nameDepartment);

  // const encodedDepartmentName = encodeURIComponent(departmentName);
  // const encodedMachineName = encodeURIComponent(machineName);
  const encodedDepartmentName = encodeURIComponent(departmentName);
  const encodedMachineName = encodeURIComponent(machineName);

  console.log('encodedDepartmentName: ' + encodedDepartmentName);
  console.log('encodedMachineName: ' + encodedMachineName);

  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/machinery/updateASMAMachine/${machineID}`, // +
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
        ///api/v1/departments/Anarbeit/ASMA/Rattunde1
        //location.assign`/api/v1/departments/${nameDepartment}/ASMA/${nameMachine}`();
        //location.assign`/api/v1/departments/${encodedDepartmentName}/ASMA/${encodedMachineName}`();
        const redirectUrl = `/api/v1/departments/${encodedDepartmentName}/ASMA/${encodedMachineName}`;
        window.location.href = redirectUrl;
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message + 'XXXXX');
  }
};
