/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts.js';

// const process = require("process");
const port = 7566;
// const port = process.env.PORT_NUMBER || 3000;
const apiUrl = 'http://127.0.0.1:' + port + '/api/v1';

//todo auch der button ManagerUsers soll von hier geöffnet werden

//todo showUsers zu showUsersManagement
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
      // $('#manageUsersTable').on('click', '.delete-button', function () {
      //   const id = $(this).attr('data-id');
      //   //deleteUser(id);
      // });
      // $('#manageUsersTable').on('click', '.edit-button', function () {
      //   const id = $(this).attr('id');
      //   location.assign(`/userw/${id}`);
      // });

      $('#manageUsersTable').DataTable({
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
          //{ data: 'name' },
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
              // return `<a href="/user/${data}" class="edit-button">Edit</a>
              // <button class="delete-button" data-id="${data}">Delete</button>`;

              //return `<a href="/user/${data}" class="edit-button">Edit</a>`;

              return `
              <a href="/api/v1/manage_users/${data}" class="edit-button">
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

      // // Define the buttons for sorting the name column
      // const $nameSortAscBtn = $(
      //   '#manageUsersTable th button-upDown.spam.arrow-up'
      // );
      // const $nameSortDescBtn = $(
      //   '#manageUsersTable th button-upDown.spam.arrow-down'
      // );

      const $employeeNumSortAscBtn = $(
        '#manageUsersTable th.employee-number button-upDown.spam.arrow-up'
      );
      const $employeeNumSortDescBtn = $(
        '#manageUsersTable th.employee-number button-upDown.spam.arrow-down'
      );

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

      // Event-Listener zum Sortieren nach aufsteigender Employee-Nummer
      $employeeNumSortAscBtn.on('click', function () {
        $('#manageUsersTable').DataTable().order([1, 'asc']).draw();
      });

      // Event-Listener zum Sortieren nach absteigender Employee-Nummer
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
  //name,
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
        employeeNumber: employeeNumber, //'66101',
        firstName: firstname, //'Erika',
        lastName: lastname, //'Schmidt',
        birthDate: birthDate,
        gender: gender,
        language: language,
        professional: professional,
        //name: name, //'erika',
        email: email,
        password: password, //'test1234',
        passwordConfirm: passwordConfirm, //'test1234',
        role: role, //'guide',
        department: department, //'Unterhalt',
        active: true,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'User signed up successfully');
      window.setTimeout(() => {
        location.assign('/api/v1/manage_users');
      }, 1200);
    } else {
      console.log('nixxxx');
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
        location.assign('/api/v1/manage_users'); //
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
        location.assign('/api/v1/manage_users');
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
        location.assign('/api/v1/login');
      }, 1200);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// export const createUser = async (email, password) => {
//   //alert(email)
//   console.log(email, password);
//   //alert(`${email}, ${password}`);
//   //alert(` ${password}`);
//
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: 'http://127.0.0.1:7566/api/v1/users/login', //http://127.0.0.1:3000/api/v1/users/login => http://localhost:3000/api/v1/users/login
//       data: {
//         email: email,
//         password: password,
//       },
//     });
//
//     if (res.data.status === 'success') {
//       // das ist der gesendete status in data
//       //alert('Logged in successfully!');
//       showAlert('success', 'Logged in successfully!');
//       window.setTimeout(() => {
//         location.assign('/overview'); //wie redirect
//       }, 1500);
//     }
//
//     //console.log(res)
//   } catch (err) {
//     console.log(JSON.stringify(err.response.data) + ' bin login in login.js'); // kommt von axios documentation
//     console.log(
//       JSON.stringify(err.response.data.message) + ' bin login in login.js'
//     );
//     // alert(JSON.stringify(err.response.data.message) + " bin login in login.js") // data ist data-responce
//
//     if (
//       err.response.data.message ===
//       "Cannot read properties of null (reading 'password')"
//     ) {
//       showAlert(
//         'error',
//         JSON.stringify(err.response.data.message) + ' email not found in db'
//       );
//     } else if (err.response.data.message === 'isBcrypt is not defined') {
//       showAlert(
//         'error',
//         JSON.stringify(err.response.data.message) +
//           ' password is wrong, email is found'
//       );
//     } else {
//       showAlert(
//         'error',
//         JSON.stringify(err.response.data.message) + ' bin login in login.js'
//       );
//     }
//
//     //console.log(JSON.parse(err.response.data) + " bin login in login.js")
//     //console.log(err.response.data + " bin login in login.js")
//   }
// };
