var param = window.location.search.substring(1).split("&");
var code_cg = param[1].split("=")[1];
var apprenant = sessionStorage.getItem("apprenant");

var competence_g;
var liste_competences;
var liste_apprenants;
var scores = [];

var myRadarChart = null;

(function() {
    listerCompetences();
    afficherAutoevaluations();
}());

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
            var mes = liste_competences[i].miseensituation;
            contenuHtml += '<tr><td>' + liste_competences[i].libelle + '</td>';
            contenuHtml += '<td><table class="table"><tbody><tr><td>Contexte</td><td>' + mes.contexte + '</td></tr>';
            contenuHtml += '<tr><td>Ressources</td><td>' + mes.ressources + '</td></tr>';
            contenuHtml += '<tr><td>Action à effectuer</td><td>' + mes.action + '</td></tr>';
            contenuHtml += '</tbody></table></td>';
            contenuHtml += '<td>';
            
            var regle = liste_competences[i].regle;
            
            if (!regle.nombre)
            {
                contenuHtml += '<p style="text-align: center"><b>Pensez-vous avoir réussi ?</b></p>';
                contenuHtml += '<div class="list-group"><div class="col-xs-6" style="text-align: center"><div class="radio radio-primary"><label><input type="radio" id="valeur_' + liste_competences[i].code + '_' + regle.cas[0].score + '_" name="valeur_' + liste_competences[i].code + '_" value=' + regle.cas[0].score + '> Oui</label></div></div>';
                contenuHtml += '<div class="list-group"><div class="col-xs-6" style="text-align: center"><div class="radio radio-primary"><label><input type="radio" id="valeur_' + liste_competences[i].code + '_' + regle.cas[1].score + '_" name="valeur_' + liste_competences[i].code + '_" value=' + regle.cas[1].score + '> Non</label></div></div>';
                contenuHtml += '</div>';
            }
            else if (regle.pattern == "RP-PROGRESSIF")
            {
                var type, verbe;
                var tab = regle.cas[0].condition.split(" ");
                
                for (var j = 0; j < tab.length; j++)
                {
                    if (tab[j].startsWith("&"))
                    {
                        if (tab[j].split("=")[0] == "&type")
                        {
                            type = tab[j].split("=")[1].replace(/_/g, " ").replace(/"/g, "");
                        }
                        else if (tab[j].split("=")[0] == "&verbe")
                        {
                           verbe = tab[j].split("=")[1].replace(/"/g, "");
                        }
                    }
                }
                
                if (['a', 'e', 'i', 'o', 'u', 'y'].includes(type[0]))
                {
                    contenuHtml += '<p style="text-align: center"><b>Combien d\'' + type + ' pensez-vous avoir ' + verbe + ' ?</b></p>';
                }
                else
                {
                    contenuHtml += '<p style="text-align: center"><b>Combien de ' + type + ' pensez-vous avoir ' + verbe + ' ?</b></p>';
                }
                
                var min = null, max = null;
                
                for (var j = 0; j < regle.cas.length; j++)
                {
                    var tab = regle.cas[j].condition.split(" ");
                    
                    for (var k = 0; k < tab.length; k++)
                    {
                        if (tab[k].startsWith("&nombre"))
                        {
                            var nombre = tab[k].split("=")[1].replace(/"/g, "");
                            if (min == null)
                            {
                                min = nombre;
                                max = nombre;
                            }
                            else
                            {
                                if (nombre < min)
                                {
                                    min = nombre;
                                }
                                if (nombre > max)
                                {
                                    max = nombre;
                                }
                            }
                        }
                    }
                }
                
                if (regle.pourcentages)
                {
                    contenuHtml += '<div class="form-inline" style="text-align: center"><input type="text" class="form-control parametre" style="width: 30px;" name="valeur_' + liste_competences[i].code + '_"> % des ' + type + '</div>';
                }
                else
                {
                    contenuHtml += '<div class="form-inline" style="text-align: center"><input type="text" class="form-control parametre" style="width: 30px;" name="valeur_' + liste_competences[i].code + '_"> ' + type + '</div>';
                }
            }
            
            contenuHtml += '</td>';
            contenuHtml += '</tr>';
        }
        
        $('#liste').html(contenuHtml);
        
        $.material.init();
        
        $('[data-toggle="tooltip"').tooltip();
        
        for (var i = 0; i < liste_competences.length; i++)
        {
            $('#icone_' + liste_competences[i].code + '_').removeClass("fa-spinner fa-pulse").css("margin-left", "0px");
        }
        
        $('#liste_competences').collapse("show");
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
    })
    .always(function() {
        //
    });
}

function rassemblerScores()
{
    var valeurs = $('[name^="valeur"');
    
    scores = [];
        
    for (var i = 0; i < valeurs.length; i++)
    {
        if (!((valeurs[i].type == "radio" && valeurs[i].checked == false) || (valeurs[i].type == "text" && valeurs[i].value == "")))
        {
            scores.push({competence: valeurs[i].name.split("_")[1], score: valeurs[i].value});
        } 
    }
}

function validerModifs()
{
    rassemblerScores();
    
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'autoevaluation',
            competence_generale: code_cg,
            scores: JSON.stringify(scores)
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        
        
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
    })
    .always(function() {
        //
    });
}

function afficherAutoevaluations()
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'liste',
            type: 'autoevaluation',
            apprenant: apprenant,
            competence: code_cg
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        var scores = data.liste;

        for (var i = 0; i < scores.length; i++)
        {
            var element = $('[name="valeur_' + scores[i].competence + '_');
            
            if (element[0].type == "text")
            {
                element[0].value = scores[i].valeur;
            }
            else if (element[0].type == "radio")
            {
                for (var j = 0; j < element.length; j++)
                {
                    if (element[j].value == scores[i].valeur)
                    {
                        element[j].checked = true;
                    }
                }
            }
        }
        
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
    })
    .always(function() {
        //
    });
}