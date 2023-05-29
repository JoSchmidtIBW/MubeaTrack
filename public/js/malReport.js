/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts.js';

// const process = require("process");
const port = 7566;
// const port = process.env.PORT_NUMBER || 3000;
const apiUrl = 'http://127.0.0.1:' + port + '/api/v1';

//showOpenMalReports
export const showOpenMalReports = async () => {
  console.log('bin showOpenMalReports');
  const machineID = document.getElementById('machineID').value;
  console.log('machineID: ' + machineID);
  const urlText = (document.getElementById('urlText').value =
    window.location.href);
  console.log('urlText: ' + urlText);
  let urlArr = urlText.split('/');
  let urlDepartmentName = urlArr[5];
  console.log('urlDepartmentName: ' + urlDepartmentName);
  let urlMachineName = urlArr[7];
  console.log('urlMachineName: ' + urlMachineName);
  // const machineName = document.getElementById('machineName').value;
  // console.log('machineName: ' + machineName);

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/malReports/${machineID}`,
    });

    if (res.data.status === 'success') {
      console.log('success in showOpenMalReports');
      console.log(res.data.status);
      //console.log(res.data.data);
      //console.log(res.data.data.data);
      // console.log(res.data.data.malReportsMachine);
      const malReportsMachine = res.data.data.malReportsMachine;
      console.log(malReportsMachine);
      console.log($('#manageASMAUnterhaltMachineOpenMalReportsTable'));

      $('#manageASMAUnterhaltMachineOpenMalReportsTable').DataTable().destroy();

      $('#manageASMAUnterhaltMachineOpenMalReportsTable').DataTable({
        data: malReportsMachine, //res.data.data.data,
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
          { data: '_id', visible: false },
          {
            data: 'createAt_Mal',
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
          { data: 'user_Mal.firstName' },
          { data: 'user_Mal.lastName' },
          { data: 'nameMachine_Mal' },
          { data: 'nameSector_Mal' },
          { data: 'nameComponent_Mal' },
          { data: 'nameComponentDetail_Mal' },
          { data: 'estimatedStatus' },
          //{ data: null },
          {
            data: 'logFal_Repair',
            render: function (data) {
              let html = `
          <table class="table1">
      
            </thead>
            <tbody>
        `;

              data.forEach((logFal_Repair) => {
                html += `
            <tr>
              <!--<td style="color:blue;">${logFal_Repair._id}</td>-->
              <td>${logFal_Repair.messageProblem_Repair}</td>
              <td>${logFal_Repair.messageMission_Repair}</td>
              <td>${logFal_Repair.isElectroMechanical_Repair}</td>
              <td>${logFal_Repair.estimatedTime_Repair}</td>
              <td>${logFal_Repair.Status_Repair}</td>
              <td>${
                logFal_Repair.user_Repair
                  ? logFal_Repair.user_Repair.firstName
                  : 'No user'
              }</td>
              <td>${
                logFal_Repair.user_Repair
                  ? logFal_Repair.user_Repair.lastName
                  : 'No user'
              }</td>
              <td>${new Date(logFal_Repair.createAt_Repair).toLocaleDateString(
                'de-DE',
                {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )}</td>
              <td><a href="/api/v1/${urlDepartmentName}/ASMA/${urlMachineName}/MalReport_updateLogFal/${
                  logFal_Repair._id
                }"><svg class="heading-box__icon">
                      <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                    </svg></a></td>
            </tr>
          `;
              });

              html += `
            </tbody>
          </table>
        `;

              return html;
            },
          },
          // {
          //   data: 'logFal_Repair',
          //   render: function () {
          //     return `
          //       <table class="table1">
          //         <thead>
          //           <tr>
          //             <th>logFal_Repair._id</th>
          //             <th>messageProblem_Repair</th>
          //             <th>messageMission_Repair</th>
          //             <th>isElectroMechanical_Repair</th>
          //             <th>estimatedTime_Repair</th>
          //             <th>Status_Repair</th>
          //             <th>user_Repair.firstName</th>
          //             <th>user_Repair.lastName</th>
          //             <th>createAt_Repair</th>
          //             <th>Edit_Repair</th>
          //           </tr>
          //         </thead>
          //         <tbody>
          //           <!--  Daten nested Tabel-->
          //
          //         </tbody>
          //       </table>
          //     `;
          //   },
          // },

          //{},
          // {
          //   data: 'logFal_Repair',
          //   render: function (data) {
          //     if (Array.isArray(data) && data.length > 0) {
          //       const logFal_Repair = data[0];
          //       return (
          //         logFal_Repair._id + ', ' + logFal_Repair.messageMission_Repair+....
          //       );
          //     } else {
          //       return '';
          //     }
          //   },
          // },
          { data: 'statusRun_Mal', visible: false },
          { data: 'statusOpenClose_Mal', visible: false },
          {
            data: '_id',
            render: function (data) {
              return `
                  <a href="/api/v1/editMal/${data}" class="edit-button">
                    <svg class="heading-box__icon">
                      <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                    </svg>
                  </a>`;
            },
          },
        ],
      });
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log('error', err.response.data.message);
  }
};

export const updateLogFal = async (
  data,
  malReportID,
  malReportLogFalID,
  machineName,
  departmentName
) => {
  console.log('bin updateLogFal in malReport.js');
  console.log(malReportID);
  console.log(malReportLogFalID);
  console.log(machineName);
  console.log(departmentName);
  console.log(data);
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/malReports/${malReportID}/updateLogFal/${malReportLogFalID}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', res.data.msg);
      window.setTimeout(() => {
        location.assign(
          `/api/v1/${departmentName}/ASMA/${machineName}/MalReports`
        );
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// function generateNestedTableRows(data) {
//   let rows = '';
//
//   data.forEach((malReport) => {
//     malReport.logFal_Repair.forEach((logFal_Repair) => {
//       rows += `
//         <tr>
//           <td>${logFal_Repair._id}</td>
//           <td>${logFal_Repair.messageProblem_Repair}</td>
//           <td>${logFal_Repair.messageMission_Repair}</td>
//           <td>${logFal_Repair.isElectroMechanical_Repair}</td>
//           <td>${logFal_Repair.estimatedTime_Repair}</td>
//           <td>${logFal_Repair.Status_Repair}</td>
//           <td>${
//             logFal_Repair.user_Repair
//               ? logFal_Repair.user_Repair.firstName
//               : 'No user'
//           }</td>
//           <td>${
//             logFal_Repair.user_Repair
//               ? logFal_Repair.user_Repair.lastName
//               : 'No user'
//           }</td>
//           <td>${logFal_Repair.createAt_Repair.toLocaleDateString('de-DE', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//           })}</td>
//           <td>Edit</td>
//         </tr>
//       `;
//     });
//   });
//
//   return rows;
// }
