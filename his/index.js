var express = require('express');
var http = express();
var session = require('express-session');
var url = require('url');
var exphbs = require('express-handlebars');
var FormData = require('form-data');
var userpermission;
var bodyParser = require('body-parser');
//
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const path = require('path');
const request = require('request');
var ss_bill
// Add these required packages at the top of your file
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
//
const { Recoverable } = require('repl');
const printlog = 1;  // 1 = print log and 0 is not print
//
dotenv.config();

// Update the headers declaration to use env variable
var headers = {
  'Authorization': process.env.API_AUTH_TOKEN || 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjA1MDI5MjQwfQ.LRiNkw7PypgY7BDHrUUsDMsx5UbYrBmPSgpnH7WXf-s',
  'Content-Type': 'application/json'
};

// Set up storage with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync('./public/uploads')) {
      fs.mkdirSync('./public/uploads', { recursive: true });
    }
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    // Check file type
    if (!file.originalname.match(/\.(csv|xlsx|xls)$/)) {
      return cb(new Error('Only CSV and Excel files are allowed!'), false);
    }
    cb(null, Date.now() + '-' + file.originalname);
  }
});

//
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    // Check if the file is an Excel file (including macro-enabled .xlsm)
    if (file.originalname.match(/\.(xlsx|xls|xlsm)$/)) {
      return cb(null, true);
    }
    cb(new Error('Only Excel files (.xlsx, .xls, .xlsm) are allowed!'));
  }
});

//

http.use(bodyParser.json({ limit: '50mb' }));
http.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
http.use(session({secret: 'secret', resave: true, saveUninitialized: true }));


http.engine('handlebars', exphbs.engine({defaultLayout: 'main'})); // default
http.set('view engine', 'handlebars');
http.use(express.static(path.join(__dirname, 'public')));
http.use(express.static('views/images'));


//*********************************************/
// File Upload Start
//
http.post('/upload', upload.single('file'), (req, res) => {
  try {
    // res.json({ message: 'File uploaded successfully!', file: req.file });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).send({ message: "File upload failed." });
  }
});

//***************************************************
//sendemailapi
//***************************************************
/*
http.post('/sendemailapi',  async (req, res) => {
  console.log("sendemailapi", " - '" + req.session.uname + "'");
    let params = {"emails": req.body.emails, "subj": req.body.subj, "msg":req.body.msg};
    //console.log("Send Mail" ,params);
    const response = await fetch('http://localhost:8144/api/sendmail', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
});
*/

async function sendEmail(emails,subject, message){
  //console.log("sendemailapi", " - '" + req.session.uname + "'");
  let params = {"emails": emails, "subj": subject, "msg":message};
  //console.log("Send Mail" ,params);
  const response = await fetch(process.env.API_URL+"/sendmail", {
      method: 'post',
      headers: headers,
      body: JSON.stringify(params)
  });
}

//***************************************************
//login
//***************************************************
http.get('/', (req, res) => {
  res.render('login',{layout:false});
});

//
http.post('/validateuser', (req, res) => {
  var url = process.env.API_URL+"/Login_Get";
  request.post(url, {form:{"IN_LOGIN_ID":req.body.username,"IN_PASSWORD":req.body.password}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    
    if (printlog == 1){
      console.log("validateuser",parsedbody);
    }     
    if(parsedbody && parsedbody.status) {
      req.session.loggedin = true;
      req.session.username = req.body.username;
      req.session.userid = parsedbody.result[0].ID;
      req.session.uname = parsedbody.result[0].NAME;
      req.session.branchid = parsedbody.result[0].BRANCH_ID;
      //
      //console.log("validateuser",parsedbody);
      //console.log("UserPermissionuserpermission123 - ","'" + parsedbody.userpermissiondata + "'");  
      userpermission = parsedbody.userpermissiondata
      
      //console.log("UserPermissionuserpermission - ",  parsedbody );  
      //console.log("print - status - ", parsedbody.status);  
      //console.log("print - result - ", parsedbody.result);  
      //console.log("print - userpermissiondata - ", parsedbody.userpermissiondata ); 
      //console.log("print - userpermissiondata123 - ", userpermission );
      //
      res.send({message:"Success"});      
    }
    else
      res.send({message:0});
  });
});

function fn_validateuserpermission(menuid){
  var permission = false;
  userpermission.forEach(obj =>{
    if (obj.MENU_ID == menuid){
      permission = obj.PERMISSION;
    }
  })
  console.log("UserPermission - ","'" + permission + "'");  
  return permission;
}

//***************************************************
//loginModule
//***************************************************
http.get('/loginModule', (req, res) => {
  if (req.session.loggedin) {
      res.render('loginModule',{layout:false});
  } else {
    res.render('login',{layout:false});
  } 
});

http.post('/secPermissionCheck', (req, res) => {
  if (req.session.loggedin) {
    var url = process.env.API_URL+"/GetUserModulePermission";    
    request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_MENU_ID":req.body.IN_MENU_ID}, headers: headers}, function (error, response, body) {
      if (printlog == 1){
        console.log("secPermissionCheck - ","'" + body + "'");  
      }      
      //secPermissionCheck -  {"status":true,"result":[{"PERMISSION":1}]}
      let mod_body = JSON.parse(body);   
      //console.log("secPermissionCheck - ", mod_body.result[0].PERMISSION ); 
      if (mod_body.result[0].PERMISSION==1){
        req.session.permission = true
        if (mod_body.result[0].MENU_CODE==1) 
          {
            http.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
          }
        else if (mod_body.result[0].MENU_CODE==2) 
          {
            http.engine('handlebars', exphbs.engine({defaultLayout: 'mainAdmin'}));
          }
        res.send({message:1});
      }   
      else{
        req.session.permission = false
        res.send({message:0});
      }
     
    });
  } else {
    res.render('login',{layout:false});
  }
});

//***************************************************
//Logout
//***************************************************
http.get('/Logout', (req, res) => {
  if (printlog == 1){
    console.log("logOut")
  }  
  req.session.loggedin = false;
  res.render('login',{layout:false});
});

//***************************************************
//dashboard
//***************************************************
http.get('/dashboard', (req, res) => {
  console.log("dashboard", " - '" + req.session.uname + "'");
  if (printlog == 1){
    console.log("dashboard", " - '" + req.session.uname + "'", " - '" + req.session.branchid + "'");
  }    
  if (req.session.loggedin) {
    if ( req.session.permission == true) {
      var url = process.env.API_URL+"/dashboard";    
      request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid}, headers: headers}, function (error, response, body) {
        let mod_body = JSON.parse(body);           
        mod_body.activeuser = req.session.uname;      
        body = JSON.stringify(mod_body);
        if (printlog == 1){
          console.log("dashboard User - ","'" + req.session.uname + "'");
        }  
        http.locals.user_name = req.session.uname;
        res.render('dashboard',{body});
      });      
    }
    else{
      res.render('loginModule',{layout:false});
    }
  } else {
    res.render('login',{layout:false});
  }
});

// Get Menu data using btnclick
http.post('/getMenu', (req, res) => {
  if (printlog == 1){
    console.log("getMenu", " - '" + req.session.uname + "'");
  }  
  var url = process.env.API_URL+"/menu";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});


//***************************************************
//SECURITY
//***************************************************

//***************************************************
//secUserGroup
//***************************************************
//Form Load
http.get('/secUserGroup',  async (req, res) => {
  
  if (printlog == 1){
      console.log("secUserGroup", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
    }   
    if (req.session.loggedin) {
      let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
      const response = await fetch(process.env.API_URL+"/SysStatus", {
          method: 'post',
          headers: headers,
          body: JSON.stringify(params)
      });

      //
      params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
      const response_UserGroup = await fetch(process.env.API_URL+"/GetUserGroup", {
          method: 'post',
          headers: headers,
          body: JSON.stringify(params)
      });

      //
      try {
          const body = await response.json();    
          const body_UserGroup = await response_UserGroup.json();   

          //
          body.UserGroup = body_UserGroup.result;
          //
          var data1 = JSON.stringify(body);
          res.render('secUserGroup',{data1});
      } 
      catch (err) {
        console.log(err)
        throw err;
      }
    } else {
      res.render('login',{layout:false});
    }
  
});

//Save
http.post('/saveUserGroup', (req, res) => {
  if (printlog == 1){
    console.log("saveUserGroup", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  }    
  var url = process.env.API_URL+"/InsertUserGroup";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveUserGroup",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getUserGroupGrd', (req, res) => {
  if (printlog == 1){
    console.log("getUserGroupGrd", " - '" + req.session.uname + "'");
  }    
  var url = process.env.API_URL+"/GetUserGroup";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/getUserGroupByID', (req, res) => {
  if (printlog == 1){
    console.log("getUserGroupByID", " - '" + req.session.uname + "'");
  }    
  var url = process.env.API_URL+"/GetUserGroup";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//secUserGroupPermission
//***************************************************
//Form Load
http.get('/secUserGroupPermission',  async (req, res) => {
  console.log("secUserGroupPermission", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch(process.env.API_URL+"/SysStatus", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_UserGroup = await fetch(process.env.API_URL+"/GetUserGroup", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Module = await fetch(process.env.API_URL+"/GetModule", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_MODULE_ID":0,"IN_STATUS":0};
    const response_Menu = await fetch(process.env.API_URL+"/GetMenu", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_UserGroup= await response_UserGroup.json();   
        const body_Module = await response_Module.json();
        const body_Menu = await response_Menu.json();

        //
        body.UserGroup = body_UserGroup.result;
        body.Module = body_Module.result;
        body.Menu = body_Menu.result;
        //
        var data1 = JSON.stringify(body);
        res.render('secUserGroupPermission',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveUserGroupPermission', (req, res) => {
  console.log("saveUserGroupPermission", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = process.env.API_URL+"/UpdateUserGroupPermission";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveUserGroupPermission",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getUserGroupPermissionGrd', (req, res) => {
  console.log("getUserGroupPermissionGrd", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetUserGroupMenuPermission";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,
        "IN_ID":0,"IN_CHECK_USER_ID":req.body.IN_CHECK_USER_ID,"IN_USER_GROUP_ID":req.body.IN_USER_GROUP_ID,
        "IN_MODULE_ID":req.body.IN_MODULE_ID, 
        "IN_MENU_ID":req.body.IN_MENU_ID, "IN_PERMISSION_CODE":req.body.IN_PERMISSION_CODE,
        "IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});



//***************************************************
//SHARED
//***************************************************

//***************************************************
//refDepartment
//***************************************************
//Form Load
http.get('/refDepartment',  async (req, res) => {

  
  //
  /*
  var url = "http://localhost:8144/api/secPermissionCheck";    
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,
                      "IN_MENU_ID":req.body.IN_MENU_ID}, headers: headers}, function (error, response, body) {
    let mod_body = JSON.parse(body);   
    if (mod_body.result[0].PERMISSION==1){
      req.session.permission = true

    }   
    else{
      req.session.permission = false
      res.send({message:0});
    }
  });
  */
  //

    if (printlog == 1){
      console.log("refDepartment", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
    }   
    if (req.session.loggedin) {
      let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
      const response = await fetch(process.env.API_URL+"/SysStatus", {
          method: 'post',
          headers: headers,
          body: JSON.stringify(params)
      });

      //
      params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
      const response_DepartmentCategory = await fetch(process.env.API_URL+"/GetDepartmentCategory", {
          method: 'post',
          headers: headers,
          body: JSON.stringify(params)
      });

      //
      params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
      const response_Department = await fetch(process.env.API_URL+"/GetDepartment", {
          method: 'post',
          headers: headers,
          body: JSON.stringify(params)
      });

      //
      try {
          const body = await response.json();   
          const body_DepartmentCategory= await response_DepartmentCategory.json();   
          const body_Department = await response_Department.json();   

          //
          body.DepartmentCategory = body_DepartmentCategory.result;
          body.Department = body_Department.result;
          //
          var data1 = JSON.stringify(body);
          res.render('refDepartment',{data1});
          /*
          http.locals.user_name = req.session.uname;
            console.log("refDepartment", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
          if (fn_validateuserpermission(1)) // 11 is menu id
            res.render('refDepartment',{data1});
          else
            res.render('dashboard',{body}); // this will call blank page with permission denied message
          */
      } 
      catch (err) {
        console.log(err)
        throw err;
      }
    } else {
      res.render('login',{layout:false});
    }

  
});

//Save
http.post('/saveDepartment', (req, res) => {
  if (printlog == 1){
    console.log("saveDepartment", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  }    
  var url = process.env.API_URL+"/InsertDepartment";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveDepartment",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getDepartmentGrd', (req, res) => {
  if (printlog == 1){
    console.log("getDepartmentGrd", " - '" + req.session.uname + "'");
  }    
  var url = process.env.API_URL+"/GetDepartment";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/getDepartmentByID', (req, res) => {
  if (printlog == 1){
    console.log("getDepartmentByID", " - '" + req.session.uname + "'");
  }    
  var url = process.env.API_URL+"/GetDepartment";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//refSubDepartment
//***************************************************
//Form Load
http.get('/refSubDepartment',  async (req, res) => {
  console.log("refSubDepartment", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch(process.env.API_URL+"/SysStatus", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_SubDepartmentCategory = await fetch(process.env.API_URL+"/GetSubDepartmentCategory", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Department = await fetch(process.env.API_URL+"/GetDepartment", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0,"IN_DEPARTMENT_ID":0 };
    const response_SubDepartment = await fetch(process.env.API_URL+"/GetSubDepartment", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_SubDepartmentCategory= await response_SubDepartmentCategory.json();   
        const body_Department = await response_Department.json();   
        const body_SubDepartment = await response_SubDepartment.json();  

        //
        body.SubDepartmentCategory = body_SubDepartmentCategory.result;
        body.Department = body_Department.result;
        body.SubDepartment = body_SubDepartment.result;
        //
        var data1 = JSON.stringify(body);
        res.render('refSubDepartment',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveSubDepartment', (req, res) => {
  console.log("saveSubDepartment", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = process.env.API_URL+"/InsertSubDepartment";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveSubDepartment",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getSubDepartmentGrd', (req, res) => {
  console.log("getSubDepartmentGrd", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetSubDepartment";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0,"IN_DEPARTMENT_ID":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/getSubDepartmentByID', (req, res) => {
  console.log("getSubDepartmentByID", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetSubDepartment";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_STATUS":0,"IN_DEPARTMENT_ID":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

http.post('/getSubDepartmentByDeptID', (req, res) => {
  console.log("getSubDepartmentByID", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetSubDepartment";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_STATUS":0,"IN_DEPARTMENT_ID":req.body.IN_DEPARTMENT_ID}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});


//***************************************************
//refPackage
//***************************************************
//Form Load
http.get('/refPackage',  async (req, res) => {
  console.log("refPackage", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch(process.env.API_URL+"/SysStatus", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_PackageList = await fetch(process.env.API_URL+"/GetPackageList", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0,"IN_DEPARTMENT_ID":0 };
    const response_ServiceForPackage = await fetch(process.env.API_URL+"/GetServiceForPackage", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();    
        const body_PackageList = await response_PackageList.json();   
        const body_ServiceForPackage = await response_ServiceForPackage.json();  

        //
        body.PackageList = body_PackageList.result;
        body.ServiceForPackage = body_ServiceForPackage.result;
        //
        var data1 = JSON.stringify(body);
        res.render('refPackage',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/savePackage', (req, res) => {
  console.log("savePackage", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = process.env.API_URL+"/InsertPackage";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveSubDepartment",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getPackageGrd', (req, res) => {
  console.log("getPackageGrd", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetPackage";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_PACKAGE_ID":req.body.IN_PACKAGE_ID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/getPackegeByID', (req, res) => {
  console.log("getPackegeByID", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetPackage";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});


//***************************************************
//refTariff
//***************************************************
//Form Load
http.get('/refTariff',  async (req, res) => {
  console.log("refTariff", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch(process.env.API_URL+"/SysStatus", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_TariffCategory = await fetch(process.env.API_URL+"/GetTariffCategory", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Tariff = await fetch(process.env.API_URL+"/GetTariff", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_TariffCategory= await response_TariffCategory.json();   
        const body_Tariff = await response_Tariff.json();   

        //
        body.TariffCategory = body_TariffCategory.result;
        body.Tariff = body_Tariff.result;
        //
        var data1 = JSON.stringify(body);
        res.render('refTariff',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveTariff', (req, res) => {
  console.log("saveDepartment", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = process.env.API_URL+"/InsertTariff";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveDepartment",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getTariffGrd', (req, res) => {
  console.log("getTariffGrd", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetTariff";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/getTariffByID', (req, res) => {
  console.log("getTariffByID", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetTariff";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//refEmployee
//***************************************************
//Form Load
http.get('/refEmployee',  async (req, res) => {
  console.log("refEmployee", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch(process.env.API_URL+"/SysStatus", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CATEGORY_ID":0, "IN_STATUS":0};
    const response_Employee = await fetch(process.env.API_URL+"/GetEmployee", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
   
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Department = await fetch(process.env.API_URL+"/GetDepartment", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_IdentityType = await fetch(process.env.API_URL+"/GetIdentityType", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Gender = await fetch(process.env.API_URL+"/GetGender", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Designation = await fetch(process.env.API_URL+"/GetDesignation", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_JobTitle = await fetch(process.env.API_URL+"/GetJobTitle", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_EmploymentCategory = await fetch(process.env.API_URL+"/GetEmploymentCategory", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_CategorySpecialization = await fetch(process.env.API_URL+"/GetCategorySpecialization", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_EmploymentStatus = await fetch(process.env.API_URL+"/GetEmploymentStatus", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_State = await fetch(process.env.API_URL+"/GetState", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Country = await fetch(process.env.API_URL+"/GetCountry", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Nationality = await fetch(process.env.API_URL+"/GetNationality", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Religion = await fetch(process.env.API_URL+"/GetReligion", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    try {
        const body = await response.json();   
        const body_Employee= await response_Employee.json();   
        const body_Department = await response_Department.json();   
        const body_IdentityType = await response_IdentityType.json();  
        const body_Gender = await response_Gender.json();  
        const body_Designation = await response_Designation.json();  
        const body_JobTitle = await response_JobTitle.json();  
        const body_EmploymentCategory = await response_EmploymentCategory.json();  
        const body_CategorySpecialization = await response_CategorySpecialization.json();  
        const body_EmploymentStatus = await response_EmploymentStatus.json();  
        const body_State = await response_State.json();  
        const body_Country = await response_Country.json();  
        const body_Nationality = await response_Nationality.json();  
        const body_Religion = await response_Religion.json();  

        //
        body.Employee = body_Employee.result;
        body.Department = body_Department.result;
        body.IdentityType = body_IdentityType.result;
        body.Gender = body_Gender.result;
        body.Designation = body_Designation.result;
        body.JobTitle = body_JobTitle.result;
        body.EmploymentCategory = body_EmploymentCategory.result;
        body.CategorySpecialization = body_CategorySpecialization.result;
        body.EmploymentStatus = body_EmploymentStatus.result;
        body.State = body_State.result;
        body.Country = body_Country.result;
        body.Nationality = body_Nationality.result;
        body.Religion = body_Religion.result;
        //
        var data1 = JSON.stringify(body);
        res.render('refEmployee',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveEmployee', (req, res) => {
  console.log("saveEmployee", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = process.env.API_URL+"/InsertEmployee";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveEmployee",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getEmployee', (req, res) => {
  console.log("getEmployee", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetEmployee";
  request.post(url, {form:{"IN_USER_ID":req.session.userid, "IN_BRANCH_ID":req.session.branchid, "IN_ID":req.body.IN_ID, "IN_CATEGORY_ID":req.body.IN_CATEGORY_ID, "IN_STATUS":req.body.IN_STATUS}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//refDataLoad
//***************************************************
//Form Load
http.get('/refDataLoad',  async (req, res) => {
  console.log("refDataLoad", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch(process.env.API_URL+"/SysStatus", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_ServiceCategory = await fetch(process.env.API_URL+"/GetServiceCategory", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_ServiceCategory= await response_ServiceCategory.json();     

        //
        body.ServiceCategory = body_ServiceCategory.result;
        //
        var data1 = JSON.stringify(body);
        res.render('refDataLoad',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveDataLoad', (req, res) => {
  console.log("saveDataLoad", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = process.env.API_URL+"/InsertDataLoad";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveDataLoad",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getDataLoadGrd', (req, res) => {
  console.log("getDataLoadGrd", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetDataLoad";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/getDataLoadByID', (req, res) => {
  console.log("getDataLoadByID", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetDataLoad";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//refServiceCategory
//***************************************************
//Form Load
http.get('/refServiceCategory',  async (req, res) => {
  console.log("refServiceCategory", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch(process.env.API_URL+"/SysStatus", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_ServiceCategory = await fetch(process.env.API_URL+"/GetServiceCategory", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_ServiceCategory= await response_ServiceCategory.json();     

        //
        body.ServiceCategory = body_ServiceCategory.result;
        //
        var data1 = JSON.stringify(body);
        res.render('refServiceCategory',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveServiceCategory', (req, res) => {
  console.log("saveServiceCategory", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = process.env.API_URL+"/InsertServiceCategory";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveServiceCategory",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getServiceCategoryGrd', (req, res) => {
  console.log("getServiceCategoryGrd", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetServiceCategory";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/getServiceCategoryByID', (req, res) => {
  console.log("getServiceCategoryByID", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetServiceCategory";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});


//***************************************************
//refServiceGroup
//***************************************************
//Form Load
http.get('/refServiceGroup',  async (req, res) => {
  console.log("refServiceGroup", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch(process.env.API_URL+"/SysStatus", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_ServiceGroup = await fetch(process.env.API_URL+"/GetServiceGroup", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_ServiceGroup= await response_ServiceGroup.json();   

        //
        body.ServiceGroup = body_ServiceGroup.result;
        //
        var data1 = JSON.stringify(body);
        res.render('refServiceGroup',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveServiceGroup', (req, res) => {
  console.log("saveServiceGroup", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = process.env.API_URL+"/InsertServiceGroup";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveServiceGroup",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getServiceGroupGrd', (req, res) => {
  console.log("getServiceGroupGrd", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetServiceGroup";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/getServiceGroupByID', (req, res) => {
  console.log("getServiceGroupByID", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetServiceGroup";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//refCompany
//***************************************************
//Form Load
http.get('/refCompany',  async (req, res) => {
  console.log("refCompany", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch(process.env.API_URL+"/SysStatus", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Tariff = await fetch(process.env.API_URL+"/GetTariff", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Company = await fetch(process.env.API_URL+"/GetCompany", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_Tariff= await response_Tariff.json();   
        const body_Company = await response_Company.json();   

        //
        body.Tariff = body_Tariff.result;
        body.Company = body_Company.result;
        //
        var data1 = JSON.stringify(body);
        res.render('refCompany',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveCompany', (req, res) => {
  console.log("saveCompany", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = process.env.API_URL+"/InsertCompany";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveCompany",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getCompanyGrd', (req, res) => {
  console.log("getCompanyGrd", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetCompany";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/getCompanyByID', (req, res) => {
  console.log("getCompanyByID", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetCompany";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//refService
//***************************************************
//Form Load
http.get('/refService',  async (req, res) => {
  console.log("refService", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch(process.env.API_URL+"/SysStatus", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_ServiceGroup = await fetch(process.env.API_URL+"/GetServiceGroup", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Department = await fetch(process.env.API_URL+"/GetDepartment", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0,"IN_DEPARTMENT_ID":0};
    const response_SubDepartment = await fetch(process.env.API_URL+"/GetSubDepartment", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Service = await fetch(process.env.API_URL+"/GetService", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CATEGORY_ID":1, "IN_STATUS":0};
    const response_EmployeeByEmpCategory = await fetch(process.env.API_URL+"/GetEmployee", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_ServiceGroup= await response_ServiceGroup.json();   
        const body_Department = await response_Department.json();
        const body_SubDepartment = await response_SubDepartment.json();
        const body_Service = await response_Service.json();
        const body_EmployeeByEmpCategory = await response_EmployeeByEmpCategory.json();

        //
        body.ServiceGroup = body_ServiceGroup.result;
        body.Department = body_Department.result;
        body.SubDepartment = body_SubDepartment.result;
        body.Service = body_Service.result;
        body.EmployeeByEmpCategory = body_EmployeeByEmpCategory.result;
        //
        var data1 = JSON.stringify(body);
        res.render('refService',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveService', (req, res) => {
  console.log("saveService", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = process.env.API_URL+"/InsertService";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveService",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getServiceGrd', (req, res) => {
  console.log("getServiceGrd", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetService";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/getServiceByID', (req, res) => {
  console.log("getServiceByID", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetService";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//refServiceCharge
//***************************************************
//Form Load
http.get('/refServiceCharge',  async (req, res) => {
  console.log("refServiceCharge", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch(process.env.API_URL+"/SysStatus", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Tariff = await fetch(process.env.API_URL+"/GetTariff", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Service = await fetch(process.env.API_URL+"/GetService", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_ServiceCategory = await fetch(process.env.API_URL+"/GetServiceCategory", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_Tariff= await response_Tariff.json();   
        const body_Service = await response_Service.json();
        const body_ServiceCategory = await response_ServiceCategory.json();

        //
        body.Tariff = body_Tariff.result;
        body.Service = body_Service.result;
        body.ServiceCategory = body_ServiceCategory.result;
        //
        var data1 = JSON.stringify(body);
        res.render('refServiceCharge',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveServiceCharge', (req, res) => {
  console.log("saveServiceCharge", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = process.env.API_URL+"/InsertServiceCharge";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveServiceCharge",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getServiceChargeGrd', (req, res) => {
  console.log("getServiceChargeGrd", " - '" + req.session.uname + "'");
  var url = process.env.API_URL+"/GetServiceCharge";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_SERVICE_ID":req.body.IN_SERVICE_ID,"IN_TARIFF_ID":req.body.IN_TARIFF_ID,"IN_SERVICE_CATEGORY_ID":req.body.IN_SERVICE_CATEGORY_ID,"IN_ID":0,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//refDefaultServiceSetup
//***************************************************
//Form Load
http.get('/refDefaultServiceSetup',  async (req, res) => {
  console.log("refDefaultServiceSetup", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch(process.env.API_URL+"/SysStatus", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Category = await fetch(process.env.API_URL+'/GetServiceCategoryDefault', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Service = await fetch(process.env.API_URL+"/GetService", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_SERVICE_CATEGORY_ID":0,"IN_STATUS":0 };
    const response_SelectedService = await fetch(process.env.API_UR+'/GetDefaultServiceSetup', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_response_Category= await response_Category.json();   
        const body_Service = await response_Service.json();  
        const body_SelectedService = await response_SelectedService.json();         

        //
        body.Category = body_response_Category.result;
        body.Service = body_Service.result;
        body.SelectedService = body_SelectedService.result;

        //
        var data1 = JSON.stringify(body);
        res.render('refDefaultServiceSetup',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveDefaultServiceSetup', (req, res) => {
  console.log("saveDefaultServiceSetup", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertDefaultServiceSetup";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveBed",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getDefaultServiceSetupGrd', (req, res) => {
  console.log("getDefaultServiceSetupGrd", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetDefaultServiceSetup";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_SERVICE_CATEGORY_ID":0 ,"IN_STATUS":0 }, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/getDefaultServiceSetupByID', (req, res) => {
  console.log("getDefaultServiceSetupByID", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetDefaultServiceSetup";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_SERVICE_CATEGORY_ID":0,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});



//***************************************************
//refBedStatus
//***************************************************
//Form Load
http.get('/refBedStatus',  async (req, res) => {
  console.log("refBedStatus", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_BedStatus = await fetch('http://localhost:8144/api/GetBedStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_BedStatus= await response_BedStatus.json();   

        //
        body.BedStatus = body_BedStatus.result;
        //
        var data1 = JSON.stringify(body);
        res.render('refBedStatus',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveBedStatus', (req, res) => {
  console.log("saveBedStatus", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertBedStatus";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveServiceGroup",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getBedStatusGrd', (req, res) => {
  console.log("getBedStatusGrd", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetBedStatus";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/getBedStatusByID', (req, res) => {
  console.log("getServiceGroupByID", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetBedStatus";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//refBedCategory
//***************************************************
//Form Load
http.get('/refBedCategory',  async (req, res) => {
  console.log("refBedCategory", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Service = await fetch('http://localhost:8144/api/GetService', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_BedCategory = await fetch('http://localhost:8144/api/GetBedCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_Service= await response_Service.json();   
        const body_BedCategory = await response_BedCategory.json();   

        //
        body.Service = body_Service.result;
        body.BedCategory = body_BedCategory.result;
        //
        var data1 = JSON.stringify(body);
        res.render('refBedCategory',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveBedCategory', (req, res) => {
  console.log("saveBedCategory", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertBedCategory";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveBedCategory",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getBedCategoryGrd', (req, res) => {
  console.log("getBedCategoryGrd", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetBedCategory";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/getBedCategoryByID', (req, res) => {
  console.log("getBedCategoryByID", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetBedCategory";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//refWardMaster
//***************************************************
//Form Load
http.get('/refWardMaster',  async (req, res) => {
  console.log("refWardMaster", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_WardCategory = await fetch('http://localhost:8144/api/GetWardCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Ward = await fetch('http://localhost:8144/api/GetWard', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_WardCategory= await response_WardCategory.json();   
        const body_Ward = await response_Ward.json();   
        //
        body.WardCategory = body_WardCategory.result;
        body.Ward = body_Ward.result;
        //
        var data1 = JSON.stringify(body);
        res.render('refWardMaster',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveWardMaster', (req, res) => {
  console.log("saveWardMaster", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertWard";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveWardMaster",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getWardMasterGrd', (req, res) => {
  console.log("getWardMasterGrd", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetWard";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/getWardMasterByID', (req, res) => {
  console.log("getWardMasterByID", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetWard";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//refBedMaster
//***************************************************
//Form Load
http.get('/refBedMaster',  async (req, res) => {
  console.log("refBedMaster", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_BedCategory = await fetch('http://localhost:8144/api/GetBedCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Ward = await fetch('http://localhost:8144/api/GetWard', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_BedStatus = await fetch('http://localhost:8144/api/GetBedStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0,"IN_WARD_ID":0,"IN_BED_CATEGORY_ID":0,"IN_BED_STATUS_ID":0 };
    const response_Bed = await fetch('http://localhost:8144/api/GetBed', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_BedCategory= await response_BedCategory.json();   
        const body_Ward = await response_Ward.json();  
        const body_BedStatus = await response_BedStatus.json();          
        const body_Bed = await response_Bed.json();  

        //
        body.BedCategory = body_BedCategory.result;
        body.Ward = body_Ward.result;
        body.BedStatus = body_BedStatus.result;
        body.Bed = body_Bed.result;

        //
        var data1 = JSON.stringify(body);
        res.render('refBedMaster',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveBedMaster', (req, res) => {
  console.log("saveBedMaster", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertBed";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveBed",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getBedMasterGrd', (req, res) => {
  console.log("getBedMasterGrd", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetBed";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0,"IN_WARD_ID":0,"IN_BED_CATEGORY_ID":0,"IN_BED_STATUS_ID":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/getBedMasterByID', (req, res) => {
  console.log("getBedMasterByID", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetBed";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_STATUS":0,"IN_WARD_ID":0,"IN_BED_CATEGORY_ID":0,"IN_BED_STATUS_ID":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});



//***************************************************
//refTemplate
//***************************************************
//Form Load
http.get('/refTemplate',  async (req, res) => {
  console.log("refTemplate", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_TemplateCategory = await fetch('http://localhost:8144/api/GetTemplateCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0,"IN_TEMPLATE_CATEGORY_ID":0 };
    const response_Template = await fetch('http://localhost:8144/api/GetTemplate', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_TemplateCategory= await response_TemplateCategory.json();   
        const body_Template = await response_Template.json();  

        //
        body.TemplateCategory = body_TemplateCategory.result;
        body.Template = body_Template.result;
        //
        var data1 = JSON.stringify(body);
        res.render('refTemplate',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveTemplate', (req, res) => {
  console.log("saveTemplate", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertTemplate";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("saveTemplate",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Get Data
http.post('/getTemplateData', (req, res) => {
  console.log("getTemplateData", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetTemplate";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_STATUS":0,"IN_TEMPLATE_CATEGORY_ID":req.body.IN_TEMPLATE_CATEGORY_ID}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});



//***************************************************
//opdPatientRegistration
//***************************************************
//Form Load
http.get('/opdPatientRegistration',  async (req, res) => {
  console.log("opdPatientRegistration", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CODE":0, "IN_STATUS":0};
    const response_PatientRegistration = await fetch('http://localhost:8144/api/GetPatientRegistration', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Company = await fetch('http://localhost:8144/api/GetCompany', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Gender = await fetch('http://localhost:8144/api/GetGender', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_IdentityType = await fetch('http://localhost:8144/api/GetIdentityType', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0,"IN_DEPARTMENT_ID":0};
    const response_BloodGroup = await fetch('http://localhost:8144/api/GetBloodGroup', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_State = await fetch('http://localhost:8144/api/GetState', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Country = await fetch('http://localhost:8144/api/GetCountry', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Nationality = await fetch('http://localhost:8144/api/GetNationality', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Relation = await fetch('http://localhost:8144/api/GetRelation', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_MaritalStatus = await fetch('http://localhost:8144/api/GetMaritalStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Religion = await fetch('http://localhost:8144/api/GetReligion', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
  
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_PatientCategory = await fetch('http://localhost:8144/api/GetPatientCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_EmploymentStatus = await fetch('http://localhost:8144/api/GetEmploymentStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();           
        const body_PatientRegistration= await response_PatientRegistration.json();  
        const body_Company= await response_Company.json();   
        const body_Gender = await response_Gender.json();   
        const body_IdentityType = await response_IdentityType.json();   
        const body_BloodGroup = await response_BloodGroup.json();   
        const body_State = await response_State.json();   
        const body_Country = await response_Country.json();   
        const body_Nationality = await response_Nationality.json(); 
        const body_Relation = await response_Relation.json(); 
        const body_MaritalStatus = await response_MaritalStatus.json();   
        const body_Religion = await response_Religion.json();   
        const body_PatientCategory = await response_PatientCategory.json();   
        const body_EmploymentStatus = await response_EmploymentStatus.json();    

        //
        body.PatientRegistration = body_PatientRegistration.result;
        body.Company = body_Company.result;
        body.Gender = body_Gender.result;
        body.IdentityType = body_IdentityType.result;
        body.BloodGroup = body_BloodGroup.result;
        body.State = body_State.result;
        body.Country = body_Country.result;
        body.Nationality = body_Nationality.result;
        body.Relation = body_Relation.result;
        body.MaritalStatus = body_MaritalStatus.result;
        body.Religion = body_Religion.result;
        body.PatientCategory = body_PatientCategory.result;
        body.EmploymentStatus = body_EmploymentStatus.result;
        
        //
        var data1 = JSON.stringify(body);
        res.render('opdPatientRegistration',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/savePatientRegistration', (req, res) => {
  console.log("savePatientRegistration", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertPatientRegistration";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    //console.log("savePatientRegistration",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//Grid Data
http.post('/getPatientRegistrationGrd', (req, res) => {
  console.log("getPatientRegistrationGrd", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetPatientRegistrationLimit";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CODE":0, "IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/getPatientRegistrationByID', (req, res) => {
  console.log("getPatientRegistrationByID", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetPatientRegistration";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_CODE":req.body.IN_CODE,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//opdBill
//***************************************************
//Form Load
http.get('/opdBill',  async (req, res) => {
  console.log("opdBill", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
   
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CODE":0, "IN_STATUS":0};
    const response_Patient = await fetch('http://localhost:8144/api/GetPatientRegistration', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Company = await fetch('http://localhost:8144/api/GetCompany', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
     
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_ServiceCategory = await fetch('http://localhost:8144/api/GetServiceCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_PAYER_ID":1,"IN_SERVICE_CATEGORY_ID":1,"IN_SERVICE_ID":0};
    const response_ServiceCharge = await fetch('http://localhost:8144/api/GetServiceForBill', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CATEGORY_ID":1, "IN_STATUS":0};
    const response_EmployeeByEmpCategory = await fetch('http://localhost:8144/api/GetEmployee', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Gender = await fetch('http://localhost:8144/api/GetGender', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_IdentityType = await fetch('http://localhost:8144/api/GetIdentityType', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });


    //
    try {
        const body = await response.json();   
        const body_response_Patient = await response_Patient.json();
        const body_response_Company = await response_Company.json();
        const body_ServiceCategory= await response_ServiceCategory.json(); 
        const body_ServiceCharge = await response_ServiceCharge.json();
        const body_EmployeeByEmpCategory = await response_EmployeeByEmpCategory.json();    
        const body_Gender = await response_Gender.json();   
        const body_IdentityType = await response_IdentityType.json();      

        //        
        body.response_Patient = body_response_Patient.result;
        body.response_Company = body_response_Company.result;
        body.ServiceCategory = body_ServiceCategory.result;
        body.ServiceCharge = body_ServiceCharge.result;
        body.EmployeeByEmpCategory = body_EmployeeByEmpCategory.result;
        body.Gender = body_Gender.result;
        body.IdentityType = body_IdentityType.result;
        //
        
        var data1 = JSON.stringify(body);
        res.render('opdBill',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//
http.post('/getOpdBillServiceCharge', (req, res) => {
  console.log("getOpdBillServiceCharge", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetServiceForBill";
  request.post(url, {form:{"IN_USER_ID":req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_PAYER_ID":req.body.IN_PAYER_ID,"IN_SERVICE_CATEGORY_ID":req.body.IN_SERVICE_CATEGORY_ID,"IN_SERVICE_ID":req.body.IN_SERVICE_ID}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//
http.post('/getOpdBillSelectedServiceCharge', (req, res) => {
  console.log("getOpdBillSelectedServiceCharge", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetServiceChargeDtlBilling";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_SERVICE_ID":req.body.IN_SERVICE_ID,"IN_PAYER_ID":req.body.IN_PAYER_ID,"IN_SERVICE_CATEGORY_ID":req.body.IN_SERVICE_CATEGORY_ID,"IN_ID":req.body.IN_ID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//Save
http.post('/saveOpdBill', (req, res) => {
  console.log("saveOpdBill", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertOpdBill";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    console.log("saveOpdBill",parsedbody);
    req.session.opdbillno=parsedbody.result[0].SQL_NO;
    console.log("Bill No ", req.session.opdbillno);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//opdBillReport
//***************************************************
http.get('/opdBillReport',  async (req, res) => {
  console.log("opdBillReport", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
   
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CODE":0, "IN_STATUS":0};
    const response_Patient = await fetch('http://localhost:8144/api/GetPatientRegistration', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Company = await fetch('http://localhost:8144/api/GetCompany', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
     
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_ServiceCategory = await fetch('http://localhost:8144/api/GetServiceCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_PAYER_ID":1,"IN_SERVICE_CATEGORY_ID":1,"IN_SERVICE_ID":0};
    const response_ServiceCharge = await fetch('http://localhost:8144/api/GetServiceForBill', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CATEGORY_ID":1, "IN_STATUS":0};
    const response_EmployeeByEmpCategory = await fetch('http://localhost:8144/api/GetEmployee', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Gender = await fetch('http://localhost:8144/api/GetGender', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_IdentityType = await fetch('http://localhost:8144/api/GetIdentityType', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });


    //
    try {
        const body = await response.json();   
        const body_response_Patient = await response_Patient.json();
        const body_response_Company = await response_Company.json();
        const body_ServiceCategory= await response_ServiceCategory.json(); 
        const body_ServiceCharge = await response_ServiceCharge.json();
        const body_EmployeeByEmpCategory = await response_EmployeeByEmpCategory.json();    
        const body_Gender = await response_Gender.json();   
        const body_IdentityType = await response_IdentityType.json();      

        //        
        body.response_Patient = body_response_Patient.result;
        body.response_Company = body_response_Company.result;
        body.ServiceCategory = body_ServiceCategory.result;
        body.ServiceCharge = body_ServiceCharge.result;
        body.EmployeeByEmpCategory = body_EmployeeByEmpCategory.result;
        body.Gender = body_Gender.result;
        body.IdentityType = body_IdentityType.result;
        //
        
        var data1 = JSON.stringify(body);
        res.render('opdBillReport',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/printopdBillReport', (req, res) => {
  console.log("printopdBillReport", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/printopdBillReport";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    console.log("printopdBillReport",parsedbody);
    req.session.opdbillno=parsedbody.result[0].SQL_NO;
    console.log("Bill No ", req.session.opdbillno);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//opdBillDefault
//***************************************************
//Form Load
http.get('/opdBillDefault',  async (req, res) => {
  console.log("opdBillDefault", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
   
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CODE":0, "IN_STATUS":0};
    const response_Patient = await fetch('http://localhost:8144/api/GetPatientRegistration', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Company = await fetch('http://localhost:8144/api/GetCompany', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
     
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_ServiceCategory = await fetch('http://localhost:8144/api/GetServiceCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_PAYER_ID":1,"IN_SERVICE_CATEGORY_ID":1,"IN_SERVICE_ID":0};
    const response_ServiceCharge = await fetch('http://localhost:8144/api/GetServiceForBill', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CATEGORY_ID":1, "IN_STATUS":0};
    const response_EmployeeByEmpCategory = await fetch('http://localhost:8144/api/GetEmployee', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Gender = await fetch('http://localhost:8144/api/GetGender', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_IdentityType = await fetch('http://localhost:8144/api/GetIdentityType', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });


    //
    try {
        const body = await response.json();   
        const body_response_Patient = await response_Patient.json();
        const body_response_Company = await response_Company.json();
        const body_ServiceCategory= await response_ServiceCategory.json(); 
        const body_ServiceCharge = await response_ServiceCharge.json();
        const body_EmployeeByEmpCategory = await response_EmployeeByEmpCategory.json();    
        const body_Gender = await response_Gender.json();   
        const body_IdentityType = await response_IdentityType.json();      

        //        
        body.response_Patient = body_response_Patient.result;
        body.response_Company = body_response_Company.result;
        body.ServiceCategory = body_ServiceCategory.result;
        body.ServiceCharge = body_ServiceCharge.result;
        body.EmployeeByEmpCategory = body_EmployeeByEmpCategory.result;
        body.Gender = body_Gender.result;
        body.IdentityType = body_IdentityType.result;
        //
        
        var data1 = JSON.stringify(body);
        res.render('opdBillDefault',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveOpdBillDefault', (req, res) => {
  console.log("saveOpdBill", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertOpdBillDefault";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    console.log("saveOpdBill",parsedbody);
    req.session.opdbillno=parsedbody.result[0].SQL_NO;
    console.log("Bill No ", req.session.opdbillno);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});


//**************************************************
//rptopdBill
//**************************************************
http.get('/rptopdBill',  async (req, res) => {
  console.log("rptopdBill", " - '" + req.session.uname + " - '" + req.session.branchid +"'"); 
  if (!(req.session.opdbillno) ){
    req.session.opdbillno=0
  }

  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/GetRptSysBranch', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
   
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":req.session.opdbillno, "IN_TYPE":0}; // IN_TYPE 0 = Header and 1 = Details 
    const response_Header = await fetch('http://localhost:8144/api/GetRptOpdBill', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":req.session.opdbillno, "IN_TYPE":1};
    const response_Dtl = await fetch('http://localhost:8144/api/GetRptOpdBill', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_response_Header = await response_Header.json();
        const body_response_Dtl = await response_Dtl.json();       
        //        
        body.response_Header = body_response_Header.result;
        body.response_Dtl = body_response_Dtl.result;
        //        
        var data1 = JSON.stringify(body);
        res.render('rptopdBill',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});


http.post('/getipdBillServiceCharge', (req, res) => {
  console.log("getipdBillServiceCharge", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetServiceForBill";
  request.post(url, {form:{"IN_USER_ID":req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_PAYER_ID":req.body.IN_PAYER_ID,"IN_SERVICE_CATEGORY_ID":req.body.IN_SERVICE_CATEGORY_ID,"IN_SERVICE_ID":req.body.IN_SERVICE_ID}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//
http.post('/getipdBillSelectedServiceCharge', (req, res) => {
  console.log("getipdBillSelectedServiceCharge", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetServiceChargeDtlBilling";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_SERVICE_ID":req.body.IN_SERVICE_ID,"IN_PAYER_ID":req.body.IN_PAYER_ID,"IN_SERVICE_CATEGORY_ID":req.body.IN_SERVICE_CATEGORY_ID,"IN_ID":req.body.IN_ID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});


//**************************************************
//rptopdBill_Select
//**************************************************
http.get('/rptopdBill_Select',  async (req, res) => {
  console.log("rptopdBill_Select", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/GetRptSysBranch', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
   
    //
    try {
        const body = await response.json();   
        //        
        var data1 = JSON.stringify(body);
        res.render('rptopdBill_Select',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//
http.post('/getrptopdBill_Select', (req, res) => {
  console.log("getrptopdBill_Select", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetRptOpdBill";
  //Note :- IN_TYPE 0 = Header and 1 = Details 
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_BILL_ID,"IN_TYPE":req.body.IN_TYPE_ID}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//
http.post('/getEmployeeByID', (req, res) => {
  console.log("getEmployeeByID", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetEmployee";
  request.post(url, {form:{"IN_USER_ID":req.session.userid, "IN_BRANCH_ID":req.session.branchid, "IN_ID":req.body.IN_ID, "IN_CATEGORY_ID":req.body.IN_CATEGORY_ID, "IN_STATUS":req.body.IN_STATUS}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});


//***************************************************
//opdBillReg
//***************************************************
http.get('/opdBillReg',  async (req, res) => {
  console.log("opdBillReg", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
   
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CODE":0,"IN_STATUS":0};
    const response_Patient = await fetch('http://localhost:8144/api/GetPatientRegistration', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Company = await fetch('http://localhost:8144/api/GetCompany', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
     
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_ServiceCategory = await fetch('http://localhost:8144/api/GetServiceCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_PAYER_ID":1,"IN_SERVICE_CATEGORY_ID":1,"IN_SERVICE_ID":0};
    const response_ServiceCharge = await fetch('http://localhost:8144/api/GetServiceForBill', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CATEGORY_ID":1, "IN_STATUS":0};
    const response_EmployeeByEmpCategory = await fetch('http://localhost:8144/api/GetEmployee', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Gender = await fetch('http://localhost:8144/api/GetGender', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_IdentityType = await fetch('http://localhost:8144/api/GetIdentityType', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_response_Patient = await response_Patient.json();
        const body_response_Company = await response_Company.json();
        const body_ServiceCategory= await response_ServiceCategory.json(); 
        const body_ServiceCharge = await response_ServiceCharge.json();
        const body_EmployeeByEmpCategory = await response_EmployeeByEmpCategory.json();    
        const body_Gender = await response_Gender.json();   
        const body_IdentityType = await response_IdentityType.json();      

        //        
        body.response_Patient = body_response_Patient.result;
        body.response_Company = body_response_Company.result;
        body.ServiceCategory = body_ServiceCategory.result;
        body.ServiceCharge = body_ServiceCharge.result;
        body.EmployeeByEmpCategory = body_EmployeeByEmpCategory.result;
        body.Gender = body_Gender.result;
        body.IdentityType = body_IdentityType.result;
        //
        
        var data1 = JSON.stringify(body);
        res.render('opdBillReg',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveOpdBillReg', (req, res) => {
  console.log("saveOpdBillReg", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertOpdBill";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    console.log("saveOpdBillReg",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//opdPatientVisit
//***************************************************
//Form Load
http.get('/opdPatientVisit',  async (req, res) => {
  console.log("opdPatientVisit", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_BILL_TYPE":"1", "IN_STATUS":0 };
    const response_Patient = await fetch('http://localhost:8144/api/GetPatientVisitBillID', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
     
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CODE":0, "IN_STATUS":0};
    const response_Patientall = await fetch('http://localhost:8144/api/GetPatientRegistration', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    try {
        const body = await response.json();   
        const body_response_Patient = await response_Patient.json();
        const body_Patientall = await response_Patientall.json();    
        //        
        body.response_Patient = body_response_Patient.result;       
        body.Patientall = body_Patientall.result;
        //
        
        var data1 = JSON.stringify(body);
        res.render('opdPatientVisit',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveopdPatientVisit', (req, res) => {
  console.log("saveopdPatientVisit", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertopdPatientVisit";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    console.log("saveopdPatientVisit",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/PatientRegistrationByOthID', (req, res) => {
  console.log("PatientRegistrationByOthID", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/PatientRegistrationByOthID";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_TYPE":1,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

http.post('/getpatientVisit', (req, res) => {
  console.log("getpatientVisit", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetPatientVisit";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid, "IN_BILL_TYPE":1, "IN_BILL_ID":req.body.IN_BILL_ID, "IN_ID":req.body.IN_ID,"IN_PID":req.body.IN_PID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});


http.post('/getpatientVisitOPIP', (req, res) => {
  console.log("getpatientVisit", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetPatientVisit";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid, "IN_BILL_TYPE":0, "IN_BILL_ID":req.body.IN_BILL_ID, "IN_ID":req.body.IN_ID,"IN_PID":req.body.IN_PID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});


//***************************************************
//ipdPatientVisit
//***************************************************
//Form Load
http.get('/ipdPatientVisit',  async (req, res) => {
  console.log("ipdPatientVisit", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_BILL_TYPE":"2", "IN_STATUS":0 };
    const response_Patient = await fetch('http://localhost:8144/api/GetPatientVisitBillID', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
     
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CODE":0, "IN_STATUS":0};
    const response_Patientall = await fetch('http://localhost:8144/api/GetPatientRegistration', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    try {
        const body = await response.json();   
        const body_response_Patient = await response_Patient.json();
        const body_Patientall = await response_Patientall.json();    
        //        
        body.response_Patient = body_response_Patient.result;       
        body.Patientall = body_Patientall.result;
        //
        
        var data1 = JSON.stringify(body);
        res.render('ipdPatientVisit',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveopdPatientVisitIPD', (req, res) => {
  console.log("saveopdPatientVisit", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertopdPatientVisit";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    console.log("saveopdPatientVisit",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});


http.post('/getpatientVisitIPD', (req, res) => {
  console.log("getpatientVisitIPD", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetPatientVisit";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid, "IN_BILL_TYPE":2, "IN_BILL_ID":req.body.IN_BILL_ID, "IN_ID":req.body.IN_ID,"IN_PID":req.body.IN_PID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});



//***************************************************
//ipdPatientRegistration
//***************************************************
//Form Load
http.get('/ipdPatientRegistration',  async (req, res) => {
  console.log("opdPatientRegistration", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CODE":0, "IN_STATUS":0};
    const response_PatientRegistration = await fetch('http://localhost:8144/api/GetPatientRegistration', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Company = await fetch('http://localhost:8144/api/GetCompany', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Gender = await fetch('http://localhost:8144/api/GetGender', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_IdentityType = await fetch('http://localhost:8144/api/GetIdentityType', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0,"IN_DEPARTMENT_ID":0};
    const response_BloodGroup = await fetch('http://localhost:8144/api/GetBloodGroup', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_State = await fetch('http://localhost:8144/api/GetState', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Country = await fetch('http://localhost:8144/api/GetCountry', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Nationality = await fetch('http://localhost:8144/api/GetNationality', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Relation = await fetch('http://localhost:8144/api/GetRelation', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_MaritalStatus = await fetch('http://localhost:8144/api/GetMaritalStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Religion = await fetch('http://localhost:8144/api/GetReligion', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
  
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_PatientCategory = await fetch('http://localhost:8144/api/GetPatientCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_EmploymentStatus = await fetch('http://localhost:8144/api/GetEmploymentStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();           
        const body_PatientRegistration= await response_PatientRegistration.json();  
        const body_Company= await response_Company.json();   
        const body_Gender = await response_Gender.json();   
        const body_IdentityType = await response_IdentityType.json();   
        const body_BloodGroup = await response_BloodGroup.json();   
        const body_State = await response_State.json();   
        const body_Country = await response_Country.json();   
        const body_Nationality = await response_Nationality.json(); 
        const body_Relation = await response_Relation.json(); 
        const body_MaritalStatus = await response_MaritalStatus.json();   
        const body_Religion = await response_Religion.json();   
        const body_PatientCategory = await response_PatientCategory.json();   
        const body_EmploymentStatus = await response_EmploymentStatus.json();    

        //
        body.PatientRegistration = body_PatientRegistration.result;
        body.Company = body_Company.result;
        body.Gender = body_Gender.result;
        body.IdentityType = body_IdentityType.result;
        body.BloodGroup = body_BloodGroup.result;
        body.State = body_State.result;
        body.Country = body_Country.result;
        body.Nationality = body_Nationality.result;
        body.Relation = body_Relation.result;
        body.MaritalStatus = body_MaritalStatus.result;
        body.Religion = body_Religion.result;
        body.PatientCategory = body_PatientCategory.result;
        body.EmploymentStatus = body_EmploymentStatus.result;
        
        //
        var data1 = JSON.stringify(body);
        res.render('opdPatientRegistration',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//***************************************************
//ipdAdmission
//***************************************************
//Form Load
http.get('/ipdAdmission',  async (req, res) => {
  console.log("opdPatientRegistration", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_PID":0, "IN_PCODE":0, "IN_AID":0, "IN_ACODE":0, "IN_STATUS":0, "IN_TYPE":0};
    const response_PatientRegistration = await fetch('http://localhost:8144/api/GetPatientList', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Company = await fetch('http://localhost:8144/api/GetCompany', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Gender = await fetch('http://localhost:8144/api/GetGender', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_IdentityType = await fetch('http://localhost:8144/api/GetIdentityType', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0,"IN_DEPARTMENT_ID":0};
    const response_BloodGroup = await fetch('http://localhost:8144/api/GetBloodGroup', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_State = await fetch('http://localhost:8144/api/GetState', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Country = await fetch('http://localhost:8144/api/GetCountry', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Nationality = await fetch('http://localhost:8144/api/GetNationality', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Relation = await fetch('http://localhost:8144/api/GetRelation', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_MaritalStatus = await fetch('http://localhost:8144/api/GetMaritalStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Religion = await fetch('http://localhost:8144/api/GetReligion', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
  
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_PatientCategory = await fetch('http://localhost:8144/api/GetPatientCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_EmploymentStatus = await fetch('http://localhost:8144/api/GetEmploymentStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_AdmissionCategory = await fetch('http://localhost:8144/api/GetAdmmissionCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_ServiceCategory = await fetch('http://localhost:8144/api/GetServiceCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_BedCategory = await fetch('http://localhost:8144/api/GetBedCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Ward = await fetch('http://localhost:8144/api/GetWard', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0,"IN_WARD_ID":0,"IN_BED_CATEGORY_ID":0,"IN_BED_STATUS_ID":1 };
    const response_Bed = await fetch('http://localhost:8144/api/GetBed', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CATEGORY_ID":1, "IN_STATUS":0};
    const response_EmployeeByEmpCategory_DR = await fetch('http://localhost:8144/api/GetEmployee', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });



    //
    try {
        const body = await response.json();           
        const body_PatientRegistration= await response_PatientRegistration.json();  
        const body_Company= await response_Company.json();   
        const body_Gender = await response_Gender.json();   
        const body_IdentityType = await response_IdentityType.json();   
        const body_BloodGroup = await response_BloodGroup.json();   
        const body_State = await response_State.json();   
        const body_Country = await response_Country.json();   
        const body_Nationality = await response_Nationality.json(); 
        const body_Relation = await response_Relation.json(); 
        const body_MaritalStatus = await response_MaritalStatus.json();   
        const body_Religion = await response_Religion.json();   
        const body_PatientCategory = await response_PatientCategory.json();   
        const body_EmploymentStatus = await response_EmploymentStatus.json();    
        const body_AdmissionCategory = await response_AdmissionCategory.json();   
        const body_ServiceCategory = await response_ServiceCategory.json();   
        const body_BedCategory  = await response_BedCategory .json();   
        const body_Ward = await response_Ward.json(); 
        const body_Bed = await response_Bed.json();     
        const body_EmployeeByEmpCategory_DR = await response_EmployeeByEmpCategory_DR.json();       

        //
        body.PatientRegistration = body_PatientRegistration.result;
        body.Company = body_Company.result;
        body.Gender = body_Gender.result;
        body.IdentityType = body_IdentityType.result;
        body.BloodGroup = body_BloodGroup.result;
        body.State = body_State.result;
        body.Country = body_Country.result;
        body.Nationality = body_Nationality.result;
        body.Relation = body_Relation.result;
        body.MaritalStatus = body_MaritalStatus.result;
        body.Religion = body_Religion.result;
        body.PatientCategory = body_PatientCategory.result;
        body.EmploymentStatus = body_EmploymentStatus.result;
        body.AdmissionCategory = body_AdmissionCategory.result;
        body.ServiceCategory = body_ServiceCategory.result;
        body.BedCategory  = body_BedCategory .result;
        body.Ward = body_Ward.result;
        body.Bed = body_Bed.result;  
        body.EmployeeByEmpCategory_DR = body_EmployeeByEmpCategory_DR.result;  
        
        //
        var data1 = JSON.stringify(body);
        res.render('ipdAdmission',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//bound data
http.post('/getBedMasterForAdmission', (req, res) => {
  console.log("getBedMasterByID", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetBed";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_STATUS":0,"IN_WARD_ID":req.body.IN_WARD_ID,"IN_BED_CATEGORY_ID":req.body.IN_BED_CATEGORY_ID,"IN_BED_STATUS_ID":req.body.IN_BED_STATUS_ID}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound data
http.post('/getAdmissionPatinetList', (req, res) => {
  console.log("getBedMasterByID", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetPatientList";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_PID":req.body.IN_PID,"IN_PCODE":req.body.IN_PCODE,"IN_AID":req.body.IN_AID,"IN_ACODE":req.body.IN_ACODE,"IN_STATUS":req.body.IN_STATUS,"IN_TYPE":req.body.IN_TYPE,}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//bound Admitted Patient data
http.post('/getAdmissionDetails', (req, res) => {
  console.log("getAdmissionDetails", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetAdmissionDetails";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_CODE":req.body.IN_CODE,"IN_ADMISSION_STATUS_ID":req.body.IN_ADMISSION_STATUS_ID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//Save
http.post('/saveipdAdmission', (req, res) => {
  console.log("saveipdAdmission", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertipdAdmission";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    console.log("saveipdAdmission",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//ipdAdvance
//***************************************************
//Form Load
http.get('/ipdAdvance',  async (req, res) => {
  console.log("ipdAdvance", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_PID":0, "IN_PCODE":0,"IN_AID":0, "IN_ACODE":0, "IN_STATUS":0, "IN_TYPE":"4"};
    const response_Patient = await fetch('http://localhost:8144/api/GetPatientList', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
     
  //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CATEGORY_ID":1, "IN_STATUS":0};
    const response_EmployeeByEmpCategory = await fetch('http://localhost:8144/api/GetEmployee', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
    
    //
    try {
        const body = await response.json();   
        const body_response_Patient = await response_Patient.json();
        const body_EmployeeByEmpCategory = await response_EmployeeByEmpCategory.json();    
        //        
        body.response_Patient = body_response_Patient.result;       
        body.EmployeeByEmpCategory = body_EmployeeByEmpCategory.result;
        //
        
        var data1 = JSON.stringify(body);
        res.render('ipdAdvance',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveipdAdvance', (req, res) => {
  console.log("saveipdAdvance", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertIpdAdvance";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    console.log("saveipdAdvance",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});


//***************************************************
//ipdBill
//***************************************************
//Form Load
http.get('/ipdBill',  async (req, res) => {
  console.log("ipdBill", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
   
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_PID":0, "IN_PCODE":0,"IN_AID":0, "IN_ACODE":0, "IN_STATUS":0, "IN_TYPE":"1"};
    const response_Patient = await fetch('http://localhost:8144/api/GetPatientList', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Company = await fetch('http://localhost:8144/api/GetCompany', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
     
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_ServiceCategory = await fetch('http://localhost:8144/api/GetServiceCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_PAYER_ID":1,"IN_SERVICE_CATEGORY_ID":1,"IN_SERVICE_ID":0};
    const response_ServiceCharge = await fetch('http://localhost:8144/api/GetServiceForBill', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CATEGORY_ID":1, "IN_STATUS":0};
    const response_EmployeeByEmpCategory = await fetch('http://localhost:8144/api/GetEmployee', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0,"IN_WARD_ID":0,"IN_BED_CATEGORY_ID":0,"IN_BED_STATUS_ID":0 };
    const response_Bed = await fetch('http://localhost:8144/api/GetBed', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_IdentityType = await fetch('http://localhost:8144/api/GetIdentityType', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });


    //
    try {
        const body = await response.json();   
        const body_response_Patient = await response_Patient.json();
        const body_response_Company = await response_Company.json();
        const body_ServiceCategory= await response_ServiceCategory.json(); 
        const body_ServiceCharge = await response_ServiceCharge.json();
        const body_EmployeeByEmpCategory = await response_EmployeeByEmpCategory.json();    
        const body_Bed = await response_Bed.json();   
        const body_IdentityType = await response_IdentityType.json();      

        //        
        body.response_Patient = body_response_Patient.result;
        body.response_Company = body_response_Company.result;
        body.ServiceCategory = body_ServiceCategory.result;
        body.ServiceCharge = body_ServiceCharge.result;
        body.EmployeeByEmpCategory = body_EmployeeByEmpCategory.result;
        body.Bed = body_Bed.result;
        body.IdentityType = body_IdentityType.result;
        //
        
        var data1 = JSON.stringify(body);
        res.render('ipdBill',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//bound Only Admitted Patient data
http.post('/getAdmittedPatientDetails', (req, res) => {
  console.log("getAdmittedPatientDetails", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetAdmissionDetails";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_ID":req.body.IN_ID,"IN_CODE":req.body.IN_CODE,"IN_ADMISSION_STATUS_ID":1,"IN_STATUS":1}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//
http.post('/getipdBillServiceCharge', (req, res) => {
  console.log("getipdBillServiceCharge", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetServiceForBill";
  request.post(url, {form:{"IN_USER_ID":req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_PAYER_ID":req.body.IN_PAYER_ID,"IN_SERVICE_CATEGORY_ID":req.body.IN_SERVICE_CATEGORY_ID,"IN_SERVICE_ID":req.body.IN_SERVICE_ID}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//
http.post('/getipdBillSelectedServiceCharg', (req, res) => {
  console.log("getipdBillSelectedServiceCharg", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetServiceChargeDtlBilling";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid,"IN_SERVICE_ID":req.body.IN_SERVICE_ID,"IN_PAYER_ID":req.body.IN_PAYER_ID,"IN_SERVICE_CATEGORY_ID":req.body.IN_SERVICE_CATEGORY_ID,"IN_ID":req.body.IN_ID,"IN_STATUS":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//Save
http.post('/saveIpdBill', (req, res) => {
  console.log("saveIpdBill", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertIpdBill";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    console.log("saveIpdBill",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//ipdBillServiceUpdate
//***************************************************
//Form Load
http.get('/ipdBillServiceUpdate',  async (req, res) => {
  console.log("ipdBillServiceUpdate", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
   
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_PID":0, "IN_PCODE":0,"IN_AID":0, "IN_ACODE":0, "IN_STATUS":0, "IN_TYPE":"1"};
    const response_Admitter_Patient_List = await fetch('http://localhost:8144/api/GetPatientList', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CATEGORY_ID":1, "IN_STATUS":0};
    const response_EmployeeByEmpCategory_Dr = await fetch('http://localhost:8144/api/GetEmployee', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CATEGORY_ID":1, "IN_STATUS":0};
    const response_EmployeeByEmpCategory_Approver = await fetch('http://localhost:8144/api/GetEmployee', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_Admitter_Patient_List  = await response_Admitter_Patient_List .json();   
        const body_EmployeeByEmpCategory_Dr = await response_EmployeeByEmpCategory_Dr.json(); 
        const body_EmployeeByEmpCategory_Approver = await response_EmployeeByEmpCategory_Approver.json();        

        //       
        body.Admitter_Patient_List  = body_Admitter_Patient_List.result;
        body.EmployeeByEmpCategory_Dr = body_EmployeeByEmpCategory_Dr.result;
        body.EmployeeByEmpCategory_Approver = body_EmployeeByEmpCategory_Approver.result;          
        //
        
        var data1 = JSON.stringify(body);
        res.render('ipdBillServiceUpdate',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//
http.post('/getipdBill', (req, res) => {
  console.log("getipdBill", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetIPDBill";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid, "IN_PID":0,"IN_AID":req.body.IN_AID,"IN_BILL_ID":0,"IN_TYPE":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//
http.post('/getipdBillDetails', (req, res) => {
  console.log("getipdBillDetails", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetIPDBill";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid, "IN_PID":0,"IN_AID":0,"IN_BILL_ID":req.body.IN_BILL_ID,"IN_TYPE":1}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//Save
http.post('/updateIPDBillService', (req, res) => {
  console.log("updateIPDBillService", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/UpdateIpdBillService";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    console.log("updateIPDBillService",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//ipdBillUpdate
//***************************************************
//Form Load
http.get('/ipdBillUpdate',  async (req, res) => {
  console.log("ipdBillUpdate", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
   
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_PID":0, "IN_PCODE":0,"IN_AID":0, "IN_ACODE":0, "IN_STATUS":0, "IN_TYPE":"1"};
    const response_Admitter_Patient_List = await fetch('http://localhost:8144/api/GetPatientList', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CATEGORY_ID":1, "IN_STATUS":0};
    const response_EmployeeByEmpCategory_Dr = await fetch('http://localhost:8144/api/GetEmployee', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CATEGORY_ID":1, "IN_STATUS":0};
    const response_EmployeeByEmpCategory_Approver = await fetch('http://localhost:8144/api/GetEmployee', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_Admitter_Patient_List  = await response_Admitter_Patient_List .json();   
        const body_EmployeeByEmpCategory_Dr = await response_EmployeeByEmpCategory_Dr.json(); 
        const body_EmployeeByEmpCategory_Approver = await response_EmployeeByEmpCategory_Approver.json();        

        //       
        body.Admitter_Patient_List  = body_Admitter_Patient_List.result;
        body.EmployeeByEmpCategory_Dr = body_EmployeeByEmpCategory_Dr.result;
        body.EmployeeByEmpCategory_Approver = body_EmployeeByEmpCategory_Approver.result;          
        //
        
        var data1 = JSON.stringify(body);
        res.render('ipdBillUpdate',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/updateIPDBill', (req, res) => {
  console.log("updateIPDBill", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/updateIPDBill";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    console.log("updateIPDBill",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//ipdBillFinal
//***************************************************
//Form Load
http.get('/ipdBillFinal',  async (req, res) => {
  console.log("ipdBillFinal", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
   
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_PID":0, "IN_PCODE":0,"IN_AID":0, "IN_ACODE":0, "IN_STATUS":0, "IN_TYPE":"1"};
    const response_Admitter_Patient_List = await fetch('http://localhost:8144/api/GetPatientList', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CATEGORY_ID":1, "IN_STATUS":0};
    const response_EmployeeByEmpCategory_Dr = await fetch('http://localhost:8144/api/GetEmployee', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CATEGORY_ID":1, "IN_STATUS":0};
    const response_EmployeeByEmpCategory_Approver = await fetch('http://localhost:8144/api/GetEmployee', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    try {
        const body = await response.json();   
        const body_Admitter_Patient_List  = await response_Admitter_Patient_List .json();   
        const body_EmployeeByEmpCategory_Dr = await response_EmployeeByEmpCategory_Dr.json(); 
        const body_EmployeeByEmpCategory_Approver = await response_EmployeeByEmpCategory_Approver.json();        

        //       
        body.Admitter_Patient_List  = body_Admitter_Patient_List.result;
        body.EmployeeByEmpCategory_Dr = body_EmployeeByEmpCategory_Dr.result;
        body.EmployeeByEmpCategory_Approver = body_EmployeeByEmpCategory_Approver.result;          
        //
        
        var data1 = JSON.stringify(body);
        res.render('ipdBillFinal',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//
http.post('/getipdBillFinal', (req, res) => {
  console.log("getipdBillFinal", " - '" + req.session.uname + "'");
  var url = "http://localhost:8144/api/GetIpdBillFinal";
  request.post(url, {form:{"IN_USER_ID":req.session.userid,"IN_BRANCH_ID":req.session.branchid, "IN_AID":req.body.IN_AID,"IN_TYPE":0}, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    if(parsedbody && parsedbody.status) {
      res.send(parsedbody.result);
    }
    else
      res.send({message:0});
  });
});

//Save
http.post('/saveipdBillFinal', (req, res) => {
  console.log("saveipdBillFinal", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertIpdBillFinal";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    console.log("saveipdBillFinal",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//ipdBedTransfer
//***************************************************
//Form Load
http.get('/ipdBedTransfer',  async (req, res) => {
  console.log("ipdBedTransfer", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
   
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_BedCategory = await fetch('http://localhost:8144/api/GetBedCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Ward = await fetch('http://localhost:8144/api/GetWard', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0,"IN_WARD_ID":0,"IN_BED_CATEGORY_ID":0,"IN_BED_STATUS_ID":1 };
    const response_Bed = await fetch('http://localhost:8144/api/GetBed', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });


    //
    try {
        const body = await response.json();   
        const body_BedCategory  = await response_BedCategory .json();   
        const body_Ward = await response_Ward.json(); 
        const body_Bed = await response_Bed.json();  
        

        //       
        body.BedCategory  = body_BedCategory .result;
        body.Ward = body_Ward.result;
        body.Bed = body_Bed.result;          
        //
        
        var data1 = JSON.stringify(body);
        res.render('ipdBedTransfer',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveipdBedTransfer', (req, res) => {
  console.log("saveipdBedTransfer", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertipdBedTransfer";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    console.log("saveipdBedTransfer",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//ipdDrTransfer
//***************************************************
//Form Load
http.get('/ipdDrTransfer',  async (req, res) => {
  console.log("ipdDrTransfer", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
   
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CATEGORY_ID":1, "IN_STATUS":0};
    const response_EmployeeByEmpCategory_DR = await fetch('http://localhost:8144/api/GetEmployee', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });


    //
    try {
        const body = await response.json();   
        const body_EmployeeByEmpCategory_DR = await response_EmployeeByEmpCategory_DR.json();
        
        //       
        body.EmployeeByEmpCategory_DR  = body_EmployeeByEmpCategory_DR .result;        
        //
        
        var data1 = JSON.stringify(body);
        res.render('ipdDrTransfer',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveipdDrTransfer', (req, res) => {
  console.log("saveipdDrTransfer", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertipdDrTransfer";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    console.log("saveipdDrTransfer",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//ipdChangePayer
//***************************************************
//Form Load
http.get('/ipdChangePayer',  async (req, res) => {
  console.log("ipdChangePayer", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
   
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Company = await fetch('http://localhost:8144/api/GetCompany', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });


    //
    try {
        const body = await response.json();   
        const body_Company  = await response_Company .json();         

        //       
        body.Company  = body_Company .result;        
        //
        
        var data1 = JSON.stringify(body);
        res.render('ipdChangePayer',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveipdChangePayer', (req, res) => {
  console.log("saveipdChangePayer", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertipdChangePayer";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    console.log("saveipdChangePayer",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//ipdPatientDischarge
//***************************************************
//Form Load
http.get('/ipdPatientDischarge',  async (req, res) => {
  console.log("ipdPatientDischarge", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
   
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_PID":0, "IN_PCODE":0,"IN_AID":0, "IN_ACODE":0, "IN_STATUS":0, "IN_TYPE":"1"};
    const response_Patient = await fetch('http://localhost:8144/api/GetPatientList', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Company = await fetch('http://localhost:8144/api/GetCompany', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
     
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_ServiceCategory = await fetch('http://localhost:8144/api/GetServiceCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_PAYER_ID":1,"IN_SERVICE_CATEGORY_ID":1,"IN_SERVICE_ID":0};
    const response_ServiceCharge = await fetch('http://localhost:8144/api/GetServiceForBill', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0, "IN_CATEGORY_ID":1, "IN_STATUS":0};
    const response_EmployeeByEmpCategory = await fetch('http://localhost:8144/api/GetEmployee', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0,"IN_WARD_ID":0,"IN_BED_CATEGORY_ID":0,"IN_BED_STATUS_ID":0 };
    const response_Bed = await fetch('http://localhost:8144/api/GetBed', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_IdentityType = await fetch('http://localhost:8144/api/GetIdentityType', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });


    //
    try {
        const body = await response.json();   
        const body_response_Patient = await response_Patient.json();
        const body_response_Company = await response_Company.json();
        const body_ServiceCategory= await response_ServiceCategory.json(); 
        const body_ServiceCharge = await response_ServiceCharge.json();
        const body_EmployeeByEmpCategory = await response_EmployeeByEmpCategory.json();    
        const body_Bed = await response_Bed.json();   
        const body_IdentityType = await response_IdentityType.json();      

        //        
        body.response_Patient = body_response_Patient.result;
        body.response_Company = body_response_Company.result;
        body.ServiceCategory = body_ServiceCategory.result;
        body.ServiceCharge = body_ServiceCharge.result;
        body.EmployeeByEmpCategory = body_EmployeeByEmpCategory.result;
        body.Bed = body_Bed.result;
        body.IdentityType = body_IdentityType.result;
        //
        
        var data1 = JSON.stringify(body);
        res.render('ipdPatientDischarge',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveipdPatientDischarge', (req, res) => {
  console.log("saveipdPatientDischarge", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertipdPatientDischarge";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    console.log("saveipdPatientDischarge",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});

//***************************************************
//ipdNurseStation
//***************************************************
//Form Load
http.get('/ipdNurseStation',  async (req, res) => {
  console.log("ipdNurseStation", " - '" + req.session.uname + " - '" + req.session.branchid +"'");  
  if (req.session.loggedin) {
    let params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid};
    const response = await fetch('http://localhost:8144/api/SysStatus', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });
   
    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_BedCategory = await fetch('http://localhost:8144/api/GetBedCategory', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0};
    const response_Ward = await fetch('http://localhost:8144/api/GetWard', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });

    //
    params = {"IN_USER_ID": req.session.userid, "IN_BRANCH_ID":req.session.branchid,"IN_ID":0,"IN_STATUS":0,"IN_WARD_ID":0,"IN_BED_CATEGORY_ID":0,"IN_BED_STATUS_ID":1 };
    const response_Bed = await fetch('http://localhost:8144/api/GetBed', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(params)
    });


    //
    try {
        const body = await response.json();   
        const body_BedCategory  = await response_BedCategory .json();   
        const body_Ward = await response_Ward.json(); 
        const body_Bed = await response_Bed.json();  
        

        //       
        body.BedCategory  = body_BedCategory .result;
        body.Ward = body_Ward.result;
        body.Bed = body_Bed.result;          
        //
        
        var data1 = JSON.stringify(body);
        res.render('ipdNurseStation',{data1});
    } 
    catch (err) {
      console.log(err)
      throw err;
    }
  } else {
    res.render('login',{layout:false});
    }
});

//Save
http.post('/saveipdNurseStation', (req, res) => {
  console.log("saveipdNurseStation", " - '" + req.session.uname + " - '" + req.session.branchid +"'");
  var url = "http://localhost:8144/api/InsertipdNurseStation";
  req.body.IN_USER_ID = req.session.userid ;
  req.body.IN_BRANCH_ID = req.session.branchid ;
  request.post(url, {form:req.body, headers: headers}, function (error, response, body) {
    var parsedbody = JSON.parse(body);
    console.log("saveipdNurseStation",parsedbody);
    if(parsedbody && parsedbody.status) {
      res.send({message:"Success"});
    }
    else
      res.send({message:0});
  });
});
//***************************************************
//
//***************************************************
//http.listen(5544);
//console.log(`run browse with http://localhost:5544/login`);
// If process.env.PORT is undefined (for now its define as 6422), the server will default to port 8080.
http.listen(process.env.PORT || 8080, () => { 
  console.log('Server is running on port 5544');
  console.log('Browse with http://localhost:5544');
  //console.log('Browse with http://localhost:5544/login');
});
