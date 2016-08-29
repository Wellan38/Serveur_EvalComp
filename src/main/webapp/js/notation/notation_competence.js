var param = window.location.search.substring(1).split("&");
var formation = param[0].split("=")[1];
var code_cg = param[1].split("=")[1];

var competence_g;
var liste_competences;
var liste_apprenants;
var scores = [];

var myRadarChart = null;

(function()
{
    init();
}());

function init()
{
    $.material.init();
    var type = $('#type_classification').val();
    
    $('#liste').html("");
    
    switch(type)
    {
        case "apprenants" :
            
            listerApprenants();
            break;
            
        case "compétences spécifiques" :
            listerCompetences();
            
            break;
    }
    
    $('#boutons_modifs').show();
}

function listerApprenants()
{
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
        var contenuHtml = '';
        
        for (var i = 0; i < liste_apprenants.length; i++)
        {
            contenuHtml += '<div class="row"><div style="padding: 15px 0px 0px 0px;"><div class="panel panel-default" id="panel_apprenant_' + liste_apprenants[i].code + '_"><div class="clickable accordion-toggle panel-heading clearfix" data-toggle="collapse" data-target="#apprenant_' + liste_apprenants[i].code + '_">';
            contenuHtml += '<h4 class="panel-title pull-left">' + liste_apprenants[i].nom + '</h4><h4 class="pull-right" style="margin: 0px;"><i id="grade_' + liste_apprenants[i].code + '_" style="padding-right: 10px;"></i><i class="fa fa-spinner fa-pulse" style="margin-left: 10px;" id="icone_' + liste_apprenants[i].code + '_"></i></h4></div>';
            contenuHtml += '<div id="apprenant_' + liste_apprenants[i].code + '_" class="clickable panel-collapse collapse"></div>';
            contenuHtml += '</div></div></div>';
        }
        
        $('#liste').html(contenuHtml);
        
        listerCompetencesParApprenant();
        
        for (var i = 0; i < liste_apprenants.length; i++)
        {
            afficherCompetencesParApprenant(liste_apprenants[i].code);
            $('#icone_' + liste_apprenants[i].code + '_').removeClass("fa-spinner fa-pulse").css("margin-left", "0px");
        }
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
    })
    .always(function() {
        //
    });
}

function listerCompetences()
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'competence_generale',
            code: code_cg
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        
        competence_g = data.obj;
        
        liste_competences = data.obj.compSpec;
        
        for (var i = 0; i < liste_competences.length; i++)
        {
            $.ajax({
                url: './ActionServlet',
                type: 'GET',
                data: {
                    action: 'infos',
                    type: 'competence_specifique',
                    code: liste_competences[i].code
                },
                async:false,
                dataType: 'json'
            })
            .done(function(data) {
                liste_competences[i] = data.obj;
            })
            .fail(function() {
                console.log('Erreur dans le chargement des informations.');
            })
            .always(function() {
                //
            });
        }
        
        var contenuHtml = '';
        
        for (var i = 0; i < liste_competences.length; i++)
        {
            contenuHtml += '<div class="row"><div style="padding: 15px 0px 0px 0px;"><div class="panel panel-default" id="panel_apprenant_' + liste_competences[i].code + '_"><div class="clickable accordion-toggle panel-heading clearfix" data-toggle="collapse" data-target="#competence_' + liste_competences[i].code + '_">';
            contenuHtml += '<h4 class="panel-title pull-left">' + liste_competences[i].libelle + '</h4><h4 class="pull-right" style="margin: 0px;"><span class="badge" data-toggle="tooltip" id="ponderation_' + liste_competences[i].code + '_" title="Pondération : ' + liste_competences[i].ponderation + '">' + liste_competences[i].ponderation + '</span><i class="fa fa-spinner fa-pulse" style="margin-left: 10px;" id="icone_' + liste_competences[i].code + '_"></i></h4></div>';
            contenuHtml += '<div id="competence_' + liste_competences[i].code + '_" class="clickable panel-collapse collapse"></div>';
            contenuHtml += '</div></div></div>';
        }
        
        $('#liste').html(contenuHtml);
        
        $('[data-toggle="tooltip"').tooltip();
        
        listerApprenantsParCompetence();
        
        for (var i = 0; i < liste_competences.length; i++)
        {
            afficherApprenantsParCompetence(liste_competences[i]);
            $('#icone_' + liste_competences[i].code + '_').removeClass("fa-spinner fa-pulse").css("margin-left", "0px");
        }
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
    })
    .always(function() {
        //
    });
}

function listerCompetencesParApprenant()
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'competence_generale',
            code: code_cg
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        competence_g = data.obj;

        liste_competences = competence_g.compSpec;
        
        for (var i = 0; i < liste_competences.length; i++)
        {
            $.ajax({
                url: './ActionServlet',
                type: 'GET',
                data: {
                    action: 'infos',
                    type: 'competence_specifique',
                    code: liste_competences[i].code
                },
                async:false,
                dataType: 'json'
            })
            .done(function(data) {
                liste_competences[i] = data.obj;
            })
            .fail(function() {
                console.log('Erreur dans le chargement des informations.');
            })
            .always(function() {
                //
            });
        }
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function listerApprenantsParCompetence()
{
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
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function afficherCompetencesParApprenant(id)
{
    $('#legende').html("Noter les apprenants pour la compétence : " + competence_g.libelle);
    
    var contenuHtml = '<table class="table table-hover" style="margin-bottom: 0px"><thead><tr>';
    contenuHtml += '<th style="width: 25%">Compétence spécifique</th>';
    contenuHtml += '<th class="minimal-cell"></th>';
    contenuHtml += '<th style="width: 30%">Mise en situation</th>';
    contenuHtml += '<th style="width: 45%">Score</th>';
    contenuHtml += '</tr></thead>';
    contenuHtml += '<tbody>';

    for (var i = 0; i < liste_competences.length; i++)
    {
        var c = liste_competences[i];
        
        contenuHtml += '<tr id="comp_' + c.code + '_' + id + '_"><td id="libelle_' + c.code + '_' + id + '_">' + c.libelle + '</td>';
        contenuHtml += '<td><span class="badge" data-toggle="tooltip" id="ponderation_' + c.code + '_' + id + '_">' + c.ponderation + '</span></td>';
        contenuHtml += '<td id="mes_' + c.code + '_' + id + '_">';
        
        var mes = c.miseensituation;
        
        contenuHtml += '<table class="table"><tbody>';
        contenuHtml += '<tr><td>Contexte</td><td>' + mes.contexte + '</td></tr>';
        contenuHtml += '<tr><td>Ressources</td><td>' + mes.ressources + '</td></tr>';
        contenuHtml += '<tr><td>Action à effectuer</td><td>' + mes.action + '</td></tr>';
        contenuHtml += '</tbody></table>';
        
        contenuHtml += '</td>';
        contenuHtml += '<td id="regle_' + c.code + '_' + id + '_"></td>';
        contenuHtml += '</tr>';
    }

    contenuHtml += '</tbody>';
    contenuHtml += '</table>';
    
    $('#apprenant_' + id + '_').html(contenuHtml);
    
    for (var k = 0; k < liste_competences.length; k++)
    {
        var c = liste_competences[k];
        
        var cas_regle = c.regle.cas;

        var contenu_regle = '<table class="table table-hover" style="margin-bottom: 0px" id="score_' + c.code + '_' + id + '_"><tbody>';

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

            contenu_regle += '<tr><td style="padding-right: 0px; vertical-align: middle; width: 20px;"><div class="radio radio-primary" style="margin: 0px;"><label style="padding-left: 42px;"><input type="radio" id="note_' + c.code + '_' + note + '_' + id + '_" name="score_' + c.code + '_' + id + '_" onclick="ajouterScore(\'' + code_cg + '\', \'' + c.code + '\', ' + note + ', \'' + id + '\')"></label></td><td style="padding-left: 0px;" id="note_' + c.code + '_' + note + '_' + id + '_">' + texte + '</td></tr>';
        }

        contenu_regle += '</tbody></table>';

        document.getElementById("regle_" + c.code + "_" + id + "_").innerHTML = contenu_regle;
        
        afficherScores(id, c.code);
    }

    $.material.init();
}

function afficherApprenantsParCompetence(comp)
{
    $('#legende').html("Noter les apprenants pour la compétence : " + competence_g.libelle);
    
    var mes = comp.miseensituation;
    
    var contenuHtml = '<p style="margin: 10px;"><b>Contexte :</b> ' + mes.contexte + '<br/><b>Ressources :</b> ' + mes.ressources + '<br/><b>Action :</b> ' + mes.action + '</p>';
    
    contenuHtml += '<table class="table" style="margin-bottom: 0px"><thead><tr>';
    contenuHtml += '<th style="width: 20%">Nom</th>';
    contenuHtml += '<th style="width: 15%">Entreprise</th>';
    contenuHtml += '<th style="width: 15%">Fonction</th>';
    contenuHtml += '<th style="width: 50%">Score</th>';
    contenuHtml += '</tr></thead>';
    contenuHtml += '<tbody>';

    for (var i = 0; i < liste_apprenants.length; i++)
    {
        var a = liste_apprenants[i];
        
        contenuHtml += '<tr><td id="nom_' + a.code + '_' + comp.code + '_">' + a.nom + '</td>';
        contenuHtml += '<td id="entreprise_' + a.code + '_' + comp.code + '_">' + a.entreprise + '</td>';
        contenuHtml += '<td id="fonction_' + a.code + '_' + comp.code + '_">' + a.fonction + '</td>';
        contenuHtml += '<td id="regle_' + a.code + '_' + comp.code + '_"></td>';
        contenuHtml += '</tr>';
    }

    contenuHtml += '</tbody>';
    contenuHtml += '</table>';
    
    $('#competence_' + comp.code + '_').html(contenuHtml);
    
    var cas_regle = comp.regle.cas;
    
    for (var k = 0; k < liste_apprenants.length; k++)
    {
        var ap = liste_apprenants[k].code;
        
        var contenu_regle = '<table class="table table-hover" style="margin-bottom: 0px" id="score_' + comp.code + '"><tbody>';

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

            contenu_regle += '<tr><td style="padding-right: 0px; vertical-align: middle; width: 20px;"><div class="radio radio-primary" style="margin: 0px;"><label style="padding-left: 42px;"><input type="radio" id="note_' + comp.code + '_' + note + '_' + ap + '_" name="score_' + comp.code + '_' + ap + '_" onclick="ajouterScore(\'' + code_cg + '\', \'' + comp.code + '\', ' + note + ', \'' + ap + '\')"></label></td><td style="padding-left: 0px;" id="note_' + comp.code + '_' + note + '">' + texte + '</td></tr>';
        }

        contenu_regle += '</tbody></table>';

        document.getElementById("regle_" + a.code + "_" + comp.code + "_").innerHTML = contenu_regle;
        
        afficherScores(ap, comp.code);
    }

    $.material.init();
}

function afficherScores(apprenant, competence)
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'liste',
            type: 'score',
            apprenant: apprenant,
            competence: code_cg.replace(/_/g, "")
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        
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
                data.liste[i]["apprenant"] = apprenant;
                scores.push(data.liste[i]);
            }
            else
            {
                scores[index].note = data.liste[i].note;
            }
            
            ajouterScore(competence, data.liste[i].competence, data.liste[i].note, apprenant);
        }
        
        for (var i = 0; i < liste_competences.length; i++)
    {
        $('#panel_comp_' + liste_competences[i].code + '_' + apprenant + '_').on('hidden.bs.collapse', function (e) {
            $('#graphique_' + e.currentTarget.id.split("_")[2] + '_').hide();
        });
        
        $('#panel_comp_' + liste_competences[i].code + '_' + apprenant + '_').on('shown.bs.collapse', function (e) {
            $('#graphique_' + e.currentTarget.id.split("_")[2] + '_').show();
        });
    }
        
        for (var i = 0; i < scores.length; i++)
        {
            $('#note_' + scores[i].competence + '_' + scores[i].note + '_' + apprenant + '_').attr("checked", "");
        }
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
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
    
    var scores_par_ap = [];
    
    for (var i = 0; i < scores.length; i++)
    {
        var contient = false;
        for (var j = 0; j < scores_par_ap.length; j++)
        {
            if (scores_par_ap[j].apprenant == scores[i].apprenant)
            {
                contient = true;
                scores_par_ap[j].scores.push(scores[i]);
                break;
            }
        }
        
        if (!contient)
        {
            scores_par_ap.push({apprenant: scores[i].apprenant, scores: [scores[i]]});
        }
    }
    
    console.log(scores_par_ap);
    
    for (var i = 0; i < scores_par_ap.length; i++)
    {
        $.ajax({
            url: './ActionServlet',
            type: 'GET',
            data: {
                action: 'notation',
                apprenant: scores_par_ap[i].apprenant,
                scores: JSON.stringify(scores_par_ap[i].scores)
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
}

function creerGraphiqueSpecifique(id)
{    
    var scores_c = [];
    for (var i = 0; i < scores.length; i++)
    {
        for (var j = 0; j < competence_g.compSpec.length; j++)
        {
            if (competence_g.compSpec[j].code === scores[i].competence)
            {
                scores_c.push(scores[i]);
                break;
            }
        }
    }
    
    var labels = [];
    var data = [];

    for (var i = 0; i < competence_g.compSpec.length; i++)
    {
        for (var j = 0; j < scores_c.length; j++)
        {
            if (competence_g.compSpec[i].code === scores_c[j].competence)
            {
                var libelle = competence_g.compSpec[i].libelle.split(" ")[0] + " : " + competence_g.compSpec[i].ponderation;
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
    
    document.getElementById("libelle_compG").innerHTML = competence_g.libelle;

    var ctx = document.getElementById("graph_spec").getContext("2d");
    var type, options;
    if (competence_g.compSpec.length > 2)
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

function ajouterScore(codeG, codeS, note, apprenant)
{    
    $('#note_' + codeS + '_' + note + '_' + apprenant + '_').addClass('active').siblings().removeClass('active');
    
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
    for (var i = 0; i < liste_competences.length; i++)
    {
        if (liste_competences[i].code === codeS)
        {
            compS = liste_competences[i];
            break;
        }
    }
    
    if (index === null)
    {
        scores.push({apprenant: apprenant, competence: codeS,note: note,ponderation:compS.ponderation});
    }
    else
    {
        scores[index].note = note;
    }

    var complet = true;
    for (var i = 0; i < liste_competences.length; i++)
    {
        var trouve = false;
        for (var j = 0; j < scores.length; j++)
        {
            if (scores[j].competence === liste_competences[i].code)
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
            for (var j = 0; j < liste_competences.length; j++)
            {
                if (liste_competences[j].code === scores[i].competence)
                {
                    moyenne += scores[i].note * scores[i].ponderation;
                }
            }
        }
        
        if (moyenne >= competence_g.seuil_max)
        {
            $('#grade_' + apprenant + '_').attr("class", "fa fa-check-circle-o").css("color", "#00FF00");
        }
        else if (moyenne <= competence_g.seuil_min)
        {
            $('#grade_' + apprenant + '_').attr("class", "fa fa-times-circle-o").css("color", "#FF0000");
        }
        else
        {
            $('#grade_' + apprenant + '_').attr("class", "fa fa-clock-o").css("color", "");
        }
        
        $('#icone_' + apprenant + '_').removeClass("fa-spinner fa-pulse").addClass("clickable fa-bar-chart").attr("onclick", "afficherGraph('" + codeG + "')");
    }
    else
    {
        $('#icone_' + apprenant + '_').removeClass("fa-spinner fa-pulse").attr("onclick", "");
    }
}

function afficherGraph(code)
{
    creerGraphiqueSpecifique(code);
    $('#myModal').modal('show');
}