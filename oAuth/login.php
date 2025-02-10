<?php
require 'vendor/autoload.php';

use League\OAuth2\Client\Provider\Google;

session_start();

$provider = new Google([
    'clientId'     => 'SEU_CLIENT_ID',
    'clientSecret' => 'SEU_CLIENT_SECRET',
    'redirectUri'  => 'http://localhost/callback.php',
]);

// Redireciona o usuário para o Google
$authUrl = $provider->getAuthorizationUrl();
$_SESSION['oauth2state'] = $provider->getState(); // Salva o estado para validação posterior
header('Location: ' . $authUrl);
exit;
?>