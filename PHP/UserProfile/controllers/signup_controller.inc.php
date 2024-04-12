<?php

declare(strict_types=1);

class ControllerSignup
{
    private $modelSignUp;

    public function __construct(){
        $this->modelSignUp  = new ModelSignup();
    }

    public function is_input_empty(string $username, string $pwd, string $email)
    {
        if (empty($username) || empty($pwd) || empty($email)) {
            return true;
        } else {
            return false;
        }
    }

    public function is_email_invalid(string $email)
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return true;
        } else {
            return false;
        }
    }

    public function is_username_taken(string $username)
    {
        if ($this->modelSignUp->get_username($username)) {
            return true;
        } else {
            return false;
        }
    }

    public function is_email_registered(string $email)
    {
        if ($this->modelSignUp->get_email($email)) {
            return true;
        } else {
            return false;
        }
    }

    public function create_users(string $pwd, string $username, string $email)
    {
        $this->modelSignUp->set_user($pwd, $username, $email);
    }
}
