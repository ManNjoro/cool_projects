<?php

class ProfileInfoController extends ProfileInfo
{
    private $userId;
    private $username;

    public function __construct($userId, $username)
    {
        $this->userId = $userId;
        $this->username = $username;
    }

    public function defaultProfileInfo()
    {
        $profileAbout = "Tell people about yourself! Your interests, hobbies, or favorite TV show!";
        $profileTitle = "Hi! I am " . $this->username;
        $profileText = "Welcome to my profile page! Soon I'll be able to tell you more about myself, and what you can find on my profile page.";
        $this->setProfileInfo($profileAbout, $profileTitle, $profileText, $this->userId);
    }
}
