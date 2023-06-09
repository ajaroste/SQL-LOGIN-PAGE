@echo off
title SQL-LOGİN-PAGE
color a
cls

:a
start https://nodejs.org/dist/v18.16.0/node-v18.16.0-x64.msi
sqlcmd -S EMINE -U sa -P 12 -d master -Q "CREATE DATABASE [LOGINDB];"
sqlcmd -S EMINE -U sa -P 12 -d LOGINDB -Q "CREATE TABLE [LOGIN] (KODU NVARCHAR(50), USERNAME NVARCHAR(50), PASSWORD NVARCHAR(50), EMAIL NVARCHAR(50));"
sqlcmd -S EMINE -U sa -P 12 -d LOGINDB -Q "SELECT * FROM [LOGIN];"

npm install bootstrap@5.3.0
npm install express@4.18.2
npm install msnodesqlv8@4.1.0
npm install mssql@9.1.1
npm install nodemon@2.0.22
npm i 
pause
