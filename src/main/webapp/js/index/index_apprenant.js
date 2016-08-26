/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var param = window.location.search.substring(1).split("&");
var type = param[0].split("=")[1];
var formation = null;
var liste_competences;

jQuery(document).ready(function($) {
    $('#competences').collapse("show");
    $(".clickable-row").click(function() {
        window.document.location = $(this).data("href");
    });
});

(function()
{
    detailsPersonne();
    listerCompetences();
}());

function afficherCompetences(competences)
{
    var contenuHtml = '';
        
    for (var i = 0; i < competences.length; i++)
    {
        var c = competences[i];

        contenuHtml += '<tr id="competence_' + c.code + '_"><td>' + c.libelle + '</td><td>' + c.categorie + '</td><td>' + c.nb_comp + '</td>';
        contenuHtml += '<td><div class="text-center"><i class="clickable fa fa-pencil" id="noter_' + c.code + '_" onclick="window.location.href=\'autoevaluation.html?formation=' + formation + '&competence=' + c.code + '\'" data-toggle="tooltip" data-placement="top" title="S\'autoévaluer pour cette compétence"></i></div></td>';
        contenuHtml += '<td><div class="text-center"><i class="clickable fa fa-list" id="voir_' + c.code + '_" onclick="window.location.href=\'competence_generale.html?mode=modification&code=' + c.code + '\'" data-toggle="tooltip" data-placement="top" title="Visualiser cette compétence"></i></div></td>';
    }

    $('#competences_body').html(contenuHtml);
    
    $('[data-toggle="tooltip"]').tooltip();
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
    document.getElementById("icone_competences").setAttribute("class", "");
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

function deroulerCompetences()
{
    document.getElementById("type_objet").value = "Compétence générale";
    changerObjetRecherche();
    $('#competences').collapse("show");
}

function detailsPersonne()
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'personne',
            code: identifiant
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
         formation = data.obj.formation;
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function voirApprenant()
{
    window.location.href = "apprenant.html?mode=modification&code=" + sessionStorage.getItem("apprenant");
}