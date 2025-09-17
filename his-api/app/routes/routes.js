module.exports = app => {
    const auth = require('../middlewares/jwt-auth');
    var router = require("express").Router();
    const cntl = require("../controllers/controller.js");

    //***************************************************
    //***************************************************
    //Email Service
    router.post("/sendmail", cntl.sendmail);
    //Token
    router.get("/generateToken", cntl.generateToken);
    //api
    app.use('/api', router);

    //***************************************************
    //login
    //***************************************************
    //router.post("/login", cntl.validate);
    router.post("/Login_Get", auth, cntl.Login_Get);

        //***************************************************
    //secUserGroup
    //***************************************************
    router.post("/InsertUserGroup", auth, cntl.InsertUserGroup);  
    router.post("/GetUserGroup", auth, cntl.GetUserGroup); 

    //***************************************************
    //User Permission Check
    //***************************************************
    // Check Permission
    router.post("/GetModule", auth, cntl.GetModule);
    //
    router.post("/GetMenu", auth, cntl.GetMenu);
    //
    router.post("/GetUserModulePermission", auth, cntl.GetUserModulePermission);
    //
    router.post("/GetUserMenuPermission", auth, cntl.GetUserMenuPermission);
    //
    router.post("/GetUserGroupMenuPermission", auth, cntl.GetUserGroupMenuPermission);
    //
    router.post("/UpdateUserGroupPermission", auth, cntl.UpdateUserGroupPermission);

    //***************************************************
    //Dashboard
    //***************************************************
    router.post("/dashboard", auth, cntl.dashboard);  
    //Menu
    router.post("/menu", auth, cntl.menu);

    //***************************************************
    //Reference Data Get
    //***************************************************
    router.post("/SysStatus", auth, cntl.SysStatus); 
    router.post("/GetDepartmentCategory", auth, cntl.GetDepartmentCategory); 
    router.post("/GetSubDepartmentCategory", auth, cntl.GetSubDepartmentCategory); 
    router.post("/GetTariffCategory", auth, cntl.GetTariffCategory); 
    router.post("/GetIdentityType", auth, cntl.GetIdentityType); 
    router.post("/GetGender", auth, cntl.GetGender); 
    router.post("/GetDesignation", auth, cntl.GetDesignation); 
    router.post("/GetJobTitle", auth, cntl.GetJobTitle); 
    router.post("/GetEmploymentCategory", auth, cntl.GetEmploymentCategory); 
    router.post("/GetCategorySpecialization", auth, cntl.GetCategorySpecialization); 
    router.post("/GetEmploymentStatus", auth, cntl.GetEmploymentStatus); 
    router.post("/GetState", auth, cntl.GetState); 
    router.post("/GetCountry", auth, cntl.GetCountry); 
    router.post("/GetNationality", auth, cntl.GetNationality); 
    router.post("/GetReligion", auth, cntl.GetReligion); 
    router.post("/GetBloodGroup", auth, cntl.GetBloodGroup); 
    router.post("/GetRelation", auth, cntl.GetRelation); 
    router.post("/GetPatientCategory", auth, cntl.GetPatientCategory); 
    router.post("/GetMaritalStatus", auth, cntl.GetMaritalStatus); 
    router.post("/GetWardCategory", auth, cntl.GetWardCategory); 
    router.post("/GetAdmmissionCategory", auth, cntl.GetAdmmissionCategory); 
    router.post("/GetTemplateCategory", auth, cntl.GetTemplateCategory);     
    router.post("/GetServiceCategoryDefault", auth, cntl.GetServiceCategoryDefault);        
    //router.post("/", auth, cntl.);         
    //***************************************************
    //Data Get
    //***************************************************
    router.post("/GetPatientList", auth, cntl.GetPatientList); 

    //***************************************************
    //Report Header Get
    //***************************************************
    //
    router.post("/GetRptSysBranch", auth, cntl.GetRptSysBranch); 
    
    //***************************************************
    //refDepartment
    //***************************************************
    router.post("/InsertDepartment", auth, cntl.InsertDepartment);  
    router.post("/GetDepartment", auth, cntl.GetDepartment); 

    //***************************************************
    //refSubDepartment
    //***************************************************
    router.post("/InsertSubDepartment", auth, cntl.InsertSubDepartment);  
    router.post("/GetSubDepartment", auth, cntl.GetSubDepartment); 

    //***************************************************
    //refTariff
    //***************************************************
    router.post("/InsertTariff", auth, cntl.InsertTariff);  
    router.post("/GetTariff", auth, cntl.GetTariff); 

    //***************************************************
    //refEmployee
    //***************************************************
    router.post("/InsertEmployee", auth, cntl.InsertEmployee);  
    router.post("/GetEmployee", auth, cntl.GetEmployee); 

    //***************************************************
    //refDataLoad
    //***************************************************
    router.post("/InsertDataLoad", auth, cntl.InsertDataLoad);  
    router.post("/GetDataLoad", auth, cntl.GetDataLoad); 

    //***************************************************
    //refServiceCategory
    //***************************************************
    router.post("/InsertServiceCategory", auth, cntl.InsertServiceCategory);  
    router.post("/GetServiceCategory", auth, cntl.GetServiceCategory); 

    //***************************************************
    //refPackege
    //***************************************************
    router.post("/InsertPackage", auth, cntl.InsertPackage);  
    router.post("/GetPackage", auth, cntl.GetPackage); 
    router.post("/GetPackageList", auth, cntl.GetPackageList); 
    router.post("/GetServiceForPackage", auth, cntl.GetServiceForPackage); 

    //***************************************************
    //refDefaultServiceSetup
    //***************************************************
    router.post("/InsertDefaultServiceSetup", auth, cntl.InsertDefaultServiceSetup);  
    router.post("/GetDefaultServiceSetup", auth, cntl.GetDefaultServiceSetup); 

    //***************************************************
    //refServiceGroup
    //***************************************************
    router.post("/InsertServiceGroup", auth, cntl.InsertServiceGroup);  
    router.post("/GetServiceGroup", auth, cntl.GetServiceGroup); 

    //***************************************************
    //refCompany
    //***************************************************
    router.post("/InsertCompany", auth, cntl.InsertCompany);  
    router.post("/GetCompany", auth, cntl.GetCompany); 

    //***************************************************
    //refService
    //***************************************************
    router.post("/InsertService", auth, cntl.InsertService);  
    router.post("/GetService", auth, cntl.GetService); 

    //***************************************************
    //refServiceCharge
    //***************************************************
    router.post("/InsertServiceCharge", auth, cntl.InsertServiceCharge);  
    router.post("/GetServiceCharge", auth, cntl.GetServiceCharge); 
    router.post("/GetServiceForBill", auth, cntl.GetServiceForBill); 

    //***************************************************
    //refBedStatus
    //***************************************************
    router.post("/InsertBedStatus", auth, cntl.InsertBedStatus);  
    router.post("/GetBedStatus", auth, cntl.GetBedStatus); 

    //***************************************************
    //refBedCategory
    //***************************************************
    router.post("/InsertBedCategory", auth, cntl.InsertBedCategory);  
    router.post("/GetBedCategory", auth, cntl.GetBedCategory); 

    //***************************************************
    //refWardMaster
    //***************************************************
    router.post("/InsertWard", auth, cntl.InsertWard);  
    router.post("/GetWard", auth, cntl.GetWard); 

    //***************************************************
    //refBedMaster
    //***************************************************
    router.post("/InsertBed", auth, cntl.InsertBed);  
    router.post("/GetBed", auth, cntl.GetBed); 

    //***************************************************
    //refTemplate
    //***************************************************
    router.post("/InsertTemplate", auth, cntl.InsertTemplate);  
    router.post("/GetTemplate", auth, cntl.GetTemplate);     

    //***************************************************
    //opdPatientRegistration
    //***************************************************
    router.post("/InsertPatientRegistration", auth, cntl.InsertPatientRegistration);  
    router.post("/GetPatientRegistration", auth, cntl.GetPatientRegistration); 
    router.post("/GetPatientRegistrationLimit", auth, cntl.GetPatientRegistrationLimit); 

    //***************************************************
    //opdBill
    //***************************************************
    router.post("/InsertOpdBill", auth, cntl.InsertOpdBill);  
    router.post("/GetOpdBill", auth, cntl.GetOpdBill); 
    router.post("/GetServiceChargeDtlBilling", auth, cntl.GetServiceChargeDtlBilling); 
    //
    router.post("/GetRptOpdBill", auth, cntl.GetRptOpdBill); 
     //***************************************************
    //opdBillReport
    //***************************************************
    router.post("/printopdBillReport", auth, cntl.printopdBillReport);  

    //***************************************************
    //ipdAdvance
    //***************************************************
    router.post("/InsertIpdAdvance", auth, cntl.InsertIpdAdvance);
    router.post("/GetIpdAdvance", auth, cntl.GetIpdAdvance);   
    
    //***************************************************
    //ipdAdmission
    //***************************************************
    router.post("/InsertipdAdmission", auth, cntl.InsertipdAdmission);
    router.post("/GetAdmissionDetails", auth, cntl.GetAdmissionDetails);

    //***************************************************
    //IpdBill
    //***************************************************
    router.post("/InsertIpdBill", auth, cntl.InsertIpdBill);
    router.post("/GetIPDBill", auth, cntl.GetIPDBill);   
    
    //***************************************************
    //IpdBillUpdate
    //***************************************************    
    router.post("/UpdateIpdBill", auth, cntl.UpdateIpdBill);
    router.post("/UpdateIpdBillService", auth, cntl.UpdateIpdBillService);

    //***************************************************
    //ipdBillFinal
    //***************************************************
    router.post("/InsertIpdBillFinal", auth, cntl.InsertIpdBillFinal);
    router.post("/GetIpdBillFinal", auth, cntl.GetIpdBillFinal);

    //***************************************************
    //ipdBedTransfer
    //***************************************************
    router.post("/InsertipdBedTransfer", auth, cntl.InsertipdBedTransfer);
    
    //***************************************************
    //ipdDrTransfer
    //***************************************************
    router.post("/InsertipdDrTransfer", auth, cntl.InsertipdDrTransfer);

    //***************************************************
    //ipdChangePayer
    //***************************************************
    router.post("/InsertipdChangePayer", auth, cntl.InsertipdChangePayer); 


    //***************************************************
    //ipdPatientDischarge
    //***************************************************
    router.post("/InsertipdPatientDischarge", auth, cntl.InsertipdPatientDischarge); 
    
    //***************************************************
    //opdPatientVisit
    //***************************************************
    router.post("/InsertopdPatientVisit", auth, cntl.InsertopdPatientVisit); 
    router.post("/PatientRegistrationByOthID", auth, cntl.PatientRegistrationByOthID); 
    router.post("/GetPatientVisit", auth, cntl.GetPatientVisit); 
    router.post("/GetPatientVisitBillID", auth, cntl.GetPatientVisitBillID); 
    
    //***************************************************
    //IpdNurseStation
    //***************************************************
    router.post("/InsertipdNurseStation", auth, cntl.InsertipdNurseStation); 

    //***************************************************
    //
    //***************************************************
    //router.post("/", auth, cntl.);\ 



    //***************************************************
    //
    //***************************************************    

    
};