<?php 
    $url = 'ckshdphy86qnz0bj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com';
    $username = 'dbq2svbpbogfomkx';
    $password = 'ajv0fg4hksiws6vu';
    $database = 'm4b18q8mcce6qfwc';
    $conn = new mysqli($url, $username, $password, $database);
    
    if($conn->connect_error) {
      echo $error = $conn->connect_error;
    }
?>