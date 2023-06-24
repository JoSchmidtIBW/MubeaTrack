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

export const showUsers = async () => {
  console.log('bin showUsers');

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/users`,
    });

    if (res.data.status === 'success') {
      console.log('success in ShowUsers');

      $('#manageUsersTable').DataTable().destroy();

      $('#manageUsersTable').DataTable({
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
          { data: 'employeeNumber' },
          { data: 'lastName' },
          { data: 'firstName' },
          { data: 'birthDate' },
          { data: 'gender' },
          { data: 'language' },
          { data: 'professional' },
          { data: 'photo', visible: false },
          { data: 'email' },
          { data: 'role' },
          { data: 'department' },
          { data: 'password', visible: false },
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
              <a href="${strPathApiV1}/manage_users/${data}" class="edit-button">
                <svg class="heading-box__icon">
                <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                </svg>
              </a>`;
            },
            orderable: false,
          },
        ],
      });

      const $employeeNumSortAscBtn = $(
        '#manageUsersTable th.employee-number button-upDown.spam.arrow-up'
      );
      const $employeeNumSortDescBtn = $(
        '#manageUsersTable th.employee-number button-upDown.spam.arrow-down'
      );

      $employeeNumSortAscBtn.on('click', function () {
        $('#manageUsersTable').DataTable().order([1, 'asc']).draw();
      });

      $employeeNumSortDescBtn.on('click', function () {
        $('#manageUsersTable').DataTable().order([1, 'desc']).draw();
      });
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const createNewUser = async (
  employeeNumber,
  firstname,
  lastname,
  birthDate,
  gender,
  language,
  professional,
  email,
  password,
  passwordConfirm,
  role,
  department
) => {
  console.log('bin createNewUser zum serverschicken');
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/users/createNewUser`,
      data: {
        employeeNumber: employeeNumber,
        firstName: firstname,
        lastName: lastname,
        birthDate: birthDate,
        gender: gender,
        language: language,
        professional: professional,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
        role: role,
        department: department,
        active: true,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'User signed up successfully');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/manage_users`);
      }, 1200);
    } else {
      console.log('not success!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateUser = async (data, id) => {
  console.log('bin updateUser in user.js');
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/users/` + id,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'User successfully updated');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/manage_users`); //
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `${apiUrl}/users/${id}`,
    });

    if (res.status === 204) {
      showAlert('success', 'User successfully deleted');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/manage_users`);
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const forgotPassword = async (email) => {
  console.log('bin forgotPassword in user.js');
  console.log('email: ' + email);
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/users/forgotPasswordAdmin`,
      data: {
        email,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password send to E-Mail');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/login`);
      }, 1200);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
