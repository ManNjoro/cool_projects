<?php
require_once "views/login_view.inc.php";
// session_start();
?>
<header id="header">
    <nav class="nav">
        <div class="nav-center">
            <div class="nav-header">
                <div class="logo">LOGO</div>
                <button class="nav-toggle">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
            <div class="links-container">
                <ul class="links">
                    <li>
                        <a href="#home" class="scroll-link">home</a>
                    </li>
                    <li>
                        <a href="index.php" class="scroll-link">Login</a>
                    </li>
                    <li>
                        <a href="index.php" class="scroll-link">Signup</a>
                    </li>
                    <?php
                    $viewLogin = new ViewLogin();
                    if (isset($_SESSION["user_id"])) {

                    ?>
                        <li>
                            <a href="profile.php"><?php $viewLogin->outputUsername(); ?></a>

                        </li>
                        <li><a href="includes/logout.inc.php">Logout</a></li>
                    <?php
                    }
                    ?>
                </ul>
            </div>
        </div>
    </nav>
</header>