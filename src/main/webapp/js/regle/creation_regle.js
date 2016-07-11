/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function() {
    changerPortee();
}());

var code_comp;

function changerPortee()
{
    var portee = document.getElementById("portee_regle").value;
    
    switch(portee)
    {
        case "Spécifique" :
            code_comp = window.location.search.substring(1).split("&")[0].split("=")[1];
            var contenuHtml = '<div class="form-group">';
            
            $.ajax({
                url: './ActionServlet',
                type: 'GET',
                data: {
                    action: 'infos',
                    type: 'competence_specifique',
                    code: code_comp
                },
                async:false,
                dataType: 'json'
            })
            .done(function(data) {
                console.log(data.obj);
            })
            .fail(function() {
                console.log('Erreur dans le chargement des informations.');
            })
            .always(function() {
                //
            });
            
            break;
    }
}