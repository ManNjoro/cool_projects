<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $username = $_POST["username"];
    $pwd = $_POST["pwd"];

    try {
        require_once '../models/login_model.inc.php';
        require_once '../controllers/login_controller.inc.php';
        $controllerLogin = new ControllerLogin();
        $modelLogin = new ModelLogin();
        //    ERROR HANDLERS
        $errors = [];
        if ($controllerLogin->is_input_empty($username, $pwd)) {
            $errors["empty_input"] = "Fill in all  fields!";
        }

        $result = $modelLogin->get_user($username);
        if ($controllerLogin->is_username_wrong($result)) {
            $errors["login_incorrect"] = "Incorrect login credentials!";
        }

        if (!$controllerLogin->is_username_wrong($result) && $controllerLogin->is_password_wrong($pwd, $result["pwd"])) {
            $errors["login_incorrect"] = "Incorrect login credentials!";
        }

        require_once 'config_session.inc.php';

        if ($errors) {
            $_SESSION["errors_login"] = $errors;

            header("Location: ../index.php");
            die();
        }

        $newSessionId = session_create_id();
        $sessionId = $newSessionId . "_" . $result["id"];
        session_id($sessionId);

        $_SESSION["user_id"] = $result["id"];
        $_SESSION["user_username"] = htmlspecialchars($result["username"]);
        $_SESSION["last_regeneration"] = time();

        header("Location: ../index.php?login=success");
        $pdo = null;
        $stmt = null;
    } catch (PDOException $e) {
        die("Query failed: " . $e->getMessage());
    }
} else {
    header("Location: ../index.php");
    die();
}
