/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var param = window.location.search.substring(1).split("&");
var mode = param[0].split("=")[1];
var formation = null;
var code;
var apprenant = null;
var liste_formations;
var compSpec;
var myRadarChart;
var chartIsGeneral = true;

(function()
{
    $.material.init();
    if (mode === "creation")
    {
        formation = param[1].split("=")[1];
        document.getElementById("details").setAttribute("class", "col-sm-12");
        
        document.getElementById("annuler").innerHTML += ' Retour aux apprenants';
        document.getElementById("valider").innerHTML += ' Créer l\'apprenant';
        
        $('#boutons_modifs').show();
        
        listerFormations();
        afficherFormations();
    }
    else if (mode === "modification")
    {
        code = param[1].split("=")[1];
        document.getElementById("code_apprenant").disabled = "true";
        
        $('#details').addClass("col-sm-6");
        
        document.getElementById("annuler").innerHTML += ' Annuler les modifications';
        document.getElementById("valider").innerHTML += ' Valider les modifications';
        
        detailsApprenant(); 
        
        document.getElementById("graphique").onclick = function(evt)
        {
            var activePoints = myRadarChart.getElementsAtEvent(evt);
            var index = activePoints[0]["_index"];
            creerGraphiqueSpecifique(competences_g[index].code);
            chartIsGeneral = false;
        };
        
        if (est_apprenant)
        {
            $(':input').attr("disabled", true);
        }
        else
        {
            $('#boutons_modifs').show();
        }
    }
       
}());

function detailsApprenant()
{    
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'apprenant',
            code: code
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        apprenant = data.obj;
        
        document.getElementById("legende").innerHTML = "Apprenant : " + apprenant.nom;
        $('#code_apprenant').attr("value", apprenant.code).trigger("change");
        $('#nom_apprenant').attr("value", apprenant.nom).trigger("change");
        $('#fonction_apprenant').attr("value", apprenant.fonction).trigger("change");
        $('#entreprise_apprenant').attr("value", apprenant.entreprise).trigger("change");
        
        listerFormations();
        
        afficherFormations();
        
        if (apprenant.formation != null)
        {
            $("#details").attr("class", "col-sm-6");
            $("#radar").attr("class", "col-sm-6");
            document.getElementById("radar").innerHTML = '<label id="label_comp">Compétences générales :</label><canvas id="graphique"></canvas>';

            detailsFormation(apprenant.formation);
            
            grades = apprenant.grades;
            scores = apprenant.scores;

            creerGraphiqueGeneral();
        }
        
        document.getElementById("legende").innerHTML = 'Apprenant : ' + apprenant.nom;
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function afficherFormations()
{
    for (var i = 0; i < liste_formations.length; i++)
    {
        if ((apprenant !== null && apprenant.formation === liste_formations[i].code) || (formation !== null &&formation === liste_formations[i].code))
        {
            if (mode === "creation")
            {
                document.getElementById("legende").innerHTML = "Création d'un apprenant pour la formation : " + liste_formations[i].libelle;
            }
            var f = liste_formations[0];
            liste_formations[0] = liste_formations[i];
            liste_formations[i] = f;
        }
    }
    
    var contenuHtml = '';
    
    for (var i = 0; i < liste_formations.length; i++)
    {
        contenuHtml += '<option id="formation_\'' + liste_formations[i].code + '\'">' + liste_formations[i].libelle + '</option>';
    }
    
    $('#formation_apprenant').html(contenuHtml).trigger("change");
}

function detailsFormation(formation)
{
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
        competences_g = data.liste;
        set_seuils(formation);
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function set_seuils(formation)
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'formation',
            code: formation
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        seuils_min = data.obj.seuils_min;
        seuils_max = data.obj.seuils_max;
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function listerFormations()
{
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
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function validerModifs()
{    
    var formation = document.getElementById("formation_apprenant");
    
    var id_form = formation[formation.selectedIndex].id.split("_")[1].replace(/'/g, "");
    
    if (mode === "modification")
    {
        afficherRetour("modifs_en_cours");
        
        $.ajax({
            url: './ActionServlet',
            type: 'POST',
            data: {
                action: 'modification',
                type: 'apprenant',
                code: document.getElementById('code_apprenant').value,
                nom: document.getElementById('nom_apprenant').value,
                fonction: document.getElementById('fonction_apprenant').value,
                entreprise: document.getElementById('entreprise_apprenant').value,
                formation: id_form
            },
            async:false,
            dataType: 'json'
        })
        .done(function(data) {

            var retour = data.retour;

            if (retour.valide)
            {
                afficherRetour("modifs_acceptees");
            }
            else
            {
                afficherRetour("modifs_refusees");
            }
        })
        .fail(function() {
            console.log('Erreur dans le chargement des informations.');
        })
        .always(function() {
            //
        });
    }
    else if (mode === "creation")
    {
        afficherRetour("creation_apprenant_en_cours");
        
        $.ajax({
        url: './ActionServlet',
        type: 'POST',
        data: {
            action: 'creation',
            type: 'apprenant',
            code: document.getElementById('code_apprenant').value,
            nom: document.getElementById('nom_apprenant').value,
            fonction: document.getElementById('fonction_apprenant').value,
            entreprise: document.getElementById('entreprise_apprenant').value,
            formation: id_form
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        
        var retour = data.retour;
        
        if (retour.valide)
        {
            afficherRetour("creation_apprenant_acceptee");
        }
        else
        {
            afficherRetour("creation_apprenant_refusee");
        }
        
        setTimeout(function() {
            document.getElementById("icone_retour").setAttribute("class", "");
            window.location.href = "apprenant.html?mode=modification&code=" + document.getElementById('code_apprenant').value;
        }, 2000);
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
    }
}