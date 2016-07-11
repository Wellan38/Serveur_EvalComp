/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var param = window.location.search.substring(1).split('&');
var code_form = param[0].split('=')[1];
var formation;
var competences;
var toutes_competences;
var ajoutComp = false;

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    detailsFormation();
    listerCompetences();
});

function detailsFormation()
{
    $.ajax({
        url: "./ActionServlet",
        type: "GET",
        data: {
            action: "infos",
            type: "formation",
            code: code_form
        },
        async:false,
        dataType: "json"
    })
    .done(function(data) {
        formation = data.obj;

        var contenuHtml = "";

        for (var i = 0; i < competences.length; i++)
        {
            var c = competences[i];
            
            contenuHtml += "<tr>";
            contenuHtml += "<td>" + c.code + "</td>";
            contenuHtml += "<td>" + c.libelle + "</td>";
            contenuHtml += "<td>" + c.seuil_min + "</td>";
            contenuHtml += "<td>" + c.seuil_max + "</td>";
            contenuHtml += "<td>" + c.nb_comp + "</td>";
            contenuHtml += '<td><div class="text-center"><i class="clickable glyphicon glyphicon-chevron-right" id="voir_' + c.code + '_" onclick="detailsCompetence(\'' + c.code + '\')" data-toggle="tooltip" data-placement="top" title="Visualiser cette compétence"></i></div></td>';
            contenuHtml += '<td><div class="text-center"><i class="clickable glyphicon glyphicon-trash" id="supprimer_' + c.code + '_" onclick="demandeSuppressionCompG(\'' + c.code + '\')" data-toggle="tooltip" data-placement="top" data-original-title="Retirer cette compétence de la formation"></i></div></td></tr>';
            
            contenuHtml += "<tr><td colspan='7'><div id='comp_"+ c.code + "_' class='collapse'></div></td></tr>";
        }
        
        if (c != null)
        {
            document.getElementById('legende').innerHTML = "Formation : " + c.libelle_formation;
        }
        
        document.getElementById("liste_comp").innerHTML = contenuHtml;
        
        document.getElementById("icone_competences").setAttribute("class", "clickable glyphicon glyphicon-plus-sign");
        document.getElementById("icone_competences").setAttribute("onclick", "ajouterCompG()");
    })
    .fail(function() {
        console.log("Erreur dans le chargement de la liste.");
    })
    .always(function() {
        //
    });
}

function listerCompetences()
{
    document.getElementById("icone_competences").setAttribute("class", "glyphicon glyphicon-refresh gly-spin");
    if (!ajoutComp)
    {
        $.ajax({
            url: "./ActionServlet",
            type: "GET",
            data: {
                action: "liste",
                type: "competence_generale",
                formation: code_form
            },
            async:false,
            dataType: "json"
        })
        .done(function(data) {
            competences = data.liste;

            var contenuHtml = "";

            for (var i = 0; i < competences.length; i++)
            {
                var c = competences[i];

                contenuHtml += "<tr>";
                contenuHtml += "<td>" + c.code + "</td>";
                contenuHtml += "<td>" + c.libelle + "</td>";
                contenuHtml += "<td>" + c.seuil_min + "</td>";
                contenuHtml += "<td>" + c.seuil_max + "</td>";
                contenuHtml += "<td>" + c.nb_comp + "</td>";
                contenuHtml += '<td><div class="text-center"><i class="clickable glyphicon glyphicon-chevron-right" id="voir_' + c.code + '_" onclick="detailsCompetence(\'' + c.code + '\')" data-toggle="tooltip" data-placement="top" title="Visualiser cette compétence"></i></div></td>';
                contenuHtml += '<td><div class="text-center"><i class="clickable glyphicon glyphicon-trash" id="supprimer_' + c.code + '_" onclick="demandeSuppressionCompG(\'' + c.code + '\')" data-toggle="tooltip" data-placement="top" data-original-title="Retirer cette compétence de la formation"></i></div></td></tr>';

                contenuHtml += "<tr><td colspan='7'><div id='comp_"+ c.code + "_' class='collapse'></div></td></tr>";
            }

            if (c != null)
            {
                document.getElementById('legende').innerHTML = "Formation : " + c.libelle_formation;
            }

            document.getElementById("liste_comp").innerHTML = contenuHtml;

            document.getElementById("icone_competences").setAttribute("class", "clickable glyphicon glyphicon-plus-sign");
            document.getElementById("icone_competences").setAttribute("onclick", "ajouterCompG()");
        })
        .fail(function() {
            console.log("Erreur dans le chargement de la liste.");
        })
        .always(function() {
            //
        });
    }
    else
    {
        $.ajax({
        url: "./ActionServlet",
        type: "GET",
        data: {
            action: "liste",
            type: "competence_generale"
        },
        async:false,
        dataType: "json"
    })
    .done(function(data) {
        toutes_competences = data.liste;

        var contenuHtml = "";

        for (var i = 0; i < toutes_competences.length; i++)
        {
            var c = toutes_competences[i];
            var trouve = false;
            for (var j = 0; j < competences.length; j++)
            {
                if (competences[j].code == c.code)
                {
                    trouve = true;
                    break;
                }
            }
            
            if (!trouve)
            {
                contenuHtml += "<tr>";
                contenuHtml += "<td>" + c.code + "</td>";
                contenuHtml += "<td>" + c.libelle + "</td>";
                contenuHtml += "<td>" + c.seuil_min + "</td>";
                contenuHtml += "<td>" + c.seuil_max + "</td>";
                contenuHtml += "<td>" + c.nb_comp + "</td>";
                contenuHtml += '<td><div class="text-center"><i class="clickable glyphicon glyphicon-chevron-right" id="voir_' + c.code + '_" onclick="detailsCompetence(\'' + c.code + '\')" data-toggle="tooltip" data-placement="top" title="Visualiser cette compétence"></i></div></td>';
                contenuHtml += '<td><div class="text-center"><i class="clickable glyphicon glyphicon-ok" id="ajouter_' + c.code + '_" onclick="validerAjout(\'' + c.code + '\')" data-toggle="tooltip" data-placement="top" data-original-title="Ajouter cette compétence à formation"></i></div></td></tr>';

                contenuHtml += "<tr><td colspan='7'><div id='comp_"+ c.code + "_' class='collapse'></div></td></tr>";
            }
        }
        
        if (c != null)
        {
            document.getElementById('legende').innerHTML = "Formation : " + c.libelle_formation;
        }
        
        document.getElementById("liste_comp").innerHTML = contenuHtml;
        
        document.getElementById("icone_competences").setAttribute("class", "clickable glyphicon glyphicon-plus-sign");
        document.getElementById("icone_competences").setAttribute("onclick", "ajouterCompG()");
    })
    .fail(function() {
        console.log("Erreur dans le chargement de la liste.");
    })
    .always(function() {
        //
    });
    }
}

function detailsCompetence(id)
{
    if ($('#comp_' + id + '_').is(":hidden"))
    {
        $.ajax({
            url: "./ActionServlet",
            type: "GET",
            data: {
                action: "infos",
                type: "competence_generale",
                code: id
            },
            async:false,
            dataType: "json"
        })
        .done(function(data) {
            var c = data.obj;

            var contenuHtml = "<div class='container'><div class='row'><div class='col-md-6' id='infos_" + c.code + "_'><form class='form-horizontal'>";
            contenuHtml += "<div class='form-group'><label for='code_competence_' class='col-xs-4 col-sm-4 col-md-3 control-label'>Code :</label>";
            contenuHtml += "<div class='col-xs-8 col-sm-8 col-md-9'><input type='text' class='form-control' id='code_competence__" + c.code + "_' value='" + c.code + "' disabled></div>";
            contenuHtml += "</div>";

            contenuHtml += "<div class='form-group'><label for='categorie_competence_' class='col-xs-4 col-sm-4 col-md-3 control-label'>Catégorie :</label>";
            contenuHtml += "<div class='col-xs-8 col-sm-8 col-md-9'><input type='text' class='form-control' id='categorie_competence__" + c.code + "_' value='" + c.categorie + "'></div>";
            contenuHtml += "</div>";

            contenuHtml += "<div class='form-group'><label for='libelle_competence_' class='col-xs-4 col-sm-4 col-md-3 control-label'>Libellé :</label>";
            contenuHtml += "<div class='col-xs-8 col-sm-8 col-md-9'><input type='text' class='form-control' id='libelle_competence__" + c.code + "_' value='" + c.libelle + "'></div>";
            contenuHtml += "</div>";

            contenuHtml += "<div class='form-group'><label for='seuil_min_competence_' class='col-xs-4 col-sm-4 col-md-3 control-label'>Seuil minimal :</label>";
            contenuHtml += "<div class='col-xs-8 col-sm-8 col-md-9'><input type='text' class='form-control' id='seuil_min_competence__" + c.code + "_' value='" + c.seuil_min + "'></div>";
            contenuHtml += "</div>";

            contenuHtml += "<div class='form-group'><label for='seuil_max_competence_' class='col-xs-4 col-sm-4 col-md-3 control-label'>Seuil maximal :</label>";
            contenuHtml += "<div class='col-xs-8 col-sm-8 col-md-9'><input type='text' class='form-control' id='seuil_max_competence__" + c.code + "_' value='" + c.seuil_max + "'></div>";
            contenuHtml += "</div>";

            contenuHtml += "<div class='text-center'>";
            contenuHtml += "<button type='button' class='btn btn-danger' id='annuler_" + c.code + "_' onclick='detailsCompetence(\"" + id + "\")'><span class='glyphicon glyphicon-remove'></span> Annuler</button>";
            contenuHtml += "<button type='button' class='btn btn-success' id='valider_" + c.code + "_' onclick='validerModifs(\"" + c.code + "\")'><span class='glyphicon glyphicon-check'></span> Valider</button>";
            contenuHtml += "<h4><span class='glyphicon' id='icone_retour__" + c.code +"_'></span></h4>";
            contenuHtml += "</div></div>";

            contenuHtml += "<div class='col-md-6' id='comp_spec__" + c.code + "_'></div>";
            contenuHtml += "</div></div>";

            document.getElementById('comp_' + c.code + '_').innerHTML = contenuHtml;

            var contient = false;
            for (var i = 0; i < competences.length; i++)
            {
                if (competences[i].code == c.code)
                {
                    contient = true;
                    break;
                }
            }

            if (!contient)
            {
                competences.push(c);
            }

            afficherCompS(c.code, c.compSpec, null);

            $('#comp_' + id + '_').collapse("show");
            document.getElementById("voir_" + id + "_").setAttribute("class", "clickable glyphicon glyphicon-chevron-down");
        })
        .fail(function() {
            console.log("Erreur dans le chargement des informations.");
        })
        .always(function() {
            //
        });
    }
    else
    {
        $('#comp_' + id + '_').collapse("hide");
        document.getElementById("voir_" + id + "_").setAttribute("class", "clickable glyphicon glyphicon-chevron-right");
    }
}

function validerModifs(codeG)
{
    document.getElementById('icone_retour__' + codeG + '_').setAttribute('class', 'glyphicon glyphicon-refresh gly-spin');
    
    var compS;
    for (var i = 0; i < competences.length; i++)
    {
        if (competences[i].code == codeG)
        {
            console.log('ok');
            compS = competences[i].compSpec
            console.log(compS);
        }
    }
    
    $.ajax({
        url: "./ActionServlet",
        type: "POST",
        data: {
            action: "modification",
            type: "competence_generale",
            code: document.getElementById("code_competence__" + codeG + "_").value,
            libelle: document.getElementById("libelle_competence__" + codeG + "_").value,
            categorie: document.getElementById("categorie_competence__" + codeG + "_").value,
            seuil_min: document.getElementById("seuil_min_competence__" + codeG + "_").value,
            seuil_max: document.getElementById("seuil_max_competence__" + codeG + "_").value,
            compSpec: JSON.stringify(compS)
        },
        async:false,
        dataType: "json"
    })
    .done(function(data) {
        
        var retour = data.retour;
        
        if (retour.valide)
        {
            document.getElementById('icone_retour__' + codeG + '_').setAttribute('class', 'glyphicon glyphicon-ok');
        }
        else
        {
            document.getElementById('icone_retour__' + codeG + '_').setAttribute('class', 'glyphicon glyphicon-remove');
        }
        
        setTimeout(function() {
            document.getElementById('icone_retour__' + codeG + '_').setAttribute('class', 'glyphicon');
        }, 2000);
    })
    .fail(function() {
        console.log("Erreur dans le chargement des informations.");
    })
    .always(function() {
        //
    });
}

function demandeSuppressionCompG(id)
{
    document.getElementById("voir_" + id + "_").setAttribute("class", "clickable glyphicon glyphicon-remove-sign");
    document.getElementById("supprimer_" + id + "_").setAttribute("class", "clickable glyphicon glyphicon-ok-sign");
    $('#supprimer_' + id + '_').attr('data-original-title', 'Valider').tooltip('fixTitle').tooltip('show');
    $('#voir_' + id + '_').attr('data-original-title', 'Annuler').tooltip('fixTitle');
    document.getElementById("supprimer_" + id + "_").setAttribute("onclick", "retirerCompG('" + id + "')");
    document.getElementById("voir_" + id + "_").setAttribute("onclick", "annulerSuppressionCompG('" + id + "')");
    
}

function retirerCompG(id)
{
    $('#supprimer_' + id + '_').tooltip('hide');
    document.getElementById("voir_" + id + "_").setAttribute("class", "");
    document.getElementById("supprimer_" + id + "_").setAttribute("class", "glyphicon glyphicon-refresh gly-spin");
    $('#supprimer_' + id + '_').attr('data-original-title', 'Retirer cette compétence de la formation').tooltip('fixTitle').tooltip('show');
    $('#voir_' + id + '_').attr('data-original-title', 'Visualiser cette compétence').tooltip('fixTitle');
    document.getElementById("supprimer_" + id + "_").setAttribute("onclick", "demandeSuppressionCompG('" + id + "')");
    document.getElementById("voir_" + id + "_").setAttribute("onclick", "window.location.href='competence_generale.html?mode=modification&code=" + id + "'");
    
    for (var i = 0; i < competences.length; i++)
    {
        if (competences[i].code === id)
        {
            pond = competences[i].ponderation;
            competences.splice(competences.indexOf(competences[i]), 1);
            break;
        }
    }
    
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'modification',
            type: 'formation',
            code: formation.code,
            libelle: formation.libelle,
            domaine: formation.domaine,
            url: formation.url,
            duree: formation.duree,
            date: formation.date,
            competences: JSON.stringify(competences)
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        listerCompetences();   
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
    })
    .always(function() {
        //
    });
}

function annulerSuppressionCompG(id)
{
    document.getElementById("voir_" + id + "_").setAttribute("class", "clickable glyphicon glyphicon-chevron-right");
    document.getElementById("supprimer_" + id + "_").setAttribute("class", "clickable glyphicon glyphicon-trash");
    $('#supprimer_' + id + '_').attr('data-original-title', 'Retirer cette compétence de la formation').tooltip('fixTitle');
    $('#voir_' + id + '_').attr('data-original-title', 'Visualiser cette compétence').tooltip('fixTitle').tooltip('show');
    document.getElementById("supprimer_" + id + "_").setAttribute("onclick", "demandeSuppressionCompG('" + id + "')");
    document.getElementById("voir_" + id + "_").setAttribute("onclick", "detailsCompetence('" + id + "')");
}

function ajouterCompG()
{
    ajoutComp = true;
    
    document.getElementById("icone_competences").setAttribute("data-original-title", "Créer une nouvelle compétence");
    listerCompetences();
    $('#icone_competences').attr("onclick", "window.location.href = 'competence_generale.html?mode=creation&formation=" + formation.code + "'");
}

function validerAjout(id)
{
    var c = null;
    for (var i = 0; i < toutes_competences.length; i++)
    {
        if (toutes_competences[i].code == id)
        {
            c = toutes_competences[i];
        }
    }
    
    if (c != null)
    {
        competences.push(c);
        
        $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'modification',
            type: 'formation',
            code: formation.code,
            libelle: formation.libelle,
            domaine: formation.domaine,
            url: formation.url,
            duree: formation.duree,
            date: formation.date,
            competences: JSON.stringify(competences)
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        ajoutComp = false;
        listerCompetences();   
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
    })
    .always(function() {
        //
    });
    }
}