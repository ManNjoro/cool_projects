<head>
<link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"
    />
    <link rel="stylesheet" href="./css/styles.css">
</head>
<?php
session_start();
include "./includes/dbh.inc.php";
include "./includes/navbar.php";
include "./models/ProfileInfoModel.php";
include "./controllers/ProfileInfoController.php";
include "./views/ProfileView.php";
$profileInfo = new ProfileInfoView();
?>

<section class="profile">
    <div class="profile-bg pbg">
        <div class="">
            <div class="profile-settings">
                <h3>Profile settings</h3>
                <p>Change your about section here!</p>
                <form action="includes/profileinfo.inc.php" method="post">
                    <textarea name="about" id="" cols="30" rows="10" placeholder="Profile about section..."></textarea>
                    <p>Change your profile page intro here</p>
                    <input type="text" name="introtitle" placeholder="Profile title...">
                    <textarea name="introtext" id="" cols="30" rows="10" placeholder="Profile introduction..."></textarea>
                    <button name="submit">SAVE</button>
                </form>
            </div>
        </div>
    </div>
</section>

<script src="./js/main.js"></script>