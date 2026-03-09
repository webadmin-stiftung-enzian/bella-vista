<?php

//  ATTENTION!
//
//  DO NOT MODIFY THIS FILE BECAUSE IT WAS GENERATED AUTOMATICALLY,
//  SO ALL YOUR CHANGES WILL BE LOST THE NEXT TIME THE FILE IS GENERATED.
//  IF YOU REQUIRE TO APPLY CUSTOM MODIFICATIONS, PERFORM THEM IN THE FOLLOWING FILE:
//  /var/www/vhosts/bella-vista-flumenthal.ch/staging.peaceful-carver.194-56-189-97.plesk.page/wp-content/maintenance/template.phtml


$protocol = $_SERVER['SERVER_PROTOCOL'];
if ('HTTP/1.1' != $protocol && 'HTTP/1.0' != $protocol) {
    $protocol = 'HTTP/1.0';
}

header("{$protocol} 503 Service Unavailable", true, 503);
header('Content-Type: text/html; charset=utf-8');
header('Retry-After: 600');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <link rel="icon" href="/favicon.ico">
    <link rel="stylesheet" href="https://staging.bella-vista-flumenthal.ch/wp-content/maintenance/assets/styles.css?1770177949">
    <script src="https://staging.bella-vista-flumenthal.ch/wp-content/maintenance/assets/timer.js?1770177949"></script>
    <title>Geplante Wartungsaufgaben</title>
    <style>body {background-image: url("https://staging.bella-vista-flumenthal.ch/wp-content/maintenance/assets/images/bg.jpg?1770177949");}</style>
</head>

<body>

    <div class="container">

    <header class="header">
        <h1>Auf der Website werden geplante Wartungsaufgaben durchgeführt.</h1>
        <h2>Bitte entschuldigen Sie die Unannehmlichkeiten. Kommen Sie später wieder vorbei. Wir sind bald wieder online.</h2>
    </header>

    <!--START_TIMER_BLOCK-->
        <!--END_TIMER_BLOCK-->

    <!--START_SOCIAL_LINKS_BLOCK-->
    <section class="social-links">
                    <a class="social-links__link" href="https://www.facebook.com/Plesk" target="_blank" title="Facebook">
                <span class="icon"><img src="https://staging.bella-vista-flumenthal.ch/wp-content/maintenance/assets/images/facebook.svg?1770177949" alt="Facebook"></span>
            </a>
                    <a class="social-links__link" href="https://x.com/Plesk" target="_blank" title="Twitter">
                <span class="icon"><img src="https://staging.bella-vista-flumenthal.ch/wp-content/maintenance/assets/images/twitter.svg?1770177949" alt="Twitter"></span>
            </a>
            </section>
    <!--END_SOCIAL_LINKS_BLOCK-->

</div>

<footer class="footer">
    <div class="footer__content">
        Mit der Technologie von WP Toolkit    </div>
</footer>

</body>
</html>
