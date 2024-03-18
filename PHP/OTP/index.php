<?php

function generate_otp()
{
    $otp = '';
    for ($i = 0; $i < 6; $i++) {
        $otp .= (string) rand(0, 9);
    }
    echo $otp;
}
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

    <form class="container">
        <h3>Enter OTP</h3>
        <input type="text" name="otp" id="otp">
        <button>SUBMIT</button>
    </form>
</body>

</html>