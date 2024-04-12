<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $username = $_POST["username"];
    $pwd = $_POST["pwd"];
    $email = $_POST["email"];

    try {
        require_once 'dbh.inc.php';
        require_once '../models/signup_model.inc.php';
        require_once '../controllers/signup_controller.inc.php';

        $modelSignUp = new ModelSignup();
        $controllerSignUp = new ControllerSignup();

        //    ERROR HANDLERS
        $errors = [];
        if ($controllerSignUp->is_input_empty($username, $pwd, $email)) {
            $errors["empty_input"] = "Fill in all  fields!";
        }

        if ($controllerSignUp->is_email_invalid($email)) {
            $errors["invalid_email"] = "Invalid email used!";
        }

        if ($controllerSignUp->is_username_taken($username)) {
            $errors["username_taken"] = "Username already exists!";
        }

        if ($controllerSignUp->is_email_registered($email)) {
            $errors["email_used"] = "Email already exists!";
        }

        require_once 'config_session.inc.php';

        if ($errors) {
            $_SESSION["errors_signup"] = $errors;
            $signupData = [
                "username" => $username,
                "email" => $email
            ];
            $_SESSION["signup_data"] = $signupData;
            header("Location: ../index.php");
            die();
        }

        $controllerSignUp->create_users($pwd, $username, $email);
        header("Location: ../index.php?signup=success");
        $pdo = null;
        $stmt = null;
        die();
    } catch (PDOException $e) {
        die("Query failed: " . $e->getMessage());
    }
} else {
    header("Location: ../index.php");
    die();
}
