/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts.js';
import process from 'process';

const dev_Port = 7566;
const prod_Port = 7577;

const port = process.env.NODE_ENV === 'development' ? dev_Port : prod_Port;
const host = 'http://127.0.0.1:';
const strPathApiV1 = '/api/v1';
const apiUrl = host + port + strPathApiV1;

export const showClosedMalReports = async () => {
  console.log('bin showClosedMalReports');
  const machineName = document.getElementById('machineName').value;
  console.log('machineName: ' + machineName);
  const currentUser = JSON.parse(document.getElementById('currentUser').value);
  console.log(currentUser.language);

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/malReports/closedMalReports/${machineName}`,
    });

    if (res.data.status === 'success') {
      console.log('success in showClosedMalReports');
      console.log(res.data.status);
      const closedMalReports = res.data.data.closedMalReports;
      console.log(closedMalReports);
      console.log($('#manageASMAUnterhaltMachineClosedMalReportsTable'));
      console.log(currentUser.language);

      if (currentUser.language === 'de') {
        console.log('currentUser.language = de');
        $('#manageASMAUnterhaltMachineClosedMalReportsTable')
          .DataTable()
          .destroy();

        $('#manageASMAUnterhaltMachineClosedMalReportsTable').DataTable({
          data: closedMalReports,
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
            { data: 'nameComponent_de_Mal' },
            { data: 'nameComponentDetail_de_Mal' },
            {
              data: 'estimatedStatus',
              render: function (data, type, row) {
                if (type === 'display') {
                  var status = data + '%';
                  return '<span class="estimatedStatus">' + status + '</span>';
                }
                return data;
              },
            },
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
              <td>${logFal_Repair.messageProblem_de_Repair}</td>
              <td>${logFal_Repair.messageMission_de_Repair}</td>
              <td>${logFal_Repair.isElectroMechanical_Repair}</td>
              <td>${logFal_Repair.estimatedTime_Repair}</td>
              <td>${logFal_Repair.Status_Repair}%</td>
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
            {
              data: 'finishAt_Mal',
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
            { data: 'statusOpenClose_Mal', visible: true },
          ],
        });
      } else if (currentUser.language === 'en') {
        console.log('currentUser.language = en');
        $('#manageASMAUnterhaltMachineClosedMalReportsTable')
          .DataTable()
          .destroy();

        $('#manageASMAUnterhaltMachineClosedMalReportsTable').DataTable({
          data: closedMalReports,
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
            { data: 'nameComponent_en_Mal' },
            { data: 'nameComponentDetail_en_Mal' },
            {
              data: 'estimatedStatus',
              render: function (data, type, row) {
                if (type === 'display') {
                  var status = data + '%';
                  return '<span class="estimatedStatus">' + status + '</span>';
                }
                return data;
              },
            },
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
              <td>${logFal_Repair.messageProblem_en_Repair}</td>
              <td>${logFal_Repair.messageMission_en_Repair}</td>
              <td>${logFal_Repair.isElectroMechanical_Repair}</td>
              <td>${logFal_Repair.estimatedTime_Repair}</td>
              <td>${logFal_Repair.Status_Repair}%</td>
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
            {
              data: 'finishAt_Mal',
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
            { data: 'statusOpenClose_Mal', visible: true },
          ],
        });
      }
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log('error', err.response.data.message);
  }
};

export const showMyMalReports = async () => {
  console.log('bin showMyMalReports');
  const currentUserID = document.getElementById('currentUserID').value;
  console.log('currentUserID: ' + currentUserID);

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/malReports/myMalReports/${currentUserID}`,
    });

    if (res.data.status === 'success') {
      console.log('success in showMyMalReports');
      console.log(res.data.status);
      const myMalReports = res.data.data.myMalReports;
      const currentUser = res.data.data.currentUser;
      console.log(myMalReports);
      console.log($('#myMalReportsTable'));
      console.log(currentUser.language);

      if (currentUser.language === 'de') {
        console.log('currentUser.language = de');
        $('#myMalReportsTable').DataTable().destroy();

        $('#myMalReportsTable').DataTable({
          data: myMalReports,
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
            { data: 'nameComponent_de_Mal' },
            { data: 'nameComponentDetail_de_Mal' },
            {
              data: 'estimatedStatus',
              render: function (data, type, row) {
                if (type === 'display') {
                  var status = data + '%';
                  return '<span class="estimatedStatus">' + status + '</span>';
                }
                return data;
              },
            },
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
              <td>${logFal_Repair.messageProblem_de_Repair}</td>
              <td>${logFal_Repair.messageMission_de_Repair}</td>
              <td>${logFal_Repair.isElectroMechanical_Repair}</td>
              <td>${logFal_Repair.estimatedTime_Repair}</td>
              <td>${logFal_Repair.Status_Repair}%</td>
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
            { data: 'statusRun_Mal', visible: false },
            { data: 'statusOpenClose_Mal', visible: false },
            {
              data: 'finishAt_Mal',
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
          ],
        });
      } else if (currentUser.language === 'en') {
        console.log('currentUser.language = en');
        $('#myMalReportsTable').DataTable().destroy();

        $('#myMalReportsTable').DataTable({
          data: myMalReports,
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
            { data: 'nameComponent_en_Mal' },
            { data: 'nameComponentDetail_en_Mal' },
            {
              data: 'estimatedStatus',
              render: function (data, type, row) {
                if (type === 'display') {
                  var status = data + '%';
                  return '<span class="estimatedStatus">' + status + '</span>';
                }
                return data;
              },
            },
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
              <td>${logFal_Repair.messageProblem_en_Repair}</td>
              <td>${logFal_Repair.messageMission_en_Repair}</td>
              <td>${logFal_Repair.isElectroMechanical_Repair}</td>
              <td>${logFal_Repair.estimatedTime_Repair}</td>
              <td>${logFal_Repair.Status_Repair}%</td>
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
            { data: 'statusRun_Mal', visible: false },
            { data: 'statusOpenClose_Mal', visible: false },
            {
              data: 'finishAt_Mal',
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
          ],
        });
      }
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log('error', err.response.data.message);
  }
};

export const showOpenMalReports = async () => {
  console.log('bin showOpenMalReports');
  const machineID = document.getElementById('machineID').value;
  //console.log('machineID: ' + machineID);
  const urlText = (document.getElementById('urlText').value =
    window.location.href);
  //console.log('urlText: ' + urlText);
  let urlArr = urlText.split('/');
  let urlDepartmentName = urlArr[5];
  //console.log('urlDepartmentName: ' + urlDepartmentName);
  let urlMachineName = urlArr[7];
  //console.log('urlMachineName: ' + urlMachineName);
  let currentUser = JSON.parse(document.getElementById('currentUser').value);
  //console.log('currentUser: ' + currentUser);

  //console.log('currentUser.language: ' + currentUser.language);
  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/malReports/${machineID}`,
    });

    if (res.data.status === 'success') {
      console.log('success in showOpenMalReports');
      //console.log(res.data.status);
      const malReportsMachine = res.data.data.malReportsMachine;
      //console.log(malReportsMachine);
      //console.log($('#manageASMAUnterhaltMachineOpenMalReportsTable'));
      //console.log(currentUser.language);

      if (currentUser.language === 'de') {
        console.log('currentUser.language = de');
        $('#manageASMAUnterhaltMachineOpenMalReportsTable')
          .DataTable()
          .destroy();

        $('#manageASMAUnterhaltMachineOpenMalReportsTable').DataTable({
          data: malReportsMachine,
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
            { data: 'nameComponent_de_Mal' },
            { data: 'nameComponentDetail_de_Mal' },
            {
              data: 'estimatedStatus',
              render: function (data, type, row) {
                if (type === 'display') {
                  var status = data + '%';
                  return '<span class="estimatedStatus">' + status + '</span>';
                }
                return data;
              },
            },
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
              <td>${logFal_Repair.messageProblem_de_Repair}</td>
              <td>${logFal_Repair.messageMission_de_Repair}</td>
              <td>${logFal_Repair.isElectroMechanical_Repair}</td>
              <td>${logFal_Repair.estimatedTime_Repair}</td>
              <td>${logFal_Repair.Status_Repair}%</td>
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
              <td><a href="${strPathApiV1}/${urlDepartmentName}/ASMA/${urlMachineName}/MalReport_updateLogFal/${
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
            { data: 'statusRun_Mal', visible: false },
            { data: 'statusOpenClose_Mal', visible: false },
            {
              data: '_id',
              render: function (data) {
                return `
                  <a href="${strPathApiV1}/${urlDepartmentName}/ASMA/${urlMachineName}/updateMalReport/${data}" class="edit-button">
                    <svg class="heading-box__icon">
                      <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                    </svg>
                  </a>`;
              },
            },
          ],
        });
      } else if (currentUser.language === 'en') {
        console.log('currentUser.language = en');
        $('#manageASMAUnterhaltMachineOpenMalReportsTable')
          .DataTable()
          .destroy();

        $('#manageASMAUnterhaltMachineOpenMalReportsTable').DataTable({
          data: malReportsMachine,
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
            { data: 'nameComponent_en_Mal' },
            { data: 'nameComponentDetail_en_Mal' },
            {
              data: 'estimatedStatus',
              render: function (data, type, row) {
                if (type === 'display') {
                  var status = data + '%';
                  return '<span class="estimatedStatus">' + status + '</span>';
                }
                return data;
              },
            },
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
              <td>${logFal_Repair.messageProblem_en_Repair}</td>
              <td>${logFal_Repair.messageMission_en_Repair}</td>
              <td>${logFal_Repair.isElectroMechanical_Repair}</td>
              <td>${logFal_Repair.estimatedTime_Repair}</td>
              <td>${logFal_Repair.Status_Repair}%</td>
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
              <td><a href="${strPathApiV1}/${urlDepartmentName}/ASMA/${urlMachineName}/MalReport_updateLogFal/${
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
            { data: 'statusRun_Mal', visible: false },
            { data: 'statusOpenClose_Mal', visible: false },
            {
              data: '_id',
              render: function (data) {
                return `
                  <a href="${strPathApiV1}/${urlDepartmentName}/ASMA/${urlMachineName}/updateMalReport/${data}" class="edit-button">
                    <svg class="heading-box__icon">
                      <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                    </svg>
                  </a>`;
              },
            },
          ],
        });
      }
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log('error', err.response.data.message);
  }
};

export const createLogFal = async (
  data,
  machineName,
  departmentName,
  malReportID
) => {
  console.log('bin createLogFal in malReport.js');
  // console.log(malReportID);
  // console.log(machineName);
  // console.log(departmentName);

  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/malReports/${malReportID}/createLogFal`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', res.data.msg);
      window.setTimeout(() => {
        location.assign(
          `${strPathApiV1}/${departmentName}/ASMA/${machineName}/MalReports`
        );
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
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
  // console.log(malReportID);
  // console.log(malReportLogFalID);
  // console.log(machineName);
  // console.log(departmentName);
  // console.log(data);
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
          `${strPathApiV1}/${departmentName}/ASMA/${machineName}/MalReports`
        );
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const closeMalReport = async (
  malReportID,
  machineName,
  departmentName
) => {
  console.log('bin closeMalReport in malReports.js');
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/malReports/closeMalReport/` + malReportID,
    });

    if (res.data.status === 'success') {
      showAlert('success', res.data.msg);
      window.setTimeout(() => {
        location.assign(
          `${strPathApiV1}/${departmentName}/ASMA/${machineName}/MalReports`
        );
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
