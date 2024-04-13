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
    <div class="profile-bg">
        <div class="wrapper">
            <div class="profile-info">
                <div class="profile-info-img">
                    <img src="./images/<?php echo $_SESSION["dp"]; ?>" alt="profilepic">
                    <p>
                    <?php
                            echo $_SESSION["user_username"];
                            echo $_SESSION["size"];
                         ?>
                    </p>
                    <a href="profilesettings.php" class="follow-btn">Profile Settings</a>
                </div>
                <div class="profile-info-about">
                    <h3>About</h3>
                    <p>
                        <?php
                        $profileInfo->fetchAbout($_SESSION["user_id"]);
                        ?>
                    </p>
                    <h3>Followers</h3>
                    <h3>Following</h3>
                </div>
            </div>
            <div class="profile-content">
                <div class="profile-intro">
                    <h3>
                        <?php
                            $profileInfo->fetchTitle($_SESSION["user_id"]);
                         ?>
                    </h3>
                    <p>
                    <?php
                            $profileInfo->fetchText($_SESSION["user_id"]);
                         ?>
                    </p>
                    <br>
                </div>
                <div class="profile-posts">
                    <h3>Posts</h3>
                    <div class="profile-post">
                        <h2>It is a busy day in Town</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis doloribus quam alias voluptatum. Architecto eligendi, eveniet numquam deleniti tempora esse accusantium omnis fugit repellat, qui ab? Magnam eius veniam asperiores.</p>
                        <p>12:46</p>
                    </div>
                    <div class="profile-post">
                        <h2>It is a busy day in Town</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis doloribus quam alias voluptatum. Architecto eligendi, eveniet numquam deleniti tempora esse accusantium omnis fugit repellat, qui ab? Magnam eius veniam asperiores.</p>
                        <p>12:46</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<script src="./js/main.js"></script>