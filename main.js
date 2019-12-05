$(document).ready(function() {

    //Popolo i contenitori dei messaggi
    //scorro tutte le conversazioni contenute nell'oggetto
    for (var codice_conversazione in conversazioni) {
        //Recupero i messaggi della conversazione cprrente
        var messaggi = conversazioni[codice_conversazione];
        //Ciclo tutti i messaggi di questa codice_conversazione

        //Clono il contenitore dei messaggio
        var contenitore_messaggi = $('.template .right-messages').clone();
        contenitore_messaggi.attr('data-codice',codice_conversazione)
        for (var i = 0; i < messaggi.length; i++) {

            var singolo_messaggio = messaggi[i];

            var testo_mes = singolo_messaggio.testo;
            var classe_messaggio = singolo_messaggio.direzione;

            //clono il template del invia_messaggio
            var new_messaggio = $('.template .message').clone();
            //inserisco nel giusto span il testo del invia_messaggio
            new_messaggio.children('.message-text').text(testo_mes);
            //aggiungo al div .message la classe presente
            new_messaggio.addClass(classe_messaggio);
            //inserisco il messaggio all'interno del contanaier
            contenitore_messaggi.append(new_messaggio);
        }
        $('.right-messages-container').append(contenitore_messaggi);

    }



    //invio del messaggio
    //intercetto il click
    $('.right-footer-icon.f-right').click(function() {
        var invio = invia_messaggio();
        if (invio.length && invio.trim() !== '') {
            //richiamo la funzione di risposta automatica dopo 3 secondi
            setTimeout(answer , 3000);
    }
    });

    //intercetto il tasto invio
    $('.new-message-inputs').keypress(function(event) {
        //controllo se il tasto digitato corrisponde al tasto enter
        if (event.which == 13) {
            var invio = invia_messaggio();
            if (invio.length && invio.trim() !== '') {
                //richiamo la funzione di risposta automatica dopo 3 secondi
                setTimeout(answer , 3000);
        }
    }
});

    //Intercetto i tasti digitati nell'input
    $('.new-message-inputs').keyup(function() {
        //recupero il testo inserito nel messaggio
        var testo_messaggio = $('.new-message-inputs').val();
        if (testo_messaggio.length != 0) {
            //Se il messaggio non è vuoto , mostro l'icona dell'aereo e nascondo il microfono
            $('.right-footer-icon.f-right i').removeClass('fa fa-microphone').addClass('fas fa-paper-plane');
        }else {
            //altrimenti (il messaggio è vuoto),nascondo l'icona dell'aereo e mostro il microfono
            $('.right-footer-icon.f-right i').addClass('fa fa-microphone').removeClass('fas fa-paper-plane');
        }
    });


    //Ricerca se un utente è presente nella lista
    $('#contacts-filter').keyup(function(event) {
        var testo_ricerca = $('#contacts-filter').val();
        console.log(testo_ricerca);
        if (testo_ricerca.length != 0) {
            $('.contact').each(function() {
                var elemento_corrente = $(this).find('.contact-name').text();
                console.log(elemento_corrente);
                if (elemento_corrente.toLowerCase().includes(testo_ricerca.toLowerCase())) {
                    $(this).show();
                }
                else{
                    $(this).hide();
                }

            });
        }else{
            $('.contact').show();
        }

    });

    //Seleziona l'utente dalla lista
    $('.contact').click(function() {
        //Rimuovo la classe active all'elemento che l'aveva prima
        $('.contact.active').removeClass('active');
        // aggiungo la classe active all'elemento cliccato
        $(this).addClass('active');
        //Sposto il contatto selezionato al primo posto nella lista
        $(this).prependTo($('.contact').parent());
        //Ottengo il nome del contatto selezionato al click
        var name = $(this).find('.contact-name').text();
        //Assegno il nome all'header right
        $('#header-right-contact-name').text(name);
        //Ottengo la foto  del contatto selezionato
        var img = $(this).find('.contact-logo img').attr('src');
        //Assegno la foto all'header right
        $('.header-right-logo img').attr('src',img);
        $('.right-messages').removeClass('active');
        //Ottengo il codice del contatto selezionato
        var codice = $(this).attr('data-codice');
        //Associo il codice alla conversazione per il contatto selezionato
        $('.right-messages[data-codice="' + codice + '"]').addClass('active');
    });


    //Funzione che fa aprire il pannello dettaglio e permette la cancellazione del messaggio
    $('.right-messages').on('click','i.fa.fa-chevron-down' ,function(){
        $(this).siblings('.message-options-panel').toggleClass('active');
        $('.message-destroy').click(function() {
            console.log('click');
            $(this).closest('.message').remove();

        })
    });

    //Simulo il click sul contato che ha la classe actibve
    $('.contact.active').trigger('click');
});

function invia_messaggio() {
    //Recupero il contenuto dell'input del messaggio
    var testo_messaggio = $('.new-message-inputs').val();
    //se il messaggio non è vuoto
    if (testo_messaggio.length != 0 && testo_messaggio.trim() !== '') {
        //clono il template del invia_messaggio
        var nuovo_messaggio = $('.template .message').clone();
        //inserisco nel giusto span il testo del invia_messaggio
        nuovo_messaggio.children('.message-text').text(testo_messaggio);
        //aggiungo al div .message la classe presente
        nuovo_messaggio.addClass('sent');
        //inserisco il messaggio all'interno del contanaier
        $('.right-messages.active').append(nuovo_messaggio);
        //Imposto l'orario d'invia_messaggio
        var time = currentTimeMessage();
        //stampo l'orario invio messaggio
        nuovo_messaggio.children('.message-time').text(time);
        //resetto l'input con una stringa vuota
        $('.new-message-inputs').val('');

    }
    return testo_messaggio;
}

//Questa funzione restituisce automaticamente una risposta con la stringa ok
function answer() {
        //clono il template
        var nuovo_messaggio = $('.template .message').clone();
        //inserisco nel giusto span il testo stringa OK
        nuovo_messaggio.children('.message-text').text('OK');
        //aggiungo al div .message la classe presente
        nuovo_messaggio.addClass('received');
        //inserisco il messaggio all'interno del contanaier
        $('.right-messages.active').append(nuovo_messaggio);
        //Imposto l'orario d'invia_messaggio
        var time = currentTimeMessage();
        //stampo l'orario invio messaggio
        nuovo_messaggio.children('.message-time').text(time);
}
//Funzione per ottenere l'orario del messaggio
function currentTimeMessage() {
    var d = new Date();
    var time = d.getHours() + ":" +(d.getMinutes()<10?'0':'')+ d.getMinutes();
    return time;
}
//Oggetti conversazioni mappati con gli id degli utenti
var conversazioni = {
    '00':[
        {
            'testo': 'Ciao Michele',
            'direzione': 'sent'
        },{
            'testo': 'Ciao anche a te!',
            'direzione': 'received'
        }
    ],
    '01':[
        {
            'testo': 'Ciao Fabio',
            'direzione': 'sent'
        },{
            'testo': 'Ciao anche a te!',
            'direzione': 'received'
        }
    ],
    '02':[
        {
            'testo': 'Ciao Samuele',
            'direzione': 'sent'
        },{
            'testo': 'Ciao anche a te!',
            'direzione': 'received'
        }
    ],
    '03':[
        {
            'testo': 'Ciao Alessandro B.',
            'direzione': 'sent'
        },{
            'testo': 'Ciao anche a te!',
            'direzione': 'received'
        }
    ],
    '04':[
        {
            'testo': 'Ciao Alessandro L.',
            'direzione': 'sent'
        },{
            'testo': 'Ciao anche a te!',
            'direzione': 'received'
        }
    ],
    '05':[
        {
            'testo': 'Ciao Claudia',
            'direzione': 'sent'
        },{
            'testo': 'Ciao anche a te!',
            'direzione': 'received'
        }
    ],
    '06':[
        {
            'testo': 'Ciao Davide',
            'direzione': 'sent'
        },{
            'testo': 'Ciao anche a te!',
            'direzione': 'received'
        }
    ],
    '07':[
        {
            'testo': 'Ciao Federico',
            'direzione': 'sent'
        },{
            'testo': 'Ciao anche a te!',
            'direzione': 'received'
        }
    ]
}
