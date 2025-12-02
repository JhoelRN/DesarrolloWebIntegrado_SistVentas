# Script para ver promociones
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"

Get-Content ver_promociones.sql | & $mysqlPath -u root -proot -h localhost -P 3306 macrosur_ecommerce_db
