/* eslint-disable */

import '@babel/polyfill'; // first line of imports, für ältere Browser
import { login, logout } from './login';
import { createUser } from './user';

import { updateData } from './updateSettings';
import { updateSettings } from './updateSettings';
import axios from 'axios';
import { showAlert } from './alerts.js';

// const process = require("process");
const port = 7566;
// const port = process.env.PORT_NUMBER || 3000;
const apiUrl = 'http://127.0.0.1:' + port + '/api/v1';

console.log('Hello from parcel! bin index.js'); //npm run watch:js

// DOM Element
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

const manageUsersTable = document.querySelector('.manageUsersTable');
const newUserDataForm = document.querySelector('.form-new-user-data');
//const createUserBtn = document.querySelector('.createUserBtn')

//if (createUserBtn) createUserBtn.addEventListener('click', createUser);

// VALUES
// const email = document.getElementById('email').value;        hier, diese sind nicht defined, wenn dom läd, braucht eventlistener
// const password = document.getElementById('password').value;

// DELEGATION

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    //document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault(); // element prevent from loading the page

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    //login({ email, password })
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

// if (userDataForm)
//     userDataForm.addEventListener('submit', e => {
//         e.preventDefault()
//         const name = document.getElementById('name').value;
//         const email = document.getElementById('email').value; // in pug id= #email
//         updateData(name, email)
//     })

// send data, to be updated on the server
if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //auch photos
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);

    form.append('photo', document.getElementById('photo').files[0]); // files sind array, brauchen erstes element

    console.log(
      'form in index.js, wenn bild, sieht keine information: ' + form
    ); // man sieht hier keine information

    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value; // in pug id= #email
    //updateData(name, email)
    //updateSettings({ name, email }, 'data')
    updateSettings(form, 'data');
  });

// if (userDataForm)
//   userDataForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const name = document.getElementById('name').value;
//     const email = document.getElementById('email').value; // in pug id= #email
//     //updateData(name, email)
//     updateSettings({ name, email }, 'data');
//   });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // wenn pw ändert, soll solange der button speicher, name ändern bis fertig
    document.querySelector('.btn--save-password').textContent = 'Updating...'; //innerHtml oder textContent
    //document.querySelector('.btn--save-password').innerHTML = 'Updating...'// mit punkt... .btn--save-password

    const passwordCurrent = document.getElementById('password-current').value; // in puc account: #password-current
    const password = document.getElementById('password').value; // in pug id= #password
    const passwordConfirm = document.getElementById('password-confirm').value; // in pug id= #password-confirm
    //updateData(name, email)
    // await, um promise von dieser funktion, um die buchstaben im passwordfield zu löschen
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    ); // diese daten müssen genau so heissen wie in postman!

    document.querySelector('.btn--save-password').textContent = 'Save password';
    //document.querySelector('.btn--save-password').innerHTML = 'Save password'// mit punkt .btn--save-password...
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

// {
//     "passwordCurrent": "newpass123",
//     "password": "newpassword",
//     "passwordConfirm": "newpassword"
// }

// if (manageUsersTable) {
//   showUsers();
// }

//const usersTable = document.querySelector('.usersTable');

//todo auch der button ManagerUsers soll von hier geöffnet werden

//todo showUsers zu showUsersManagement
const showUsers = async () => {
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
          { data: 'employeeNumber' },
          { data: 'firstName' },
          { data: 'lastName' },
          { data: 'age' },
          { data: 'gender' },
          { data: 'language' },
          { data: 'photo' },
          { data: 'name' },
          { data: 'email' },
          { data: 'role' },
          { data: 'department' },
          { data: 'password', visible: false },
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

      // Define the buttons for sorting the name column
      const $nameSortAscBtn = $(
        '#manageUsersTable th button-upDown.spam.arrow-up'
      );
      const $nameSortDescBtn = $(
        '#manageUsersTable th button-upDown.spam.arrow-down'
      );

      const $employeeNumSortAscBtn = $(
        '#manageUsersTable th.employee-number button-upDown.spam.arrow-up'
      );
      const $employeeNumSortDescBtn = $(
        '#manageUsersTable th.employee-number button-upDown.spam.arrow-down'
      );

      // Add event listener to the button for ascending name sorting
      $nameSortAscBtn.on('click', function () {
        // Sort the data in the table by name in ascending order
        table.order([2, 'asc']).draw();
      });

      // Add event listener to the button for descending name sorting
      $nameSortDescBtn.on('click', function () {
        // Sort the data in the table by name in descending order
        table.order([2, 'desc']).draw();
      });

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

if (manageUsersTable) {
  console.log('bin If usertable');
  showUsers();
}

if (newUserDataForm) {
  newUserDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    //const id = document.getElementById('userId').value;
    const employeeNumber = document.getElementById('employeeNumber').value;
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const age = document.getElementById('age').value;
    const gender = document.querySelector('#gender').value;
    const language = document.querySelector('#language').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const role = document.querySelector('#role').value;
    const department = document.querySelector('#department').value;

    console.log(employeeNumber);
    console.log(firstname);
    console.log(lastname);
    console.log(age);
    console.log(gender);
    console.log(language);
    console.log(name);
    console.log(email);
    console.log(password);
    console.log(passwordConfirm);
    console.log(role);
    console.log(department);

    createNewUser(
      employeeNumber,
      firstname,
      lastname,
      age,
      gender,
      language,
      name,
      email,
      password,
      passwordConfirm,
      role,
      department
    );
    // try {
    //   const url = '${apiUrl}/users/signup'; ////127.0.0.1:4301/api/v1/users/signup
    //
    //   const res = await axios({
    //     method: 'POST',
    //     url, //: url,
    //     //data, //: {
    //     //     data, //das schicken wir der API
    //     // }
    //     data: {
    //       name: 'erika',
    //       firstName: 'Erika',
    //       lastName: 'Schmidt',
    //       employeeNumber: '66101',
    //       email: 'm2@example.com',
    //       password: 'test1234',
    //       passwordConfirm: 'test1234',
    //       role: 'guide',
    //       active: true,
    //       department: 'Unterhalt',
    //     },
    //   });
    //
    //   //testen, ob das gesendete zum server angekommen ist
    //   if (res.data.status === 'success') {
    //     // status bei API request
    //     showAlert('success', `${type.toUpperCase()} updated successfully!`);
    //   } else {
    //     console.log('nixxxx');
    //   }
    // } catch (err) {
    //   console.log(err);
    //   showAlert('error', err.response.data.message); //err.responce.data.message) //testen, zb falsche email bei /me eingeben
    // }

    // console.log(passwordConfirm);

    // updateUser(
    //   {
    //     employeeNumber,
    //     name,
    //     email,
    //     role,
    //   },
    //   id
    // );
  });
}

//todo passwort als passwort machen!!!
const createNewUser = async (
  employeeNumber,
  firstname,
  lastname,
  age,
  gender,
  language,
  name,
  email,
  password,
  passwordConfirm,
  role,
  department
) => {
  console.log('bin signup zum serverschicken');
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/users/createNewUser`,
      data: {
        employeeNumber: employeeNumber, //'66101',
        firstName: firstname, //'Erika',
        lastName: lastname, //'Schmidt',
        age: age,
        gender: gender,
        language: language,
        name: name, //'erika',
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

// const showUsers = async () => {
//   console.log('Bin showUsers');
//   console.log('Bin showUserswwwww');
//   try {
//     const res = await axios({
//       method: 'GET',
//       url: `${apiUrl}/users`,
//     });
//
//     console.log(res.data.status); //
//     // Wenn der API-Aufruf erfolgreich ist
//     if (res.data.status === 'success') {
//       console.log(res.data.status);
//       // Die Tabelle zerstören, falls sie bereits existiert
//       //$('#manageUsersTable').DataTable().destroy();
//       $('#manageUsersTable').DataTable().clear().destroy();
//
//       // Benutzerdaten in die Tabelle einfügen
//       $('#manageUsersTable').DataTable({
//         data: res.data.data.data,
//         columns: [
//           { data: '_id', visible: false },
//           { data: 'createdAt' },
//           { data: 'firstName' },
//           { data: 'lastName' },
//           { data: 'age' },
//           { data: 'gender' },
//           { data: 'employeeNumber' },
//           { data: 'language' },
//           { data: 'photo' },
//           { data: 'role' },
//           { data: 'department' },
//           { data: 'name' },
//           { data: 'email' },
//           { data: 'password' },
//           {
//             data: '_id',
//             render: function (data) {
//               return `<a href="/user/${data}" class="edit-button">Edit</a>
//               <button class="delete-button" data-id="${data}">Delete</button>`;
//             },
//             orderable: false,
//           },
//         ],
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
//
// // Benutzer anzeigen, wenn das Dokument bereit ist
// $(document).ready(() => {
//   showUsers();
// });

// Definiere die Spalten-Optionen einmal
// const columns = [
//   { data: 'createdAt' },
//   {
//     data: 'firstName',
//     render: function (data) {
//       return `<button class="sort-btn" data-sort-col="firstName">First Name</button>`;
//     },
//   },
//   { data: 'lastName' },
//   { data: 'age' },
//   { data: 'gender' },
//   { data: 'employeeNumber' },
//   { data: 'language' },
//   { data: 'photo' },
//   { data: 'role' },
//   { data: 'department' },
//   { data: 'name' },
//   { data: 'email' },
//   { data: 'password' },
//   {
//     data: '_id',
//     render: function (data) {
//       return `<a href="/user/${data}" class="edit-button">Edit</a>`;
//     },
//     orderable: false,
//   },
//   {
//     data: '_id',
//     render: function (data) {
//       return `<button class="delete-button" data-id="${data}">Delete</button>`;
//     },
//     orderable: false,
//   },
// ];
//
// const showUsers = async () => {
//   try {
//     const response = await axios.get(`${apiUrl}/users`);
//
//     if (
//       response.data &&
//       response.data.status === 'success' &&
//       response.data.data &&
//       response.data.data.data &&
//       response.data.data.data.length > 0
//     ) {
//       $('#manageUsersTable').DataTable({
//         data: response.data.data.data,
//         columns: columns, // Verwende die zuvor definierten Spalten-Optionen
//         columnDefs: [
//           {
//             targets: [0],
//             visible: false,
//           },
//         ],
//         pageLength: 10,
//       });
//     } else {
//       console.log('No data available.');
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
//
// $(document).ready(() => {
//   showUsers();
// });

// ---- USERS ----

// const showUsers = async () => {
//   try {
//     const res = await axios({
//       method: 'GET',
//       url: `${apiUrl}/users`,
//     });
//
//     if (res.data.status === 'success') {
//       // showAlert('success', 'success');
//       $('#usersTable').DataTable().destroy();
//       $('#usersTable').on('click', '.delete-button', function () {
//         const id = $(this).attr('data-id');
//         deleteUser(id);
//       });
//       $('#usersTable').on('click', '.edit-button', function () {
//         const id = $(this).attr('id');
//         location.assign(`/user/${id}`);
//       });
//
//       $('#usersTable').DataTable({
//         data: res.data.data.data,
//         columns: [
//           {
//             data: '_id',
//             visible: false,
//           },
//           { data: 'employeeNumber' },
//           { data: 'name' },
//           { data: 'email' },
//           { data: 'role' },
//           {
//             data: '_id',
//             render: function (data) {
//               return (
//                 '<a href="#" id="' +
//                 data +
//                 '" class="edit-button"><i class="fas fa-edit"></i></a>' +
//                 '   ' +
//                 '<a href="#" data-id="' +
//                 data +
//                 '" class="delete-button"><i class="fas fa-trash-alt"></i></a>'
//               );
//             },
//             orderable: false,
//           },
//         ],
//       });
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };

// // Zeigt die Benutzertabelle an, sobald die DOM-Struktur geladen ist
// $(document).ready(() => {
//   showUsers();
// });

//-----------------------------------down-------------------------------------------
//
// // Eine Funktion, die alle Benutzer vom Server abruft und in der Tabelle anzeigt
// const showUsers = async () => {
//   try {
//     // Ruft alle Benutzer vom Server ab und speichert die Antwort in einer Variablen
//     const response = await axios.get(`${apiUrl}/users`);
//     console.log(response);
//
//     // Prüft, ob die Serverantwort erfolgreich war und Daten enthält
//     // if (
//     //   response.data &&
//     //   response.data.status === 'success' &&
//     //   response.data.data &&
//     //   response.data.data.data &&
//     //   response.data.data.data.length > 0
//     // ) {
//     if (response.data.status === 'success') {
//       // Zerstört die Tabelle, wenn sie bereits existiert, und leert sie
//       //$('#manageUsersTable').DataTable().clear().destroy();
//       $('#manageUsersTable').DataTable().destroy();
//
//       // Erstellt eine neue Tabelle mit den Benutzerdaten als Datenquelle und fügt Spalten hinzu, um die _id des Benutzers, den Edit-Button und den Delete-Button anzuzeigen
//       const table = $('#manageUsersTable').DataTable({
//         data: response.data.data.data,
//         columns: [
//           { data: '_id', visible: false },
//           { data: 'createdAt' },
//           {
//             data: 'firstName',
//             render: function (data) {
//               return `<button class="sort-btn" data-sort-col="firstName">First Name</button>`;
//             },
//           },
//           { data: 'lastName' },
//           { data: 'age' },
//           { data: 'gender' },
//           { data: 'employeeNumber' },
//           { data: 'language' },
//           { data: 'photo' },
//           { data: 'role' },
//           { data: 'department' },
//           { data: 'name' },
//           { data: 'email' },
//           { data: 'password' },
//           {
//             data: '_id',
//             render: function (data) {
//               return `<a href="/user/${data}" class="edit-button">Edit</a>`;
//             },
//             orderable: false,
//           },
//           {
//             data: '_id',
//             render: function (data) {
//               return `<button class="delete-button" data-id="${data}">Delete</button>`;
//             },
//             orderable: false,
//           },
//         ],
//         columnDefs: [
//           // { targets: [0], visible: false, searchable: false }, // hides the ID column
//           // { targets: [0], visible: false },
//           // { targets: [0], searchable: false },
//           {
//             targets: 0,
//             visible: false,
//           },
//           {
//             targets: 2,
//             render: function (data, type, row) {
//               return `<button class="sort-button">${data}</button>`;
//             },
//           },
//         ],
//         //order: [[2, 'asc']], // Sortiert nach Vorname aufwärts
//         //lengthMenu: [1, 5, 50, 100],
//         //pageLength: 1, // Zeigt 10 Benutzer pro Seite an
//       });
//       $('#manageUsersTable').on('click', '.sort-button', function () {
//         const column = $(this).closest('th');
//         const direction = column.hasClass('asc') ? 'desc' : 'asc';
//         column.toggleClass('asc').toggleClass('desc');
//         table.order([2, direction]).draw();
//       });
//       $('#manageUsersTable_length select').on('change', function () {
//         table.page.len($(this).val()).draw();
//       });
//       // $('#manageUsersTable').dataTable({
//       //   lengthMenu: [
//       //     [2, 25, 50, -1],
//       //     [2, 25, 50, 'All'],
//       //   ],
//       // });
//       // $('#all').on('click', function () {
//       //   table.page.len(-1).draw();
//       // });
//       //
//       // $('#manageUsersTable').on('click', function () {
//       //   table.page.len(1).draw();
//       // });
//       $(document).ready(function () {
//         $('#manageUsersTable').DataTable({
//           lengthMenu: [
//             [10, 25, 50, -1],
//             [10, 25, 50, 'All'],
//           ],
//         });
//       });
//     } else {
//       // Wenn keine Daten vorhanden sind, wird eine entsprechende Meldung ausgegeben
//       console.log('No data available.');
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
//
// // Zeigt die Benutzertabelle an, sobald die DOM-Struktur geladen ist
// $(document).ready(() => {
//   showUsers();
// });
//------------------------------------------------------------up--------------------------------
// const showUsers = async () => {
//   try {
//     // Ruft alle Benutzer vom Server ab und speichert die Antwort in einer Variablen
//     const response = await axios.get(`${apiUrl}/users`);
//     const data = response.data;
//
//     // Erstellt DataTable mit serverseitiger Verarbeitung und gibt Spalten an
//     const dt = $('#example').DataTable({
//       processing: true,
//       serverSide: true,
//       data: data,
//       columns: [
//         {
//           class: 'details-control',
//           orderable: false,
//           data: null,
//           defaultContent: '',
//         },
//         { data: 'firstName' },
//         { data: 'lastName' },
//       ],
//       order: [[1, 'asc']],
//     });
//
//     // Array, um die ids der angezeigten Details-Zeilen zu verfolgen
//     const detailRows = [];
//
//     $('#example tbody').on('click', 'tr td.details-control', function () {
//       const tr = $(this).closest('tr');
//       const row = dt.row(tr);
//       const idx = detailRows.indexOf(tr.attr('id'));
//
//       if (row.child.isShown()) {
//         tr.removeClass('details');
//         row.child.hide();
//
//         // Entfernen aus dem 'open' Array
//         detailRows.splice(idx, 1);
//       } else {
//         tr.addClass('details');
//         row.child(format(row.data())).show();
//
//         // Zum 'open' Array hinzufügen
//         if (idx === -1) {
//           detailRows.push(tr.attr('id'));
//         }
//       }
//     });
//
//     // Bei jedem Zeichnen wird über das 'detailRows' Array iteriert und alle Kindzeilen angezeigt
//     dt.on('draw', function () {
//       detailRows.forEach(function (id, i) {
//         $('#' + id + ' td.details-control').trigger('click');
//       });
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };
//
// $(document).ready(() => {
//   showUsers();
// });

//-----------------------------------------------------------------------------------------------

// For the example - show interactions with the table
// var eventFired = function (type) {
//   var n = document.querySelector('#demo_info');
//   n.innerHTML += '<div>' + type + ' event - ' + new Date().getTime() + '</div>';
//   n.scrollTop = n.scrollHeight;
// };
//
// document.addEventListener('DOMContentLoaded', function () {
//   let table = new DataTable('#example');
//
//   table
//     .on('order', function () {
//       eventFired('Order');
//     })
//     .on('search', function () {
//       eventFired('Search');
//     })
//     .on('page', function () {
//       eventFired('Page');
//     });
// });

// $(document).ready(function () {
//   var dt = $('#example').DataTable({
//     processing: true,
//     serverSide: true,
//     ajax: 'scripts/ids-objects.php',
//     columns: [
//       {
//         class: 'details-control',
//         orderable: false,
//         data: null,
//         defaultContent: '',
//       },
//       { data: 'first_name' },
//       { data: 'last_name' },
//       { data: 'position' },
//       { data: 'office' },
//     ],
//     order: [[1, 'asc']],
//   });
//
//   // Array to track the ids of the details displayed rows
//   var detailRows = [];
//
//   $('#example tbody').on('click', 'tr td.details-control', function () {
//     var tr = $(this).closest('tr');
//     var row = dt.row(tr);
//     var idx = detailRows.indexOf(tr.attr('id'));
//
//     if (row.child.isShown()) {
//       tr.removeClass('details');
//       row.child.hide();
//
//       // Remove from the 'open' array
//       detailRows.splice(idx, 1);
//     } else {
//       tr.addClass('details');
//       row.child(format(row.data())).show();
//
//       // Add to the 'open' array
//       if (idx === -1) {
//         detailRows.push(tr.attr('id'));
//       }
//     }
//   });
//
//   // On each draw, loop over the `detailRows` array and show any child rows
//   dt.on('draw', function () {
//     detailRows.forEach(function (id, i) {
//       $('#' + id + ' td.details-control').trigger('click');
//     });
//   });
// });

// const showUsers = async () => {
//   console.log('Bin showUsers'); // Gib eine Nachricht im Browser-Entwickler-Tool aus, um zu bestätigen, dass die Funktion ausgeführt wird
//   console.log('Bin showUserswwwww'); // Gib eine weitere Nachricht im Browser-Entwickler-Tool aus, um zu bestätigen, dass die Funktion ausgeführt wird
//   try {
//     const response = await axios.get(`${apiUrl}/users`); // Senden einer GET-Anforderung an die API-URL, um Benutzerdaten zu erhalten
//
//     console.log(response.data.status); // Gib den Status der API-Antwort im Browser-Entwickler-Tool aus
//     if (response.data.status === 'success') {
//       // Wenn die API-Antwort erfolgreich war
//       console.log(response.data.status); // Gib den Status der API-Antwort im Browser-Entwickler-Tool aus
//       $('#manageUsersTable').DataTable().clear().destroy(); // Zerstöre die bestehende DataTable, bevor du eine neue erstellst
//
//       $('#manageUsersTable').DataTable({
//         // Erstelle eine DataTable mit den erhaltenen Benutzerdaten
//         data: response.data.data.data, // Daten aus der API-Antwort
//         columns: [
//           { data: '_id' }, // Spalte für die Benutzer-ID
//           { data: 'createdAt' }, // Spalte für das Erstellungsdatum des Benutzers
//           { data: 'firstName' }, // Spalte für den Vornamen des Benutzers
//           { data: 'lastName' }, // Spalte für den Nachnamen des Benutzers
//           { data: 'age' }, // Spalte für das Alter des Benutzers
//           { data: 'gender' }, // Spalte für das Geschlecht des Benutzers
//           { data: 'employeeNumber' }, // Spalte für die Personalnummer des Benutzers
//           { data: 'language' }, // Spalte für die Sprache des Benutzers
//           { data: 'photo' }, // Spalte für das Foto des Benutzers
//           { data: 'role' }, // Spalte für die Rolle des Benutzers
//           { data: 'department' }, // Spalte für die Abteilung des Benutzers
//           { data: 'name' }, // Spalte für den Benutzernamen
//           { data: 'email' }, // Spalte für die E-Mail-Adresse des Benutzers
//           { data: 'password' }, // Spalte für das Passwort des Benutzers
//           {
//             data: '_id',
//             render: function (data) {
//               return `<a href="/user/${data}" class="edit-button">Edit</a>
//               <button class="delete-button" data-id="${data}">Delete</button>`; // Erstelle eine Schaltfläche zum Bearbeiten und Löschen des Benutzers in der letzten Spalte
//             },
//             orderable: false, // Deaktiviere die Sortierung für die letzte Spalte
//           },
//         ],
//       });
//     }
//   } catch (error) {
//     console.log(error); // Gib einen Fehler aus, wenn die API-Anforderung fehlschlägt
//   }
// };
//
// $(document).ready(() => {
//   showUsers(); // Rufe die showUsers-Funktion auf, wenn das Dokument bereit ist
// });

// function showUser(user) {
//   // entferne die bestehende Tabelle
//   $('#manageUsersTable').DataTable().destroy();
//   $('#manageUsersTable').empty();
//
//   // erstelle eine neue Tabelle
//   var table = $('#manageUsersTable').DataTable({
//     data: [user],
//     columns: [
//       { data: '_id', visible: false },
//       { data: 'createdAt' },
//       { data: 'firstName' },
//       { data: 'lastName' },
//       { data: 'age' },
//       { data: 'gender' },
//       { data: 'employeeNumber' },
//       { data: 'language' },
//       { data: 'photo' },
//       { data: 'role' },
//       { data: 'department' },
//       { data: 'name' },
//       { data: 'email' },
//       { data: 'password' },
//       {
//         data: '_id',
//         render: function (data) {
//           return `<a href="/user/${data}" class="edit-button">Edit</a>
//           <button class="delete-button" data-id="${data}">Delete</button>`;
//         },
//         orderable: false,
//       },
//     ],
//   });
//
//   // füge die neue Tabelle hinzu
//   $('#manageUsersTable_wrapper').append(table.table().node());
// }
