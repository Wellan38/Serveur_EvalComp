/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var param = window.location.search.substring(1).split("&");
var formation = param[0].split("=")[1];
var apprenant = param[1].split("=")[1];

var liste_formations;
var liste_apprenants;
var liste_competences;
var scores = [];
var regle;

var myRadarChart = null;

(function(){
    listerCompetences();
})();

function listerCompetences()
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
        liste_competences = data.liste;
        afficherCompetences();
        
        for (var i = 0; i < data.liste.length; i++)
        {
            detailsComp(data.liste[i].code);
        }
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
    })
    .always(function() {
        //
    });
}

function afficherCompetences()
{
    var contenuHtml = '';
    
    for (var i = 0; i < liste_competences.length; i++)
    {
        contenuHtml += '<div class="row"><div style="padding: 15px 0px 0px 0px;"><div class="panel panel-default" id="panel_comp_' + liste_competences[i].code + '_"><div class="panel-heading clearfix">';
        contenuHtml += '<h4 class="panel-title pull-left"><a class="clickable accordion-toggle" data-toggle="collapse" href="#comp_' + liste_competences[i].code + '_">' + liste_competences[i].libelle + '</a></h4><h4 class="pull-right" style="margin: 0px;"><i class="fa fa-clock-o" style="padding-right: 10px;"></i><i class="fa fa-spinner fa-pulse" id="icone_' + liste_competences[i].code + '_"></i></h4></div>';
        contenuHtml += '<div id="comp_' + liste_competences[i].code + '_" class="clickable panel-collapse collapse"></div>';
        contenuHtml += '</div></div></div>';
    }

    $('#competences').html(contenuHtml);
    
    for (var i = 0; i < liste_competences.length; i++)
    {
        $('#graphique_' + liste_competences[i].code + '_').hide();
    }
}

function detailsComp(code)
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'competence_generale',
            code: code.replace(/_/g, "")
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        var compSpec = data.obj.compSpec;
        
        var contenuHtml = '<div class="table-responsive"><table class="table table-hover" style="margin-bottom: 0px"><thead><tr>';
        contenuHtml += '<th style="width: 30%">Compétence spécifique</th>';
        contenuHtml += '<th style="width: 35%">Mise en situation</th>';
        contenuHtml += '<th style="width: 35%">Score</th>';
        contenuHtml += '<th class="minimal-cell"></th>';
        contenuHtml += '</tr></thead>';
        contenuHtml += '<tbody>';
        
        for (var i = 0; i < compSpec.length; i++)
        {
            var c = compSpec[i];
            contenuHtml += '<tr><td id="libelle_' + c.code + '_"></td>';
            contenuHtml += '<td id="mes_' + c.code + '_"></td>';
            contenuHtml += '<td id="regle_' + c.code + '_"></td>';
            contenuHtml += '<td style="padding-left: 0px;"><div class="text-center"><i class="clickable glyphicon glyphicon-list" id="visu_' + c.code + '_" onclick="window.location.href=\'competence_specifique.html?mode=modification&codeG=' + data.obj.code + '&codeS=' + c.code + '\'"></i></div></td>';
            contenuHtml += '</tr>';
        }
        
        contenuHtml += '</tbody>';
        contenuHtml += '</table></div>';
        
        $('#comp_' + code + '_').html(contenuHtml);
        $('#form_mes').hide();
        $('#form_regle').hide();
        
        for (var i = 0; i < compSpec.length; i++)
        {
            detailsCompS(code, compSpec[i].code);
        }
        
        afficherScores(code);
        
        $('#boutons_modifs').show();
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function afficherScores(competence)
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'liste',
            type: 'score',
            apprenant: apprenant,
            competence: competence.replace(/_/g, "")
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        
        if (data.liste.length === 0)
        {
            for (var i = 0; i < liste_competences.length; i++)
            {
                $('#icone_' + liste_competences[i].code + '_').removeClass("fa-spinner fa-pulse");
            }
        }
        
        for (var i = 0; i < data.liste.length; i++)
        {
            var index = null;
            
            for (var j = 0; j < scores.length; j++)
            {
                if (scores[j].competence == data.liste[i].competence)
                {
                    index = j;
                    break;
                }
            }
            
            if (index == null)
            {
                scores.push(data.liste[i]);
            }
            else
            {
                scores[index].note = data.liste[i].note;
            }
            
            ajouterScore(competence, data.liste[i].competence, data.liste[i].note);
        }
        
        for (var i = 0; i < liste_competences.length; i++)
    {
        $('#panel_comp_' + liste_competences[i].code + '_').on('hidden.bs.collapse', function (e) {
            $('#graphique_' + e.currentTarget.id.split("_")[2] + '_').hide();
        });
        
        $('#panel_comp_' + liste_competences[i].code + '_').on('shown.bs.collapse', function (e) {
            $('#graphique_' + e.currentTarget.id.split("_")[2] + '_').show();
        });
    }
        
//        for (var i = 0; i < scores.length; i++)
//        {
//            $('#note_' + scores[i].competence + '_' + scores[i].note).addClass('active').siblings().removeClass('active');
//        }
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
    })
    .always(function() {
        //
    });
}

function selectionnerCompS(code)
{
    for (var i = 0; i < liste_competences.length; i++)
    {
        for (var j = 0; j < liste_competences[i].compSpec.length; j++)
        {
            if (liste_competences[i].compSpec[j].code == code)
            {
                document.getElementById("comp_spec_" + code + "_").setAttribute("class", "row list-group-item active");
                detailsCompS(code);
            }
            else if(document.getElementById("comp_spec_" + liste_competences[i].compSpec[j].code + "_") !== null)
            {
                document.getElementById("comp_spec_" + liste_competences[i].compSpec[j].code + "_").setAttribute("class", "row list-group-item");
            }
        }
    }
}

function detailsCompS(codeG, codeS)
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'competence_specifique',
            code: codeS.replace(/_/g, "")
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        var c = data.obj;
        var code_regle = c.regle;
        
        document.getElementById("libelle_" + codeS + "_").innerHTML = c.libelle;
        
        var mes = c.miseensituation;
        
        document.getElementById("mes_" + codeS + "_").innerHTML = mes;
        
        infosRegle(code_regle);
        
        var r = regle.texte;
        
        var contenu_regle = '<ul class="list-group" style="margin-bottom: 0px" id="score_' + codeS + '">';
        
        for (var i = 0; i < r.length; i++)
        {
            var tab_regle = r[i].split(" ");
            var note = tab_regle[tab_regle.length - 1];
            tab_regle[0] = '<b>' + tab_regle[0] + '</b>';
            
            for (var j = tab_regle.length - 5; j < tab_regle.length; j++)
            {
                tab_regle[j] = '<b>' + tab_regle[j] + '</b>';
            }
            
            var texte = tab_regle.join(" ");
            
            contenu_regle += '<li class="clickable list-group-item" id="note_' + codeS + '_' + note + '" onclick="ajouterScore(\'' + codeG + '\', \'' + codeS + '\', ' + note + ')">' + texte + '</li>';
        }
        
        contenu_regle += '</ul>';
        
        document.getElementById("regle_" + codeS + "_").innerHTML = contenu_regle;
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function infosRegle(code)
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'regle',
            code: code.replace(/_/g, "")
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        regle = data.obj;
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function annulerModifs()
{
    listerCompetences();
}

function validerModifs()
{
    $('#icone_retour').attr("class", "glyphicon glyphicon-refresh gly-spin");
    
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'notation',
            apprenant: apprenant,
            scores: JSON.stringify(scores)
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        if (data.retour.valide)
        {
            $('#icone_retour').attr("class", "glyphicon glyphicon-ok");
        }
        else
        {
            $('#icone_retour').attr("class", "glyphicon glyphicon-remove");
        }
        
        setTimeout(function() {
            $('#icone_retour').attr("class", "glyphicon");
        }, 2000);
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function creerGraphiqueSpecifique(id)
{
    var c = null;
    
    for (var i = 0; i < liste_competences.length; i++)
    {
        if (liste_competences[i].code === id)
        {
            c = liste_competences[i];
            break;
        }
    }
    
    var scores_c = [];
    for (var i = 0; i < scores.length; i++)
    {
        for (var j = 0; j < c.compSpec.length; j++)
        {
            if (c.compSpec[j].code === scores[i].competence)
            {
                scores_c.push(scores[i]);
                break;
            }
        }
    }
    
    var labels = [];
    var data = [];

    for (var i = 0; i < c.compSpec.length; i++)
    {
        for (var j = 0; j < scores_c.length; j++)
        {
            if (c.compSpec[i].code === scores_c[j].competence)
            {
                var libelle = c.compSpec[i].libelle.split(" ")[0] + " : " + c.compSpec[i].ponderation;
                labels.push(libelle);
                data.push(scores_c[j].note);
                
                break;
            }
        }
    }
    
    if (myRadarChart !== null)
    {
        myRadarChart.destroy();
    }
    
    
    document.getElementById("libelle_compG").innerHTML = c.libelle;

    var ctx = document.getElementById("graph_spec").getContext("2d");
    var type, options;
    if (c.compSpec.length > 2)
    {
        type = 'radar';
        options = {
            legend: {
                display:false
            },
                scale: {
                    ticks: {
                        min: 0,
                        max: 10
                    }
                }
        };
    }
    else
    {
        type = 'bar';
        options = {
            legend: {
                display:false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        max: 10,
                        min: 0
                    }
                }]
            }
        };
    }
    
    var infos = {
        type: type,
        data: {
                labels: labels,
                datasets: [
                    {
                        backgroundColor: "rgba(0,0,255,0.2)",
                        borderColor: "rgba(0,0,255,1)",
                        borderWidth: 2,
                        pointBackgroundColor: "rgba(0,0,255,1)",
                        pointBorderColor: "#fff",
                        data: data
                    }
                ]  
            },
        options: options
    };

    myRadarChart = new Chart(ctx, infos);
}

function ajouterScore(codeG, codeS, note)
{
    $('#note_' + codeS + '_' + note).addClass('active').siblings().removeClass('active');
    
    var index = null;
    for (var i = 0; i < scores.length; i++)
    {
        if (scores[i].competence === codeS)
        {
            index = i;
            break;
        }
    }
    
    if (index === null)
    {
        scores.push({competence: codeS,note: note});
    }
    else
    {
        scores[index].note = note;
    }
    
    var c = null;
    for (var i = 0; i < liste_competences.length; i++)
    {
        if (liste_competences[i].code === codeG)
        {
            c = liste_competences[i];
            break;
        }
    }

    var complet = true;
    for (var i = 0; i < c.compSpec.length; i++)
    {
        var trouve = false;
        for (var j = 0; j < scores.length; j++)
        {
            if (scores[j].competence === c.compSpec[i].code)
            {
                trouve = true;
                break;
            }
        }
        if (!trouve)
        {
            complet = false;
            break;
        }
    }

    if (complet)
    {
        var compG = null;
        
        for (var i = 0; i < liste_competences.length; i++)
        {
            if (liste_competences[i].code === codeG)
            {
                compG = liste_competences[i];
                break;
            }
        }
        
        var moyenne = 0;
        
        for (var i = 0; i < compG.compSpec.length; i++)
        {
            moyenne += 
        }
        
        $('#icone_' + codeG + '_').removeClass("fa-spinner fa-pulse").addClass("clickable fa-bar-chart").attr("onclick", "afficherGraph('" + codeG + "')");
    }
    else
    {
        $('#icone_' + codeG + '_').removeClass("fa-spinner fa-pulse").attr("onclick", "");
    }
}

function afficherGraph(code)
{
    creerGraphiqueSpecifique(code);
    $('#myModal').modal('show');
}