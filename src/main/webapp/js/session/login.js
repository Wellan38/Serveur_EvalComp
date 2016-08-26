/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function() {
    $.material.init();
    $('#modal_login').modal();
    $('#form_connexion').on('submit', function(e) {
        e.preventDefault();
    });
}());

function connexion()
{
    var id = $('#identifiant').val();
    var mdp = $('#mot_de_passe').val();
    
    $.ajax({
        url: './ActionServlet',
        type: 'POST',
        data: {
            action: 'connexion',
            identifiant: id,
            mot_de_passe: mdp
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
           
           var retour = data.retour;
           var lien = retour.lien;
   
           document.location.href = lien;
           sessionStorage.setItem("identifiant", retour.identifiant);
           sessionStorage.setItem("nav_nom", retour.nom);
           sessionStorage.setItem("type_utilisateur", retour.type);
           sessionStorage.setItem("apprenant", retour.apprenant);
    })
    .fail(function() {
        console.log('Erreur de connexion.');
    })
    .always(function() {
        //
    });
}