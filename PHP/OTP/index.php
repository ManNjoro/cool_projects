<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP</title>
    <link rel="stylesheet" href="./css/index.css">
</head>

<body>

    <form class="container" method="post" action="verify.php">
        <h3>Enter OTP</h3>
        <input type="text" name="otp" id="otp">
        <button>SUBMIT</button>
        <?php
        if (isset($_SESSION["error"])) {
            echo "<div class='red'>
            " . $_SESSION['error'] . "
            </div>";
            unset($_SESSION['error']);
        }
        ?>
    </form>
</body>

</html>