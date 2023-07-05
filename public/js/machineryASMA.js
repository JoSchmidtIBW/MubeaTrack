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

      $('#manageASMAMachineTable').DataTable({
        data: res.data.data.data,
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
          { data: 'name' },
          { data: 'description' },
          { data: 'department' },
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
              return `
              <a href="${strPathApiV1}/createASMAmachine/${data}" class="edit-button" >
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
        location.assign(`${strPathApiV1}/manage_ASMAmachine`);
      }, 1200);
    } else {
      console.log('not success');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateSectorASMA = async (data, machineID, sectorASMAID) => {
  console.log('bin updateSectorASMA in machineryASMA.js');
  // console.log('machineID: ' + machineID);
  // console.log('sectorASMAID: ' + sectorASMAID);
  // console.log('data: ' + data);
  // console.log('data: ' + JSON.stringify(data));
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/machinery/${machineID}/updateSectorASMA/${sectorASMAID}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Machine with SectorASMA successfully updated');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/createASMAmachine/${machineID}`);
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteSectorASMA = async (machineID, sectorASMAID) => {
  console.log('bin deleteSectorASMA in machineryASMA.js');
  // console.log('machineIDdelete: ' + machineID);
  // console.log('sectorASMAIDdelete: ' + sectorASMAID);

  try {
    const res = await axios({
      method: 'DELETE',
      url: `${apiUrl}/machinery/${machineID}/updateSectorASMA/${sectorASMAID}`,
    });
    //
    if (res.status === 204) {
      showAlert('success', 'Sector successfully deleted');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/manage_ASMAmachine`);
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
