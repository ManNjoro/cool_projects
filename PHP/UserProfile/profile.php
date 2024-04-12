<head>
<link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"
    />
    <link rel="stylesheet" href="./css/styles.css">
</head>
<?php
session_start();
include "./includes/navbar.php";
?>

<section class="profile">
    <div class="profile-bg">
        <div class="wrapper">
            <div class="profile-info">
                <div class="profile-info-img">
                    <p>Man Njoro</p>
                    <div class="break"></div>
                    <a href="profilesettings.php" class="follow-btn">Profile Settings</a>
                </div>
                <div class="profile-info-about">
                    <h3>About</h3>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae, necessitatibus animi. Accusamus accusantium laboriosam ducimus! Dicta amet at numquam expedita beatae eos, laborum illo laudantium eius aliquam ab consectetur vero!</p>
                    <h3>Followers</h3>
                    <h3>Following</h3>
                </div>
            </div>
            <div class="profile-content">
                <div class="profile-intro">
                    <h3>Hi I'm Man Njoro</h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis omnis temporibus distinctio velit perspiciatis nisi hic consequuntur voluptate aut! Atque consequatur, quo inventore laboriosam natus necessitatibus nihil tempora praesentium quos.</p>
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