var type_utilisateur = sessionStorage.getItem("type_utilisateur");
var identifiant = sessionStorage.getItem("identifiant");
var est_apprenant = (type_utilisateur == "Apprenant");
var est_formateur = (type_utilisateur == "Formateur");
var est_coordonateur = (type_utilisateur == "Coordonateur");

var url_array = window.location.href.split("?")[0].split("/");
var url = url_array[url_array.length - 1];

(function() {
    var nom = sessionStorage.getItem("nav_nom");
    
    if (nom == null)
    {
        document.location.href = "index.html";
    }
    else
    {
        $.material.init();
        $('#nav_nom').html(nom);
        
        if (est_apprenant && url != "apprenant.html" && url != "index_apprenant.html" && url != "autoevaluation.html")
        {
            $(':input').attr("disabled", true);
            $('.radio').attr("disabled", true);
        }
        
        if (est_apprenant)
        {
            $('#bouton_index').attr("href", "index_apprenant.html");
        }
        else
        {
            $('#bouton_index').attr("href", "index_formateur.html");
        }
        
        if ($('#boutons_modifs') != null && ((!est_apprenant && url != "autoevaluation.html") || (est_apprenant && url == "autoevaluation.html")))
        {
            $('#boutons_modifs').show();
        }
    }
}());

$(document).ajaxComplete(function(event,xhr,options)
{
    if (xhr.status == 401)
    {
        document.location.href = "index.html";
    }
});

function deconnexion()
{
    $.ajax({
        url: './ActionServlet',
        type: 'POST',
        data: {
            action: 'deconnexion'
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        document.location.href = "index.html";
    })
    .fail(function() {
        console.log('Erreur de déconnexion.');
    })
    .always(function() {
        //
    });
}