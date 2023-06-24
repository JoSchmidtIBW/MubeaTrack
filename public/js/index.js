/* eslint-disable */

import '@babel/polyfill'; // first line of imports, for older browsers
import { login, logout } from './login';

import {
  showUsers,
  createNewUser,
  updateUser,
  deleteUser,
  forgotPassword,
} from './user';

import {
  showMachinery,
  createNewMachine,
  updateMachine,
  deleteMachine,
} from './machine';

import {
  showASMAmachinery,
  createSectorASMA,
  updateSectorASMA,
  deleteSectorASMA,
} from './machineryASMA';

import {
  createComponentASMA,
  updateComponentASMA,
  deleteComponentASMA,
} from './componentsASMA';

import {
  createComponentDetailASMA,
  updateComponentDetailASMA,
  deleteComponentDetailASMA,
} from './componentDetailsASMA';

import { showUsersMachinery, updateUserMachinery } from './usersMachinery';

import { updateASMAMachine } from './ASMAmachine';

import {
  showOpenMalReports,
  updateLogFal,
  closeMalReport,
  createLogFal,
  showMyMalReports,
  showClosedMalReports,
} from './malReport';

import { updateSettings } from './updateSettings';

import dotenv from 'dotenv';
dotenv.config({ path: '../../config.env' });
import * as process from 'process';

const dev_Port = 7566;
const prod_Port = 7577;

const port = process.env.NODE_ENV === 'development' ? dev_Port : prod_Port;
const host = 'http://127.0.0.1:';
const strPathApiV1 = '/api/v1';
const apiUrl = host + port + strPathApiV1;

console.log('Hello from parcel! bin index.js');
console.log('port in index.js: ' + port);
console.log('process: ' + JSON.stringify(process));
console.log('process: ' + JSON.stringify(process.env));
console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV);
console.log('process.env.DEV_PORT: ' + process.env.DEV_PORT);

// DOM Element
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

const manageUsersTable = document.querySelector('.manageUsersTable');
const newUserDataForm = document.querySelector('.form-new-user-data');
const updateUserByAdminDataForm = document.querySelector(
  '.form-workerAdmin-data'
);
const updateUserByChefDataForm = document.querySelector(
  '.form-workerChef-data'
);

const manageMachineryTabel = document.querySelector('.manageMachineryTable');
const newMachineDataForm = document.querySelector('.form-new-machine-data');
const updateMachineForm = document.querySelector('.form-machine-data');

const manageASMAMachineTable = document.querySelector(
  '.manageASMAMachineTable'
);
const newSectorASMAform = document.querySelector('.form-new-sectorASMA-data');
const updateSectorASMAForm = document.querySelector(
  '.form-updateSectorASMA-data'
);
const newComponentASMAForm = document.querySelector(
  '.form-new-componentsASMA-data'
);
const updateComponentASMAForm = document.querySelector(
  '.form-updateComponentASMA-data'
);

const newcomponentDetailsASMAForm = document.querySelector(
  '.form-new-componentDetailsASMA-data'
);

const updateComponentDetailASMAForm = document.querySelector(
  '.form-updateComponentDetailASMA-data'
);

const manageUsersMachineryTable = document.querySelector(
  '.manageUsersMachineryTable'
);

const updateUserMashineForm = document.querySelector('.form-userMachine-data');

const ASMAbtnForm = document.querySelector('.form-ASMAbtn-data');

const manageASMAUnterhaltMachineOpenMalReportsTable = document.querySelector(
  '.manageASMAUnterhaltMachineOpenMalReportsTable'
);

const updateLogFalForm = document.querySelector('.form-updateLogFal-data');
const updateMalReportForm = document.querySelector(
  '.form-updateMalReport-data'
);

const manageASMAUnterhaltMachineClosedMalReportsTable = document.querySelector(
  '.manageASMAUnterhaltMachineClosedMalReportsTable'
);
const myMalReportsTable = document.querySelector('.myMalReportsTable');

const forgotPasswordForm = document.querySelector('.form--forgotPassword');

// DELEGATION

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // element prevent from loading the page

    const employeeNumber = document.getElementById('employeeNumber').value;
    const password = document.getElementById('password').value;

    login(employeeNumber, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //also images
    const form = new FormData();
    form.append('firstName', document.getElementById('firstname').value);
    form.append('lastName', document.getElementById('lastname').value);
    form.append('gender', document.getElementById('gender').value);
    form.append('language', document.getElementById('language').value);
    form.append('email', document.getElementById('email').value);
    form.append('role', document.getElementById('role').value);

    form.append('photo', document.getElementById('photo').files[0]); // files are array, need first element

    console.log(
      'bin if(userDataForm), in index.js, wenn bild, sieht keine information sollte aber kein problem sein: ' +
        form
    );

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn--save-password').textContent = 'Updating...'; // innerHtml or textContent

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    ); // this data must be called exactly the same as in postman!

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (e) => {
    console.log('bin forgotPasswordForm');
    e.preventDefault();
    const email = document.getElementById('email').value;
    console.log('email: ' + email);
    forgotPassword(email);
  });
}

if (manageUsersTable) {
  console.log('bin If usertable');
  showUsers();
}

if (newUserDataForm) {
  newUserDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const employeeNumber = document.getElementById('employeeNumber').value;
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const birthDate = document.getElementById('birthDate').value;
    const gender = document.querySelector('#gender').value;
    const language = document.querySelector('#language').value;
    const professional = document.querySelector('#professional').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const role = document.querySelector('#role').value;
    const selectedDepartments = Array.from(
      document.querySelectorAll('input[name="departments"]:checked')
    ).map((department) => department.value);

    console.log(employeeNumber);
    console.log(firstname);
    console.log(lastname);
    console.log(birthDate);
    console.log(gender);
    console.log(language);
    console.log(professional);
    console.log(email);
    console.log(password);
    console.log(passwordConfirm);
    console.log(role);

    console.log('-------------------');
    console.log(selectedDepartments);

    const department = selectedDepartments;

    createNewUser(
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
    );
  });
}

const saveUpdateUserByAdminButton = document.querySelector(
  '.btn--saveUpdateUserByAdmin'
);
const deleteUpdateUserByAdminButton = document.querySelector(
  '.btn--deleteUpdateUserByAdmin'
);

if (updateUserByAdminDataForm) {
  updateUserByAdminDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('bin updateUserChefDataForm');

    const id = document.getElementById('userId').value;
    const employeeNumber = document.getElementById('employeeNumber').value;
    const firstName = document.getElementById('firstname').value;
    const lastName = document.getElementById('lastname').value;
    const birthDate = document.getElementById('birthDate').value;
    const gender = document.querySelector('#gender').value;
    const language = document.querySelector('#language').value;
    const professional = document.querySelector('#professional').value;
    const email = document.getElementById('email').value;
    const role = document.querySelector('#role').value;
    const departmentString = document.querySelector('#department').value;

    console.log(id);
    console.log(employeeNumber);
    console.log(firstName);
    console.log(lastName);
    console.log(birthDate);
    console.log(gender);
    console.log(language);
    console.log(professional);
    console.log(email);
    console.log(role);

    console.log(departmentString);
    const departmentsArray = departmentString.split(',');

    console.log(departmentsArray);
    const department = departmentsArray;
    if (e.submitter === saveUpdateUserByAdminButton) {
      updateUser(
        {
          firstName,
          lastName,
          birthDate,
          gender,
          professional,
          email,
          role,
          department,
        },
        id
      );
    } else if (e.submitter === deleteUpdateUserByAdminButton) {
      console.log('bin Delete in updateUserByAdminDataForm');
      deleteUser(id);
    }
  });
}

const saveUpdateUserByChefButton = document.querySelector(
  '.btn--saveUpdateUserByChef'
);
const deleteUpdateUserByChefButton = document.querySelector(
  '.btn--deleteUpdateUserByChef'
);

if (updateUserByChefDataForm) {
  updateUserByChefDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('bin updateUserChefDataForm');

    const id = document.getElementById('userId').value;
    const employeeNumber = document.getElementById('employeeNumber').value;
    const firstName = document.getElementById('firstname').value;
    const lastName = document.getElementById('lastname').value;
    const birthDate = document.getElementById('birthDate').value;
    const gender = document.querySelector('#gender').value;
    const language = document.querySelector('#language').value;
    const professional = document.querySelector('#professional').value;
    const email = document.getElementById('email').value;
    const role = document.querySelector('#role').value;
    const departmentString = document.querySelector('#department').value;

    console.log(id);
    console.log(employeeNumber);
    console.log(firstName);
    console.log(lastName);
    console.log(birthDate);
    console.log(gender);
    console.log(language);
    console.log(professional);
    console.log(email);
    console.log(role);

    console.log(departmentString);
    const departmentsArray = departmentString.split(',');

    console.log(departmentsArray);
    const department = departmentsArray;
    if (e.submitter === saveUpdateUserByChefButton) {
      updateUser(
        {
          firstName,
          lastName,
          professional,
          birthDate,
          gender,
          email,
          role,
          department,
        },
        id
      );
    } else if (e.submitter === deleteUpdateUserByChefButton) {
      console.log('bin Delete in updateUserByAdminDataForm');
      deleteUser(id);
    }
  });
}

if (manageMachineryTabel) {
  console.log('bin If machinerytable');
  showMachinery();
}

if (newMachineDataForm) {
  newMachineDataForm.addEventListener('submit', async (e) => {
    console.log('bin newMachineDataForm');
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const zone = document.querySelector('#zone').value;
    const type = document.getElementById('type').value;
    const constructionYear = document.getElementById('constructionYear').value;
    const companyMachine = document.getElementById('companyMachine').value;
    const voltage = document.getElementById('voltage').value;
    const controlVoltage = document.getElementById('controlVoltage').value;
    const ratedCurrent = document.getElementById('ratedCurrent').value;
    const electricalFuse = document.getElementById('electricalFuse').value;
    const compressedAir = document.getElementById('compressedAir').value;
    const weightMass = document.getElementById('weightMass').value;
    const dimensions = document.getElementById('dimensions').value;
    const drawingNumber = document.getElementById('drawingNumber').value;
    const department = document.querySelector('#department').value;

    console.log(name);
    console.log(description);
    console.log(zone);
    console.log(type);
    console.log(constructionYear);
    console.log(companyMachine);
    console.log(voltage);
    console.log(controlVoltage);
    console.log(ratedCurrent);
    console.log(electricalFuse);
    console.log(compressedAir);
    console.log(weightMass);
    console.log(dimensions);
    console.log(drawingNumber);
    console.log(department);

    createNewMachine(
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
    );
  });
}

const saveUpdateMachineButton = document.querySelector(
  '.btn--saveUpdateMachine'
);
const deleteUpdateMachineButton = document.querySelector(
  '.btn--deleteUpdateMachine'
);

if (updateMachineForm) {
  updateMachineForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('bin updateMachineDataForm');

    const id = document.getElementById('machineId').value;
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    let zone = document.getElementById('zone').value;
    const type = document.getElementById('type').value;
    const constructionYear = document.getElementById('constructionYear').value;
    const companyMachine = document.getElementById('companyMachine').value;
    const voltage = document.getElementById('voltage').value;
    const controlVoltage = document.getElementById('controlVoltage').value;
    const ratedCurrent = document.getElementById('ratedCurrent').value;
    const electricalFuse = document.getElementById('electricalFuse').value;
    const compressedAir = document.getElementById('compressedAir').value;
    const weightMass = document.getElementById('weightMass').value;
    const dimensions = document.getElementById('dimensions').value;
    const drawingNumber = document.getElementById('drawingNumber').value;
    const department = document.querySelector('#department').value;

    console.log(id);
    console.log(name);
    console.log(description);

    console.log('---------------');
    console.log(zone);
    if (zone.startsWith('["')) {
      zone = zone.replace(/[\[\]"]/g, '');
    }

    console.log(zone);
    console.log(type);
    console.log(constructionYear);
    console.log(companyMachine);
    console.log(voltage);
    console.log(controlVoltage);
    console.log(ratedCurrent);
    console.log(electricalFuse);
    console.log(compressedAir);
    console.log(weightMass);
    console.log(dimensions);
    console.log(drawingNumber);
    console.log(department);

    if (e.submitter === saveUpdateMachineButton) {
      updateMachine(
        {
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
          department,
        },
        id
      );
    } else if (e.submitter === deleteUpdateMachineButton) {
      console.log('bin Delete in updateMachineDataForm');
      deleteMachine(id);
    }
  });
}

if (newcomponentDetailsASMAForm) {
  newcomponentDetailsASMAForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('bin newcomponentDetailsASMAForm');

    const machineId = document.getElementById('machineID').value;
    const sectorASMAID = document.getElementById('sectorASMAID').value;
    const componentASMAID = document.getElementById('componentASMAID').value;
    const input_name_de = document.getElementById('input_name_de').value;
    const input_name_en = document.getElementById('input_name_en').value;

    console.log('machineId: ' + machineId);
    console.log('sectorASMAID: ' + sectorASMAID);
    console.log('componentASMAID: ' + componentASMAID);
    console.log('input_name_de: ' + input_name_de);
    console.log('input_name_en: ' + input_name_en);

    createComponentDetailASMA(
      machineId,
      sectorASMAID,
      componentASMAID,
      input_name_de,
      input_name_en
    );
  });
}

if (newComponentASMAForm) {
  newComponentASMAForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('bin newComponentASMAForm');

    const machineId = document.getElementById('machineID').value;
    const sectorASMAID = document.getElementById('sectorASMAID').value;
    const input_name_de = document.getElementById('input_name_de').value;
    const input_name_en = document.getElementById('input_name_en').value;
    const input_description_de = document.getElementById(
      'input_description_de'
    ).value;
    const input_description_en = document.getElementById(
      'input_description_en'
    ).value;

    console.log('machineId: ' + machineId);
    console.log('sectorASMAID: ' + sectorASMAID);
    console.log('input_name_de: ' + input_name_de);
    console.log('input_name_en: ' + input_name_en);
    console.log('input_description_de: ' + input_description_de);
    console.log('input_description_en: ' + input_description_en);

    createComponentASMA(
      machineId,
      sectorASMAID,
      input_name_de,
      input_name_en,
      input_description_de,
      input_description_en
    );
  });
}

const saveUpdateComponentASMAButton = document.querySelector(
  '.btn--saveUpdateComponentASMA'
);
const deleteComponentASMAButton = document.querySelector(
  '.btn--deleteComponentASMA'
);

const saveUpdateComponentDetailASMAButton = document.querySelector(
  '.btn--saveUpdateComponentDetailASMA'
);
const deleteComponentDetailASMAButton = document.querySelector(
  '.btn--deleteComponentDetailASMA'
);

if (updateComponentDetailASMAForm) {
  updateComponentDetailASMAForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('bin updateComponentDetailASMAForm');

    const machineID = document.getElementById('machineID').value;
    const sectorASMAID = document.getElementById('sectorASMAID').value;
    const componentASMAID = document.getElementById('componentASMAID').value;
    const componentDetailASMAID = document.getElementById(
      'componentDetailASMAID'
    ).value;
    const componentDetailASMAName_de = document.getElementById(
      'componentDetailASMAName_de'
    ).value;
    const componentDetailASMAName_en = document.getElementById(
      'componentDetailASMAName_en'
    ).value;

    console.log('machineID: ' + machineID);
    console.log('sectorASMAID: ' + sectorASMAID);
    console.log('componentASMAID: ' + componentASMAID);
    console.log('componentDetailASMAID: ' + componentDetailASMAID);
    console.log('componentDetailASMAName_de: ' + componentDetailASMAName_de);
    console.log('componentDetailASMAName_en: ' + componentDetailASMAName_en);

    if (e.submitter === saveUpdateComponentDetailASMAButton) {
      console.log('bin saveUpdateComponentDetailASMAButton');
      updateComponentDetailASMA(
        {
          componentDetailASMAName_de,
          componentDetailASMAName_en,
        },
        machineID,
        sectorASMAID,
        componentASMAID,
        componentDetailASMAID
      );
    } else if (e.submitter === deleteComponentDetailASMAButton) {
      console.log('bin deleteComponentDetailASMAButton');
      deleteComponentDetailASMA(
        machineID,
        sectorASMAID,
        componentASMAID,
        componentDetailASMAID
      );
    }
  });
}

if (updateComponentASMAForm) {
  updateComponentASMAForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('bin updateComponentASMAForm');

    const machineID = document.getElementById('machineID').value;
    const sectorASMAID = document.getElementById('sectorASMAID').value;
    const componentASMAID = document.getElementById('componentASMAID').value;
    const componentASMAName_de = document.getElementById(
      'componentASMAName_de'
    ).value;
    const componentASMAName_en = document.getElementById(
      'componentASMAName_en'
    ).value;
    const componentASMADescription_de = document.getElementById(
      'componentASMAdescription_de'
    ).value;
    const componentASMADescription_en = document.getElementById(
      'componentASMAdescription_en'
    ).value;

    console.log('machineID: ' + machineID);
    console.log('sectorASMAID: ' + sectorASMAID);
    console.log('componentASMAID: ' + componentASMAID);
    console.log('componentASMAName_de: ' + componentASMAName_de);
    console.log('componentASMAName_en: ' + componentASMAName_en);
    console.log('componentASMADescription_de: ' + componentASMADescription_de);
    console.log('componentASMADescription_en: ' + componentASMADescription_en);

    if (e.submitter === saveUpdateComponentASMAButton) {
      console.log('bin saveUpdateComponentASMAButton');
      updateComponentASMA(
        {
          componentASMAName_de,
          componentASMAName_en,
          componentASMADescription_de,
          componentASMADescription_en,
        },
        machineID,
        sectorASMAID,
        componentASMAID
      );
    } else if (e.submitter === deleteComponentASMAButton) {
      console.log('bin deleteComponentASMAButton');
      deleteComponentASMA(machineID, sectorASMAID, componentASMAID);
    }
  });
}

if (newSectorASMAform) {
  newSectorASMAform.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('bin newSectorASMAform');

    const machineId = document.getElementById('id').value;
    const input_name = document.getElementById('input_name').value;
    const input_description_de = document.getElementById(
      'input_description_de'
    ).value;
    const input_description_en = document.getElementById(
      'input_description_en'
    ).value;

    console.log('machineId: ' + machineId);
    console.log('input_name: ' + input_name);
    console.log('input_description_de: ' + input_description_de);
    console.log('input_description_en: ' + input_description_en);

    createSectorASMA(
      machineId,
      input_name,
      input_description_de,
      input_description_en
    );
  });
}

const saveUpdateUserMachine = document.querySelector(
  '.btn--saveUpdateUserMachine'
);

if (ASMAbtnForm) {
  ASMAbtnForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('bin ASMAbtnForm');

    const currentUserID = document.getElementById('currentUserID').value;
    const machineID = document.getElementById('machineID').value;
    const departmentName = document.getElementById('departmentName').value;
    const machineName = document.getElementById('machineName').value;
    const selectedIdsBtnArr = document.getElementById('selectedIdsInput').value;
    const selectedRunIdBtn =
      document.getElementById('selectedRunIdInput').value;

    console.log('currentUserID: ' + currentUserID);
    console.log('machineID: ' + machineID);
    console.log('departmentName: ' + departmentName);
    console.log('machineName: ' + machineName);
    console.log('selectedIdsBtnArr: ' + selectedIdsBtnArr);
    console.log('selectedRunIdBtn: ' + selectedRunIdBtn);
    console.log('bin abszBtn');

    updateASMAMachine(
      { selectedIdsBtnArr, selectedRunIdBtn, currentUserID, machineID },
      machineID,
      departmentName,
      machineName
    );
    //}
  });
}

if (updateUserMashineForm) {
  updateUserMashineForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('bin updateUserMashineForm');

    const userID = document.getElementById('userID').value;
    const machineryInDepartmentID = document.getElementById(
      'machineryInDepartment'
    ).value;

    console.log('userID: ' + userID);
    console.log('machineryInDepartment: ' + machineryInDepartmentID);
    console.log('bin saveUpdateUserMachinery');

    updateUserMachinery({ machineryInDepartmentID }, userID);
  });
}

const closeMalReportButton = document.querySelector('.btn--closeMalReport');
const saveNewLogfalButton = document.querySelector('.btn--saveNewLogfal');

if (updateMalReportForm) {
  updateMalReportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('bin updateMalReportForm');

    const currentUser = document.getElementById('currentUser').value;
    const malReportID = document.getElementById('malReportID').value;
    const departmentName = document.getElementById('departmentName').value;
    const machineName = document.getElementById('machineName').value;
    const elektroMech = document.getElementById('elektroMech').value;
    const estimatedTime_Repair = document.getElementById(
      'estimatedTime_Repair'
    ).value;
    const Status_Repair = document.getElementById('Status_Repair').value;
    const messageProblem_de_Repair = document.getElementById(
      'messageProblem_de_Repair'
    ).value;
    const messageMission_de_Repair = document.getElementById(
      'messageMission_de_Repair'
    ).value;
    const messageProblem_en_Repair = document.getElementById(
      'messageProblem_en_Repair'
    ).value;
    const messageMission_en_Repair = document.getElementById(
      'messageMission_en_Repair'
    ).value;
    const createAt_Repair = document.getElementById('createAt_Repair').value;
    const estimatedStatus = document.getElementById('estimatedStatus').value;

    console.log('currentUser: ' + currentUser);
    console.log('malReportID: ' + malReportID);
    console.log('departmentName: ' + departmentName);
    console.log('machineName: ' + machineName);
    console.log('elektroMech: ' + elektroMech);
    console.log('estimatedTime_Repair: ' + estimatedTime_Repair);
    console.log('Status_Repair: ' + Status_Repair);
    console.log('messageProblem_de_Repair: ' + messageProblem_de_Repair);
    console.log('messageMission_de_Repair: ' + messageMission_de_Repair);
    console.log('messageProblem_en_Repair: ' + messageProblem_en_Repair);
    console.log('messageMission_en_Repair: ' + messageMission_en_Repair);
    console.log('createAt_Repair: ' + createAt_Repair);
    console.log('estimatedStatus: ' + estimatedStatus);

    if (e.submitter === closeMalReportButton) {
      console.log('bin closeMalReportButton');
      closeMalReport(malReportID, machineName, departmentName);
    } else if (e.submitter === saveNewLogfalButton) {
      console.log('bin saveNewLogfalButton');

      createLogFal(
        {
          currentUser,
          elektroMech,
          estimatedTime_Repair,
          Status_Repair,
          messageProblem_de_Repair,
          messageMission_de_Repair,
          messageProblem_en_Repair,
          messageMission_en_Repair,
          createAt_Repair,
          estimatedStatus,
        },
        machineName,
        departmentName,
        malReportID
      );
    }
  });
}

const saveUpdateSectorASMAButton = document.querySelector(
  '.btn--saveUpdateSectorASMA'
);
const deleteSectorASMAButton = document.querySelector('.btn--deleteSectorASMA');

if (updateSectorASMAForm) {
  updateSectorASMAForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('bin updateSectorASMAForm');

    const machineID = document.getElementById('machineID').value;
    const sectorASMAID = document.getElementById('sectorASMAID').value;
    const sectorASMAName = document.getElementById('sectorASMAname').value;
    const sectorASMADescription_de = document.getElementById(
      'sectorASMAdescription_de'
    ).value;
    const sectorASMADescription_en = document.getElementById(
      'sectorASMAdescription_en'
    ).value;

    console.log('machineID: ' + machineID);
    console.log('sectorASMAID: ' + sectorASMAID);
    console.log('sectorASMAName: ' + sectorASMAName);
    console.log('sectorASMADescription_de: ' + sectorASMADescription_de);
    console.log('sectorASMADescription_en: ' + sectorASMADescription_en);

    if (e.submitter === saveUpdateSectorASMAButton) {
      console.log('bin saveUpdateSectorASMAButton');
      updateSectorASMA(
        { sectorASMAName, sectorASMADescription_de, sectorASMADescription_en },
        machineID,
        sectorASMAID
      );
    } else if (e.submitter === deleteSectorASMAButton) {
      console.log('bin deleteSectorASMAButton');
      deleteSectorASMA(machineID, sectorASMAID);
    }
  });
}

if (manageUsersMachineryTable) {
  console.log('bin If manageUsersMachineryTable');
  showUsersMachinery();
}

if (manageASMAMachineTable) {
  console.log('bin If manageASMAMachineTable');
  showASMAmachinery();
}

if (manageASMAUnterhaltMachineOpenMalReportsTable) {
  console.log('bin if manageASMAUnterhaltMachineOpenMalReportsTable');
  showOpenMalReports();
}

if (myMalReportsTable) {
  console.log('bin if myMalReportsTable');
  showMyMalReports();
}

if (manageASMAUnterhaltMachineClosedMalReportsTable) {
  console.log('bin if manageASMAUnterhaltMachineClosedMalReportsTable');
  showClosedMalReports();
}

if (updateLogFalForm) {
  updateLogFalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('bin updateLogFalForm');

    const currentUser = document.getElementById('currentUser').value;
    const malReportID = document.getElementById('malReportID').value;
    const malReportLogFalID =
      document.getElementById('malReportLogFalID').value;
    const machineName = document.getElementById('machineName').value;
    const departmentName = document.getElementById('departmentName').value;
    const estimatedStatus = document.getElementById('estimatedStatus').value;
    const elektroMech = document.getElementById('elektroMech').value;
    const estimatedTime = document.getElementById('estimatedTime_Repair').value;
    const Status_Repair = document.getElementById('Status_Repair').value;
    const messageProblem_de = document.getElementById(
      'messageProblem_de_Repair'
    ).value;
    const messageProblem_en = document.getElementById(
      'messageProblem_en_Repair'
    ).value;
    const messageMission_de = document.getElementById(
      'messageMission_de_Repair'
    ).value;
    const messageMission_en = document.getElementById(
      'messageMission_en_Repair'
    ).value;
    const createAt_Repair = document.getElementById('createAt_Repair').value;

    console.log('currentUser: ' + currentUser);
    console.log('malReportID: ' + malReportID);
    console.log('malReportLogFalID: ' + malReportLogFalID);
    console.log('machineName: ' + machineName);
    console.log('departmentName: ' + departmentName);
    console.log('estimatedStatus: ' + estimatedStatus);
    console.log('elektroMech: ' + elektroMech);
    console.log('estimatedTime: ' + estimatedTime);
    console.log('Status_Repair: ' + Status_Repair);
    console.log('messageProblem_de: ' + messageProblem_de);
    console.log('messageProblem_en: ' + messageProblem_en);
    console.log('messageMission_de: ' + messageMission_de);
    console.log('messageMission_en: ' + messageMission_en);
    console.log('createAt_Repair: ' + createAt_Repair);

    console.log('bin saveUpdateLogFal');
    updateLogFal(
      {
        currentUser,
        elektroMech,
        estimatedTime,
        Status_Repair,
        messageProblem_de,
        messageProblem_en,
        messageMission_de,
        messageMission_en,
        createAt_Repair,
        estimatedStatus,
      },
      malReportID,
      malReportLogFalID,
      machineName,
      departmentName
    );
  });
}
