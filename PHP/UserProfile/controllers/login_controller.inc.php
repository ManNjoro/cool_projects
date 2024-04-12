<?php

declare(strict_types=1);

class ControllerLogin
{

    public function is_input_empty(string $username, string $pwd)
    {
        if (empty($username) || empty($pwd)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param bool|array $result
     * @return bool
     */
    public function is_username_wrong($result)
    {
        if (!$result) {
            return true;
        } else {
            return false;
        }
    }

    public function is_password_wrong(string $pwd, string $hashedPwd)
    {
        if (!password_verify($pwd, $hashedPwd)) {
            return true;
        } else {
            return false;
        }
    }
}
