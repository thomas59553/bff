<?php
session_start();

// Nom d'utilisateur et mot de passe fictifs pour l'exemple
$admin_username = "admin";
$admin_password = "password";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    if ($username == $admin_username && $password == $admin_password) {
        $_SESSION['admin'] = true;
        header("Location: admin.html");
        exit();
    } else {
        echo '<script>alert("Nom d\'utilisateur ou mot de passe incorrect!"); window.location.href = "login.html";</script>';
    }
}
?>
