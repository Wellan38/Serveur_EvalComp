/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var param = window.location.search.substring(1).split("&");
var formation = param[0].split("=")[1];
var apprenant = param[1].split("=")[1];

(function(){
    listerCompetences();
})();
/*
$('.panel').on('hidden.bs.collapse', function (e) {
    alert('Event fired on #' + e.currentTarget.id);
});
*/
var liste_formations;
var liste_apprenants;
var liste_competences;
var liste_scores;

var regle;

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
        contenuHtml += '<div class="panel panel-default"><div class="panel-heading">';
        contenuHtml += '<h4 class="panel-title"><a class="clickable accordion-toggle" data-toggle="collapse" href="#comp_' + liste_competences[i].code + '_" onclick="detailsComp(\'' + liste_competences[i].code + '\')">' + liste_competences[i].libelle + '</a></h4></div>';
        contenuHtml += '<div id="comp_' + liste_competences[i].code + '_" class="clickable panel-collapse collapse"></div>';
        contenuHtml += '</div>';
    }

    $('#competences').html(contenuHtml);
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
        
        var contenuHtml = '<div class="table-responsive"><table class="table table-hover"><thead><tr>';
        contenuHtml += '<th style="width: 30%">Compétence spécifique</th>';
        contenuHtml += '<th style="width: 35%">Mise en situation</th>';
        contenuHtml += '<th style="width: 35%">Score</th>';
        contenuHtml += '</tr></thead>';
        contenuHtml += '<tbody>';
        
        for (var i = 0; i < compSpec.length; i++)
        {
            var c = compSpec[i];
            contenuHtml += '<tr><td id="libelle_' + c.code + '_"></td>';
            contenuHtml += '<td id="mes_' + c.code + '_"></td>';
            contenuHtml += '<td id="regle_' + c.code + '_"></td>';
            contenuHtml += '</tr>';
        }
        
        contenuHtml += '</tbody>';
        contenuHtml += '</table></div>';
        
        $('#comp_' + code + '_').html(contenuHtml);
        $('#form_mes').hide();
        $('#form_regle').hide();
        
        for (var i = 0; i < compSpec.length; i++)
        {
            detailsCompS(compSpec[i].code);
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
        var scores = data.liste;
        
        for (var i = 0; i < scores.length; i++)
        {
            $('#note_' + scores[i].competence_specifique + '_' + scores[i].note).addClass('active').siblings().removeClass('active');
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

function detailsCompS(code)
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'competence_specifique',
            code: code.replace(/_/g, "")
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        var c = data.obj;
        var mes = c.miseensituation;
        var code_regle = c.regle;
        
        document.getElementById("libelle_" + code + "_").innerHTML = c.libelle;
        
        var mes = c.miseensituation;
        var texte_mes = "";
        
        var texte_mes = '- ';
        var newline = String.fromCharCode(13, 10);
        
        for (var i = 0; i < mes.length; i++)
        {
            texte_mes += mes[i];
            if (i < mes.length - 1)
            {
                texte_mes += '<br/>- ';
            }
        }
        
        document.getElementById("mes_" + code + "_").innerHTML = texte_mes;
        
        infosRegle(code_regle);
        
        var r = regle.texte;
        
        var contenu_regle = '<ul class="list-group" id="score_' + code + '">';
        
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
            
            contenu_regle += '<li class="clickable list-group-item" id="note_' + code + '_' + note + '" onclick="$(this).addClass(\'active\').siblings().removeClass(\'active\')">' + texte + '</li>';
        }
        
        contenu_regle += '</ul>';
        
        document.getElementById("regle_" + code + "_").innerHTML = contenu_regle;
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
    
    var scores = [];
    
    var actifs = document.getElementsByClassName("list-group-item active");
    
    for (var i = 0; i < actifs.length; i++)
    {
        var id = actifs[i].id.split("_");
        
        var code = id[1];
        var note = id[2];
        
        scores.push({competence: code,note: note});
    }
    
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