/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

// const process = require("process");
const port = 7566;
// const port = process.env.PORT_NUMBER || 3000;
const apiUrl = 'http://127.0.0.1:' + port + '/api/v1';

export const showMachinery = async () => {
  console.log('bin showMachinery');
  const currentUser = JSON.parse(document.getElementById('currentUser').value);
  console.log(currentUser.language);

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/machinery`,
    });
    //
    if (res.data.status === 'success') {
      console.log('success in showMachinery');

      if (currentUser.language === 'de') {
        console.log('currentUser.language = de');
        $('#manageMachineryTable').DataTable().destroy();
        // $('#manageUsersTable').on('click', '.delete-button', function () {
        //   const id = $(this).attr('data-id');
        //   //deleteUser(id);
        // });
        // $('#manageUsersTable').on('click', '.edit-button', function () {
        //   const id = $(this).attr('id');
        //   location.assign(`/userw/${id}`);
        // });

        $('#manageMachineryTable').DataTable({
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
                // return `<a href="/user/${data}" class="edit-button">Edit</a>
                // <button class="delete-button" data-id="${data}">Delete</button>`;
                //return `<a href="/user/${data}" class="edit-button">Edit</a>`;
                return `
              <a href="/api/v1/manage_machinery/${data}" class="edit-button">
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

        // const $employeeNumSortAscBtn = $(
        //   '#manageUsersTable th.employee-number button-upDown.spam.arrow-up'
        // );
        // const $employeeNumSortDescBtn = $(
        //   '#manageUsersTable th.employee-number button-upDown.spam.arrow-down'
        // );

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
        // $employeeNumSortAscBtn.on('click', function () {
        //   $('#manageUsersTable').DataTable().order([1, 'asc']).draw();
        // });
        //
        // // Event-Listener zum Sortieren nach absteigender Employee-Nummer
        // $employeeNumSortDescBtn.on('click', function () {
        //   $('#manageUsersTable').DataTable().order([1, 'desc']).draw();
        // });
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
        // $('#manageUsersTable').on('click', '.delete-button', function () {
        //   const id = $(this).attr('data-id');
        //   //deleteUser(id);
        // });
        // $('#manageUsersTable').on('click', '.edit-button', function () {
        //   const id = $(this).attr('id');
        //   location.assign(`/userw/${id}`);
        // });

        $('#manageMachineryTable').DataTable({
          data: translatedData, //res.data.data.data,
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

            { data: 'name' },
            { data: 'description' },
            { data: 'zone' },
            // {
            //   data: 'zone',
            //   render: function (data) {
            //     const translatedZone = await translateZone(data);
            //     return translatedZone;
            //   },
            // },
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
                // return `<a href="/user/${data}" class="edit-button">Edit</a>
                // <button class="delete-button" data-id="${data}">Delete</button>`;
                //return `<a href="/user/${data}" class="edit-button">Edit</a>`;
                return `
              <a href="/api/v1/manage_machinery/${data}" class="edit-button">
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

        // const $employeeNumSortAscBtn = $(
        //   '#manageUsersTable th.employee-number button-upDown.spam.arrow-up'
        // );
        // const $employeeNumSortDescBtn = $(
        //   '#manageUsersTable th.employee-number button-upDown.spam.arrow-down'
        // );

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
        // $employeeNumSortAscBtn.on('click', function () {
        //   $('#manageUsersTable').DataTable().order([1, 'asc']).draw();
        // });
        //
        // // Event-Listener zum Sortieren nach absteigender Employee-Nummer
        // $employeeNumSortDescBtn.on('click', function () {
        //   $('#manageUsersTable').DataTable().order([1, 'desc']).draw();
        // });
      }
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// export const showMachinery = async () => {
//   console.log('bin showMachinery');
//   const currentUser = JSON.parse(document.getElementById('currentUser').value);
//   console.log(currentUser.language);
//
//   try {
//     const res = await axios({
//       method: 'GET',
//       url: `${apiUrl}/machinery`,
//     });
//     //
//     if (res.data.status === 'success') {
//       console.log('success in showMachinery');
//
//       if (currentUser.language === 'de') {
//         console.log('currentUser.language = de');
//         $('#manageMachineryTable').DataTable().destroy();
//         // $('#manageUsersTable').on('click', '.delete-button', function () {
//         //   const id = $(this).attr('data-id');
//         //   //deleteUser(id);
//         // });
//         // $('#manageUsersTable').on('click', '.edit-button', function () {
//         //   const id = $(this).attr('id');
//         //   location.assign(`/userw/${id}`);
//         // });
//
//         $('#manageMachineryTable').DataTable({
//           data: res.data.data.data,
//           //pagingType: 'full_numbers', // Hier wird das Paging-Layout definiert
//           dom: 'l<"toolbar">frtip',
//           pagingType: 'full_numbers',
//           paging: true, // zeigt immer den "Next"-Button an, auch wenn weniger als 2
//           //lengthChange: false, // verhindert, dass der Benutzer die Anzahl der angezeigten Einträge ändern kann
//           language: {
//             lengthMenu: 'Display _MENU_ records per page',
//             zeroRecords: 'Nothing found - sorry',
//             info: 'Showing page _PAGE_ of _PAGES_',
//             infoEmpty: 'No records available',
//             infoFiltered: '(filtered from _MAX_ total records)',
//             paginate: {
//               first: 'First',
//               last: 'Last',
//               next: 'Next',
//               previous: 'Previous',
//             },
//           },
//           lengthChange: true, // verhindert, dass der Benutzer die Anzahl der angezeigten Einträge ändern kann
//           lengthMenu: [
//             [2, 5, 10, -1],
//             [2, 5, 10, 'All'],
//           ],
//           pageLength: 5, // Hier wird die standardmäßige Anzahl von Einträgen pro Seite definiert
//           columns: [
//             {
//               data: '_id',
//               visible: false,
//             },
//
//             { data: 'name' },
//             { data: 'description' },
//             { data: 'zone' },
//             { data: 'type' },
//             { data: 'constructionYear' },
//             { data: 'companyMachine' },
//             { data: 'department' },
//             { data: 'voltage' },
//             { data: 'controlVoltage' },
//             { data: 'ratedCurrent' },
//             { data: 'electricalFuse' },
//             { data: 'compressedAir' },
//             { data: 'weightMass' },
//             { data: 'dimensions' },
//             { data: 'drawingNumber' },
//             { data: 'employeesCount' },
//             {
//               data: 'createdAt',
//               render: function (data) {
//                 const date = new Date(data);
//                 const options = {
//                   day: '2-digit',
//                   month: '2-digit',
//                   year: 'numeric',
//                   hour: '2-digit',
//                   minute: '2-digit',
//                 };
//                 return date.toLocaleDateString('de-DE', options);
//               },
//             },
//             {
//               data: '_id',
//               render: function (data) {
//                 // return `<a href="/user/${data}" class="edit-button">Edit</a>
//                 // <button class="delete-button" data-id="${data}">Delete</button>`;
//                 //return `<a href="/user/${data}" class="edit-button">Edit</a>`;
//                 return `
//               <a href="/api/v1/manage_machinery/${data}" class="edit-button">
//                 <svg class="heading-box__icon">
//                 <use xlink:href="/img/icons.svg#icon-edit-3"></use>
//                 </svg>
//               </a>`;
//                 // '<a href="#" id="' + data + '" class="edit-button"><i class="fas fa-edit"></i></a>'`;
//                 // return '<a href="#" class="edit-button"><i class="fas fa-edit"></i></a>';
//                 //             svg.heading-box__icon
//                 // use(xlink:href='/img/icons.svg#icon-map-pin')`;
//                 //<svg className="edit-icon"><use xlink:href="#icon-edit"></use></svg>`;
//               },
//               orderable: false,
//             },
//           ],
//         });
//
//         // // Define the buttons for sorting the name column
//         // const $nameSortAscBtn = $(
//         //   '#manageUsersTable th button-upDown.spam.arrow-up'
//         // );
//         // const $nameSortDescBtn = $(
//         //   '#manageUsersTable th button-upDown.spam.arrow-down'
//         // );
//
//         // const $employeeNumSortAscBtn = $(
//         //   '#manageUsersTable th.employee-number button-upDown.spam.arrow-up'
//         // );
//         // const $employeeNumSortDescBtn = $(
//         //   '#manageUsersTable th.employee-number button-upDown.spam.arrow-down'
//         // );
//
//         // // Add event listener to the button for ascending name sorting
//         // $nameSortAscBtn.on('click', function () {
//         //   // Sort the data in the table by name in ascending order
//         //   table.order([2, 'asc']).draw();
//         // });
//         //
//         // // Add event listener to the button for descending name sorting
//         // $nameSortDescBtn.on('click', function () {
//         //   // Sort the data in the table by name in descending order
//         //   table.order([2, 'desc']).draw();
//         // });
//
//         // Event-Listener zum Sortieren nach aufsteigender Employee-Nummer
//         // $employeeNumSortAscBtn.on('click', function () {
//         //   $('#manageUsersTable').DataTable().order([1, 'asc']).draw();
//         // });
//         //
//         // // Event-Listener zum Sortieren nach absteigender Employee-Nummer
//         // $employeeNumSortDescBtn.on('click', function () {
//         //   $('#manageUsersTable').DataTable().order([1, 'desc']).draw();
//         // });
//       } else if (currentUser.language === 'en') {
//         console.log('currentUser.language = en');
//         const data = res.data.data.data;
//
//         const translatedData = await Promise.all(
//           data.map(async (item) => {
//             const translatedZone = await translateZone(item.zone);
//             return { ...item, zone: translatedZone };
//           })
//         );
//
//         $('#manageMachineryTable').DataTable().destroy();
//         // $('#manageUsersTable').on('click', '.delete-button', function () {
//         //   const id = $(this).attr('data-id');
//         //   //deleteUser(id);
//         // });
//         // $('#manageUsersTable').on('click', '.edit-button', function () {
//         //   const id = $(this).attr('id');
//         //   location.assign(`/userw/${id}`);
//         // });
//
//         $('#manageMachineryTable').DataTable({
//           data: translatedData, //res.data.data.data,
//           //pagingType: 'full_numbers', // Hier wird das Paging-Layout definiert
//           dom: 'l<"toolbar">frtip',
//           pagingType: 'full_numbers',
//           paging: true, // zeigt immer den "Next"-Button an, auch wenn weniger als 2
//           //lengthChange: false, // verhindert, dass der Benutzer die Anzahl der angezeigten Einträge ändern kann
//           language: {
//             lengthMenu: 'Display _MENU_ records per page',
//             zeroRecords: 'Nothing found - sorry',
//             info: 'Showing page _PAGE_ of _PAGES_',
//             infoEmpty: 'No records available',
//             infoFiltered: '(filtered from _MAX_ total records)',
//             paginate: {
//               first: 'First',
//               last: 'Last',
//               next: 'Next',
//               previous: 'Previous',
//             },
//           },
//           lengthChange: true, // verhindert, dass der Benutzer die Anzahl der angezeigten Einträge ändern kann
//           lengthMenu: [
//             [2, 5, 10, -1],
//             [2, 5, 10, 'All'],
//           ],
//           pageLength: 5, // Hier wird die standardmäßige Anzahl von Einträgen pro Seite definiert
//           columns: [
//             {
//               data: '_id',
//               visible: false,
//             },
//
//             { data: 'name' },
//             { data: 'description' },
//             { data: 'zone' },
//             // {
//             //   data: 'zone',
//             //   render: function (data) {
//             //     const translatedZone = await translateZone(data);
//             //     return translatedZone;
//             //   },
//             // },
//             { data: 'type' },
//             { data: 'constructionYear' },
//             { data: 'companyMachine' },
//             { data: 'department' },
//             { data: 'voltage' },
//             { data: 'controlVoltage' },
//             { data: 'ratedCurrent' },
//             { data: 'electricalFuse' },
//             { data: 'compressedAir' },
//             { data: 'weightMass' },
//             { data: 'dimensions' },
//             { data: 'drawingNumber' },
//             { data: 'employeesCount' },
//             {
//               data: 'createdAt',
//               render: function (data) {
//                 const date = new Date(data);
//                 const options = {
//                   day: '2-digit',
//                   month: '2-digit',
//                   year: 'numeric',
//                   hour: '2-digit',
//                   minute: '2-digit',
//                 };
//                 return date.toLocaleDateString('de-DE', options);
//               },
//             },
//             {
//               data: '_id',
//               render: function (data) {
//                 // return `<a href="/user/${data}" class="edit-button">Edit</a>
//                 // <button class="delete-button" data-id="${data}">Delete</button>`;
//                 //return `<a href="/user/${data}" class="edit-button">Edit</a>`;
//                 return `
//               <a href="/api/v1/manage_machinery/${data}" class="edit-button">
//                 <svg class="heading-box__icon">
//                 <use xlink:href="/img/icons.svg#icon-edit-3"></use>
//                 </svg>
//               </a>`;
//                 // '<a href="#" id="' + data + '" class="edit-button"><i class="fas fa-edit"></i></a>'`;
//                 // return '<a href="#" class="edit-button"><i class="fas fa-edit"></i></a>';
//                 //             svg.heading-box__icon
//                 // use(xlink:href='/img/icons.svg#icon-map-pin')`;
//                 //<svg className="edit-icon"><use xlink:href="#icon-edit"></use></svg>`;
//               },
//               orderable: false,
//             },
//           ],
//         });
//
//         // // Define the buttons for sorting the name column
//         // const $nameSortAscBtn = $(
//         //   '#manageUsersTable th button-upDown.spam.arrow-up'
//         // );
//         // const $nameSortDescBtn = $(
//         //   '#manageUsersTable th button-upDown.spam.arrow-down'
//         // );
//
//         // const $employeeNumSortAscBtn = $(
//         //   '#manageUsersTable th.employee-number button-upDown.spam.arrow-up'
//         // );
//         // const $employeeNumSortDescBtn = $(
//         //   '#manageUsersTable th.employee-number button-upDown.spam.arrow-down'
//         // );
//
//         // // Add event listener to the button for ascending name sorting
//         // $nameSortAscBtn.on('click', function () {
//         //   // Sort the data in the table by name in ascending order
//         //   table.order([2, 'asc']).draw();
//         // });
//         //
//         // // Add event listener to the button for descending name sorting
//         // $nameSortDescBtn.on('click', function () {
//         //   // Sort the data in the table by name in descending order
//         //   table.order([2, 'desc']).draw();
//         // });
//
//         // Event-Listener zum Sortieren nach aufsteigender Employee-Nummer
//         // $employeeNumSortAscBtn.on('click', function () {
//         //   $('#manageUsersTable').DataTable().order([1, 'asc']).draw();
//         // });
//         //
//         // // Event-Listener zum Sortieren nach absteigender Employee-Nummer
//         // $employeeNumSortDescBtn.on('click', function () {
//         //   $('#manageUsersTable').DataTable().order([1, 'desc']).draw();
//         // });
//       }
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };

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
        name: name, //'66101',
        description: description, //'Erika',
        zone: zone,
        type: type, //'Schmidt',
        constructionYear: constructionYear,
        companyMachine: companyMachine,
        voltage: voltage,
        controlVoltage: controlVoltage, //'erika',
        ratedCurrent: ratedCurrent,
        electricalFuse: electricalFuse, //'test1234',
        compressedAir: compressedAir, //'test1234',
        weightMass: weightMass, //'guide',
        dimensions: dimensions, //'guide',
        drawingNumber: drawingNumber, //'guide',
        department: department, //'Unterhalt',
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Machine created successfully');
      window.setTimeout(() => {
        location.assign('/api/v1/manage_machinery');
      }, 1200);
    } else {
      console.log('nichts beim server /machinery/createMachine angekommen');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
  //   if (res.data.status === 'success') {
  //     showAlert('success', 'Machine created successfully');
  //     window.setTimeout(() => {
  //       location.assign('/api/v1/manage_machinery');
  //     }, 1200);
  //   } else {
  //     console.log('nichts beim server /machinery/createMachine angekommen');
  //   }
  // } catch (err) {
  //   showAlert('error', err.response.data.message);
  // }
};

export const updateMachine = async (data, id) => {
  console.log('bin updateMachine in index.js');
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
        location.assign('/api/v1/manage_machinery');
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
        location.assign('/api/v1/manage_machinery');
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
