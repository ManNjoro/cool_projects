<?php

session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = $_SESSION["user_id"];
    $username = $_SESSION["user_username"];
    $about = htmlspecialchars($_POST["about"], ENT_QUOTES, "UTF-8");
    $introTitle = htmlspecialchars($_POST["introtitle"], ENT_QUOTES, "UTF-8");
    $introText = htmlspecialchars($_POST["introtext"], ENT_QUOTES, "UTF-8");
    include "./dbh.inc.php";
    include "../models/ProfileInfoModel.php";
    include "../controllers/ProfileInfoController.php";
    include "../views/ProfileView.php";

    $profileInfo = new ProfileInfoController($id, $username);

    $filename = $_FILES["profile-dp"]["name"];
    $tmp = $_FILES["profile-dp"]["tmp_name"];
    $size = $_FILES["profile-dp"]["size"];
    $error = $_FILES["profile-dp"]["error"];
    $_SESSION["size"] = $size;


    $profileInfo->updateProfileInfo($about, $introTitle, $introText, $filename, $tmp);
    
    // print_r($_FILES);
    header("Location: ../profile.php?error=none");
}
