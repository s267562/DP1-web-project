<!--	
    Simone Sinagra - s267562
	Programmazione distribuita I - 2018/2019
    ESONERO WEB - index.php
-->
<?php
    include 'php/functions.php';
    sessionStart(); /* function checks if user has been inactive for more then 2 minutes and start session */
    forceHTTPS();
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Airplane company</title>
        <meta charset="UTF-8"/>
        <meta http-equiv="author" content="Simone Sinagra" />

        <!-- style sheet -->
        <link href="css/styles.css" type="text/css" rel="stylesheet" />
        <link href="css/airplaneStyles.css" type="text/css" rel="stylesheet" />
        <link href="css/forms.css" type="text/css" rel="stylesheet" /> 

        <!-- javascript-->
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script> <!-- load JQuery -->
        <?php if(userLoggedIn()){ ?> <script type="text/javascript" src="js/auth_functions.js"></script>
        <?php } else { ?> <script type="text/javascript" src="js/unauth_functions.js"></script> <?php } ?>

        <script> if(!navigator.cookieEnabled) { window.location.href = 'cookieDisabled.html'; }; </script>

    </head>

    <body>
        <aside>
            <?php 
                sidebar();
            ?>
        </aside>
        <div id="wrapper">
            <header>
                <a href="index.php"> <img id="logo" src="img/logo/logo.png" alt="Logo"> </a>
            </header>
            <div id="main">
                <noscript> 
                    <h1 class="noscript"> JavaScript disabilitato </h1>
                    <p class="noscript"> il sito potrebbe non funzionare correttamente. </p>
                </noscript>
                <table id="main_table">
                <tr id="first-row">
                    <td id="airplane-cell">
                        <div id="airplane">
                            <?php
                                seatsMap();
                                /* createMap(false); */
                            ?>
                        </div> <!-- airplane -->
                    </td> 
                    <td id="airplane_info">
                        <div>
                            <h3 class='airplane_info'>POSTI TOTALI:<span class='info_text' id='totSeats'></span></h3>
                            <h3 class='airplane_info'>POSTI ACQUISTATI:<span class='info_text' id='totPurchasedSeats'></span></h3>
                            <h3 class='airplane_info'>POSTI PRENOTATI:<span class='info_text' id='totBookedSeats'></span></h3>
                            <h3 class='airplane_info'>POSTI DISPONIBILI:<span class='info_text' id='totAvailableSeats'></span></h3>
                        </div>
                        <script>
                            $('#totSeats').html($('.seat').length);
                            $('#totPurchasedSeats').html($('.seat.purchased').length);
                            $('#totBookedSeats').html($('.seat.booked').length + $('.seat.bookedByUser').length);
                            $('#totAvailableSeats').html($('.seat.available').length); 
                        </script>
                    </td> <!-- info -->
                </tr>
                <tr id="second-row">
                    <td> 
                        <?php
                            legend();
                        ?>
                    </td> <!-- legend -->
                </tr>
            </table>
            </div>
        </div> <!-- wrapper -->
    </body>
</html>