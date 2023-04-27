/* eslint-disable */

import '@babel/polyfill'; // first line of imports, für ältere Browser
import { login, logout } from './login';
import { updateData } from './updateSettings';
import { updateSettings } from './updateSettings';
//import axios from 'axios'

console.log('Hello from parcel! bin index.js'); //npm run watch:js

// DOM Element
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

const manageUsersTable = document.querySelector('.manageUsersTable');

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
