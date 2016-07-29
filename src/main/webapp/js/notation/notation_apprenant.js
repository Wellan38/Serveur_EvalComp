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
var myRadarChart = null;

(function(){
    $.material.init();
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
        contenuHtml += '<div class="row"><div style="padding: 15px 0px 0px 0px;"><div class="panel panel-default" id="panel_comp_' + liste_competences[i].code + '_"><div class=" clickable accordion-toggle panel-heading clearfix" data-toggle="collapse" data-target="#comp_' + liste_competences[i].code + '_">';
        contenuHtml += '<h4 class="panel-title pull-left">' + liste_competences[i].libelle + '</h4><h4 class="pull-right" style="margin: 0px;"><i id="grade_' + liste_competences[i].code + '_" style="padding-right: 10px;"></i><i class="fa fa-spinner fa-pulse" id="icone_' + liste_competences[i].code + '_"></i></h4></div>';
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
        
        var contenuHtml = '<div"><table class="table table-hover" style="margin-bottom: 0px"><thead><tr>';
        contenuHtml += '<th style="width: 25%">Compétence spécifique</th>';
        contenuHtml += '<th class="minimal-cell"></th>';
        contenuHtml += '<th style="width: 25%">Mise en situation</th>';
        contenuHtml += '<th style="width: 50%">Score</th>';
        contenuHtml += '<th class="minimal-cell"></th>';
        contenuHtml += '</tr></thead>';
        contenuHtml += '<tbody>';
        
        for (var i = 0; i < compSpec.length; i++)
        {
            var c = compSpec[i];
            contenuHtml += '<tr><td id="libelle_' + c.code + '_"></td>';
            contenuHtml += '<td><span class="badge" data-toggle="tooltip" id="ponderation_' + c.code + '_"></span></td>';
            contenuHtml += '<td id="mes_' + c.code + '_"></td>';
            contenuHtml += '<td id="regle_' + c.code + '_"></td>';
            contenuHtml += '<td style="padding-left: 0px;"><div class="text-center"><i class="clickable fa fa-list" id="visu_' + c.code + '_" onclick="window.location.href=\'competence_specifique.html?mode=modification&codeG=' + data.obj.code + '&codeS=' + c.code + '\'"></i></div></td>';
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
        
        for (var i = 0; i < scores.length; i++)
        {
            $('#note_' + scores[i].competence + '_' + scores[i].note).attr("checked", "");
        }
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
        if (c.regle != null)
        {
            var cas_regle = c.regle.cas;

            document.getElementById("libelle_" + codeS + "_").innerHTML = c.libelle;
            $('#ponderation_' + codeS + '_').html(c.ponderation);
            $('#ponderation_' + codeS + '_').attr("title", "Pondération : " + c.ponderation);
            $('[data-toggle="tooltip"]').tooltip();

            var mes = c.miseensituation;
            
            var texte_mes = '<table class="table"><tbody>';
            texte_mes += '<tr><td>Contexte</td><td>' + mes.contexte + '</td></tr>';
            texte_mes += '<tr><td>Ressources</td><td>' + mes.ressources + '</td></tr>';
            texte_mes += '<tr><td>Action à effectuer</td><td>' + mes.action + '</td></tr>';
            texte_mes += '</tbody></table>';

            document.getElementById("mes_" + codeS + "_").innerHTML = texte_mes;

            var contenu_regle = '<table class="table table-hover" style="margin-bottom: 0px" id="score_' + codeS + '"><tbody>';

            for (var i = 0; i < cas_regle.length; i++)
            {
                var tab_regle = cas_regle[i].condition.split(" ");
                var note = cas_regle[i].score;

                for (var j = 0; j < tab_regle.length; j++)
                {
                    if (tab_regle[j] === "si" || tab_regle[j] === "sinon")
                    {
                        tab_regle[j] = '<b>' + tab_regle[j] + '</b>';
                    }
                    if (tab_regle[j].startsWith("&"))
                    {
                        tab_regle[j] = tab_regle[j].split("=")[1].replace(/"/g, "").replace(/_/g, " ");
                    }
                    if (tab_regle[j].endsWith('"'))
                    {
                        tab_regle[j] = tab_regle[j].replace(/"/g, "");
                    }
                }
                
                var texte;
                
                if (tab_regle[0].includes("sinon"))
                {
                    texte = tab_regle.join(" ") + '<b> : score = ' + note + '</b>';
                }
                else
                {
                    texte = tab_regle.join(" ") + ', <b>alors : score = ' + note + '</b>';
                }

                contenu_regle += '<tr><td style="padding-right: 0px; vertical-align: middle;"><div class="radio radio-primary" style="margin: 0px;"><label style="padding-left: 42px;"><input type="radio" id="note_' + codeS + '_' + note + '" name="score_' + codeS + '_" onclick="ajouterScore(\'' + codeG + '\', \'' + codeS + '\', ' + note + ')"></label></td><td style="padding-left: 0px;" id="note_' + codeS + '_' + note + '">' + texte + '</td></tr>';
            }

            contenu_regle += '</tbody></table>';

            document.getElementById("regle_" + codeS + "_").innerHTML = contenu_regle;
            
            $.material.init();
        }
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
    afficherRetour("notation_en_cours");
    
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
            afficherRetour("notation_acceptee");
        }
        else
        {
            afficherRetour("notation_refusee");
        }
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
    var c = null;
    for (var i = 0; i < liste_competences.length; i++)
    {
        if (liste_competences[i].code === codeG)
        {
            c = liste_competences[i];
            break;
        }
    }
    
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
    
    var compS = null;
    for (var i = 0; i < c.compSpec.length; i++)
    {
        if (c.compSpec[i].code === codeS)
        {
            compS = c.compSpec[i];
            break;
        }
    }
    
    if (index === null)
    {
        scores.push({competence: codeS,note: note,ponderation:compS.ponderation});
    }
    else
    {
        scores[index].note = note;
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
        
        for (var i = 0; i < scores.length; i++)
        {
            for (var j = 0; j < compG.compSpec.length; j++)
            {
                if (compG.compSpec[j].code === scores[i].competence)
                {
                    moyenne += scores[i].note * scores[i].ponderation;
                }
            }
        }
        
        console.log(scores);
        
        if (moyenne >= compG.seuil_max)
        {
            $('#grade_' + codeG + '_').attr("class", "fa fa-check-circle-o").css("color", "#00FF00");
        }
        else if (moyenne <= compG.seuil_min)
        {
            $('#grade_' + codeG + '_').attr("class", "fa fa-times-circle-o").css("color", "#FF0000");
        }
        else
        {
            $('#grade_' + codeG + '_').attr("class", "fa fa-clock-o").css("color", "");
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