--Global

INSERT dbo.SYS_CLIENT (NAME, DESCRIPTION, STATUS, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('CLIENT 1', 'Clent1 Description', 1, 1,GETDATE(), 1, GETDATE()),
('CLIENT 2', 'Clent2 Description', 1, 1,GETDATE(), 1, GETDATE())
GO

INSERT dbo.SYS_BRANCH (CODE, NAME, CLIENT_ID, ADDRESS, EMAIL, PHONE, PHONE2, RPT_TEMPLATE, DESCRIPTION, 
	STATUS, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES
('CB1', 'BRANCH 1', 1, 'Branch1 Address', 'admin@client1.com', '1111111111', '11111', '
                        <h3 style="text-align: center; line-height: 1;"><p style="margin-bottom: 0.0001pt; line-height: 1;"><span style="line-height: 107%; color:#000000; ">True Care
Hospital<o:p></o:p></span></p>
<p class="MsoNormal" align="center" style="margin-bottom: 0.0001pt; line-height: 1;"><span style="font-size: 18px; color:#000000; ">(Keeping you well)</span><o:p></o:p></p><span style="font-size: 18px;">
</span><p class="MsoNormal" align="center" style="margin-bottom: 0.0001pt; line-height: 1;"><span style="font-size: 18px; color:#000000; ">#A-12, Noida, Sector 62, UP</span><o:p></o:p></p><span style="font-size: 18px;">
</span><p class="MsoNormal" align="center" style="margin-bottom: 0.0001pt; line-height: 1;"><span style="font-size: 18px; color:#000000; ">Email: admin@admin.com | Phone: 12345678</span><o:p></o:p></p></h3>', 
'Branch1 Description', 1, 1, GETDATE(), 1, GETDATE()),
('C2B1', 'Client 2 BRANCH 1', 1, 'Branch1_2 Address', 'admin@client1.com', '3333333333', '33333', '
                        <h3 style="text-align: center; line-height: 1;"><p style="margin-bottom: 0.0001pt; line-height: 1;"><span style="line-height: 107%; color:#000000; ">True Care
Hospital<o:p></o:p></span></p>
<p class="MsoNormal" align="center" style="margin-bottom: 0.0001pt; line-height: 1;"><span style="font-size: 18px; color:#000000; ">(Keeping you well)</span><o:p></o:p></p><span style="font-size: 18px;">
</span><p class="MsoNormal" align="center" style="margin-bottom: 0.0001pt; line-height: 1;"><span style="font-size: 18px; color:#000000; ">#A-12, Noida, Sector 62, UP</span><o:p></o:p></p><span style="font-size: 18px;">
</span><p class="MsoNormal" align="center" style="margin-bottom: 0.0001pt; line-height: 1;"><span style="font-size: 18px; color:#000000; ">Email: admin@admin.com | Phone: 12345678</span><o:p></o:p></p></h3>', 
'Branch3 Description', 1, 1, GETDATE(), 1, GETDATE()),
('CB2', 'BRANCH 2', 2, 'Branch2 Address', 'admin@client1.com', '2222222222', '22222', '
                        <h3 style="text-align: center; line-height: 1;"><p style="margin-bottom: 0.0001pt; line-height: 1;"><span style="line-height: 107%; color:#000000; ">True Care
Hospital<o:p></o:p></span></p>
<p class="MsoNormal" align="center" style="margin-bottom: 0.0001pt; line-height: 1;"><span style="font-size: 18px; color:#000000; ">(Keeping you well)</span><o:p></o:p></p><span style="font-size: 18px;">
</span><p class="MsoNormal" align="center" style="margin-bottom: 0.0001pt; line-height: 1;"><span style="font-size: 18px; color:#000000; ">#A-12, Noida, Sector 62, UP</span><o:p></o:p></p><span style="font-size: 18px;">
</span><p class="MsoNormal" align="center" style="margin-bottom: 0.0001pt; line-height: 1;"><span style="font-size: 18px; color:#000000; ">Email: admin@admin.com | Phone: 12345678</span><o:p></o:p></p></h3>', 
'Branch2 Description', 1, 1, GETDATE(), 1, GETDATE())
GO

SET IDENTITY_INSERT [dbo].[REF_STATUS] ON 
GO
INSERT [dbo].[REF_STATUS] ([ID], [CODE], [NAME]) VALUES 
(1, N'A', N'ACTIVE'),
(2, N'D', N'DEACTIVE')
GO
SET IDENTITY_INSERT [dbo].[REF_STATUS] OFF
GO

-- Client


Insert into SYS_MODULE (CODE, NAME, DISPLAY_NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES
('SYS', 'SYSTEM_MANAGEMENT', 'System Management', 'System Management Module', 1, 1, 1, GETDATE(), 1, GETDATE()),
('REF', 'REF_MANAGEMENT', 	 'Master Management', 'Master Management Module', 1, 1, 1, GETDATE(), 1, GETDATE()),
('OPD', 'OPD_MANAGEMENT', 	 'OPD Management', 	  'Opd Management Module', 	  1, 1, 1, GETDATE(), 1, GETDATE()),
('IPD', 'IPD_MANAGEMENT', 	 'IPD Management', 	  'Ipd Management Module', 	  1, 1, 1, GETDATE(), 1, GETDATE()),
('LAB', 'LAB_MANAGEMENT', 	 'LAB Management', 	  'LAB Management Module', 	  1, 1, 1, GETDATE(), 1, GETDATE())

INSERT INTO SYS_MENU
(MODULE_ID, CODE, NAME, PARENT_MENU, MENU_LEVEL, URL, DISPLAY_NAME, PREFIX, SUFFIX, CLASS1, CLASS2, CLASS3, DESCRIPTION, 
STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES
(2, 'DEPARTMENT', 'refDepartment', 1, 1, 'URL', 'D NAME', 'PX', 'SX', 'C1', 'C2', 'C3', 'DESC', 1, 1, 1, GETDATE(), 1, GETDATE()),
(2, 'SUBDEPARTMENT', 'refSubDepartment', 1, 1, 'URL', 'D NAME', 'PX', 'SX', 'C1', 'C2', 'C3', 'DESC', 1, 1, 1, GETDATE(), 1, GETDATE()),
(2, 'EMPLOYEE', 'refEmployee', 1, 1, 'URL', 'D NAME', 'PX', 'SX', 'C1', 'C2', 'C3', 'DESC', 1, 1, 1, GETDATE(), 1, GETDATE()),
(2, 'TARIFF', 'refTariff', 1, 1, 'URL', 'D NAME', 'PX', 'SX', 'C1', 'C2', 'C3', 'DESC', 1, 1, 1, GETDATE(), 1, GETDATE()),
(2, 'COMPANY', 'refCompany', 1, 1, 'URL', 'D NAME', 'PX', 'SX', 'C1', 'C2', 'C3', 'DESC', 1, 1, 1, GETDATE(), 1, GETDATE()),
(2, 'SERVICECATEGORY', 'refServiceCategory', 1, 1, 'URL', 'D NAME', 'PX', 'SX', 'C1', 'C2', 'C3', 'DESC', 1, 1, 1, GETDATE(), 1, GETDATE()),
(2, 'SERVICEGROUP', 'refServiceGroup', 1, 1, 'URL', 'D NAME', 'PX', 'SX', 'C1', 'C2', 'C3', 'DESC', 1, 1, 1, GETDATE(), 1, GETDATE()),
(2, 'BEDSTATUS', 'refBedStatus', 1, 1, 'URL', 'D NAME', 'PX', 'SX', 'C1', 'C2', 'C3', 'DESC', 1, 1, 1, GETDATE(), 1, GETDATE()),
(2, 'BEDCATEGORY', 'refBedCategory', 1, 1, 'URL', 'D NAME', 'PX', 'SX', 'C1', 'C2', 'C3', 'DESC', 1, 1, 1, GETDATE(), 1, GETDATE()),
(2, 'WARD', 'refWardMaster', 1, 1, 'URL', 'D NAME', 'PX', 'SX', 'C1', 'C2', 'C3', 'DESC', 1, 1, 1, GETDATE(), 1, GETDATE()),
(2, 'BED', 'refBedMaster', 1, 1, 'URL', 'D NAME', 'PX', 'SX', 'C1', 'C2', 'C3', 'DESC', 1, 1, 1, GETDATE(), 1, GETDATE())

INSERT dbo.SEC_USER_GROUP (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('ADMIN', 'ADMIN',   'User Admin Group', 1, 1, 1, GETDATE(), 1, GETDATE()),
('OPD',   'OPD BILLING', 'OPD Billing', 1, 1, 1, GETDATE(), 1, GETDATE()),
('IPD',   'IPD BILLING', 'IPD Billing', 1, 1, 1, GETDATE(), 1, GETDATE()),
('NS',   'NURSE STATION', 'Nurse Station', 1, 1, 1, GETDATE(), 1, GETDATE())

INSERT dbo.SEC_USER (LOGIN_ID, PASSWORD, USER_GROUP_ID, EMPLOYEE_ID, STATUS, BRANCH_ID, CREATE_USER, CREATE_DT, UPDATE_USER, UPDATE_DT) VALUES 
('admin', 'admin',   1, 0, 1, 1, 1, GETDATE(), 1, GETDATE()),
('a', 'a',           1, 0, 1, 1, 1, GETDATE(), 1, GETDATE()),
('b', 'b',           2, 0, 1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_WARD_CATEGORY (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('DC1', 'WARD CATEGORY1', 'WARD Category 1', 1, 1, 1, GETDATE(), 1, GETDATE()),
('DC2', 'WARD CATEGORY2', 'WARD Category 2', 1, 1, 1, GETDATE(), 1, GETDATE())


INSERT dbo.REF_SERVICE_CATEGORY (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('N', 'Normal', 'Normal Service',           1, 1, 1, GETDATE(), 1, GETDATE()),
('E', 'Emergency Service', 'E',             1, 1, 1, GETDATE(), 1, GETDATE()),
('N', 'Night', 'Night Service',             1, 1, 1, GETDATE(), 1, GETDATE()),
('S', 'Special Service', 'Special Service', 1, 1, 1, GETDATE(), 1, GETDATE()),
('N2', 'Normal2', 'Normal Service2',        1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_SERVICE_GROUP (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('SOPD', 'OPD Service', 'OPD Service', 1, 1, 1, GETDATE(), 1, GETDATE()),
('SIPD', 'IPD Service', 'IPD Service', 1, 1, 1, GETDATE(), 1, GETDATE()),
('SLAB', 'LAB Service', 'LAB Service', 1, 1, 1, GETDATE(), 1, GETDATE()),
('SU', 'Ultrasound', 'Ultrasound',     1, 1, 1, GETDATE(), 1, GETDATE()),
('SO', 'OPD Service 2', 'OPD Service', 1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_STATE (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('S1', 'State 1', 'State Name 1', 1, 1, 1, GETDATE(), 1, GETDATE()),
('S2', 'State 2', 'State Name 2', 1, 1, 1, GETDATE(), 1, GETDATE()),
('ST', 'State T', 'State Name T', 1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_GENDER (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('M', 'Male', 'Male',     1, 1, 1, GETDATE(), 1, GETDATE()),
('F', 'Female', 'Female', 1, 1, 1, GETDATE(), 1, GETDATE()),
('O', 'Other', 'Other',   1, 1, 1, GETDATE(), 1, GETDATE()),
('MM', 'MMale', 'MMale',  1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_IDENTITY_TYPE (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('UID', 'Aadhar', 'Aadhar ID', 1, 1, 1, GETDATE(), 1, GETDATE()),
('PAN', 'PAN', 'PAN ID',       1, 1, 1, GETDATE(), 1, GETDATE()),
('DL', 'DL', 'DL',             1, 1, 1, GETDATE(), 1, GETDATE()),
('AD', 'Aadhar Only', 'Aadhar',1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_JOB_TITLE (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('JT1', 'Job Title 1', 'Job Title Description1', 1, 1, 1, GETDATE(), 1, GETDATE()),
('JT2', 'Job Title 2', 'Job Title Description2', 1, 1, 1, GETDATE(), 1, GETDATE()),
('Title1', 'Job T  1', 'Job Title Desc 1',       1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_MARITAL_STATUS (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('S', 'Single', 'Single',     1, 1, 1, GETDATE(), 1, GETDATE()),
('M', 'Married ', 'Married ', 1, 1, 1, GETDATE(), 1, GETDATE()),
('O', 'Other', 'Other',       1, 1, 1, GETDATE(), 1, GETDATE()),
('S2', 'Single1', 'Single1',  1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_PATIENT_CATEGORY (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('P1', 'Patient Category 1', 'Patient Category 1', 1, 1, 1, GETDATE(), 1, GETDATE()),
('P2', 'Patient Category 2', 'Patient Category 2', 1, 1, 1, GETDATE(), 1, GETDATE()),
('PC', 'Patient Category A', 'Patient Category A', 1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_RELATION (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('Husband', 'Husband', 'Husband', 1, 1, 1, GETDATE(), 1, GETDATE()),
('Wife', 'Wife', 'Wife',          1, 1, 1, GETDATE(), 1, GETDATE()),
('Father', 'Father', 'Father',    1, 1, 1, GETDATE(), 1, GETDATE()),
('Mother', 'Mother', 'Mother',    1, 1, 1, GETDATE(), 1, GETDATE()),
('Brother', 'Brother', 'Brother', 1, 1, 1, GETDATE(), 1, GETDATE()),
('Sister', 'Sister', 'Sister',    1, 1, 1, GETDATE(), 1, GETDATE()),
('Son', 'Son', 'Son',             1, 1, 1, GETDATE(), 1, GETDATE()),
('Daughter','Daughter','Daughter',1, 1, 1, GETDATE(), 1, GETDATE()),
('Grandfather', 'Grandfather','', 1, 1, 1, GETDATE(), 1, GETDATE()),
('Grandmother', 'Grandmother','', 1, 1, 1, GETDATE(), 1, GETDATE()),
('Uncle', 'Uncle', 'Uncle',       1, 1, 1, GETDATE(), 1, GETDATE()),
('Aunt', 'Aunt', 'Aunt',          1, 1, 1, GETDATE(), 1, GETDATE()),
('Friend', 'Friend', 'Friend',    1, 1, 1, GETDATE(), 1, GETDATE()),
('Self', 'Self', 'Self',          1, 1, 1, GETDATE(), 1, GETDATE()),
('Self 2', 'Self2', 'SF',         1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_RELIGION (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('R1', 'RELIGION 1', 'RELIGION Name 1', 1, 1, 1, GETDATE(), 1, GETDATE()),
('R2', 'RELIGION 2', 'RELIGION Name 2', 1, 1, 1, GETDATE(), 1, GETDATE()),
('R3', 'RELIGION 3', 'RELIGION Name 3', 1, 1, 1, GETDATE(), 1, GETDATE()),
('R4', 'RELIGION 4', 'RELIGION Name 4', 1, 1, 1, GETDATE(), 1, GETDATE()),
('RA1', 'REG 1'    , 'RELIGION Name 1', 1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT [dbo].REF_ADMISSION_CATEGORY (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('AN', 'Normal', 'Normal Category',    1, 1, 1, GETDATE(), 1, GETDATE()),
('AV', 'VIP',    'VIP Category'   ,    1, 1, 1, GETDATE(), 1, GETDATE()),
('AN2', 'Normal2', 'Normal Category2', 1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_ADMISSION_STATUS (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('A', 'Admitted', 'Admitted Status',      1, 1, 1, GETDATE(), 1, GETDATE()),
('D', 'Discharge', 'Discharge Status',    1, 1, 1, GETDATE(), 1, GETDATE()),
('ICU', 'ICU Bed', 'ICU Bed',             1, 1, 1, GETDATE(), 1, GETDATE()),
('A2', 'Admitted 2', 'Admitted Status',   1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_BED_STATUS (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('V', 'VACANT', 'VACANT Status',     1, 1, 1, GETDATE(), 1, GETDATE()),
('O', 'OCCUPIED', 'OCCUPIED Status', 1, 1, 1, GETDATE(), 1, GETDATE()),
('B', 'BLOCKED', 'BLOCKED Status',   1, 1, 1, GETDATE(), 1, GETDATE()),
('R', 'REPAIR', 'REPAIR Status',     1, 1, 1, GETDATE(), 1, GETDATE()),
('V', 'VACANT 2', 'VACANT Status',   1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_BLOOD_GROUP (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('A+',  'A RhD positive',  'A RhD positive',       1, 1, 1, GETDATE(), 1, GETDATE()),
('A-',  'A RhD negative',  'A RhD negative',       1, 1, 1, GETDATE(), 1, GETDATE()),
('B+',  'B RhD positive',  'B RhD positive',       1, 1, 1, GETDATE(), 1, GETDATE()),
('B-',  'B RhD negative',  'B RhD negative',       1, 1, 1, GETDATE(), 1, GETDATE()),
('O+',  'O RhD positive',  'O RhD positive',       1, 1, 1, GETDATE(), 1, GETDATE()),
('O-',  'O RhD negative',  'O RhD negative',       1, 1, 1, GETDATE(), 1, GETDATE()),
('AB+', 'AB RhD positive', 'AB RhD positive',      1, 1, 1, GETDATE(), 1, GETDATE()),
('AB-', 'AB RhD negative', 'AB RhD negative',      1, 1, 1, GETDATE(), 1, GETDATE()),
('A+ 2',  'A RhD positive B2',  'A RhD positive',  1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_COUNTRY (CODE, NAME, NATIONALITY, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('C1', 'Country 1', 'Citizenship1', 'Country Name 1', 1, 1, 1, GETDATE(), 1, GETDATE()),
('C1', 'Country 2', 'Citizenship2', 'Country Name 2', 1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_DESIGNATION (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('D1', 'DESIGNATION 1', 'DESIGNATION 1', 1, 1, 1, GETDATE(), 1, GETDATE()),
('D2', 'DESIGNATION 2', 'DESIGNATION 2', 1, 1, 1, GETDATE(), 1, GETDATE()),
('D3', 'DESIGNATION 3', 'DESIGNATION 3', 1, 1, 1, GETDATE(), 1, GETDATE()),
('D4', 'DESIGNATION 4', 'DESIGNATION 4', 1, 1, 1, GETDATE(), 1, GETDATE()),
('DG1', 'DESIG DC1',    'DG 1'         , 1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_EMPLOYMENT_STATUS (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('FT', 'FULL TIME', 'Full Time Employment', 1, 1, 1, GETDATE(), 1, GETDATE()),
('PT', 'PART TIME', 'Part Time Employment', 1, 1, 1, GETDATE(), 1, GETDATE()),
('T', 'Time TIME', 'Time  Time Employment', 1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_EMPLOYMENT_CATEGORY (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('DR', 'Doctor', 'Doctor Category',                     1, 1, 1, GETDATE(), 1, GETDATE()),
('EC2', 'EMPLOYMENT_CATEGORY2', 'EMPLOYMENT_CATEGORY2', 1, 1, 1, GETDATE(), 1, GETDATE()),
('EC3', 'EMPLOYMENT_CATEGORY3', 'EMPLOYMENT_CATEGORY3', 1, 1, 1, GETDATE(), 1, GETDATE()),
('EC4', 'EMPLOYMENT_CATEGORY4', 'EMPLOYMENT_CATEGORY4', 1, 1, 1, GETDATE(), 1, GETDATE()),
('CE1', 'CATEGORY5EMPLOYMENT_C','EMPLOYMENT_CATEGORY1', 1, 2, 1, GETDATE(), 1, GETDATE()) 
GO

INSERT dbo.REF_EMPLOYMENT_CATEGORY_SPECIALIZATION (EMPLOYMENT_CATEGORY_ID, CODE, NAME, DESCRIPTION, 
	STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
(1, 'S1', 'SPECIALIZATION1', 'SPECIALIZATION 1', 1, 1, 1, GETDATE(), 1, GETDATE()),
(2, 'S2', 'SPECIALIZATION2', 'SPECIALIZATION 2', 1, 1, 1, GETDATE(), 1, GETDATE()),
(1, 'S3', 'SPECIALIZATION3', 'SPECIALIZATION 3', 1, 1, 1, GETDATE(), 1, GETDATE()),
(3, 'S4', 'SPECIALIZATION4', 'SPECIALIZATION 4', 1, 1, 1, GETDATE(), 1, GETDATE()),
(5, 'P1', 'SPECIALIZATION1', 'SPECIALIZATION 1', 1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_DEPARTMENT_CATEGORY (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('DC1', 'DEPARTMENT CATEGORY1', 'Department Category 1', 1, 1, 1, GETDATE(), 1, GETDATE()),
('DC2', 'DEPARTMENT CATEGORY2', 'Department Category 2', 1, 1, 1, GETDATE(), 1, GETDATE()),
('DC1_2', 'CLIENT2 CATEGORY12', 'Department Category12', 1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.SYS_MESSAGE (NAME, TYPE, MSG, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('SP_SEC_LOGIN_GET', 1, 'Success', 'Success Message',                         1, 1, 1, GETDATE(), 1, GETDATE()),
('SP_SEC_LOGIN_GET', 2, 'Error Message, Connect with Admin', 'Error Message', 1, 1, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.SYS_PARAMETER (TYPE, SUB_TYPE, CODE, NAME, VALUE1, VALUE2, VALUE3, DESCRIPTION, 
STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('SYS', 'SYS', 'INSERT_MESSAGE', 'SP_INSERT_MESSAGE', 'INSERTED RECORD SUCCESSFULLY', 
	NULL, NULL, 'SQL default procedure Message after Insert Record', 1, 1, 1, GETDATE(), 1, GETDATE()),
('SYS', 'SYS', 'UPDATE_MESSAGE', 'SP UPDATE MESSAGE', 'UPDATED RECORD SUCCESSFULLY', 
	NULL, NULL, 'SQL default procedure Message after Update Record', 1, 1, 1, GETDATE(), 1, GETDATE()),
('OPD', 'REGISTRATION', 'REGISTRATION_PREFIX', 'PATIENT REGISTRATION PREFIX', 'PR', 
	NULL, NULL, 'Patient Registration Prefix', 1, 1, 1, GETDATE(), 1, GETDATE()),
('OPD', 'OPDBILL', 'OPD_BILL', 'OPD BILL PREFIX', 'OP', 
	NULL, NULL, 'OPD Bill Prefix', 1, 1, 1, GETDATE(), 1, GETDATE()),
('IPD', 'IPDBILL', 'IPD_BILL', 'IPD BILL PREFIX', 'IP', 
	NULL, NULL, 'IPD Bill Prefix', 1, 1, 1, GETDATE(), 1, GETDATE()),
('IPD', 'ADMISSION', 'PATIENT_ADMISSION', 'IPD PATIENT ADMISSION PREFIX', 'IPA', 
	NULL, NULL, 'IPD Admission Prefix', 1, 1, 1, GETDATE(), 1, GETDATE()),
('OPD', 'PRESCRIPTION_BOOKING', 'PRESCRIPTION_BOOKING', 'PRESCRIPTION_BOOKING', 'PR', 
	NULL, NULL, 'Dr Prescription Booking', 1, 1, 1, GETDATE(), 1, GETDATE()),
('SYS', 'SYS', 'DATETIME_FORMAT_UI', 'DATETIME_FORMAT', 'dd-MM-yyyy HH:MM tt', 
	NULL, NULL, 'Date Time Format', 1, 1, 1, GETDATE(), 1, GETDATE()),
('IPD', 'IPDBILLFINAL', 'IPDBILLFINAL', 'IPD BILL FINAL PREFIX', 'IP-INV-', 
	NULL, NULL, 'IPD Bill Prefix', 1, 1, 1, GETDATE(), 1, GETDATE()),
('OPD', 'PATIENTADVANCE', 'PATIENTADVANCE', 'PATIENT ADVANCE PREFIX', 'ADV-B-', 
	NULL, NULL, 'Advance Bill Prefix', 1, 1, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.SYS_PARAMETER_YEAR (TYPE, SUB_TYPE, CODE, NAME, FROM_DT, TO_DT, VALUE1, VALUE2, VALUE3, DESCRIPTION, 
STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('SYS', 'SYS', '2022', '2022', '2022-01-01', '2022-12-31', NULL, NULL, NULL, 'Year 2022', 1, 1, 1, GETDATE(), 1, GETDATE()),
('SYS', 'SYS', '2022', '2023', '2023-01-01', '2023-12-31', NULL, NULL, NULL, 'Year 2023', 1, 1, 1, GETDATE(), 1, GETDATE())



INSERT dbo.REF_TEMPLATE_CATEGORY (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES
('ADM', 'ADMISSION NOTES', 'ADMISSION NOTES',      1, 1, 1, GETDATE(), 1, GETDATE()),
('DSR', 'DISCHARGE SUMMARY', 'DISCHARGE SUMMARY`', 1, 1, 1, GETDATE(), 1, GETDATE()),
('DVI', 'DOCTOR VISTI IPD', 'DOCTOR VISTI IPD',    1, 1, 1, GETDATE(), 1, GETDATE()),
('NVI', 'NURSE VISTI IPD', 'DOCTOR VISTI IPD',     1, 1, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_SUB_DEPARTMENT_CATEGORY (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('SDC1', 'SUB DEPARTMENT CATEGORY', 'Sub Department Category 1', 1, 1, 1, GETDATE(), 1, GETDATE()),
('SDC2', 'SUB DEPARTMENT CATEGORY', 'Sub Department Category 2', 1, 1, 1, GETDATE(), 1, GETDATE()),
('SD1', 'SUB DDC', 'Sub Department Category 3',                  1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_TARIFF_CATEGORY (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
( 'TC1', 'TARIFF CATEGORY1', 'TARIFF Category 1', 1, 1, 1, GETDATE(), 1, GETDATE()),
( 'TT1', 'TARIFF CATEGORY1', 'TARIFF Category 2', 1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_TARIFF (CODE, NAME, TARIFF_CATEGORY_ID, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('CS', 'Cash', 1, 'Cash Tariff for Default', 1, 1, 1, GETDATE(), 1, GETDATE()),
('IH', 'InHouse', 2, 'InHouse Members',      1, 1, 1, GETDATE(), 1, GETDATE()),
('CS', 'Cash', 1, 'Cash Tariff for Default', 1, 1, 2, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_DEPARTMENT (CODE, NAME, DEPARTMENT_CATEGORY_ID, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('OPD', 'OPD', 1, 'OPD Department',       1, 1, 1, GETDATE(), 1, GETDATE()),
('IP', 'IPD',  1, 'IPD Department',       1, 1, 1, GETDATE(), 1, GETDATE()),
('LB', 'LAB',  2, 'Lab Department',       1, 1, 1, GETDATE(), 1, GETDATE()),
('DT1', 'DPT TempA1', 3, 'Temp Dept',     1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_SUB_DEPARTMENT 
(DEPARTMENT_ID, CODE, NAME, SUB_DEPARTMENT_CATEGORY_ID, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
(1, 'OS1', 'OPD S1', 1, 'OPD S1 Desc', 1, 1, 1, GETDATE(), 1, GETDATE()),
(1, 'OS2', 'OPD S2', 2, 'OPD S2 Desc', 1, 1, 1, GETDATE(), 1, GETDATE()),
(2, 'IS', 'IPD S1', 1, 'IPD S1 Desc',  1, 1, 1, GETDATE(), 1, GETDATE()),
(2, 'IS2', 'IPD S2', 2, 'IPD S2 desc', 1, 1, 1, GETDATE(), 1, GETDATE()),
(3, 'LS1', 'LAB S1', 1, 'LS Desc',     1, 1, 1, GETDATE(), 1, GETDATE()),
(3, 'LS2', 'LAB S2', 1, 'LS Desc',     1, 1, 1, GETDATE(), 1, GETDATE()),
(4, 'SDP', 'SDP', 3, 'Sdp2',           1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_BED_CATEGORY (CODE, NAME, SERVICE_ID, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('PV',  'Private',   2, 'Disc',  1, 1, 1, GETDATE(), 1, GETDATE()),
--('PV2', 'Private2',  2, 'Disc2', 1, 1, 1, GETDATE(), 1, GETDATE()),
('ICU', 'ICY Bed',   2, '',      1, 1, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_BED (CODE, NAME, BED_CATEGORY_ID, WARD_ID, BED_STATUS_ID, INCLUDE_OCCUPENCY, PHONE, PHONE2, DESCRIPTION, 
	STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('B1', 'B1', 1, 1, 2, 0, '1111111111', '123456781', 'B1 desc', 1, 1, 1, GETDATE(), 1, GETDATE()),
('B2', 'B2', 1, 1, 2, 0, '1111111111', '123456782', 'B2 desc', 1, 1, 1, GETDATE(), 1, GETDATE()),
('B3', 'B3', 1, 1, 2, 0, '1111111111', '123456783', 'B3 desc', 1, 1, 1, GETDATE(), 1, GETDATE()),
('B4', 'B4', 1, 1, 2, 0, '1111111111', '123456784', 'B4 desc', 1, 1, 1, GETDATE(), 1, GETDATE()),
('B5', 'B5', 1, 1, 2, 0, '1111111111', '123456785', 'B5 desc', 1, 1, 1, GETDATE(), 1, GETDATE()),
('B6', 'B6', 1, 1, 2, 0, '1111111111', '123456786', 'B6 desc', 1, 1, 1, GETDATE(), 1, GETDATE()),
('B7', 'B7', 1, 1, 2, 0, '1111111111', '123456787', 'B7 desc', 1, 1, 1, GETDATE(), 1, GETDATE()),
('B8', 'B8', 1, 1, 2, 0, '1111111111', '123456788', 'B8 desc', 1, 1, 1, GETDATE(), 1, GETDATE()),
('B9', 'B9', 1, 1, 2, 0, '1111111111', '123456789', 'B9 desc', 1, 1, 1, GETDATE(), 1, GETDATE()),
('C1', 'C1', 1, 1, 2, 0, '1111111111', '123456799', 'C1 desc', 1, 2, 1, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_COMPANY (CODE, NAME, TARIFF_ID, APPROVAL_REQUIRED, ADDRESS, MOBILE, EMAIL, FAX, WEBSITE, 
	CONTACT_NAME1, DESIGNATION1, MOBILE1, EMAIL1, CONTACT_NAME2, DESIGNATION2, MOBILE2, EMAIL2, DESCRIPTION, 
	STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('C1', 'CASH', 1, 1, 'Cash Company Address', '111111111111', '1@cash.com', '222222222222', 'www.cashcompany.com', 'Contact Name 1', 'RM', '12345678', 'rm@cash.com', 'Contact Name 2', 'PM', '', 'pm@cash.com', 'Desc  Cash', 1, 1, 2, GETDATE(), 1, GETDATE()),
('TC1', 'TPA Company', 3, 1, 'Tpa Company Address', 'TPA', 'email@tpacomp.com', '12345678', 'tpacomp.com', 'Name 1', 'Desig 1', '11111111111', 'NAME1@TPA.COM', 'NAME 2', 'dESIG 2', '222222222', 'NAME2@TPA.COM', 'TPA Company', 1, 1, 2, GETDATE(), 1, GETDATE()),
('IH', 'Inhouse Company', 2, 0, 'Address Inhouse Mob Phine Location', '5555555555', 'in@hans,com', '8888888888', 'hans,com', 'C1 Name', 'Desig', '99999', 'mail@amsn.com', 'C2 Name', 'Design 2', '888888888866', '234567hans,com', 'Desig TPA Details', 1, 1, 2, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_EMPLOYEE (CODE, NAME, IDENTITY_TYPE_ID, UID, GENDER_ID, DOB, DESIGNATION_ID, DEPARTMENT_ID, JOB_TITLE_ID, MANAGER_ID, 
EMPLOYMENT_CATEGORY_ID, SPECIALIZATION_ID, EMPLOYMENT_STATUS_ID, DOJ, MOBILE, MOBILE2, EMAIL, EMAIL2, C_ADDRESS, C_CITY, C_STATE_ID, 
C_COUNTRY_ID, C_PIN, P_ADDRESS, P_CITY, P_STATE_ID, P_COUNTRY_ID, P_PIN, NATIONALITY_ID, RELIGION_ID, F_NAME, F_MOBILE, F_EMAIL, 
M_NAME, M_MOBILE, M_EMAIL, S_NAME, S_MOBILE, S_EMAIL, G_NAME, G_MOBILE, G_EMAIL, DESCRIPTION, 
STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('A001', 'A001 | Admin User', 0, '1111111111', 0, GETDATE(), 0, 0, 0, 0, 1, 0, 0, GETDATE(), '1212121212', '', 'Jai@sri.com', '', 
'C1', 'CT', 1, 2, '87543', 'C2', 'RR', 1, 1, '24', 2, 0, 'N', '', 'E1', 'MN', '', 'e2', 'SN', '', '', 'GN', '', '', '', 1, 0, 2, 
GETDATE(), 2, GETDATE())
GO

/*
INSERT dbo.REF_SERVICE (DEPARTMENT_ID, SUB_DEPARTMENT_ID, CODE, NAME, SERVICE_GROUP_ID, BILLING_MESSAGE, SHOW_MESSAGE, DR_REQUIRED, DR_ID, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
(1, 1, 'OPS1', 'Service 1', 1, '', 1, 1, 1, '', 1, 1, 1, GETDATE(), 1, GETDATE())
GO
*/



INSERT dbo.REF_TEMPLATE (CODE, NAME, TEMPLATE_CATEGORY_ID, TEMPLATE, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('DC1', 'Default Template', 2, '<p>aSASD</p><p>ASD</p><p>AS</p><p>DA</p><p>SD</p><p>ASD</p><p>AS</p><p>D</p><p>AS</p>', 'DF Description', 1, 0, 2, GETDATE(), 1, GETDATE()),
('DC2', 'Def Temp 2', 1, '<h2 style="margin-top: 30px; margin-bottom: 30px; padding: 0px; font-size: 40px; color: rgb(17, 17, 17); font-family: Raleway, sans-serif; font-weight: 600;"><strong style="font-weight: bold; line-height: 1;">Demographics</strong><span class="ez-toc-section-end"></span></h2><h3 style="margin-top: 40px; margin-bottom: 30px; padding: 0px; font-size: 25px; font-family: Raleway, sans-serif; font-weight: 600; text-decoration-line: underline; color: rgb(25, 53, 82) !important;"><strong style="font-weight: bold; line-height: 1;">Patient details</strong></h3><p style="margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; color: rgb(68, 68, 68); font-family: &quot;Work Sans&quot;, sans-serif; font-size: 15px;">Important information to include regarding the patient <span style="background-color: rgb(255, 255, 0);">includes</span>:</p><ul style="margin-right: 0px; margin-bottom: 1em; margin-left: 1em; padding: 0px; list-style-position: initial; list-style-image: initial; color: rgb(68, 68, 68); font-family: &quot;Work Sans&quot;, sans-serif; font-size: 15px;"><li><strong style="font-weight: bold; line-height: 1;">Patient name:&nbsp;</strong>full name of the patient (also the patient’s preferred name if relevant)</li><li><strong style="font-weight: bold; line-height: 1;">Date of birth</strong></li><li><strong style="font-weight: bold; line-height: 1;">Unique identification number</strong></li><li><strong style="font-weight: bold; line-height: 1;">Patient address:&nbsp;</strong>the usual place of residence of the patient</li><li><strong style="font-weight: bold; line-height: 1;">Patient telephone number</strong></li><li><strong style="font-weight: bold; line-height: 1;">Patient sex:&nbsp;</strong>sex at birth (this determines how the individual will be treated clinically)</li><li><strong style="font-weight: bold; line-height: 1;">Gender:</strong>&nbsp;the gender the patient identifies with</li><li><strong style="font-weight: bold; line-height: 1;">Ethnicity:</strong>&nbsp;ethnicity as specified by the patient</li><li><strong style="font-weight: bold; line-height: 1;">Next of kin/emergency contact:</strong>&nbsp;full name, relationship to the patient and contact details</li></ul><h3 style="margin-top: 40px; margin-bottom: 30px; padding: 0px; font-size: 25px; font-family: Raleway, sans-serif; font-weight: 600; text-decoration-line: underline; color: rgb(25, 53, 82) !important;">GP details</h3><p style="margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; color: rgb(68, 68, 68); font-family: &quot;Work Sans&quot;, sans-serif; font-size: 15px;">This section should be completed with the details of the&nbsp;<strong style="font-weight: bold; line-height: 1;">General</strong>&nbsp;<strong style="font-weight: bold; line-height: 1;">Practitioner</strong>&nbsp;with whom the patient is registered:</p><ul style="margin-right: 0px; margin-bottom: 1em; margin-left: 1em; padding: 0px; list-style-position: initial; list-style-image: initial; color: rgb(68, 68, 68); font-family: &quot;Work Sans&quot;, sans-serif; font-size: 15px;"><li><strong style="font-weight: bold; line-height: 1;">GP name:</strong>&nbsp;the patient’s usual GP</li><li><strong style="font-weight: bold; line-height: 1;">GP practice details:&nbsp;</strong>name, address, email, telephone number and fax of the patient’s registered GP practice</li><li><strong style="font-weight: bold; line-height: 1;">GP practice identifier:&nbsp;</strong>a national code which identifies the practice</li></ul><h3 style="margin-top: 40px; margin-bottom: 30px; padding: 0px; font-size: 25px; font-family: Raleway, sans-serif; font-weight: 600; text-decoration-line: underline; color: rgb(25, 53, 82) !important;"><strong style="font-weight: bold; line-height: 1;">Hospital details&nbsp;</strong></h3><p style="margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; color: rgb(68, 68, 68); font-family: &quot;Work Sans&quot;, sans-serif; font-size: 15px;">This section should encompass the&nbsp;<strong style="font-weight: bold; line-height: 1;">salient aspects</strong>&nbsp;of the&nbsp;<strong style="font-weight: bold; line-height: 1;">patient’s</strong>&nbsp;<strong style="font-weight: bold; line-height: 1;">discharge</strong>:</p><ul style="margin-right: 0px; margin-bottom: 1em; margin-left: 1em; padding: 0px; list-style-position: initial; list-style-image: initial; color: rgb(68, 68, 68); font-family: &quot;Work Sans&quot;, sans-serif; font-size: 15px;"><li><strong style="font-weight: bold; line-height: 1;">Discharging consultant:</strong>&nbsp;the consultant responsible for the patient at the time of discharge</li><li><strong style="font-weight: bold; line-height: 1;">Discharging specialty/department:</strong>&nbsp;the specialty/department responsible for the patient at the time of discharge</li><li><strong style="font-weight: bold; line-height: 1;">Date and time of admission and discharge</strong></li><li><strong style="font-weight: bold; line-height: 1;">Discharge destination:</strong>&nbsp;destination of the patient on discharge from hospital (e.g. home, residential care home)</li></ul>', 'Def 2', 1, 0, 1, GETDATE(), 1, GETDATE()),
('DC3', 'Report Header', 1, '
                        <h3 style="text-align: center; line-height: 1;"><p style="margin-bottom: 0.0001pt; line-height: 1;"><span style="line-height: 107%; color:#000000; ">True Care
Hospital<o:p></o:p></span></p>

<p class="MsoNormal" align="center" style="margin-bottom: 0.0001pt; line-height: 1;"><span style="font-size: 18px; color:#000000; ">(Keeping you well)</span><o:p></o:p></p><span style="font-size: 18px;">

</span><p class="MsoNormal" align="center" style="margin-bottom: 0.0001pt; line-height: 1;"><span style="font-size: 18px; color:#000000; ">#A-12, Noida, Sector 62, UP</span><o:p></o:p></p><span style="font-size: 18px;">

</span><p class="MsoNormal" align="center" style="margin-bottom: 0.0001pt; line-height: 1;"><span style="font-size: 18px; color:#000000; ">Email: admin@admin.com | Phone: 12345678</span><o:p></o:p></p></h3>
                    ', '', 1, 0, 2, GETDATE(), 1, GETDATE())
GO


INSERT dbo.REF_WARD 
(CODE, NAME, WARD_CATEGORY_ID, WARD_INCHARGE, PHONE, PHONE2, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('W1', 'W1', 2, 'asdf', '1234', '5632', 'Desc', 1, 1, 1, GETDATE(), 1, GETDATE()),
('SW', 'Ward Spl', 1, 'W i n', '5555', '44444444', 'SW desc', 1, 1, 2, GETDATE(), 1, GETDATE())
GO

INSERT dbo.REF_IPD_BILL_STATUS (CODE, NAME, DESCRIPTION, STATUS, BRANCH_ID, CREATED_BY, CREATED_DT, UPDATED_BY, UPDATED_DT) VALUES 
('IPB', 'IPD Bill',       'Ready For IPD Bill after adminssion',	1, 1, 1, GETDATE(), 1, GETDATE()),
('IPF', 'IPD Final Bill', 'Ready for Final Bill after IPD Bill',	1, 1, 1, GETDATE(), 1, GETDATE()),
('IPI', 'IPD Invoice',    'Ready For Invoice after Final Bill',		1, 1, 1, GETDATE(), 1, GETDATE()),
('IPC', 'IPD Complete',   'Ready For Discharge after IPD Invoice',	1, 1, 1, GETDATE(), 1, GETDATE())
GO

