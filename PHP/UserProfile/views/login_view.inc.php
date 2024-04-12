<?php

declare(strict_types=1);

class ViewLogin
{

    public function outputUsername()
    {
        if (isset($_SESSION["user_id"])) {
            echo $_SESSION["user_username"];
        }
    }
    public function checkLoginErrors()
    {
        if (isset($_SESSION["errors_login"])) {
            $errors = $_SESSION["errors_login"];

            echo "<br>";

            foreach ($errors as $error) {
                echo '<p class="form-error">' . $error . '</p>';
            }

            unset($_SESSION['errors_login']);
        } else if (isset($_GET['login']) && $_GET['login'] === 'success') {
            echo '<br>';
            echo '<p class="form-success"> Login successful!</p>';
        }
    }
}
