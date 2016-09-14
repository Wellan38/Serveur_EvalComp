var param = window.location.search.substring(1).split("&");
var formation = param[0].split("=")[1];
var code_apprenant = param[1].split("=")[1];
var apprenant;

var comp_spec = [];
var liste_competences = [];

(function() {
    $.material.init();
    infosApprenant();
    listerCompetences();
}());

function infosApprenant()
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'apprenant',
            code: code_apprenant
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        apprenant = data.obj;
        $('#legende').html("Historique des autoévaluations pour l'apprenant : " + apprenant.nom);
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations sur l\'apprenant.');
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
        
        for (var i = 0; i < liste_competences.length; i++)
        {
            listerAutoevaluations(liste_competences[i].code);
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
        contenuHtml += '<h4 class="panel-title pull-left">' + liste_competences[i].libelle + '</h4><h4 class="pull-right" style="margin: 0px;"><i class="fa fa-spinner fa-pulse" id="icone_' + liste_competences[i].code + '_"></i></h4></div>';
        contenuHtml += '<div id="comp_' + liste_competences[i].code + '_" class="clickable panel-collapse collapse"></div>';
        contenuHtml += '</div></div></div>';
    }

    $('#competences').html(contenuHtml);
    
    listerCompSpec();
}

function listerCompSpec()
{
    for (var i = 0; i < liste_competences.length; i++)
    {
        $.ajax({
            url: './ActionServlet',
            type: 'GET',
            data: {
                action: 'infos',
                type: 'competence_generale',
                code: liste_competences[i].code
            },
            async:false,
            dataType: 'json'
        })
        .done(function(data) {

            var compSpec = data.obj.compSpec;

            var contenuHtml = '<table class="table table-hover" style="margin-bottom: 0px"><thead><tr>';
            contenuHtml += '<th style="width: 50%;">Compétence spécifique</th>';
            contenuHtml += '<th style="width: 50%">Scores</th>';
            contenuHtml += '</tr></thead>';
            contenuHtml += '<tbody>';

            for (var j = 0; j < compSpec.length; j++)
            {
                var c = compSpec[j];
                contenuHtml += '<tr><td id="libelle_' + c.code + '_" style="vertical-align: middle;">' + compSpec[j].libelle + '</td>';
                contenuHtml += '<td>';
                contenuHtml += '<table class="table table-hover" style="margin-bottom: 0px"><thead><tr>';
                contenuHtml += '<th style="width: 50%">Date</th>';
                contenuHtml += '<th style="width: 50%">Note</th></tr>';
                contenuHtml += '<tbody id="autoevaluations_' + c.code + '_"></tbody>';
                contenuHtml += '</table></td>';
                contenuHtml += '</tr>';
            }

            contenuHtml += '</tbody>';
            contenuHtml += '</table>';

            $('#comp_' + liste_competences[i].code + '_').html(contenuHtml);
        })
        .fail(function() {
            console.log('Erreur dans le chargement des compétences spécifiques.');
        })
        .always(function() {
            //
        });
    }
}

function listerAutoevaluations(comp)
{
    var html = [];
    
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'historique',
            type: 'autoevaluations',
            apprenant: code_apprenant,
            competence: comp
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        var autoevaluations = data.liste;
        //console.log(autoevaluations);
        for (var i = 0; i < autoevaluations.length; i++)
        {
            var index = null;
            
            for (var j = 0; j < html.length; j++)
            {
                if (html[j].competence == autoevaluations[i].competence)
                {
                    index = j;
                    break;
                }
            }
            
            if (index == null)
            {
                html.push({competence: autoevaluations[i].competence, autoevaluations: ""});
                index = html.length - 1;
            }
            html[index].autoevaluations += "<tr><td>" + autoevaluations[i].date + "</td><td>" + autoevaluations[i].note + "</td></tr>";
        }
        
        for (var i = 0; i < html.length; i++)
        {
            $('#autoevaluations_' + html[i].competence + '_').html(html[i].autoevaluations);
            var derniere_autoevaluation = $('#autoevaluations_' + html[i].competence + '_')[0].childNodes[0];
            
            if (derniere_autoevaluation != null)
            {
                derniere_autoevaluation.bgColor = "#3C8DBC";
            }
        }
        
        $('#icone_' + comp + '_').attr("class", "fa");
    })
    .fail(function() {
        console.log('Erreur dans le chargement des autoévaluations.');
    })
    .always(function() {
        //
    });
}