<?php
session_start();

$otp = $_POST['otp'];

if ($otp == $_SESSION["OTP"]) {
    $_SESSION["success"] = "Login Successful!";
    header( 'Location: ./verified.php');
} else {
    $_SESSION["error"] = "OTP does not match!";
    header( "Location: ./index.php");
}