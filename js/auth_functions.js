/* javascript functions for authenticated users */
$(function() {
    /* listener on click of each airplane seats */
    $('#airplane').click(function (e) {
        var purchasedSeats = $('#totPurchasedSeats');
        var bookedSeats = $('#totBookedSeats');
        var availableSeats = $('#totAvailableSeats');

        var target = $(e.target);
        if(target.hasClass("bookedByUser")) { /* query the db to un-book your seat (AJAX) */ 
            $.ajax({ 
                type: 'POST', /* method of http request */
                url: 'php/actions.php?action=unbookSeat',
                data: { seatID: target.attr("id") }, /* data to be sent to the server  */
                success: function(msg) {
                    if(!errorMsg(msg)) {
                        if(msg == 'purchased') {
                            $(e.target).removeClass("bookedByUser");
                            target.addClass("purchased");
                            msg = 'Nessun problema! Il posto è stato comprato da un altro utente';
                            /* update the website airplane informations */
                            bookedSeats.text(parseInt(bookedSeats.text(), 10)-1); /* (bookedSeats)-- */ /* parseInt(string, baseNumerica (10)) */
                            purchasedSeats.text(parseInt(purchasedSeats.text(), 10)+1);; /* (purchasedSeats)++ */
                        } else if(msg == 'bookedByOther') {
                            $(e.target).removeClass("bookedByUser");
                            target.addClass("booked");
                            msg = 'Nessun problema! Il posto è stato prenotato da un altro utente';
                        }
                        if(msg) {
                            setTimeout(function() {
                                alert(msg);
                            },15) /* show the alert 15ms after the class changed to make change effective */
                        } else { /* if msg is an empty string (false) -> seat un-booked correctly */ 
                            $(e.target).removeClass("bookedByUser");
                            $(e.target).addClass("available");
                            /* update the website airplane informations */
                            bookedSeats.text(parseInt(bookedSeats.text(), 10)-1); /* (bookedSeats)-- */ /* parseInt(string, baseNumerica (10)) */
                            availableSeats.text(parseInt(availableSeats.text(), 10)+1);; /* (availableSeats)++ */
                        }
                    }
                }
            });
        } else if(target.hasClass("booked") || target.hasClass("available")){ /* query the db to book a seat (AJAX) */  
            $.ajax({
                type: 'POST', /* method of http request */
                url: 'php/actions.php?action=bookSeat',
                data: { seatID: target.attr("id") }, /* data to be sent to the server  */
                success: function(msg) {
                    if(!errorMsg(msg)) {
                        if(msg == 'purchased') {
                            target.addClass("purchased");
                            msg = 'Troppo tardi! il posto è stato comprato da un altro utente';
                            /* update the website airplane informations */
                            availableSeats.text(parseInt(availableSeats.text(), 10)-1); /* (availableSeats)-- */ /* parseInt(string, baseNumerica (10)) */
                            purchasedSeats.text(parseInt(purchasedSeats.text(), 10)+1);; /* (purchasedSeats)++ */
                        }
                        if(msg) {
                            setTimeout(function() {
                                alert(msg);
                            },15) /* show the alert 15ms after the class changed to make change effective */
                        } else { /* if msg is an empty string (false) -> seat booked correctly */ 
                            if(target.hasClass('available')) {
                                target.removeClass("available");
                                target.addClass("bookedByUser");
                                /* update the website airplane informations */
                                bookedSeats.text(parseInt(bookedSeats.text(), 10)+1); /* (bookedSeats)++ */ /* parseInt(string, baseNumerica (10)) */
                                availableSeats.text(parseInt(availableSeats.text(), 10)-1);; /* (availableSeats)-- */
                            } else if($(e.target).hasClass("booked")) {
                                $(e.target).removeClass("unbook");
                                $(e.target).addClass("bookedByUser");
                            }
                            $('.purchasedError').addClass("hide");
                        }
                    }
                }
            });
        }
    });

    /* listener for update button */
    $("#update_button").click( function(e) {
        e.preventDefault();
        /* get airplane container to remove old content and put new content */
        var container = $('#airplane');
        $.ajax({
            type: 'POST', /* method of http request */
            url: 'php/actions.php?action=update',
            success: function(msg) {
                if(!errorMsg(msg)) {
                    container.html(''); /* remove old airplane */
                    container.html(msg); /* setting the content returned by the AJAX request */                 
                    $('#totPurchasedSeats').html($('.seat.purchased').length);
                    $('#totBookedSeats').html($('.seat.booked').length);
                    $('#totAvailableSeats').html($('.seat.available').length);
                }
            }
        });
    });

    /* listener for purchase button */
    $("#purchase_button").click(function(e) {
        e.preventDefault();
        /* get all seats booked by user to send with the ajax request */
        var seats = [];
        $('.seat.bookedByUser').each(function() {
            seats.push(this.id);
        });

        if(seats.length == 0) {
            $('.purchasedError').removeClass('hide');
        } else {
            $.ajax({
                type: "POST", /* method of http request */
                data: { seats: JSON.stringify({ 'seats': seats }) },
                url: 'php/actions.php?action=purchaseSeats',
                success: function(msg){
                    if(!errorMsg(msg)) {
                        if(msg) {
                            /* purchase fail */
                            $('.seat.bookedByUser').removeClass('booked');
                            $('.seat.bookedByUser').addClass('available');
                        } else {
                            /* purchase success */
                            $('.seat.bookedByUser').removeClass('booked');
                            $('.seat.bookedByUser').addClass('purchased');
                            var msg = "Acquisto avvenuto con successo.";
                        }
                    }
                    setTimeout(function() {
                        alert(msg);
                        window.location.href = 'index.php';
                    },15); /* show the alert 15ms to make class changeed effective */
                }
            });
        }
    });

});

function errorMsg(msg) {
    if(msg=='timeout') {
        msg = "Timeout! Effettua nuovamente il login.";
        alert(msg);
        window.location.href = 'index.php?msg=timeout';
    } else if(msg=='accessDenied') {
        msg = "Accesso negato! Effettua il login.";
        alert(msg);
        window.location.href = 'index.php?msg=accessDenied';
    } else { 
        return false;
    }
    return true;
}