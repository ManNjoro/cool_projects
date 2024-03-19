<?php

require "../vendor/autoload.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use Dotenv\Dotenv as Dotenv;

function generate_otp()
{
    $otp = '';
    for ($i = 0; $i < 6; $i++) {
        $otp .= (string) rand(0, 9);
    }
    return $otp;
}

function sendMail($email, $subject, $message)
{
    $dotenv = Dotenv::createImmutable('.');
    $dotenv->load();
    $mail = new PHPMailer(true);
    // $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $mail->isSMTP();
    $mail->SMTPAuth = true;
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->Username = $_ENV['USERNAME'];
    $mail->Password = $_ENV['PASSWORD'];
    $mail->setFrom("mifflindunder980@gmail.com", "Dunder Mifflin");
    $mail->addAddress($email, "Mifflin");
    $mail->Subject = $subject;
    $mail->Body = $message;
    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );

    try {
        $mail->send();
        echo "Email sent successfully";
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}

$otp = generate_otp();
session_start();
$_SESSION["OTP"] = $otp;
sendMail('elijohnmwoho@gmail.com', 'OTP', $otp);