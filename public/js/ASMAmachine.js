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

export const updateASMAMachine = async (
  data,
  machineID,
  departmentName,
  machineName
) => {
  console.log('bin updateASMAMachine in ASMAmachine.js');
  // console.log('machineID: ' + machineID);
  // console.log('departmentName: ' + departmentName);
  // console.log('machineName: ' + machineName);
  // console.log('data: ' + data);
  // console.log('data: ' + JSON.stringify(data));

  const nameMachine = machineName;
  const nameDepartment = departmentName;
  // console.log('nameMachine: ' + nameMachine);
  // console.log('nameDepartment: ' + nameDepartment);

  const encodedDepartmentName = encodeURIComponent(departmentName);
  const encodedMachineName = encodeURIComponent(machineName);

  // console.log('encodedDepartmentName: ' + encodedDepartmentName);
  // console.log('encodedMachineName: ' + encodedMachineName);

  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/machinery/updateASMAMachine/${machineID}`, // +
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${res.data.message}`);
      window.setTimeout(() => {
        const redirectUrl = `/api/v1/departments/${encodedDepartmentName}/ASMA/${encodedMachineName}`;
        window.location.href = redirectUrl;
      }, 5000);
    }
  } catch (err) {
    showAlert(
      'error',
      err.response.data.message + ' updateASMAMachine in ASMAmachine.js'
    );
  }
};
