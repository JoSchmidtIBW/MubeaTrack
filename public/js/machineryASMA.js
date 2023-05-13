/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

// const process = require("process");
const port = 7566;
// const port = process.env.PORT_NUMBER || 3000;
const apiUrl = 'http://127.0.0.1:' + port + '/api/v1';

export const showASMAmachinery = async () => {
  console.log('bin showASMAmachinery in machineryASMA.js');

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/machinery/machineryASMA`,
    });

    if (res.data.status === 'success') {
      console.log('success in showASMAmachinery');
      console.log(res.data.data.data);

      $('#manageASMAMachineTable').DataTable().destroy();
      // $('#manageUsersTable').on('click', '.delete-button', function () {
      //   const id = $(this).attr('data-id');
      //   //deleteUser(id);
      // });
      // $('#manageUsersTable').on('click', '.edit-button', function () {
      //   const id = $(this).attr('id');
      //   location.assign(`/userw/${id}`);
      // });

      $('#manageASMAMachineTable').DataTable({
        data: res.data.data.data,
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
            data: '_id',
            visible: true,
          },
          { data: 'name' },
          { data: 'description' },
          { data: 'department' },
          // { data: 'ASMAmachinery' },
          {
            data: null,
            render: function (data, type, row, meta) {
              let html = '';
              data.sectorASMA.forEach(function (sector) {
                html += `<p>${sector.name}</p>`;
              });
              return html;
            },
          },
          {
            data: '_id',
            render: function (data) {
              // return `<a href="/user/${data}" class="edit-button">Edit</a>
              // <button class="delete-button" data-id="${data}">Delete</button>`;
              //return `<a href="/user/${data}" class="edit-button">Edit</a>`;
              // return (
              //   '<a href="/api/v1/manage_ASMA/createASMAmachine/' +
              //   data +
              //   '" class="edit-button">Edit</a>'
              // );
              return `
              <a href="/api/v1/createASMAmachine/${data}" class="edit-button" >
                <svg class="heading-box__icon">
                <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                </svg>
              </a>`;

              // '<a href="#" id="' + data + '" class="edit-button"><i class="fas fa-edit"></i></a>'`;
              // return '<a href="#" class="edit-button"><i class="fas fa-edit"></i></a>';
              //             svg.heading-box__icon
              // use(xlink:href='/img/icons.svg#icon-map-pin')`;
              //<svg className="edit-icon"><use xlink:href="#icon-edit"></use></svg>`;
            },
            orderable: false,
          },
        ],
      });

      // Define the buttons for sorting the name column
      // const $nameSortAscBtn = $(
      //   '#manageUsersTable th button-upDown.spam.arrow-up'
      // );
      // const $nameSortDescBtn = $(
      //   '#manageUsersTable th button-upDown.spam.arrow-down'
      // );
      //
      // const $employeeNumSortAscBtn = $(
      //   '#manageUsersTable th.employee-number button-upDown.spam.arrow-up'
      // );
      // const $employeeNumSortDescBtn = $(
      //   '#manageUsersTable th.employee-number button-upDown.spam.arrow-down'
      // );
      //
      // // Add event listener to the button for ascending name sorting
      // $nameSortAscBtn.on('click', function () {
      //   // Sort the data in the table by name in ascending order
      //   table.order([2, 'asc']).draw();
      // });
      //
      // // Add event listener to the button for descending name sorting
      // $nameSortDescBtn.on('click', function () {
      //   // Sort the data in the table by name in descending order
      //   table.order([2, 'desc']).draw();
      // });
      //
      // //Event-Listener zum Sortieren nach aufsteigender Employee-Nummer
      // $employeeNumSortAscBtn.on('click', function () {
      //   $('#manageUsersTable').DataTable().order([1, 'asc']).draw();
      // });
      //
      // // Event-Listener zum Sortieren nach absteigender Employee-Nummer
      // $employeeNumSortDescBtn.on('click', function () {
      //   $('#manageUsersTable').DataTable().order([1, 'desc']).draw();
      // });
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const createSectorASMA = async (
  machineId,
  input_name,
  input_description_de,
  input_description_en
) => {
  console.log('bin createSectorASMA zum serverschicken');
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/machinery/createSectorASMA/${machineId}`,
      data: {
        //machineId: machineId,
        sectionName: input_name,
        sectionDescription_de: input_description_de,
        sectionDescription_en: input_description_en,
      },
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'New sectorASMA has been successfully added to the machine'
      );
      window.setTimeout(() => {
        location.assign('/api/v1/manage_ASMAmachine');
      }, 1200);
    } else {
      console.log('nichts');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateSectorASMA = async (data, machineID, sectorASMAID) => {
  console.log('bin updateSectorASMA in machineryASMA.js');
  console.log('machineID: ' + machineID);
  console.log('sectorASMAID: ' + sectorASMAID);
  console.log('data: ' + data);
  console.log('data: ' + JSON.stringify(data));
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/machinery/${machineID}/updateSectorASMA/${sectorASMAID}`, // +
      //id,
      //127.0.0.1:7566/api/v1/createASMAmachine/6444566c830afd3adeba2d38/updateSectorASMA/645e7f222f0b54507c6859ae
      //http: data,
      data,
    });
    //
    if (res.data.status === 'success') {
      showAlert('success', 'Machine with SectorASMA successfully updated');
      console.log('machineIDddddddddd: ' + machineID);
      window.setTimeout(() => {
        location.assign(`/api/v1/createASMAmachine/${machineID}`);
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteSectorASMA = async (machineID, sectorASMAID) => {
  console.log('bin deleteSectorASMA in machineryASMA.js');
  console.log('machineIDdelete: ' + machineID);
  console.log('sectorASMAIDdelete: ' + sectorASMAID);
  const WarummachineID = machineID;
  // const sectorASMAID = sectorASMAID;

  try {
    const res = await axios({
      method: 'DELETE',
      url: `${apiUrl}/machinery/${machineID}/updateSectorASMA/${sectorASMAID}`,
    });
    //
    if (res.status === 204) {
      //console.log(machineID);
      //alert('success', 'SectorASMA in machine successfully deleted');
      showAlert('success', 'Machine successfully deleted');
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
