/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var param = window.location.search.substring(1).split("&");
var type = param[0].split("=")[1];
var formation = null;

jQuery(document).ready(function($) {
    $('#formations').collapse("show");
    $(".clickable-row").click(function() {
        window.document.location = $(this).data("href");
    });
});

(function()
{    
    listerFormations();
    
    switch(type)
    {
        case "formations" :
            deroulerFormations();
            break;
            
        case "apprenants" :
            deroulerApprenants();
            break;
            
        case "competences" :
            deroulerCompetences();
            break;
    }
})();

var liste_formations;
var liste_apprenants;
var liste_competences;

function afficherFormations(formations)
{
    var contenuHtml = '';
    
    for (var i = 0; i < formations.length; i++)
    {
        var f = formations[i];

        contenuHtml += '<tr id="formation_' + f.code + '_" onclick="selectionnerFormation(\'' + f.code + '\')"><td>' + f.libelle + '</td><td>' + f.domaine + '</td>';
        contenuHtml += '<td><div class="text-center"><i class="clickable fa fa-list" id="voir_' + f.code + '_" onmouseover="disableClickFormation(\'' + f.code + '\')" onmouseout="enableClickFormation(\'' + f.code + '\')" onclick="window.location.href=\'formation.html?mode=modification&code=' + f.code + '\'" data-toggle="tooltip" data-placement="top" title="Visualiser cette formation"></i></div></td>';
        contenuHtml += '<td><div class="text-center"><i class="clickable glyphicon glyphicon-trash" id="supprimer_' + f.code + '_" onmouseover="disableClickFormation(\'' + f.code + '\')" onmouseout="enableClickFormation(\'' + f.code + '\')" onclick="demandeSuppressionFormation(\'' + f.code + '\')" data-toggle="tooltip" data-placement="top" title="Supprimer cette formation"></i></div></td></tr>';
    }

    $('#formations_body').html(contenuHtml);
    
    $('[data-toggle="tooltip"]').tooltip();
}

function afficherApprenants(apprenants)
{
    var contenuHtml = '';
        
    for (var i = 0; i < apprenants.length; i++)
    {
        var a = apprenants[i];
        
        contenuHtml += '<tr id="apprenant_' + a.code + '_"><td>' + a.nom + '</td><td>' + a.fonction + '</td><td>' + a.entreprise + '</td>';
        
        contenuHtml += '<td><div class="text-center"><i class="clickable fa fa-pencil" id="noter_' + a.code + '_" onclick="window.location.href=\'notation.html?formation=' + a.formation + '&apprenant=' + a.code + '\'" data-toggle="tooltip" data-placement="top" title="Attribuer une note à cet apprenant"></i></div></td>';
        contenuHtml += '<td><div class="text-center"><i class="clickable fa fa-list" id="voir_' + a.code + '_" onclick="window.location.href=\'apprenant.html?mode=modification&code=' + a.code + '\'" data-toggle="tooltip" data-placement="top" title="Visualiser cet apprenant"></i></div></td>';
        contenuHtml += '<td><div class="text-center"><i class="clickable glyphicon glyphicon-trash" id="supprimer_' + a.code + '_" onclick="demandeSuppressionApprenant(\'' + a.code + '\')" data-toggle="tooltip" data-placement="top" title="Supprimer cet apprenant"></i></div></td></tr>';
    }

    $('#apprenants_body').html(contenuHtml);
    
    $('[data-toggle="tooltip"]').tooltip();
}

function afficherCompetences(competences)
{
    var contenuHtml = '';
        
    for (var i = 0; i < competences.length; i++)
    {
        var c = competences[i];

        contenuHtml += '<tr id="competence_' + c.code + '_"><td>' + c.libelle + '</td><td>' + c.categorie + '</td><td>' + c.nb_comp + '</td>';
        contenuHtml += '<td><div class="text-center"><i class="clickable fa fa-list" id="voir_' + c.code + '_" onclick="window.location.href=\'competence_generale.html?mode=modification&code=' + c.code + '\'" data-toggle="tooltip" data-placement="top" title="Visualiser cette compétence"></i></div></td>';
        contenuHtml += '<td><div class="text-center"><i class="clickable glyphicon glyphicon-trash" id="supprimer_' + c.code + '_" onclick="demandeSuppressionCompG(\'' + c.code + '\')" data-toggle="tooltip" data-placement="top" title="Supprimer cette compétence"></i></div></td></tr>';
    }

    $('#competences_body').html(contenuHtml);
    
    $('[data-toggle="tooltip"]').tooltip();
}

function listerFormations()
{
    $('#icone_formations').removeClass("clickable fa-plus-circle").addClass("fa-spinner fa-pulse").attr("onclick", "");
    
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'liste',
            type: 'formation'
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        liste_formations = data.liste;
        afficherFormations(liste_formations);        
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
    })
    .always(function() {
        //
    });
    
    $('#icone_formations').removeClass("fa-spinner fa-pulse").addClass("clickable fa-plus-circle").attr("onclick", "window.location.href = 'formation.html?mode=creation'");
}

function listerApprenants()
{
    document.getElementById("icone_apprenants").setAttribute("class", "fa fa-spinner fa-pulse");
    document.getElementById("icone_apprenants").setAttribute("onclick", "");
    
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'liste',
            type: 'apprenant',
            formation: formation
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        liste_apprenants = data.liste;
        afficherApprenants(liste_apprenants);        
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
    })
    .always(function() {
        //
    });
    document.getElementById("icone_apprenants").setAttribute("class", "clickable fa fa-plus-circle");
    document.getElementById("icone_apprenants").setAttribute("onclick", "window.location.href='apprenant.html?mode=creation&formation=" + formation + "'");
}

function listerCompetences()
{
    document.getElementById("icone_competences").setAttribute("class", "fa fa-spinner fa-pulse");
    document.getElementById("icone_competences").setAttribute("onclick", "");
    
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'liste',
            type: 'competence_generale',
            formation: formation
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        liste_competences = data.liste;
        afficherCompetences(liste_competences);        
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
    })
    .always(function() {
        //
    });
    document.getElementById("icone_competences").setAttribute("class", "clickable fa fa-plus-circle");
    document.getElementById("icone_competences").setAttribute("onclick", "window.location.href = 'competence_generale.html?mode=creation&formation=" + formation + "'");
}

function rechercherFormation()
{
    var contenu = document.getElementById("recherche_formation").value;
    var type = document.getElementById("type_recherche_formation").value;
    var liste;
    
    liste = liste_formations;
            
    switch(type)
    {
        case "Libellé" :
            type = "libelle";

            break;

        case "Domaine" :
            type = "domaine";

            break;
    }
    
    var worker = new Worker("js/ResearchWorker.js");
    
    worker.postMessage(["formation", type, contenu, liste, "stop"]);
    
    worker.onmessage = function(e)
    {
        $("#formations").collapse("show");
        $("#apprenants").collapse("hide");
        $("#competences_generales").collapse("hide");
        afficherFormations(JSON.parse(e.data));        
    };
}

function rechercherApprenant()
{
    var contenu = document.getElementById("recherche_apprenant").value;
    var type = document.getElementById("type_recherche_apprenant").value;
    var liste;
    
    liste = liste_apprenants;
            
    switch(type)
    {
        case "Nom" :
            type = "nom";

            break;

        case "Fonction" :
            type = "fonction";

            break;
            
        case "Entreprise" :
            type = "entreprise";

            break;
    }
    
    var worker = new Worker("js/ResearchWorker.js");
    
    worker.postMessage(["apprenant", type, contenu, liste, "stop"]);
    
    worker.onmessage = function(e)
    {
        $("#apprenants").collapse("show");
        afficherApprenants(JSON.parse(e.data));        
    };
}

function rechercherCompetence()
{
    var contenu = document.getElementById("recherche_competence").value;
    var type = document.getElementById("type_recherche_competence").value;
    var liste;
    
    liste = liste_competences;
            
    switch(type)
    {
        case "Libellé" :
            type = "libelle";

            break;

        case "Type" :
            type = "type";

            break;
    }
    
    var worker = new Worker("js/ResearchWorker.js");
    
    worker.postMessage(["competence", type, contenu, liste, "stop"]);
    
    worker.onmessage = function(e)
    {
        $("#competences").collapse("show");
        afficherCompetences(JSON.parse(e.data));        
    };
}

function deroulerFormations()
{
    document.getElementById("type_objet").value = "Formation";
    changerObjetRecherche();
    $('#formations').collapse("show");
    $('#apprenants').collapse("hide");
    $('#competences').collapse("hide");
}

function deroulerApprenants()
{
    document.getElementById("type_objet").value = "Apprenant";
    changerObjetRecherche();
    $('#formations').collapse("hide");
    $('#apprenants').collapse("show");
    $('#competences').collapse("hide");
}

function deroulerCompetences()
{
    document.getElementById("type_objet").value = "Compétence générale";
    changerObjetRecherche();
    $('#formations').collapse("hide");
    $('#apprenants').collapse("hide");
    $('#competences').collapse("show");
}

function demandeSuppressionFormation(id)
{
    document.getElementById("voir_" + id + "_").setAttribute("class", "clickable fa fa-times-circle");
    document.getElementById("supprimer_" + id + "_").setAttribute("class", "clickable fa fa-check-circle");
    $('#supprimer_' + id + '_').attr('title', 'Valider').tooltip('fixTitle').tooltip('show');
    $('#voir_' + id + '_').attr('title', 'Annuler').tooltip('fixTitle');
    document.getElementById("supprimer_" + id + "_").setAttribute("onclick", "supprimerFormation('" + id + "')");
    document.getElementById("voir_" + id + "_").setAttribute("onclick", "annulerSuppressionFormation('" + id + "')");
    
}

function demandeSuppressionApprenant(id)
{
    document.getElementById("voir_" + id + "_").setAttribute("class", "clickable fa fa-times-circle");
    document.getElementById("supprimer_" + id + "_").setAttribute("class", "clickable fa fa-check-circle");
    $('#noter_' + id + '_').removeClass("fa-pencil");
    $('#supprimer_' + id + '_').attr('title', 'Valider').tooltip('fixTitle').tooltip('show');
    $('#voir_' + id + '_').attr('title', 'Annuler').tooltip('fixTitle');
    document.getElementById("supprimer_" + id + "_").setAttribute("onclick", "supprimerApprenant('" + id + "')");
    document.getElementById("voir_" + id + "_").setAttribute("onclick", "annulerSuppressionApprenant('" + id + "')");
    
}

function demandeSuppressionCompG(id)
{
    document.getElementById("voir_" + id + "_").setAttribute("class", "clickable fa fa-times-circle");
    document.getElementById("supprimer_" + id + "_").setAttribute("class", "clickable fa fa-check-circle");
    $('#supprimer_' + id + '_').attr('title', 'Valider').tooltip('fixTitle').tooltip('show');
    $('#voir_' + id + '_').attr('title', 'Annuler').tooltip('fixTitle');
    document.getElementById("supprimer_" + id + "_").setAttribute("onclick", "supprimerCompG('" + id + "')");
    document.getElementById("voir_" + id + "_").setAttribute("onclick", "annulerSuppressionCompG('" + id + "')");
    
}

function supprimerFormation(id)
{
    $('#supprimer_' + id + '_').tooltip('hide');
    document.getElementById("voir_" + id + "_").setAttribute("class", "");
    document.getElementById("supprimer_" + id + "_").setAttribute("class", "fa fa-spinner fa-pulse");
    $('#supprimer_' + id + '_').attr('title', 'Supprimer cette formation').tooltip('fixTitle').tooltip('show');
    $('#voir_' + id + '_').attr('title', 'Visualiser cette formation').tooltip('fixTitle');
    document.getElementById("supprimer_" + id + "_").setAttribute("onclick", "demandeSuppressionFormation('" + id + "')");
    document.getElementById("voir_" + id + "_").setAttribute("onclick", "window.location.href='formation.html?mode=modification&code=" + id + "'");
    
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'suppression',
            type: 'formation',
            code: id
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        //liste_formations = data.retour;
        listerFormations();   
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
    })
    .always(function() {
        //
    });
}

function supprimerApprenant(id)
{
    $('#supprimer_' + id + '_').tooltip('hide');
    document.getElementById("voir_" + id + "_").setAttribute("class", "");
    document.getElementById("supprimer_" + id + "_").setAttribute("class", "fa fa-spinner fa-pulse");
    $('#supprimer_' + id + '_').attr('title', 'Supprimer cet apprenant').tooltip('fixTitle').tooltip('show');
    $('#voir_' + id + '_').attr('title', 'Visualiser cet apprenant').tooltip('fixTitle');
    document.getElementById("supprimer_" + id + "_").setAttribute("onclick", "demandeSuppressionApprenant('" + id + "')");
    document.getElementById("voir_" + id + "_").setAttribute("onclick", "window.location.href='apprenant.html?mode=modification&code=" + id + "'");
    
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'suppression',
            type: 'apprenant',
            code: id
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        //liste_apprenants = data.retour;
        listerApprenants();   
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
    })
    .always(function() {
        //
    });
}

function supprimerCompG(id)
{
    $('#supprimer_' + id + '_').tooltip('hide');
    document.getElementById("voir_" + id + "_").setAttribute("class", "");
    document.getElementById("supprimer_" + id + "_").setAttribute("class", "fa fa-spinner fa-pulse");
    $('#supprimer_' + id + '_').attr('title', 'Supprimer cette compétence').tooltip('fixTitle').tooltip('show');
    $('#voir_' + id + '_').attr('title', 'Visualiser cette compétence').tooltip('fixTitle');
    document.getElementById("supprimer_" + id + "_").setAttribute("onclick", "demandeSuppressionCompG('" + id + "')");
    document.getElementById("voir_" + id + "_").setAttribute("onclick", "window.location.href='competence_generale.html?mode=modification&code=" + id + "'");
    
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'suppression',
            type: 'competence_generale',
            code: id
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        //liste_competences = data.retour;
        listerCompetences();   
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
    })
    .always(function() {
        //
    });
}

function annulerSuppressionFormation(id)
{
    document.getElementById("voir_" + id + "_").setAttribute("class", "clickable fa fa-list");
    document.getElementById("supprimer_" + id + "_").setAttribute("class", "clickable glyphicon glyphicon-trash");
    $('#supprimer_' + id + '_').attr('title', 'Supprimer cette formation').tooltip('fixTitle');
    $('#voir_' + id + '_').attr('title', 'Visualiser cette formation').tooltip('fixTitle').tooltip('show');
    document.getElementById("supprimer_" + id + "_").setAttribute("onclick", "demandeSuppressionFormation('" + id + "')");
    document.getElementById("voir_" + id + "_").setAttribute("onclick", "window.location.href='formation.html?mode=modification&code=" + id + "'");
}

function annulerSuppressionApprenant(id)
{
    document.getElementById("voir_" + id + "_").setAttribute("class", "clickable fa fa-list");
    document.getElementById("supprimer_" + id + "_").setAttribute("class", "clickable glyphicon glyphicon-trash");
    $('#supprimer_' + id + '_').attr('title', 'Supprimer cet apprenant').tooltip('fixTitle');
    $('#voir_' + id + '_').attr('title', 'Visualiser cet apprenant').tooltip('fixTitle').tooltip('show');
    $('#noter_' + id + '_').addClass("fa-pencil");
    document.getElementById("supprimer_" + id + "_").setAttribute("onclick", "demandeSuppressionApprenant('" + id + "')");
    document.getElementById("voir_" + id + "_").setAttribute("onclick", "window.location.href='apprenant.html?mode=modification&code=" + id + "'");
}

function annulerSuppressionCompG(id)
{
    document.getElementById("voir_" + id + "_").setAttribute("class", "clickable fa fa-list");
    document.getElementById("supprimer_" + id + "_").setAttribute("class", "clickable glyphicon glyphicon-trash");
    $('#supprimer_' + id + '_').attr('title', 'Supprimer cette compétence').tooltip('fixTitle');
    $('#voir_' + id + '_').attr('title', 'Visualiser cette compétence').tooltip('fixTitle').tooltip('show');
    document.getElementById("supprimer_" + id + "_").setAttribute("onclick", "demandeSuppressionCompG('" + id + "')");
    document.getElementById("voir_" + id + "_").setAttribute("onclick", "window.location.href='competence_generale.html?mode=modification&code=" + id + "'");
}

function selectionnerFormation(id)
{
    formation = id;
    $('#formation_' + id + '_').addClass('active').siblings().removeClass('active');
    listerApprenants();
    listerCompetences();
    $('#ligne_apprenants').css("visibility", "visible");
    $('#ligne_competences').css("visibility", "visible");
}

function disableClickFormation(id)
{
    $('#formation_' + id + '_').attr("onclick", "");
}

function enableClickFormation(id)
{
    $('#formation_' + id + '_').attr("onclick", "selectionnerFormation('" + id + "')");
}