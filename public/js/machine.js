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

export const showMachinery = async () => {
  console.log('bin showMachinery');
  const currentUser = JSON.parse(document.getElementById('currentUser').value);
  console.log(currentUser.language);

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/machinery`,
    });

    if (res.data.status === 'success') {
      console.log('success in showMachinery');

      if (currentUser.language === 'de') {
        console.log('currentUser.language = de');
        $('#manageMachineryTable').DataTable().destroy();

        $('#manageMachineryTable').DataTable({
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
            { data: 'zone' },
            { data: 'type' },
            { data: 'constructionYear' },
            { data: 'companyMachine' },
            { data: 'department' },
            { data: 'voltage' },
            { data: 'controlVoltage' },
            { data: 'ratedCurrent' },
            { data: 'electricalFuse' },
            { data: 'compressedAir' },
            { data: 'weightMass' },
            { data: 'dimensions' },
            { data: 'drawingNumber' },
            { data: 'employeesCount' },
            {
              data: 'createdAt',
              render: function (data) {
                const date = new Date(data);
                const options = {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                };
                return date.toLocaleDateString('de-DE', options);
              },
            },
            {
              data: '_id',
              render: function (data) {
                return `
              <a href="${strPathApiV1}/manage_machinery/${data}" class="edit-button">
                <svg class="heading-box__icon">
                <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                </svg>
              </a>`;
              },
              orderable: false,
            },
          ],
        });
      } else if (currentUser.language === 'en') {
        console.log('currentUser.language = en');
        const data = res.data.data.data;

        const translatedData = await Promise.all(
          data.map(async (item) => {
            const translatedZone = await translateZone(item.zone);
            return { ...item, zone: translatedZone };
          })
        );

        $('#manageMachineryTable').DataTable().destroy();

        $('#manageMachineryTable').DataTable({
          data: translatedData,
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
            { data: 'zone' },
            { data: 'type' },
            { data: 'constructionYear' },
            { data: 'companyMachine' },
            { data: 'department' },
            { data: 'voltage' },
            { data: 'controlVoltage' },
            { data: 'ratedCurrent' },
            { data: 'electricalFuse' },
            { data: 'compressedAir' },
            { data: 'weightMass' },
            { data: 'dimensions' },
            { data: 'drawingNumber' },
            { data: 'employeesCount' },
            {
              data: 'createdAt',
              render: function (data) {
                const date = new Date(data);
                const options = {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                };
                return date.toLocaleDateString('de-DE', options);
              },
            },
            {
              data: '_id',
              render: function (data) {
                return `
              <a href="${strPathApiV1}/manage_machinery/${data}" class="edit-button">
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
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

async function translateZone(zone) {
  console.log('bin translateZone');
  const translations = {
    Schweissen: 'Welding',
    Sägen: 'Sawing',
    Ziehen: 'Drawing',
    Spitzen: 'Topping',
    Richten: 'Straightening',
    Recken: 'Stretching',
    Glühen: 'Glowing',
    Beizen: 'Pickling',
    Sonstige: 'Others',
    Spalten: 'Splitting',
  };
  if (zone in translations) {
    return translations[zone];
  }
  return zone;
}

export const createNewMachine = async (
  name,
  description,
  zone,
  type,
  constructionYear,
  companyMachine,
  voltage,
  controlVoltage,
  ratedCurrent,
  electricalFuse,
  compressedAir,
  weightMass,
  dimensions,
  drawingNumber,
  department
) => {
  console.log('bin createNewMachine zum serverschicken');
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/machinery/createMachine`,
      data: {
        name: name,
        description: description,
        zone: zone,
        type: type,
        constructionYear: constructionYear,
        companyMachine: companyMachine,
        voltage: voltage,
        controlVoltage: controlVoltage,
        ratedCurrent: ratedCurrent,
        electricalFuse: electricalFuse,
        compressedAir: compressedAir,
        weightMass: weightMass,
        dimensions: dimensions,
        drawingNumber: drawingNumber,
        department: department,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Machine created successfully');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/manage_machinery`);
      }, 1200);
    } else {
      console.log('nichts beim server /machinery/createMachine angekommen');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateMachine = async (data, id) => {
  console.log('bin updateMachine in machine.js');
  console.log(id);
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/machinery/` + id,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Machine successfully updated');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/manage_machinery`);
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteMachine = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `${apiUrl}/machinery/${id}`,
    });

    if (res.status === 204) {
      showAlert('success', 'Machine successfully deleted');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/manage_machinery`);
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
