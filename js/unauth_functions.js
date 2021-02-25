/* JavaScript functions for unauthenticated users */
$(function() { 

    checkTimeout(); /* check if the timeout msg is passed in the GET request (from the href) and put it into the error div */

    /* listener used to change from register to signin form and viceversa */
    $('#showAuthForm').on('click', function (e) {
        $('.form.auth').removeClass('hide');
        $('.form.reg').addClass('hide');
        $('.form_msg_container').addClass('hide'); /* setta hide a tutti i container dei messaggi */
    });
    $('#showRegForm').on('click', function (e) {
        $('form.reg').removeClass('hide');
        $('.form.auth').addClass('hide');
        $('.form_msg_container').addClass('hide'); /* setta hide a tutti i container dei messaggi */
        $('#warning_container').removeClass('hide');
    });

    /* listener per il login */
    $('.form.auth').submit(function(event) {
		event.preventDefault();
		var $form = $(this);
        var login_URL = $form.attr('action');
		var email = $('#auth_email', $form).val();
		var password = $('#auth_pass', $form).val();
		$.ajax({
			type: 'POST', /* method of http request */
            url: login_URL, /* string containing the URL to which the request is sent */
			data: {email: email, password: password}, /* data to be sent to the server. It can be JSON object, string or array */
			success: function(err_msg) {
                if(err_msg) {
                    switch(err_msg) {
                        case '1':
                            var msg = "Email non registrata";
                            $('#auth_email').val('').focus();
                            break;
                        case '2':
                            var msg = "Password errata";
                            $('#auth_pass').val('').focus();
                            break;
                        default:
                            var msg = "Errore: ";
                            alert(msg + err_msg);
                            $('#auth_email').val('');
                            break;
                    }
                    /* scrivo il messaggio sotto al form */
                    $('#auth_pass').val('');
                    $('#error_msg').text(msg);
                    $('#error_container').removeClass('hide');
                } else {
                    window.location.href = 'index.php'; 
                }
            }
		});
    });



    /* listeners per la registrazione: */
    /* if email_state && password_state are both true user can submit the form */ 
    var email_state = false; 
    var password_state = false;

    /* listener per controllare se la mail è già presente nel db (AJAX) quando l'utente toglie il focus dalla casella */
    $email = $('#unauth_email');
    var email_validator = new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$');
    $email.on('blur', function (e) {
        if(email_validator.test($email.val())) {
            $email.addClass('valid');
            /* check se l'utente è già registrato */
            $.ajax({
                url: 'php/actions.php?action=checkEmail',
                type: 'post',
                data: {
                    'email' : $email.val(),
                },
                success: function(response){
                    $email.removeClass('invalid');
                    if (response == 'available') {
                        email_state = true;
                        $email.removeClass('invalid');
                        $email.addClass('valid');
                        $('#error_email_container').addClass('hide');
                        $('#available_container').removeClass('hide');
                    }else if (response == 'not_available') {
                        console.log("HERE");
                        email_state = false;
                        $email.removeClass('valid');
                        $email.addClass('invalid');
                        $('#error_email_msg').text('Email già registrata nel DB');
                        $('#available_container').addClass('hide');
                        $('#error_email_container').removeClass('hide');
                    }
                }
            });   
        } else if($email.val().length == 0) {
            email_state = false;
            $email.removeClass('valid');
            $email.removeClass('invalid');
            $('#available_container').addClass('hide');
            $('#error_email_container').addClass('hide');
        } else {
            email_state = false;
            $('#available_container').addClass('hide');
            $email.addClass('invalid');
            $('#error_email_msg').text('Inserisci una email valida');
            $('#error_email_container').removeClass('hide');
        }
    });
    $email.on('keyup', function (e) {
        $('#error_container').addClass('hide');
    });
    $email.on('click', function (e) {
        $('#error_container').addClass('hide');
    });

    /* listener per fare il check della password */
    var password_validator = new RegExp("(?=.*[a-z])(?=.*[A-Z0-9])");
    var $pass1 = $('#unauth_pass');
    var $pass2 = $('#unauth_pass2');    
    $pass1.on('keyup', function (e) {
        $('#error_container').addClass('hide');
        if($pass1.val().length != 0) {
            /* password validation */
            if(password_validator.test($pass1.val())) {
                $('#warning_container').addClass('hide');
                $pass2.removeAttr("disabled"); /* abilito la passw2 */
                $pass1.removeClass('invalid');
                $pass1.addClass('valid');
                $('#invalid_container').addClass('hide');
                $('#valid_container').removeClass('hide');
            } else {
                $('#warning_container').removeClass('hide');
                $pass2.val('');
                $pass2.removeClass('match');
                $pass2.removeClass('notMatch');
                $pass2.attr("disabled", "disabled"); /* disabilito la passw2 */
                $pass1.removeClass('valid');
                $pass1.addClass('invalid');
                $('#valid_container').addClass('hide');
                $('#invalid_container').removeClass('hide');
            }
        } else {
            $pass2.val('');
            $pass2.attr("disabled", "disabled");
            $('#invalid_msg_container').addClass('hide');
            $pass1.removeClass('valid');
            $pass1.removeClass('invalid');
            $pass2.removeClass('match');
            $pass2.removeClass('notMatch');
            $('#notMatch_container').addClass('hide');
            $('#match_container').addClass('hide');
            $('#invalid_container').addClass('hide');
            $('#valid_container').addClass('hide');
        }
    });
    
    /* listener per fare il match delle password */
    $pass2.on('keyup', function (e) { 
        if($pass1.val().length!=0) {
            if($pass2.val().length!=0) {
                /* match tra le password */
                if($pass2.val() != $pass1.val()) {
                    password_state = false;
                    $pass2.removeClass('match');
                    $pass2.addClass('notMatch');
                    $('#notMatch_container').removeClass('hide');
                    $('#match_container').addClass('hide');
                } else {
                    password_state = true;
                    $pass2.removeClass('notMatch');
                    $pass2.addClass('match');
                    $('#match_container').removeClass('hide');
                    $('#notMatch_container').addClass('hide');
                }
            } else {
                password_state = false;
                $pass2.removeClass('notMatch');
                $pass2.removeClass('match');
                $('#match_container').addClass('hide');
                $('#notMatch_container').addClass('hide');
            }
        } else {
            password_state = false;
            $pass2.attr("disabled", "disabled");
        }
    });
    
    /* listener per il submit del form registrazione */
    $('.form.reg').submit(function(event) {
        event.preventDefault();
        if (email_state == false || password_state == false) {
            $('#error_msg').text('Risolvi gli errori prima di richiedere la registrazione');
            $('#error_container').removeClass('hide');
        } else {
            var $form = $(this);
            var reg_URL = $form.attr('action');
            var email = $email.val();
            var password = $pass1.val();
            $.ajax({
                type: 'POST', /* method of http request */
                url: reg_URL, /* string containing the URL to which the request is sent */
                data: { /* data to be sent to the server */ 
                    'email': email, 
                    'password': password 
                }, 
                success: function(err_msg) {
                    if(err_msg) {
                        $('#error_msg').text(err_msg);
                        $('#error_container').removeClass('hide');
                        $email.val('');
                        $pass1.val('');
                        $pass2.val('');
                        $email.removeClass('invalid');
                        $email.removeClass('valid');
                        $pass1.removeClass('invalid');
                        $pass1.removeClass('valid');
                        $pass2.removeClass('match');
                        $pass2.removeClass('notMatch');
                        $('.form_msg_container').addClass('hide'); /* setta hide a tutti i container dei messaggi */
                        $('#error_container').removeClass('hide');
                        $('#warning_container').removeClass('hide');
                    } else {
                        window.location.href = 'index.php'; 
                    }
                }
            });   
        }
    });

});

function checkTimeout(){
    var url = window.location.href;

    if (url.indexOf('?') > -1) { /* Returns -1 if the value to search for never occurs */
        var msg = url.split('?')[1].split('=')[1];
        if( msg == 'timeout' ) {
            $('#error_msg').text('Timeout! Effettua nuovamente il login.');
            $('#error_container').removeClass('hide');
        } else if( msg == 'accessDenied' ) {
            $('#error_msg').text('Accesso negato! Effettua il login.');
            $('#error_container').removeClass('hide');
        }
    }
}
