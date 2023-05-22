/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

// const process = require("process");
const port = 7566;
// const port = process.env.PORT_NUMBER || 3000;
const apiUrl = 'http://127.0.0.1:' + port + '/api/v1';

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
      console.log(res.data.data.machinery);
      const usersData = res.data.data.users;

      $('#manageUsersMachineryTable').DataTable().destroy();
      // $('#manageUsersTable').on('click', '.delete-button', function () {
      //   const id = $(this).attr('data-id');
      //   //deleteUser(id);
      // });
      // $('#manageUsersTable').on('click', '.edit-button', function () {
      //   const id = $(this).attr('id');
      //   location.assign(`/userw/${id}`);
      // });

      $('#manageUsersMachineryTable').DataTable({
        data: usersData, //res.data.data.data,
        //pagingType: 'full_numbers', // Hier wird das Paging-Layout definiert
        dom: 'l<"toolbar">frtip',
        pagingType: 'full_numbers',
        paging: true, // zeigt immer den "Next"-Button an, auch wenn weniger als 2
        //lengthChange: false, // verhindert, dass der Benutzer die Anzahl der angezeigten Einträge ändern kann
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
        lengthChange: true, // verhindert, dass der Benutzer die Anzahl der angezeigten Einträge ändern kann
        lengthMenu: [
          [2, 5, 10, -1],
          [2, 5, 10, 'All'],
        ],
        pageLength: 5, // Hier wird die standardmäßige Anzahl von Einträgen pro Seite definiert
        columns: [
          {
            data: '_id', //'users._id',
            visible: true,
            // visible: true,
            // render: function (data) {
            //   return data;
            // },
            // render: function (data) {
            //   return data;
            // },
          },
          { data: 'employeeNumber' },
          { data: 'firstName' },
          { data: 'lastName' },
          { data: 'professional' },
          { data: 'department' },
          {
            data: 'machinery',
            render: function (data) {
              if (data && Array.isArray(data)) {
                console.log('Data is an array');
                console.log(res.data.data.machinery);
                return data
                  .map(function (machineId) {
                    console.log(typeof machineId);
                    const machine = res.data.data.machinery.find(function (m) {
                      return m._id.toString() === machineId.toString();
                    });
                    console.log(machine);
                    console.log(typeof machineId, typeof machine._id);
                    return machine ? machine.name : 'No machine found';
                  })
                  .join(', ');
              } else {
                return 'No machine assigned';
              }
            },
            // ...

            // render: function (data) {
            //   if (data && Array.isArray(data)) {
            //     return data
            //       .map(function (machineId) {
            //         const machine = res.data.data.machinery.find(function (m) {
            //           return m._id.toString() === machineId.toString();
            //         });
            //         return machine ? machine.name : 'No machine found';
            //       })
            //       .join(', ');
            //   } else {
            //     return 'No machine assigned';
            //   }
            // },
            // render: function (data) {
            //   if (data && Array.isArray(data)) {
            //     return data
            //       .map(function (machineId) {
            //         const machine = res.data.data.machinery.find(function (m) {
            //           return m._id.toString() === machineId.toString();
            //         });
            //         return machine ? machine.name : 'No machine found';
            //       })
            //       .join(', ');
            //   } else {
            //     return 'No machine assigned';
            //   }
            // },
            // render: function (data) {
            //   if (data) {
            //     return data
            //       .map(function (machineId) {
            //         const machine = res.data.data.machinery.find(function (m) {
            //           return m._id.toString() === machineId.toString();
            //         });
            //
            //         return machine ? machine.name : 'No machine found';
            //       })
            //       .join(', ');
            //   } else {
            //     return 'No machine assigned';
            //   }
            // },
          },
          {
            data: '_id',
            render: function (data) {
              return `
              <a href="/api/v1/manage_usersMachinery/${data}" class="edit-button">
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
      url: `${apiUrl}/users/updateUserMachinery/${userID}`, // +
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
        location.assign`/api/v1/manage_user-machine`();
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message + 'XXXXX');
  }
};
