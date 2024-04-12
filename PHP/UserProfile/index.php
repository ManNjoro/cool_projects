<?php
require_once "includes/config_session.inc.php";
require_once "views/signup_view.inc.php";
require_once "views/login_view.inc.php";
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Sign up for an account or log in to your existing account on the online">
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"
    />
    <link rel="stylesheet" type="text/css" href="./css/main.css">
    <link rel="stylesheet" href="./css/styles.css" />
    <title>Document</title>
</head>

<body>
    <?php
    include "./includes/navbar.php";
    ?>
    <section class="forms">
        <h3>
            <?php
            $viewLogin = new ViewLogin();
            $viewLogin->output_username();
            ?>
        </h3>

        <?php
        if (!isset($_SESSION["user_id"])) { ?>
            
            <h3>Login</h3>
    
            <form action="./includes/login.inc.php" method="post">
                <input type="text" name="username" id="uname" placeholder="Username">
                <input type="password" name="pwd" id="pwd" placeholder="Password">
                <button>Login</button>
            </form>
        <?php } ?>
        <?php
        $viewLogin->check_login_errors();
        ?>
        <h3>Signup</h3>

        <form action="./includes/signup.inc.php" method="post">
            <?php
            $viewSignUp = new ViewSignup();
            $viewSignUp->signup_inputs();
            ?>
            <button>Signup</button>
        </form>

        <?php
        $viewSignUp->check_signup_errors();
        ?>

        <h3>Logout</h3>

        <form action="./includes/logout.inc.php" method="post">
            <button>Logout</button>
        </form>
    </section>
    <script src="./js/main.js"></script>
</body>

</html>