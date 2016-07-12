/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var param = window.location.search.substring(1).split("&");
var mode = param[0].split("=")[1];
var code;
var liste_formations;
var compSpec;
var myRadarChart;
var chartIsGeneral = true;

(function() {
    if (mode === "creation")
    {
        document.getElementById("details").setAttribute("class", "col-sm-12");
        document.getElementById("annuler").innerHTML += ' Retour aux apprenants';
        document.getElementById("valider").innerHTML += ' Créer l\'apprenant';
        listerFormations();
        afficherFormations();
    }
    else if (mode === "modification")
    {
        code = param[1].split("=")[1];
        document.getElementById("code_apprenant").disabled = "true";
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
    }
       
}());

function detailsApprenant()
{
    document.getElementById("legende").innerHTML = 'Apprenant : <h4><i class="glyphicon glyphicon-refresh gly-spin"></h4>';
    
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
        var apprenant = data.obj;
        
        document.getElementById("legende").innerHTML = "Apprenant : " + apprenant.nom;
        document.getElementById("code_apprenant").value = apprenant.code;
        document.getElementById("nom_apprenant").value = apprenant.nom;
        document.getElementById("fonction_apprenant").value = apprenant.fonction;
        document.getElementById("entreprise_apprenant").value = apprenant.entreprise;
        
        listerFormations();
        
        afficherFormations();
        
        if (apprenant.formation != null)
        {
            document.getElementById("details").setAttribute("class", "col-sm-6");
            document.getElementById("radar").setAttribute("class", "col-sm-6");
            document.getElementById("radar").innerHTML = '<label id="label_comp">Compétences générales :</label><canvas id="graphique"></canvas>';
            
            for (var i = 0; i < liste_formations.length; i++)
            {
                if (apprenant.formation === liste_formations[i].code)
                {
                    var f = liste_formations[0];
                    liste_formations[0] = liste_formations[i];
                    liste_formations[i] = f;
                }
            }

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
    var contenuHtml = '';
    
    for (var i = 0; i < liste_formations.length; i++)
    {
        contenuHtml += '<option id="formation_\'' + liste_formations[i].code + '\'">' + liste_formations[i].libelle + '</option>';
    }
    
    document.getElementById("formation_apprenant").innerHTML = contenuHtml;
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
    document.getElementById("icone_retour").setAttribute("class", "glyphicon glyphicon-refresh gly-spin");
    
    var formation = document.getElementById("formation_apprenant");
    
    var id_form = formation[formation.selectedIndex].id.split("_")[1].replace(/'/g, "");
    
    if (mode === "modification")
    {
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
                document.getElementById("icone_retour").setAttribute("class", "glyphicon glyphicon-ok");
            }
            else
            {
                document.getElementById("icone_retour").setAttribute("class", "glyphicon glyphicon-remove");
            }

            setTimeout(function() {
                document.getElementById("icone_retour").setAttribute("class", "");
            }, 2000);
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
            document.getElementById("icone_retour").setAttribute("class", "glyphicon glyphicon-ok");
        }
        else
        {
            document.getElementById("icone_retour").setAttribute("class", "glyphicon glyphicon-remove");
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