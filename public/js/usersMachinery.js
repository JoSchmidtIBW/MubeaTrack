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

export const showUsersMachinery = async () => {
  console.log('bin showUsersMachinery in usersMachinery.js');
  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/users/usersMachinery`,
    });

    if (res.data.status === 'success') {
      console.log('success in showUsersMachinery');
      console.log(res.data.data);
      console.log(res.data);
      console.log('-----------------');
      console.log(res.data.data.machinery);
      console.log('-----------------***************');

      const usersData = res.data.data.users;

      $('#manageUsersMachineryTable').DataTable().destroy();

      $('#manageUsersMachineryTable').DataTable({
        data: usersData,
        dom: 'l<"toolbar">frtip',
        pagingType: 'full_numbers',
        paging: true,
        language: {
          lengthMenu: 'Display _MENU_ records per page',
          zeroRecords: 'Nothing found - sorry',
          info: 'Showing page _PAGE_ of _PAGES_',
          infoEmpty: 'No records available',
          infoFiltered: '(filtered from _MAX_ total records)',
          paginate: {
            first: 'First',
            last: 'Last',
            next: 'Next',
            previous: 'Previous',
          },
        },
        lengthChange: true,
        lengthMenu: [
          [2, 5, 10, -1],
          [2, 5, 10, 'All'],
        ],
        pageLength: 5,
        columns: [
          {
            data: '_id',
            visible: false,
          },
          { data: 'employeeNumber' },
          { data: 'lastName' },
          { data: 'firstName' },
          { data: 'professional' },
          { data: 'department' },
          {
            data: 'machinery',
            render: function (data) {
              if (data && Array.isArray(data)) {
                console.log('Data is an array');
                //console.log(res.data.data.machinery);
                return data
                  .map(function (machineId) {
                    console.log(typeof machineId);
                    console.log(machineId);
                    const machine = res.data.data.machinery.find(function (m) {
                      return m._id.toString() === machineId.toString();
                    });
                    console.log(machine.name);
                    
                    console.log(typeof machineId, typeof machine._id);
                    return machine ? machine.name : 'No machine found';
                  })
                  .join(', ');
              } else {
                return 'No machine assigned';
              }
            },
          },
          {
            data: '_id',
            render: function (data) {
              return `
              <a href="${strPathApiV1}/manage_usersMachinery/${data}" class="edit-button">
                <svg class="heading-box__icon">
                <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                </svg>
              </a>`;
            },
            orderable: false,
          },
        ],
      });
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateUserMachinery = async (data, userID) => {
  console.log('bin updateUserMachinery in userMachinery.js');
  console.log('userID: ' + userID);
  console.log('data: ' + data);
  console.log('data: ' + JSON.stringify(data));
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/users/updateUserMachinery/${userID}`,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${res.data.message}`);
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/manage_user-machine`);
      }, 5000);
    }
  } catch (err) {
    showAlert(
      'error',
      err.response.data.message + 'bin updateUserMachinery in userMachinery.js'
    );
  }
};
