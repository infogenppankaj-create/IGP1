const jwt = require('jsonwebtoken');
const db = require("../models");
const sequelize = db.sequelize;
var nodemailer = require('nodemailer');
const printlog = 0; // 1 = print log and 0 is not print log

// Error handling middleware
const handleError = (res, error) => {
  console.error(error);
  res.status(500).send({ status: false, error: error.message });
};

//***************************************************
//Email Service
//***************************************************
//
/*
// Outlook
exports.sendmail = async (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'Outlook365', //'geninvo.com',
    host: 'smtp.office365.com',
    port: '587',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    },
    secureConnection: false,
    tls: { ciphers: 'SSLv3' }
  });

 //gmail 
exports.sendmail = async (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail', //'geninvo.com',
    auth: {
      user: process.env.EMAIL1,
      pass: process.env.PASSWORD1
    }
  });
*/

exports.sendmail = async (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail', //'geninvo.com',
    auth: {
      user: process.env.EMAIL1,
      pass: process.env.PASSWORD1
    }
  });
  
  //Enable Emaol security using below URL
  //https://www.google.com/settings/security/lesssecureapps
  var mailOptions = {
    from: process.env.EMAIL, //'kr.ritesh.317@gmail.com',
    to: req.body.emails,
    subject: req.body.subj, //'Financial LightHouse Email',
    text: req.body.msg
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      res.send({status:true, result:error});
    } else {
      console.log('Email sent: ' + info.response);
      res.send({status:true, result: info.response});
    }
  });
};

//***************************************************
//Token
//***************************************************
exports.generateToken = async (req, res) => {
  try {
    const token = jwt.sign({ username: "admin" }, process.env.JWT_SECRET);
    res.send({ status: true, token: token });
  } catch (error) {
    handleError(res, error);
  }
};

//***************************************************
//login
//***************************************************
exports.Login_Get = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_SEC_LOGIN_GET @IN_LOGIN_ID = :IN_LOGIN_ID, @IN_PASSWORD = :IN_PASSWORD';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_LOGIN_ID: body.IN_LOGIN_ID, IN_PASSWORD: body.IN_PASSWORD}});
  
  //
  const sqlQueryloginpermission = 'SP_SEC_LOGIN_PERMISSION @IN_LOGIN_ID = :IN_LOGIN_ID, @IN_PASSWORD = :IN_PASSWORD';
  const resultloginpermission = await sequelize.query(sqlQueryloginpermission, { replacements: { IN_LOGIN_ID: body.IN_LOGIN_ID, IN_PASSWORD: body.IN_PASSWORD}});
  
   console.log("result-Status_Get***",resultloginpermission);
  //console.log("result-Status_Get***",result);
  //console.log("result-Status_Get",result[0]);
  //console.log("result-Status_Get***2",result[0].ID);
  //console.log("result-Status_Get***3",result[0][0].ID);
  //console.log("result-Status_Get***4",result[0][0].NAME);
  //console.log("result-Status_Get***5",result.length);
  if(result && result.length > 0 && result[0][0].ID > 0)
      res.send({status:true, result:result[0], resultloginpermission:resultloginpermission[0]});
  else
      res.send({status:false, result:result[0]});
};

//***************************************************
//secUserGroup
//***************************************************
exports.InsertUserGroup = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_SEC_USER_GROUP_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_CODE, :IN_NAME, ' +
                    ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_CODE: body.IN_CODE, IN_NAME: body.IN_NAME,  
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertUserGroup",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get secUser Group
exports.GetUserGroup = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_SEC_USER_GROUP_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetUserGroup",result);
  res.send({status:true, result:result[0]});
};


//***************************************************
//User Permission Check
//***************************************************

//Get Module
exports.GetModule = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_SYS_MODULE_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetModule",result);
  res.send({status:true, result:result[0]});
};


//Get Menu Type
exports.GetMenu = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_SYS_MENU_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_MODULE_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_MODULE_ID: body.IN_MODULE_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetMenu",result);
  res.send({status:true, result:result[0]});
};

//Module Permissions
exports.GetUserModulePermission = async (req, res) => {
  console.log("GetUserModulePermission");
  var body = req.body;
  const sqlQuery = 'SP_SEC_USER_MODULE_PERMISSION_GET :IN_USER_ID, :IN_BRANCH_ID, :IN_MENU_ID';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, IN_MENU_ID: body.IN_MENU_ID }});  
  res.send({status:true, result:result[0]});
};

//
//Menu Permissions
exports.GetUserMenuPermission = async (req, res) => {
  console.log("GetUserMenuPermission");
  var body = req.body;
  const sqlQuery = 'SP_SEC_USER_MENU_PERMISSION_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                                    ':IN_ACCESS_TYPE_ID, :IN_MODULE_CODE, :IN_MENU_CODE, :IN_PERMISSION_CODE';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ACCESS_TYPE_ID: body.IN_ACCESS_TYPE_ID, IN_MODULE_CODE: body.IN_MODULE_CODE,
    IN_MENU_CODE: body.IN_MENU_CODE, IN_PERMISSION_CODE: body.IN_PERMISSION_CODE }});  
  res.send({status:true, result:result[0]});
};


//User Group Permissions
exports.GetUserGroupMenuPermission = async (req, res) => {
  console.log("GetUserGroupMenuPermission");
  var body = req.body;
  const sqlQuery = 'SP_SEC_USER_GROUP_MENU_PERMISSION_BY_ID_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                      ':IN_ID, :IN_CHECK_USER_ID, ' +
                                      ':IN_USER_GROUP_ID, :IN_MODULE_ID, :IN_MENU_ID, :IN_PERMISSION_CODE, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
                                      IN_ID: body.IN_ID, IN_CHECK_USER_ID: body.IN_CHECK_USER_ID,   
                                      IN_USER_GROUP_ID: body.IN_USER_GROUP_ID, IN_MODULE_ID: body.IN_MODULE_ID,
                                      IN_MENU_ID: body.IN_MENU_ID, IN_PERMISSION_CODE: body.IN_PERMISSION_CODE,
                                      IN_STATUS: body.IN_STATUS }});  
  res.send({status:true, result:result[0]});
};


//Menu Permissions Update
exports.UpdateUserGroupPermission = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_SEC_USER_GROUP_MENU_PERMISSION_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_USER_GROUP_ID, ' +
                    ':IN_MODULE_ID, :IN_MENU_ID, ' +
                    ':IN_OPEN_YN, :IN_NEW_YN, ' +
                    ':IN_EDIT_YN, :IN_REMOVE_YN,  ' +
                    ':IN_PRINT_YN, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_USER_GROUP_ID: body.IN_USER_GROUP_ID,   
                    IN_MODULE_ID: body.IN_MODULE_ID, IN_MENU_ID: body.IN_MENU_ID,   
                    IN_OPEN_YN: body.IN_OPEN_YN, IN_NEW_YN: body.IN_NEW_YN,   
                    IN_EDIT_YN: body.IN_EDIT_YN, IN_REMOVE_YN: body.IN_REMOVE_YN,       
                    IN_PRINT_YN: body.IN_PRINT_YN, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-UpdateUserGroupPermission",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};


//***************************************************
//Dashboard
//***************************************************
exports.dashboard = async (req, res) => {
  console.log("menu");
  var body = req.body;
  const sqlQuery = 'SP_DASHBOARD_DATA_GET :IN_USER_ID, :IN_BRANCH_ID';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID }});
  //console.log("dashboard",result);
  //console.log("dashboard",result[0]);
  res.send({status:true, result:result[0]});
};

//***************************************************
//Menu
//***************************************************
exports.menu = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_PR_MENU :IN_USER_ID, :IN_BRANCH_ID';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID} });
  //console.log("menu",result[0]);
  res.send({status:true, result:result[0]});
};

//***************************************************
//Reference Data Get
//***************************************************
//Get Status (Active , Deactive)
exports.SysStatus = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_STATUS_GET :IN_USER_ID, :IN_BRANCH_ID';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID}});
  //console.log("result-SysStatus",result);
  res.send({status:true, result:result[0]});
};

//Get Department Type
exports.GetDepartmentCategory = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_DEPARTMENT_CATEGORY_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetDepartmentCategory",result);
  res.send({status:true, result:result[0]});
};

//Get Department Type
exports.GetSubDepartmentCategory = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_SUB_DEPARTMENT_CATEGORY_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetSubDepartmentCategory",result);
  res.send({status:true, result:result[0]});
};

//Get Tariff Type
exports.GetTariffCategory = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_TARIFF_CATEGORY_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetTariffCategory",result);
  res.send({status:true, result:result[0]});
};

//Get Identity Type
exports.GetIdentityType = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_IDENTITY_TYPE_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetIdentityType",result);
  res.send({status:true, result:result[0]});
};

//Get Gender
exports.GetGender = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_GENDER_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetGender",result);
  res.send({status:true, result:result[0]});
};

//Get Designation 
exports.GetDesignation = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_DESIGNATION_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetDesignation",result);
  res.send({status:true, result:result[0]});
};

//Get JobTitle
exports.GetJobTitle = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_JOB_TITLE_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetJobTitle",result);
  res.send({status:true, result:result[0]});
};

//Get Employment Category
exports.GetEmploymentCategory = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_EMPLOYMENT_CATEGORY_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetEmploymentCategory",result);
  res.send({status:true, result:result[0]});
};

//Get GetCategorySpecialization
exports.GetCategorySpecialization = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_EMPLOYMENT_CATEGORY_SPECIALIZATION_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetGetCategorySpecialization",result);
  res.send({status:true, result:result[0]});
};

//Get EmploymentStatus 
exports.GetEmploymentStatus = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_EMPLOYMENT_STATUS_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetEmploymentStatus",result);
  res.send({status:true, result:result[0]});
};

//Get State
exports.GetState = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_STATE_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetState",result);
  res.send({status:true, result:result[0]});
};

//Get Country
exports.GetCountry = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_COUNTRY_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetCountry",result);
  res.send({status:true, result:result[0]});
};

//Get Nationality 
exports.GetNationality = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_NATIONALITY_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetNationality",result);
  res.send({status:true, result:result[0]});
};

//Get Religion
exports.GetReligion = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_RELIGION_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetReligion",result);
  res.send({status:true, result:result[0]});
};

//Get BloodGroup
exports.GetBloodGroup = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_BLOOD_GROUP_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetBloodGroup",result);
  res.send({status:true, result:result[0]});
};

//Get Relation
exports.GetRelation = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_RELATION_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetRelation",result);
  res.send({status:true, result:result[0]});
};

//Get PatientCategory
exports.GetPatientCategory = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_PATIENT_CATEGORY_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-PatientCategory",result);
  res.send({status:true, result:result[0]});
};

//Get MaritalStatus
exports.GetMaritalStatus = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_MARITAL_STATUS_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetMaritalStatus",result);
  res.send({status:true, result:result[0]});
};

//Get Ward Type
exports.GetWardCategory = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_WARD_CATEGORY_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetWardCategory",result);
  res.send({status:true, result:result[0]});
};

//Get Admission Categort
exports.GetAdmmissionCategory = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_ADMISSION_CATEGORY_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetAdmmissionCategory",result);
  res.send({status:true, result:result[0]});
};

//GetTemplateCategory
exports.GetTemplateCategory = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_TEMPLATE_CATEGORY_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetTemplateCategory",result);
  res.send({status:true, result:result[0]});
};

//Get ServiceCategoryDefault
exports.GetServiceCategoryDefault = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_SERVICE_CATEGORY_DEFAULT_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetServiceCategory",result);
  res.send({status:true, result:result[0]});
};


//***************************************************
//Data Get
//***************************************************

exports.GetPatientList = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_PATIENT_LIST_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_PID, :IN_PCODE, :IN_AID, :IN_ACODE, :IN_STATUS, :IN_TYPE';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_PID: body.IN_PID, IN_PCODE: body.IN_PCODE, IN_AID: body.IN_AID, IN_ACODE: body.IN_ACODE, 
                      IN_STATUS: body.IN_STATUS, IN_TYPE: body.IN_TYPE}});
  //console.log("result-GetPatientList",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//Report Header Get
//***************************************************
//GetRptSysBranch
exports.GetRptSysBranch = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_SYS_BRANCH_RPT_GET :IN_USER_ID, :IN_BRANCH_ID ';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID }});
  //console.log("result-GetRptSysBranch",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//refDepartment
//***************************************************
exports.InsertDepartment = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_DEPARTMENT_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_CODE, ' +
                    ':IN_NAME, :IN_DEPARTMENT_CATEGORY_ID,  ' +
                    ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_CODE: body.IN_CODE,   
                    IN_NAME: body.IN_NAME, IN_DEPARTMENT_CATEGORY_ID: body.IN_DEPARTMENT_CATEGORY_ID,       
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertDepartment",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get Department Name
exports.GetDepartment = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_DEPARTMENT_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetDepartment",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//refSubDepartment
//***************************************************
exports.InsertSubDepartment = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_SUB_DEPARTMENT_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_DEPARTMENT_ID, :IN_CODE, ' +
                    ':IN_NAME, :IN_SUB_DEPARTMENT_CATEGORY_ID,  ' +
                    ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_DEPARTMENT_ID: body.IN_DEPARTMENT_ID, IN_CODE: body.IN_CODE,   
                    IN_NAME: body.IN_NAME, IN_SUB_DEPARTMENT_CATEGORY_ID: body.IN_SUB_DEPARTMENT_CATEGORY_ID,       
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertSubDepartment",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get SubDepartment Name
exports.GetSubDepartment = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_SUB_DEPARTMENT_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS, :IN_DEPARTMENT_ID';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS, IN_DEPARTMENT_ID: body.IN_DEPARTMENT_ID}});
  //console.log("result-GetSubDepartment",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//refTariff
//***************************************************
exports.InsertTariff = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_TARIFF_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_CODE, ' +
                    ':IN_NAME, :IN_TARIFF_CATEGORY_ID, :IN_TARIFF_ID_CLONE, ' +
                    ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_CODE: body.IN_CODE,   
                    IN_NAME: body.IN_NAME, IN_TARIFF_CATEGORY_ID: body.IN_TARIFF_CATEGORY_ID, IN_TARIFF_ID_CLONE: body.IN_TARIFF_ID_CLONE,
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertTariff",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get Tariff Name
exports.GetTariff = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_TARIFF_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetDepartment",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//refEmployee
//***************************************************
exports.InsertEmployee = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_EMPLOYEE_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, '+
                    ':IN_ID, :IN_CODE, :IN_NAME,  '+
                    ':IN_IDENTITY_TYPE_ID, :IN_UID, :IN_GENDER_ID,  '+
                    ':IN_DOB, :IN_DESIGNATION_ID, :IN_DEPARTMENT_ID,  '+
                    ':IN_JOB_TITLE_ID, :IN_MANAGER_ID, :IN_EMPLOYMENT_CATEGORY_ID,  '+
                    ':IN_SPECIALIZATION_ID, :IN_EMPLOYMENT_STATUS_ID, :IN_DOJ,  '+
                    ':IN_MOBILE, :IN_MOBILE2, :IN_EMAIL, :IN_EMAIL2,  '+
                    ':IN_C_ADDRESS, :IN_C_CITY, :IN_C_STATE_ID, :IN_C_COUNTRY_ID, :IN_C_PIN,  '+
                    ':IN_P_ADDRESS, :IN_P_CITY, :IN_P_STATE_ID, :IN_P_COUNTRY_ID, :IN_P_PIN,  '+
                    ':IN_NATIONALITY_ID, :IN_RELIGION_ID,  '+
                    ':IN_F_NAME, :IN_F_MOBILE, :IN_F_EMAIL,  '+
                    ':IN_M_NAME, :IN_M_MOBILE, :IN_M_EMAIL,  '+
                    ':IN_S_NAME, :IN_S_MOBILE, :IN_S_EMAIL,  '+
                    ':IN_G_NAME, :IN_G_MOBILE, :IN_G_EMAIL,  '+
                    ':IN_DESCRIPTION, :IN_STATUS';``
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
                    IN_ID: body.IN_ID, IN_CODE: body.IN_CODE, IN_NAME: body.IN_NAME, 
                    IN_IDENTITY_TYPE_ID: body.IN_IDENTITY_TYPE_ID, IN_UID: body.IN_UID, IN_GENDER_ID: body.IN_GENDER_ID, 
                    IN_DOB: body.IN_DOB, IN_DESIGNATION_ID: body.IN_DESIGNATION_ID, IN_DEPARTMENT_ID: body.IN_DEPARTMENT_ID, 
                    IN_JOB_TITLE_ID: body.IN_JOB_TITLE_ID, IN_MANAGER_ID: body.IN_MANAGER_ID, IN_EMPLOYMENT_CATEGORY_ID: body.IN_EMPLOYMENT_CATEGORY_ID, 
                    IN_SPECIALIZATION_ID: body.IN_SPECIALIZATION_ID, IN_EMPLOYMENT_STATUS_ID: body.IN_EMPLOYMENT_STATUS_ID, IN_DOJ: body.IN_DOJ, 
                    IN_MOBILE: body.IN_MOBILE, IN_MOBILE2: body.IN_MOBILE2, IN_EMAIL: body.IN_EMAIL, IN_EMAIL2: body.IN_EMAIL2, 
                    IN_C_ADDRESS: body.IN_C_ADDRESS, IN_C_CITY: body.IN_C_CITY, IN_C_STATE_ID: body.IN_C_STATE_ID, IN_C_COUNTRY_ID: body.IN_C_COUNTRY_ID, IN_C_PIN: body.IN_C_PIN, 
                    IN_P_ADDRESS: body.IN_P_ADDRESS, IN_P_CITY: body.IN_P_CITY, IN_P_STATE_ID: body.IN_P_STATE_ID, IN_P_COUNTRY_ID: body.IN_P_COUNTRY_ID, 
                    IN_P_PIN: body.IN_P_PIN, IN_NATIONALITY_ID: body.IN_NATIONALITY_ID, IN_RELIGION_ID: body.IN_RELIGION_ID, 
                    IN_F_NAME: body.IN_F_NAME, IN_F_MOBILE: body.IN_F_MOBILE, IN_F_EMAIL: body.IN_F_EMAIL, 
                    IN_M_NAME: body.IN_M_NAME, IN_M_MOBILE: body.IN_M_MOBILE, IN_M_EMAIL: body.IN_M_EMAIL, 
                    IN_S_NAME: body.IN_S_NAME, IN_S_MOBILE: body.IN_S_MOBILE, IN_S_EMAIL: body.IN_S_EMAIL, 
                    IN_G_NAME: body.IN_G_NAME, IN_G_MOBILE: body.IN_G_MOBILE, IN_G_EMAIL: body.IN_G_EMAIL, 
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS        
                  }});
  //console.log("result-InsertEmployee",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

exports.GetEmployee = async (req, res) => {
  var body = req.body;
  //console.log("api body GetEmployee", body);
  const sqlQuery = 'SP_REF_EMPLOYEE_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_CATEGORY_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_CATEGORY_ID: body.IN_CATEGORY_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetEmployee",result);
  res.send({status:true, result:result[0]});
};


//***************************************************
//refDataLoad
//***************************************************
exports.InsertDataLoad = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_DATA_LOAD_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, ' +
                    ':IN_NAME, :IN_DATA_CATEGORY, ' +
                    ':IN_FILE_DATA, :IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID,  
                    IN_NAME: body.IN_NAME,  IN_DATA_CATEGORY: body.IN_DATA_CATEGORY,      
                    IN_FILE_DATA: body.IN_FILE_DATA, IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertDataLoad",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get DataLoad
exports.GetDataLoad = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_DATA_LOAD_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetDataLoad",result);
  res.send({status:true, result:result[0]});
};


//***************************************************
//refServiceCategory
//***************************************************
exports.InsertServiceCategory = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_SERVICE_CATEGORY_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_CODE, ' +
                    ':IN_NAME, :IN_SERVICE_CATEGORY_ID_CLONE, ' +
                    ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_CODE: body.IN_CODE,   
                    IN_NAME: body.IN_NAME,  IN_SERVICE_CATEGORY_ID_CLONE: body.IN_SERVICE_CATEGORY_ID_CLONE,      
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertServiceCategory",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get ServiceCategory
exports.GetServiceCategory = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_SERVICE_CATEGORY_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetServiceCategory",result);
  res.send({status:true, result:result[0]});
};


//***************************************************
//refPackege
//***************************************************
exports.InsertPackage = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_PACKAGE_SERVICE_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_PACKAGE_ID, :IN_SERVICE_ID, ' +
                    ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_PACKAGE_ID: body.IN_PACKAGE_ID,   
                    IN_SERVICE_ID: body.IN_SERVICE_ID,      
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertPackage",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get Package
exports.GetPackage = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_PACKAGE_SERVICE_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_PACKAGE_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_PACKAGE_ID: body.IN_PACKAGE_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetPackage",result);
  res.send({status:true, result:result[0]});
};


//Get GetPackageList
exports.GetPackageList = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_PACKAGE_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetPackageList",result);
  res.send({status:true, result:result[0]});
};


//Get GetServiceForPackage
exports.GetServiceForPackage = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_SERVICE_FOR_PACKAGE_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetServiceForPackage",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//refDefaultServiceSetup
//***************************************************
exports.InsertDefaultServiceSetup = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_SERVICE_DEFAULT_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_SERVICE_CATEGORY_ID, ' +
                    ':IN_SERVICE_ID, ' +
                    ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_SERVICE_CATEGORY_ID: body.IN_SERVICE_CATEGORY_ID,   
                    IN_SERVICE_ID: body.IN_SERVICE_ID,    
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertDefaultServiceSetup",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get DefaultServiceSetup
exports.GetDefaultServiceSetup = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_SERVICE_DEFAULT_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_SERVICE_CATEGORY_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_SERVICE_CATEGORY_ID: body.IN_SERVICE_CATEGORY_ID,  IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetDefaultServiceSetup",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//refServiceGroup
//***************************************************
exports.InsertServiceGroup = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_SERVICE_GROUP_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_CODE, ' +
                    ':IN_NAME, ' +
                    ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_CODE: body.IN_CODE,   
                    IN_NAME: body.IN_NAME,        
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertServiceGroup",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get ServiceGroup
exports.GetServiceGroup = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_SERVICE_GROUP_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetServiceGroup",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//refCompany
//***************************************************
exports.InsertCompany = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_COMPANY_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, '+
                      ':IN_ID, :IN_CODE, :IN_NAME, :IN_TARIFF_ID,  '+
                      ':IN_APPROVAL_REQUIRED, :IN_ADDRESS,  '+
                      ':IN_MOBILE, :IN_EMAIL, :IN_FAX, :IN_WEBSITE,  '+
                      ':IN_CONTACT_NAME1, :IN_DESIGNATION1, :IN_MOBILE1, :IN_EMAIL1, '+
                      ':IN_CONTACT_NAME2, :IN_DESIGNATION2, :IN_MOBILE2, :IN_EMAIL2,  '+ 
                      ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                        IN_ID: body.IN_ID, IN_CODE: body.IN_CODE, IN_NAME: body.IN_NAME, IN_TARIFF_ID: body.IN_TARIFF_ID,
                        IN_APPROVAL_REQUIRED: body.IN_APPROVAL_REQUIRED,	IN_ADDRESS: body.IN_ADDRESS, 
                        IN_MOBILE: body.IN_MOBILE, IN_EMAIL: body.IN_EMAIL,	IN_FAX: body.IN_FAX, IN_WEBSITE: body.IN_WEBSITE,
                        IN_CONTACT_NAME1: body.IN_CONTACT_NAME1, IN_DESIGNATION1: body.IN_DESIGNATION1, IN_MOBILE1: body.IN_MOBILE1, IN_EMAIL1: body.IN_EMAIL1,		
                        IN_CONTACT_NAME2: body.IN_CONTACT_NAME2, IN_DESIGNATION2: body.IN_DESIGNATION2, IN_MOBILE2: body.IN_MOBILE2, IN_EMAIL2: body.IN_EMAIL2,                        
                        IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS    
                  }});
  //console.log("result-InsertCompany",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

exports.GetCompany = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_COMPANY_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetCompany",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//refService
//***************************************************
exports.InsertService = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_SERVICE_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_DEPARTMENT_ID, :IN_SUB_DEPARTMENT_ID,  ' +
                    ':IN_CODE, :IN_NAME, :IN_SERVICE_GROUP_ID, :IN_BILLING_MESSAGE, ' +
                    ':IN_DR_CHARGE, :IN_H_CHARGE, :IN_OTH_CHARGE, :IN_SERVICE_TAX, :IN_SERVICE_DISC, ' +                    
                    ':IN_SHOW_MESSAGE, :IN_DR_REQUIRED, :IN_DR_ID, ' +
                    ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_DEPARTMENT_ID: body.IN_DEPARTMENT_ID, IN_SUB_DEPARTMENT_ID: body.IN_SUB_DEPARTMENT_ID, 
                    IN_CODE: body.IN_CODE, IN_NAME: body.IN_NAME, IN_SERVICE_GROUP_ID: body.IN_SERVICE_GROUP_ID, 
                    IN_BILLING_MESSAGE: body.IN_BILLING_MESSAGE,                     
                    IN_DR_CHARGE: body.IN_DR_CHARGE, IN_H_CHARGE: body.IN_H_CHARGE, 
                    IN_OTH_CHARGE: body.IN_OTH_CHARGE, IN_SERVICE_TAX: body.IN_SERVICE_TAX, IN_SERVICE_DISC: body.IN_SERVICE_DISC,
                    IN_SHOW_MESSAGE: body.IN_SHOW_MESSAGE, 
                    IN_DR_REQUIRED: body.IN_DR_REQUIRED, IN_DR_ID: body.IN_DR_ID,                             
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertService",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get ServiceGroup
exports.GetService = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_SERVICE_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetService",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//refServiceCharge
//***************************************************
exports.InsertServiceCharge = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_SERVICE_CHARGE_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_TARIFF_ID, :IN_SERVICE_ID, :IN_SERVICE_CATEGORY_ID, ' +
                    ':IN_DR_CHARGE, :IN_H_CHARGE, :IN_OTH_CHARGE, :IN_SERVICE_TAX, :IN_SERVICE_DISC, ' +                    
                    ':IN_FOR_ALL_TARIFF, :IN_FOR_ALL_SERVICE_CATEGORY, :IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_TARIFF_ID: body.IN_TARIFF_ID, IN_SERVICE_ID: body.IN_SERVICE_ID, IN_SERVICE_CATEGORY_ID: body.IN_SERVICE_CATEGORY_ID, 
                    IN_DR_CHARGE: body.IN_DR_CHARGE, IN_H_CHARGE: body.IN_H_CHARGE, 
                    IN_OTH_CHARGE: body.IN_OTH_CHARGE, IN_SERVICE_TAX: body.IN_SERVICE_TAX, IN_SERVICE_DISC: body.IN_SERVICE_DISC,                     
                    IN_FOR_ALL_TARIFF: body.IN_FOR_ALL_TARIFF, IN_FOR_ALL_SERVICE_CATEGORY: body.IN_FOR_ALL_SERVICE_CATEGORY,
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertServiceCharge",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get ServiceGroupCharge
exports.GetServiceCharge = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_SERVICE_CHARGE_GET :IN_USER_ID, :IN_BRANCH_ID, :IN_SERVICE_ID, :IN_TARIFF_ID,' +
                                          ':IN_SERVICE_CATEGORY_ID, :IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_SERVICE_ID: body.IN_SERVICE_ID, IN_TARIFF_ID: body.IN_TARIFF_ID, 
                      IN_SERVICE_CATEGORY_ID: body.IN_SERVICE_CATEGORY_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetServiceCharge",result);
  res.send({status:true, result:result[0]});
};

//Get ServiceForBill
exports.GetServiceForBill = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_SERVICE_LIST_FOR_BILL_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_PAYER_ID, :IN_SERVICE_CATEGORY_ID, :IN_SERVICE_ID';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
    IN_PAYER_ID: body.IN_PAYER_ID, IN_SERVICE_CATEGORY_ID: body.IN_SERVICE_CATEGORY_ID, IN_SERVICE_ID: body.IN_SERVICE_ID}});
  //console.log("result-GetServiceForBill",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//refBedStatus
//***************************************************
exports.InsertBedStatus = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_BED_STATUS_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_CODE, ' +
                    ':IN_NAME, ' +
                    ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_CODE: body.IN_CODE,   
                    IN_NAME: body.IN_NAME,        
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertServiceGroup",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get ServiceGroup
exports.GetBedStatus = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_BED_STATUS_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetServiceGroup",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//refBedCategory
//***************************************************
exports.InsertBedCategory = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_BED_CATEGORY_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_CODE, ' +
                    ':IN_NAME, :IN_SERVICE_ID,  ' +
                    ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_CODE: body.IN_CODE,   
                    IN_NAME: body.IN_NAME, IN_SERVICE_ID: body.IN_SERVICE_ID,       
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertBedCategory",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get BedCategory Name
exports.GetBedCategory = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_BED_CATEGORY_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetBedCategory",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//refWardMaster
//***************************************************
exports.InsertWard = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_WARD_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_CODE, ' +
                    ':IN_NAME, :IN_WARD_CATEGORY_ID,  ' +
                    ':IN_WARD_INCHARGE, :IN_PHONE, :IN_PHONE2, ' +
                    ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_CODE: body.IN_CODE,   
                    IN_NAME: body.IN_NAME, IN_WARD_CATEGORY_ID: body.IN_WARD_CATEGORY_ID,      
                    IN_WARD_INCHARGE: body.IN_WARD_INCHARGE, IN_PHONE: body.IN_PHONE, IN_PHONE2: body.IN_PHONE2,  
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertWard",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get Ward Name
exports.GetWard = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_WARD_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetWard",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//refBedMaster
//***************************************************
exports.InsertBed = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_BED_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_CODE, :IN_NAME, :IN_BED_CATEGORY_ID, ' +
                    ':IN_WARD_ID, :IN_BED_STATUS_ID, :IN_INCLUDE_OCCUPENCY, :IN_PHONE, :IN_PHONE2, ' +
                    ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_CODE: body.IN_CODE, IN_NAME: body.IN_NAME, IN_BED_CATEGORY_ID: body.IN_BED_CATEGORY_ID, 
                    IN_WARD_ID: body.IN_WARD_ID, IN_BED_STATUS_ID: body.IN_BED_STATUS_ID, IN_INCLUDE_OCCUPENCY: body.IN_INCLUDE_OCCUPENCY, 
                    IN_PHONE: body.IN_PHONE, IN_PHONE2: body.IN_PHONE2,     
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertBed",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get Bed Name
exports.GetBed = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_BED_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS, :IN_WARD_ID, :IN_BED_CATEGORY_ID, :IN_BED_STATUS_ID';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS, IN_WARD_ID: body.IN_WARD_ID,
                      IN_BED_CATEGORY_ID: body.IN_BED_CATEGORY_ID, IN_BED_STATUS_ID: body.IN_BED_STATUS_ID }});
  //console.log("result-GetBed",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//refTemplate
//***************************************************
exports.InsertTemplate = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_REF_TEMPLATE_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_TEMPLATE_CATEGORY_ID, :IN_CODE, ' +
                    ':IN_NAME, :IN_TEMPLATE,  ' +
                    ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_TEMPLATE_CATEGORY_ID: body.IN_TEMPLATE_CATEGORY_ID, IN_CODE: body.IN_CODE,   
                    IN_NAME: body.IN_NAME, IN_TEMPLATE: body.IN_TEMPLATE,       
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertTemplate",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//GetTemplate
exports.GetTemplate = async (req, res) => {
  var body = req.body;
  //console.log("api GetTemplate", body);
  const sqlQuery = 'SP_REF_TEMPLATE_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS, :IN_TEMPLATE_CATEGORY_ID';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS, IN_TEMPLATE_CATEGORY_ID: body.IN_TEMPLATE_CATEGORY_ID}});
  //console.log("result-GetTemplate",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//opdPatientRegistration
//***************************************************
exports.InsertPatientRegistration = async (req, res) => {
  var body = req.body;

  const sqlQuery = 'SP_PATIENT_REGISTRATION_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                  ':IN_ID, :IN_YEAR_ID, :IN_CODE, :IN_NAME, :IN_REGISTRATION_DT, :IN_PAYER_ID, :IN_GENDER_ID, ' +
                  ':IN_AGE, :IN_DOB, :IN_IDENTITY_ID, :IN_UID, :IN_MOBILE, :IN_EMAIL, :IN_BLOOD_GROUP_ID, ' +
                  ':IN_HEIGHT, :IN_WEIGHT, :IN_OBESITY, :IN_ADDRESS, :IN_CITY, :IN_STATE_ID, :IN_COUNTRY_ID, ' + 
                  ':IN_PIN, :IN_KIN_NAME, :IN_KIN_RELATION_ID, :IN_KIN_MOBILE, :IN_MARITAL_STATUS_ID, ' + 
                  ':IN_RELIGION_ID, :IN_PATIENT_CATEGORY_ID, :IN_P_ADDRESS, :IN_P_CITY, :IN_P_STATE_ID, ' + 
                  ':IN_P_COUNTRY_ID, :IN_P_PIN, :IN_NATIONALITY_ID, :IN_F_NAME, :IN_F_MOBILE, :IN_F_EMAIL, ' + 
                  ':IN_M_NAME, :IN_M_MOBILE, :IN_M_EMAIL, :IN_S_NAME, :IN_S_MOBILE, :IN_S_EMAIL, :IN_G_NAME, ' + 
                  ':IN_G_MOBILE, :IN_G_EMAIL, :IN_REF_ID, :IN_REF_BY, :IN_REF_HOSPITAL, :IN_ORG_ID, ' + 
                  ':IN_ORG_NAME, :IN_ORG_EMP_ID, :IN_ORG_MOBILE, :IN_ORG_EMAIL, :IN_INS_TYPE, :IN_INS_ID, ' + 
                  ':IN_MATURITY_DT, :IN_MATURITY_PERIOD, :IN_MATURED_AMOUNT, :IN_RECOV_AMOUNT, ' + 
                  ':IN_EMPLOYMENT_CATEGORY_ID, :IN_SPECIALIZATION, :IN_EMPLOYMENT_STATUS_ID, :IN_EMPLOYMENT_DT, ' +
                  ':IN_DESCRIPTION, :IN_STATUS';
                                      ;
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_YEAR_ID: body.IN_YEAR_ID, IN_CODE: body.IN_CODE, 
                    IN_NAME: body.IN_NAME, IN_REGISTRATION_DT: body.IN_REGISTRATION_DT, 
                    IN_PAYER_ID: body.IN_PAYER_ID, IN_GENDER_ID: body.IN_GENDER_ID, 
                    IN_AGE: body.IN_AGE, IN_DOB: body.IN_DOB, IN_IDENTITY_ID: body.IN_IDENTITY_ID, 
                    IN_UID: body.IN_UID, IN_MOBILE: body.IN_MOBILE, IN_EMAIL: body.IN_EMAIL, 
                    IN_BLOOD_GROUP_ID: body.IN_BLOOD_GROUP_ID, IN_HEIGHT: body.IN_HEIGHT, 
                    IN_WEIGHT: body.IN_WEIGHT, IN_OBESITY: body.IN_OBESITY, 
                    IN_ADDRESS: body.IN_ADDRESS, IN_CITY: body.IN_CITY, IN_STATE_ID: body.IN_STATE_ID, 
                    IN_COUNTRY_ID: body.IN_COUNTRY_ID, IN_PIN: body.IN_PIN, IN_KIN_NAME: body.IN_KIN_NAME, 
                    IN_KIN_RELATION_ID: body.IN_KIN_RELATION_ID, IN_KIN_MOBILE: body.IN_KIN_MOBILE, 
                    IN_MARITAL_STATUS_ID: body.IN_MARITAL_STATUS_ID, IN_RELIGION_ID: body.IN_RELIGION_ID, 
                    IN_PATIENT_CATEGORY_ID: body.IN_PATIENT_CATEGORY_ID, IN_P_ADDRESS: body.IN_P_ADDRESS, 
                    IN_P_CITY: body.IN_P_CITY, IN_P_STATE_ID: body.IN_P_STATE_ID, IN_P_COUNTRY_ID: body.IN_P_COUNTRY_ID, 
                    IN_P_PIN: body.IN_P_PIN, IN_NATIONALITY_ID: body.IN_NATIONALITY_ID, IN_F_NAME: body.IN_F_NAME, 
                    IN_F_MOBILE: body.IN_F_MOBILE, IN_F_EMAIL: body.IN_F_EMAIL, IN_M_NAME: body.IN_M_NAME, 
                    IN_M_MOBILE: body.IN_M_MOBILE, IN_M_EMAIL: body.IN_M_EMAIL, IN_S_NAME: body.IN_S_NAME, 
                    IN_S_MOBILE: body.IN_S_MOBILE, IN_S_EMAIL: body.IN_S_EMAIL, IN_G_NAME: body.IN_G_NAME, 
                    IN_G_MOBILE: body.IN_G_MOBILE, IN_G_EMAIL: body.IN_G_EMAIL, IN_REF_ID: body.IN_REF_ID, 
                    IN_REF_BY: body.IN_REF_BY, IN_REF_HOSPITAL: body.IN_REF_HOSPITAL, IN_ORG_ID: body.IN_ORG_ID, 
                    IN_ORG_NAME: body.IN_ORG_NAME, IN_ORG_EMP_ID: body.IN_ORG_EMP_ID, IN_ORG_MOBILE: body.IN_ORG_MOBILE, 
                    IN_ORG_EMAIL: body.IN_ORG_EMAIL, IN_INS_TYPE: body.IN_INS_TYPE, IN_INS_ID: body.IN_INS_ID, 
                    IN_MATURITY_DT: body.IN_MATURITY_DT, IN_MATURITY_PERIOD: body.IN_MATURITY_PERIOD, 
                    IN_MATURED_AMOUNT: body.IN_MATURED_AMOUNT, IN_RECOV_AMOUNT: body.IN_RECOV_AMOUNT, 
                    IN_EMPLOYMENT_CATEGORY_ID: body.IN_EMPLOYMENT_CATEGORY_ID, 
                    IN_SPECIALIZATION: body.IN_SPECIALIZATION, IN_EMPLOYMENT_STATUS_ID: body.IN_EMPLOYMENT_STATUS_ID, 
                    IN_EMPLOYMENT_DT: body.IN_EMPLOYMENT_DT, 	     
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertPatientRegistration",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get PatientRegistration
exports.GetPatientRegistration = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_PATIENT_REGISTRATION_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_CODE, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_CODE: body.IN_CODE, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetPatientRegistration",result);
  res.send({status:true, result:result[0]});
};

//Get PatientRegistration
exports.GetPatientRegistrationLimit = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_PATIENT_REGISTRATION_LIMIT_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_CODE, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_CODE: body.IN_CODE, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetPatientRegistration",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//opdBill
//***************************************************
exports.InsertOpdBill = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_OPD_BILL_INSERT :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_YEAR_ID, :IN_CODE, ' +
                    ':IN_PID, :IN_PAYER_ID, :IN_SERVICE_CATEGORY_ID, :IN_NAME, ' +
                    ':IN_GENDER, :IN_AGE, :IN_DOB, :IN_IDENTITY_TYPE_ID,  ' +
                    ':IN_UID, :IN_MOBILE, :IN_EMAIL,  :IN_ADDRESS, ' +
                    ':IN_DESCRIPTION, :IN_STATUS, :IN_OPD_BILL_DTL';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_YEAR_ID: body.IN_YEAR_ID, IN_CODE: body.IN_CODE, IN_PID: body.IN_PID,   
                    IN_PAYER_ID: body.IN_PAYER_ID, IN_SERVICE_CATEGORY_ID: body.IN_SERVICE_CATEGORY_ID,  
                    IN_NAME: body.IN_NAME, IN_GENDER: body.IN_GENDER, IN_AGE: body.IN_AGE,
                    IN_DOB: body.IN_DOB, IN_IDENTITY_TYPE_ID: body.IN_IDENTITY_TYPE_ID,
                    IN_UID: body.IN_UID, IN_MOBILE: body.IN_MOBILE, IN_EMAIL: body.IN_EMAIL, 
                    IN_ADDRESS: body.IN_ADDRESS,                        
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS,
                    IN_OPD_BILL_DTL: body.IN_OPD_BILL_DTL       
                  }});
  //console.log("result-InsertOpdBill",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get OpdBill Name
exports.GetOpdBill = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_SUB_DEPARTMENT_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_STATUS, :IN_DEPARTMENT_ID';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS, IN_DEPARTMENT_ID: body.IN_DEPARTMENT_ID}});
  //console.log("result-GetOpdBill",result);
  res.send({status:true, result:result[0]});
};

//Get ServiceGroupCharge
exports.GetServiceChargeDtlBilling = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_REF_SERVICE_LIST_CHARGE_FOR_BILL_GET :IN_USER_ID, :IN_BRANCH_ID, :IN_SERVICE_ID, :IN_PAYER_ID,' +
                                          ':IN_SERVICE_CATEGORY_ID, :IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_SERVICE_ID: body.IN_SERVICE_ID, IN_PAYER_ID: body.IN_PAYER_ID, 
                      IN_SERVICE_CATEGORY_ID: body.IN_SERVICE_CATEGORY_ID,
                      IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetServiceChargeDtlBilling",result);
  res.send({status:true, result:result[0]});
};

//Report
exports.GetRptOpdBill = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_OPD_BILL_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                              ':IN_ID, :IN_TYPE ';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID, 
    IN_ID: body.IN_ID, IN_TYPE: body.IN_TYPE }});
  console.log("result-GetWardCategory",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//opdBillReport
//***************************************************
exports.printopdBillReport = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_OPD_BILL_REPORT_ID_GET :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-printopdBillReport",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};


//***************************************************
//ipdAdvance
//***************************************************
exports.InsertIpdAdvance = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_PATIENT_ADVANCE_INSERT :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_PID, :IN_ADVANCE_AMOUNT, :IN_RECEIVED_BY, ' +
                    ':IN_RECEIVED_NOTE, :IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_PID: body.IN_PID, IN_ADVANCE_AMOUNT: body.IN_ADVANCE_AMOUNT,   
                    IN_RECEIVED_BY: body.IN_RECEIVED_BY,  IN_RECEIVED_NOTE: body.IN_RECEIVED_NOTE, 
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS
                  }});
  console.log("result-InsertIpdAdvance",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//GetIpdAdvance
exports.GetIpdAdvance = async (req, res) => {
  var body = req.body;
  //console.log("GetIpdAdvance", body);
  const sqlQuery = 'SP_IPD_BILL_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_PID, :IN_AID';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
    IN_PID: body.IN_PID, IN_AID: body.IN_AID}});
  //console.log("result-GetIpdAdvance",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//ipdAdmission
//***************************************************
exports.InsertipdAdmission = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_IPD_ADMISSION_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_YEAR_ID, :IN_CODE, :IN_PID, :IN_ADMISSION_DR_ID, ' +
                    ':IN_ADMISSION_DT, :IN_ADMISSION_CATEGORY_ID, :IN_SERVICE_CATEGORY_ID, :IN_PAYER_ID, ' +
                    ':IN_BED_ID, :IN_KIN_NAME, :IN_KIN_RELATION_ID, ' +
                    ':IN_KIN_MOBILE, :IN_REF_ID, :IN_REF_BY, ' +
                    ':IN_REF_HOSPITAL, :IN_DESCRIPTION, :IN_STATUS ';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_YEAR_ID: body.IN_YEAR_ID, IN_CODE: body.IN_CODE, IN_PID: body.IN_PID, IN_ADMISSION_DR_ID: body.IN_ADMISSION_DR_ID,  
                    IN_ADMISSION_DT: body.IN_ADMISSION_DT, IN_ADMISSION_CATEGORY_ID: body.IN_ADMISSION_CATEGORY_ID, 
                    IN_SERVICE_CATEGORY_ID: body.IN_SERVICE_CATEGORY_ID, IN_PAYER_ID: body.IN_PAYER_ID, 
                    IN_BED_ID: body.IN_BED_ID, IN_KIN_NAME: body.IN_KIN_NAME, IN_KIN_RELATION_ID: body.IN_KIN_RELATION_ID,
                    IN_KIN_MOBILE: body.IN_KIN_MOBILE, IN_REF_ID: body.IN_REF_ID, IN_REF_BY: body.IN_REF_BY, 
                    IN_REF_HOSPITAL: body.IN_REF_HOSPITAL, IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS
                  }});
  //console.log("result-InsertipdAdmission",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//GetAdmissionDetails
exports.GetAdmissionDetails = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_IPD_ADMISSION_PATIENT_DETAILS_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_CODE, :IN_ADMISSION_STATUS_ID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_CODE: body.IN_CODE, IN_ADMISSION_STATUS_ID: body.IN_ADMISSION_STATUS_ID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetAdmissionDetails",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//IpdBill
//***************************************************
exports.InsertIpdBill = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_IPD_BILL_INSERT :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_YEAR_ID, :IN_CODE, :IN_PID, :IN_AID, ' +
                    ':IN_BILL_DT, :IN_SERVICE_CATEGORY_ID, :IN_PAYER_ID, ' +
                    ':IN_BED_ID, :IN_DESCRIPTION, :IN_STATUS, :IN_IPD_BILL_DTL';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_YEAR_ID: body.IN_YEAR_ID, IN_CODE: body.IN_CODE, IN_PID: body.IN_PID, IN_AID: body.IN_AID,   
                    IN_BILL_DT: body.IN_BILL_DT,  IN_SERVICE_CATEGORY_ID: body.IN_SERVICE_CATEGORY_ID, 
                    IN_PAYER_ID: body.IN_PAYER_ID, IN_BED_ID: body.IN_BED_ID, 
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS,
                    IN_IPD_BILL_DTL: body.IN_IPD_BILL_DTL       
                  }});
  console.log("result-InsertIpdBill",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//GetIPDBill
exports.GetIPDBill = async (req, res) => {
  var body = req.body;
  //console.log("GetIPDBill", body);
  const sqlQuery = 'SP_IPD_BILL_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_PID, :IN_AID, :IN_BILL_ID, :IN_TYPE';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
    IN_PID: body.IN_PID, IN_AID: body.IN_AID, IN_BILL_ID: body.IN_BILL_ID, IN_TYPE: body.IN_TYPE}});
  //console.log("result-GetIPDBill",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//IpdBillUpdate
//***************************************************
// Update Bill
exports.UpdateIpdBill = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_IPD_BILL_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_AID, ' +
                    ':IN_BILL_ID, :IN_TAX, :IN_DISC, :IN_APPROVER, ' +
                    ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_AID: body.IN_AID,   
                    IN_BILL_ID: body.IN_BILL_ID, IN_TAX: body.IN_TAX, 
                    IN_DISC: body.IN_DISC, IN_APPROVER: body.IN_APPROVER,
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS    
                  }});
  console.log("result-UpdateIpdBill",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

// Update Service
exports.UpdateIpdBillService = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_IPD_BILL_SERVICE_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_AID, ' +
                    ':IN_BILL_ID, :IN_BILL_DTL_ID, :IN_SERVICE_ID, :IN_DR_ID, ' +
                    ':IN_QUANTITY, :IN_TAX, :IN_DISC, :IN_APPROVER, ' +
                    ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_AID: body.IN_AID,   
                    IN_BILL_ID: body.IN_BILL_ID,  IN_BILL_DTL_ID: body.IN_BILL_DTL_ID, 
                    IN_SERVICE_ID: body.IN_SERVICE_ID, IN_DR_ID: body.IN_DR_ID,
                    IN_QUANTITY: body.IN_QUANTITY,  IN_TAX: body.IN_TAX, 
                    IN_DISC: body.IN_DISC, IN_APPROVER: body.IN_APPROVER,
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS    
                  }});
  console.log("result-UpdateIpdBillService",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//***************************************************
//ipdBillFinal
//***************************************************
exports.InsertIpdBillFinal = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_IPD_BILL_FINAL_INSERT :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_YEAR_ID, :IN_CODE, :IN_PID, :IN_AID, ' +
                    ':IN_TAX, :IN_DISC, :IN_PATIENT_AMOUNT, :IN_PAYER_AMOUNT, ' +
                    ':IN_APPROVER, :IN_DESCRIPTION, :IN_STATUS ';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_YEAR_ID: body.IN_YEAR_ID, IN_CODE: body.IN_CODE, IN_PID: body.IN_PID, IN_AID: body.IN_AID,   
                    IN_TAX: body.IN_TAX,  IN_DISC: body.IN_DISC, 
                    IN_PATIENT_AMOUNT: body.IN_PATIENT_AMOUNT, IN_PAYER_AMOUNT: body.IN_PAYER_AMOUNT, 
                    IN_APPROVER: body.IN_APPROVER,   
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS
                        
                  }});
  console.log("result-InsertIpdBillFinal",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//GetIpdBillFinal
exports.GetIpdBillFinal = async (req, res) => {
  var body = req.body;
  //console.log("GetIpdBillFinal", body);
  const sqlQuery = 'SP_IPD_BILL_FINAL_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_AID, :IN_TYPE';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
    IN_AID: body.IN_AID, IN_TYPE: body.IN_TYPE}});
  //console.log("result-GetIpdBillFinal",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//ipdBedTransfer
//***************************************************
exports.InsertipdBedTransfer = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_IPD_ADMISSION_BED_TRANSFER :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_AID, :IN_PID, :IN_DR_ID, :IN_TRANSFER_DT, ' +
                    ':IN_BED_ID, :IN_DESCRIPTION, :IN_STATUS ';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_AID: body.IN_AID, IN_PID: body.IN_PID, IN_DR_ID: body.IN_DR_ID, IN_TRANSFER_DT: body.IN_TRANSFER_DT,  
                    IN_BED_ID: body.IN_BED_ID, IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS
                  }});
  console.log("result-InsertipdBedTransfer",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//***************************************************
//ipdDrTransfer
//***************************************************
exports.InsertipdDrTransfer = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_IPD_ADMISSION_DR_TRANSFER :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_AID, :IN_PID, :IN_APPROVAL_ID, :IN_DR_ID,  ' +
                    ':IN_TRANSFER_DT, :IN_DESCRIPTION, :IN_STATUS ';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_AID: body.IN_AID, IN_PID: body.IN_PID, IN_APPROVAL_ID: body.IN_APPROVAL_ID, IN_DR_ID: body.IN_DR_ID, 
                    IN_TRANSFER_DT: body.IN_TRANSFER_DT, IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS
                  }});
  console.log("result-InsertipdDrTransfer",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//***************************************************
//ipdChangePayer
//***************************************************
exports.InsertipdChangePayer = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_IPD_ADMISSION_CHANGE_PAYER :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_AID, :IN_PID, :IN_APPROVAL_ID, :IN_PAYER_ID,  ' +
                    ':IN_CHANGE_DT, :IN_DESCRIPTION, :IN_STATUS ';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_AID: body.IN_AID, IN_PID: body.IN_PID, IN_APPROVAL_ID: body.IN_APPROVAL_ID, IN_PAYER_ID: body.IN_PAYER_ID, 
                    IN_CHANGE_DT: body.IN_CHANGE_DT, IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS
                  }});
  console.log("result-InsertipdChangePayer",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//***************************************************
//ipdPatientDischarge
//***************************************************
exports.InsertipdPatientDischarge = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_IPD_PATIENT_DISCHARGE_INSERT :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_AID, :IN_PID, :IN_APPROVAL_ID, :IN_DISCHARGE_STATUS_ID,  ' +
                    ':IN_DISCHARGE_DT, :IN_DESCRIPTION, :IN_DISCHARGE_NOTE, :IN_STATUS ';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_AID: body.IN_AID, IN_PID: body.IN_PID, IN_APPROVAL_ID: body.IN_APPROVAL_ID, 
                    IN_DISCHARGE_STATUS_ID: body.IN_DISCHARGE_STATUS_ID, 
                    IN_DISCHARGE_DT: body.IN_DISCHARGE_DT, IN_DESCRIPTION: body.IN_DESCRIPTION, 
                    IN_DISCHARGE_NOTE: body.IN_DISCHARGE_NOTE, IN_STATUS: body.IN_STATUS
                  }});
  console.log("result-InsertipdPatientDischarge",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//***************************************************
//opdPatientVisit
//***************************************************
exports.InsertopdPatientVisit = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_OPD_PATIENT_VISIT_INSERT_UPDATE :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_ID, :IN_CODE, ' +
                    ':IN_BILL_ID, :IN_PROGRESS_NOTES, :IN_TREATEMENT_ADVICE,  ' +
                    ':IN_DESCRIPTION, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_ID: body.IN_ID, IN_CODE: body.IN_CODE,   
                    IN_BILL_ID: body.IN_BILL_ID, IN_PROGRESS_NOTES: body.IN_PROGRESS_NOTES, 
                    IN_TREATEMENT_ADVICE: body.IN_TREATEMENT_ADVICE,      
                    IN_DESCRIPTION: body.IN_DESCRIPTION, IN_STATUS: body.IN_STATUS     
                  }});
  //console.log("result-InsertopdPatientVisit",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//Get PatientRegistrationByOthID
exports.PatientRegistrationByOthID = async (req, res) => {
  var body = req.body;
  //console.log("api body", body);
  const sqlQuery = 'SP_PATIENT_REGISTRATION_BY_OTHER_ID_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_ID, :IN_TYPE, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                      IN_ID: body.IN_ID, IN_TYPE: body.IN_TYPE, IN_STATUS: body.IN_STATUS}});
  //console.log("result-PatientRegistrationByOthID",result);
  res.send({status:true, result:result[0]});
};



//Get GetPatientVisit
exports.GetPatientVisit = async (req, res) => {
  var body = req.body;
  //console.log("GetPatientVisit", body);
  const sqlQuery = 'SP_PATIENT_VISIST_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_BILL_TYPE, :IN_BILL_ID, :IN_ID,  :IN_PID, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
      IN_BILL_TYPE: body.IN_BILL_TYPE, IN_BILL_ID: body.IN_BILL_ID,                 
      IN_ID: body.IN_ID, IN_PID: body.IN_PID, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetPatientVisit",result);
  res.send({status:true, result:result[0]});
};

//Get GetPatientVisitBillID
exports.GetPatientVisitBillID = async (req, res) => {
  var body = req.body;
  //console.log("GetPatientVisitBillID", body);
  const sqlQuery = 'SP_PATIENT_VISIST_BILL_ID_GET :IN_USER_ID, :IN_BRANCH_ID,' +
                                          ':IN_BILL_TYPE, :IN_STATUS';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
      IN_BILL_TYPE: body.IN_BILL_TYPE, IN_STATUS: body.IN_STATUS}});
  //console.log("result-GetPatientVisitBillID",result);
  res.send({status:true, result:result[0]});
};

//***************************************************
//IpdNurseStation
//***************************************************
exports.InsertipdNurseStation = async (req, res) => {
  var body = req.body;
  const sqlQuery = 'SP_IPD_NURSE_STATION_UPSERT :IN_USER_ID, :IN_BRANCH_ID, ' +
                    ':IN_AID, :IN_AID_CODE, :IN_TYPE ';
  const result = await sequelize.query(sqlQuery, { replacements: { IN_USER_ID: body.IN_USER_ID, IN_BRANCH_ID: body.IN_BRANCH_ID,
                    IN_AID: body.IN_AID, IN_AID_CODE: body.IN_AID_CODE, IN_TYPE: body.IN_TYPE
                  }});
  console.log("result-InsertipdNurseStation",result);
  if(result[0][0].SQL_STATUS == 'SUCCESS')
  {
    res.send({status:true, result:result[0]});
  }
  else
  {
    res.send({status:false, result:result[0]});
  }
};

//***********************************************************************************************************
//***********************************************************************************************************









