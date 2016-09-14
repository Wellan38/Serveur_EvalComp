var param = window.location.search.substring(1).split("&");
var formation = param[0].split("=")[1];
var code_cg = param[1].split("=")[1];

var competence_g;
var liste_competences;
var liste_apprenants;

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
            contenuHtml += '<h4 class="panel-title pull-left">' + liste_apprenants[i].nom + '</h4><h4 class="pull-right" style="margin: 0px;"><i class="fa fa-spinner fa-pulse" style="margin-left: 10px;" id="icone_' + liste_apprenants[i].code + '_"></i></h4></div>';
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
            contenuHtml += '<h4 class="panel-title pull-left">' + liste_competences[i].libelle + '</h4><h4 class="pull-right" style="margin: 0px;"><i class="fa fa-spinner fa-pulse" style="margin-left: 10px;" id="icone_' + liste_competences[i].code + '_"></i></h4></div>';
            contenuHtml += '<div id="competence_' + liste_competences[i].code + '_" class="clickable panel-collapse collapse"></div>';
            contenuHtml += '</div></div></div>';
        }
        
        $('#liste').html(contenuHtml);
        
        $('[data-toggle="tooltip"').tooltip();
        
        listerApprenantsParCompetence();
        
        for (var i = 0; i < liste_competences.length; i++)
        {
            afficherApprenantsParCompetence(liste_competences[i].code);
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
    $('#legende').html("Historique des scores des apprenants pour la compétence : " + competence_g.libelle);
    
    var contenuHtml = '<table class="table table-hover" style="margin-bottom: 0px"><thead><tr>';
    contenuHtml += '<th style="width: 50%">Compétence spécifique</th>';
    contenuHtml += '<th style="width: 50%">Scores</th>';
    contenuHtml += '</tr></thead>';
    contenuHtml += '<tbody>';
    
    for (var j = 0; j < liste_competences.length; j++)
    {
        var c = liste_competences[j];
        contenuHtml += '<tr><td id="libelle_' + c.code + '_" style="vertical-align: middle;">' + liste_competences[j].libelle + '</td>';
        contenuHtml += '<td>';
        contenuHtml += '<table class="table table-hover" style="margin-bottom: 0px"><thead><tr>';
        contenuHtml += '<th style="width: 50%">Date</th>';
        contenuHtml += '<th style="width: 50%">Note</th></tr>';
        contenuHtml += '<tbody id="scores_' + id + '_' + c.code + '_"></tbody>';
        contenuHtml += '</table></td>';
        contenuHtml += '</tr>';
    }
    
    contenuHtml += '</tbody>';
    contenuHtml += '</table>';
    
    $('#apprenant_' + id + '_').html(contenuHtml);

    $.material.init();
    
    listerScores(id);
}

function afficherApprenantsParCompetence(comp)
{
    $('#legende').html("Noter les apprenants pour la compétence : " + competence_g.libelle);
    
    var contenuHtml = "";
    
    contenuHtml += '<table class="table" style="margin-bottom: 0px"><thead><tr>';
    contenuHtml += '<th style="width: 50%">Nom</th>';
    contenuHtml += '<th style="width: 50%">Scores</th>';
    contenuHtml += '</tr></thead>';
    contenuHtml += '<tbody>';
    
    for (var j = 0; j < liste_apprenants.length; j++)
    {
        var a = liste_apprenants[j];
        contenuHtml += '<tr><td>' + a.nom + '</td>';
        contenuHtml += '<td>';
        contenuHtml += '<table class="table table-hover" style="margin-bottom: 0px"><thead><tr>';
        contenuHtml += '<th style="width: 50%">Date</th>';
        contenuHtml += '<th style="width: 50%">Note</th></tr>';
        contenuHtml += '<tbody id="scores_' + a.code + '_' + comp + '_"></tbody>';
        contenuHtml += '</table></td>';
        contenuHtml += '</tr>';
    }
    
    contenuHtml += '</tbody>';
    contenuHtml += '</table>';
    
    $('#competence_' + comp + '_').html(contenuHtml);
    
    for (var i = 0; i < liste_apprenants.length; i++)
    {
        listerScores(liste_apprenants[i].code, comp);
    }

    $.material.init();
}

function listerScores(apprenant)
{
    var html = [];
    
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'historique',
            type: 'scores',
            apprenant: apprenant,
            competence: code_cg
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        var scores = data.liste;
        //console.log(scores);
        for (var i = 0; i < scores.length; i++)
        {
            var index = null;
            
            for (var j = 0; j < html.length; j++)
            {
                if (html[j].competence == scores[i].competence)
                {
                    index = j;
                    break;
                }
            }
            
            if (index == null)
            {
                html.push({competence: scores[i].competence, scores: ""});
                index = html.length - 1;
            }
            html[index].scores += "<tr><td>" + scores[i].date + "</td><td>" + scores[i].note + "</td></tr>";
        }
        
        for (var i = 0; i < html.length; i++)
        {
            $('#scores_' + apprenant + '_' + html[i].competence + '_').html(html[i].scores);
            var liste_lignes = $('#scores_' + apprenant + '_' + html[i].competence + '_')[0];
            
            if (liste_lignes != null)
            {
                var dernier_score = liste_lignes.childNodes[0];
                
                if (dernier_score != null)
                {
                    dernier_score.bgColor = "#3C8DBC";
                }
            }
        }
        
        $('#icone_' + apprenant + '_').attr("class", "fa");
    })
    .fail(function() {
        console.log('Erreur dans le chargement des scores.');
    })
    .always(function() {
        //
    });
}

function listerScores(apprenant, comp)
{
    var html = [];
    
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'historique',
            type: 'scores',
            apprenant: apprenant,
            competence: code_cg
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        var scores = data.liste;
        //console.log(scores);
        for (var i = 0; i < scores.length; i++)
        {
            var index = null;
            
            for (var j = 0; j < html.length; j++)
            {
                if (html[j].competence == scores[i].competence)
                {
                    index = j;
                    break;
                }
            }
            
            if (index == null)
            {
                html.push({competence: scores[i].competence, scores: ""});
                index = html.length - 1;
            }
            html[index].scores += "<tr><td>" + scores[i].date + "</td><td>" + scores[i].note + "</td></tr>";
        }
        
        for (var i = 0; i < html.length; i++)
        {
            $('#scores_' + apprenant + '_' + html[i].competence + '_').html(html[i].scores);
            var liste_lignes = $('#scores_' + apprenant + '_' + html[i].competence + '_')[0];
            
            if (liste_lignes != null)
            {
                var dernier_score = liste_lignes.childNodes[0];
                
                if (dernier_score != null)
                {
                    dernier_score.bgColor = "#3C8DBC";
                }
            }
        }
        
        $('#icone_' + comp + '_').attr("class", "fa");
    })
    .fail(function() {
        console.log('Erreur dans le chargement des scores.');
    })
    .always(function() {
        //
    });
}