/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var param = window.location.search.substring(1).split("&");
var mode = param[0].split("=")[1];
var codeG = param[1].split("=")[1];
var codeS = null;
var anciennePond = 0;
var compS;

(function() {
    $.material.init();
    document.getElementById("valider").setAttribute("id", "valider_" + codeG + "_");
    document.getElementById("autres_comp").setAttribute("id", "comp_spec__" + codeG + "_");
    init();
}());

function init()
{
    if (mode === "modification")
    {
        codeS = param[2].split("=")[1];
        document.getElementById("valider_" + codeG + "_").innerHTML = '<span class="fa fa-check"></span> Valider les modifications';
        document.getElementById("annuler").innerHTML = '<span class="fa fa-times"></span> Annuler les modifications';
        detailsCompS();
        detailsCompG();
    }
    else if (mode === "creation")
    {
        document.getElementById("code_comp").disabled = false;
        document.getElementById("valider_" + codeG + "_").innerHTML = '<span class="fa fa-check"></span> Créer la compétence';
        document.getElementById("annuler").innerHTML = '<span class="fa fa-times"></span> Revenir aux compétences générales';
        detailsCompG();
        listerRulePatterns();
        
        competences[0].compSpec.push(JSON.parse('{"code":null,"libelle":"","ponderation":0,"categorie":""}'));
        
        changerPonderation(0.2);
        
        afficherCompS(codeG, competences[0].compSpec, null);
    }
}

function detailsCompG()
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'competence_generale',
            code: codeG
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        var c = data.obj;
        competences.push(c);
        if (mode !== "creation")
        {
            afficherCompS(codeG, c.compSpec, codeS);
        }
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

var param = window.location.search.substring(1).split("&");
var code_comp = param[0].split("=")[1];
var code_rule_pattern = null;
var cas_rule_pattern = null;
var liste_rule_patterns = [];

function placerTag(tag)
{
    var value = document.getElementById("libelle_comp").value;
    
    var value_tab = value.substring(0).split(" ");
    value = tag + " ";
    
    for (var i = 1; i < value_tab.length; i++)
    {
        value += value_tab[i];
        if (i !== value_tab.length - 1)
        {
            value += " ";
        }
    }
    
    $('#libelle_comp').val(value).trigger("change");
    
    $('#myModal').modal('hide');
}

function listerTags()
{
    var categorie = document.getElementById("categorie_comp").value;
    var tags;
    switch(categorie)
    {
        case "Connaissance" :
            tags = [
                {text: "Définir", weight: 7, html: {onclick: "placerTag(\"Définir\")", style: "cursor: pointer"}},
                {text: "Lister", weight: 6, html: {onclick: "placerTag(\"Lister\")", style: "cursor: pointer"}},
                {text: "Nommer", weight: 5, html: {onclick: "placerTag(\"Nommer\")", style: "cursor: pointer"}},
                {text: "Identifier", weight: 4, html: {onclick: "placerTag(\"Identifier\")", style: "cursor: pointer"}}
            ];

            break;
            
        case "Compréhension" :
            tags = [
                {text: "Classifier", weight: 7, html: {onclick: "placerTag(\"Classifier\")", style: "cursor: pointer"}},
                {text: "Décrire", weight: 6, html: {onclick: "placerTag(\"Décrire\")", style: "cursor: pointer"}},
                {text: "Expliquer", weight: 5, html: {onclick: "placerTag(\"Expliquer\")", style: "cursor: pointer"}},
                {text: "Reformuler", weight: 4, html: {onclick: "placerTag(\"Reformuler\")", style: "cursor: pointer"}}
            ];
            
            break;
            
        case "Application" :
            tags = [
                {text: "Appliquer", weight: 7, html: {onclick: "placerTag(\"Appliquer\")", style: "cursor: pointer"}},
                {text: "Utiliser", weight: 6, html: {onclick: "placerTag(\"Utiliser\")", style: "cursor: pointer"}},
                {text: "Employer", weight: 5, html: {onclick: "placerTag(\"Employer\")", style: "cursor: pointer"}},
                {text: "Résoudre", weight: 4, html: {onclick: "placerTag(\"Résoudre\")", style: "cursor: pointer"}}
            ];
            
            break;
            
        case "Analyse" :
            tags = [
                {text: "Analyser", weight: 7, html: {onclick: "placerTag(\"Analyser\")", style: "cursor: pointer"}},
                {text: "Estimer", weight: 6, html: {onclick: "placerTag(\"Estimer\")", style: "cursor: pointer"}},
                {text: "Comparer", weight: 5, html: {onclick: "placerTag(\"Comparer\")", style: "cursor: pointer"}},
                {text: "Différencier", weight: 4, html: {onclick: "placerTag(\"Différencier\")", style: "cursor: pointer"}}
            ];
            
            break;
            
        case "Synthèse" :
            tags = [
                {text: "Concevoir", weight: 7, html: {onclick: "placerTag(\"Concevoir\")", style: "cursor: pointer"}},
                {text: "Développer", weight: 6, html: {onclick: "placerTag(\"Développer\")", style: "cursor: pointer"}},
                {text: "Planifier", weight: 5, html: {onclick: "placerTag(\"Planifier\")", style: "cursor: pointer"}},
                {text: "Proposer", weight: 4, html: {onclick: "placerTag(\"Proposer\")", style: "cursor: pointer"}}
            ];
            
            break;
            
        case "Évaluation" :
            tags = [
                {text: "Évaluer", weight: 7, html: {onclick: "placerTag(\"Évaluer\")", style: "cursor: pointer"}},
                {text: "Comparer", weight: 6, html: {onclick: "placerTag(\"Comparer\")", style: "cursor: pointer"}},
                {text: "Chiffrer", weight: 5, html: {onclick: "placerTag(\"Chiffrer\")", style: "cursor: pointer"}},
                {text: "Juger", weight: 4, html: {onclick: "placerTag(\"Juger\")", style: "cursor: pointer"}}
            ];
            
            break;
            
        default:
            tags = [];
            
            break;
    }

    $("#tags_cloud").empty();
    $("#tags_cloud").jQCloud(tags, {width: 200, height: 200, delayedMode: true, shape: "rectangular"});
    
    var verbes = $('*[id^="verbe_"]');

    for (var i = 0; i < verbes.length; i++)
    {
        listerVerbes(verbes[i].id);
    }
}

function afficherTags()
{
    listerTags();
    $('#myModal').modal('show');
}

function listerRulePatterns()
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'liste',
            type: 'rule_pattern'
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        var patterns = data.liste;
        
        afficherListeRulePatterns(patterns);
    })
    .fail(function() {
        console.log('Erreur dans le chargement de la liste.');
    })
    .always(function() {
        //
    });
}

function afficherListeRulePatterns(patterns)
{
    var contenuListe = '<div class="list-group">';

    for (var i = 0; i < patterns.length; i++)
    {
        contenuListe += '<div class="list-group-item" style="padding: 0px;"><div class="radio radio-primary">';
        contenuListe += '<label style="text-align: left; padding-left: 35px;"><input type="radio" name="regle" id="regle_' + patterns[i].code + '_" value="_' + patterns[i].code + '_" onclick="changerRulePattern(\'' + patterns[i].code + '\')" >' + patterns[i].libelle + '</label>';
        contenuListe += '</div></div>';
    }
    
    contenuListe += '</div>';
    
    $('#liste_rule_patterns').html(contenuListe);
    
    $.material.init();
}

function detailsCompS()
{
    listerRulePatterns();
    
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'competence_specifique',
            code: codeS
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        var comp = data.obj;
        
        $('#legende').html('Compétence spécifique : ' + comp.libelle);
        $('#code_comp').val(comp.code).trigger("change");
        $('#categorie_comp').val(comp.categorie).trigger("change");
        $('#libelle_comp').val(comp.libelle).trigger("change");
        $('#ponderation_comp').val(comp.ponderation);
        anciennePond = comp.ponderation;
        
        if (comp.regle != null)
        {
            code_rule_pattern = comp.regle.pattern;
            checkRulePattern();

            var cas = comp.regle.cas;

            for (var i = 0; i < cas.length; i++)
            {
                var tab = cas[i].condition.split(" ");
                
                for (var j = 0; j < tab.length; j++)
                {
                    if (tab[j].includes('="'))
                    {
                        if (!tab[j].endsWith('"'))
                        {
                            while (!tab[j+1].includes('"'))
                            {
                                tab[j] += " " + tab[j+1];
                                tab.splice(j+1, 1);
                            }
                            tab[j] += " " + tab[j+1];
                        }
                    }
                }

                for (var j = 0; j < tab.length; j++)
                {
                    if (tab[j].includes("&nombre"))
                    {
                        var valeur = tab[j].split("=")[1].replace(/"/g, "");
                        $('#nombre_' + i + '_' + j).val(valeur);
                    }
                    else if (tab[j].includes("&type"))
                    {
                        var valeur = tab[j].split("=")[1].replace(/"/g, "");
                        $('#type_' + i + '_' + j).val(valeur);
                    }
                    else if (tab[j].includes("&verbe"))
                    {
                        var valeur = tab[j].split("=")[1].replace(/"/g, "");
                        $('#verbe_' + i + '_' + j).val(valeur);
                    }
                    else if (tab[j].includes("&libre"))
                    {
                        var valeur = tab[j].split("=")[1].replace(/"/g, "");
                        $('#libre_' + i + '_' + j).val(valeur);
                    }
                }
            }
        }
        
        $('#mise_en_situation').attr("value", comp.miseensituation).trigger("change");
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function checkRulePattern()
{
    if (code_rule_pattern != null)
    {
        $("#regle_" + code_rule_pattern + "_").attr("checked", "");
        $.ajax({
            url: './ActionServlet',
            type: 'GET',
            data: {
                action: 'infos',
                type: 'rule_pattern',
                code: code_rule_pattern
            },
            async:false,
            dataType: 'json'
        })
        .done(function(data) {
            var p = data.obj;

            var texte = p.cas;
            cas_rule_pattern = p.cas;
            
            var contenuTexte = '<thead><tr><th>Condition</th><th>Score</th></tr></thead>';
            
            if (p.ajoutCas)
            {
                contenuTexte += '';
            }
            
            contenuTexte += '<tbody>';

            for (var j = 0; j < texte.length; j++)
            {
                var tab = texte[j].condition.split(" ");

                for (var k = 0; k < tab.length; k++)
                {
                    if (tab[k] === "si" || tab[k] === "sinon")
                    {
                        tab[k] = '<b>' + tab[k] + '</b>';
                    }
                    if (tab[k].includes("&nombre"))
                    {
                        tab[k] = '<div class="form-group" style="margin: 0px;"><input type="text" class="form-control parametre" id="nombre_' + j + '_' + k + '" style="width: 60px;"></input></div>';
                    }
                    else if (tab[k].includes("&type"))
                    {
                        tab[k] = '<div class="form-group" style="margin: 0px; padding-left: 0px;"><select class="form-control parametre" id="type_' + j + '_' + k + '" style="width: 100px;"></select></div>';
                    }
                    else if (tab[k].includes("&verbe"))
                    {
                        tab[k] = '<div class="form-group" style="margin: 0px;"><select class="form-control parametre" id="verbe_' + j + '_' + k + '" style="width: 100px;"></select></div>';
                    }
                    else if (tab[k].includes("&libre"))
                    {
                        tab[k] = '<div class="form-group" style="margin: 0px;"><input type="text" class="form-control parametre" id="libre_' + j + '_' + k + '" style="width: 100%;"></div>';
                    }
                }

                var texte_parse = '<div class="form-inline">' + tab.join(" ") + '</div>';

                contenuTexte += '<tr><td>' + texte_parse + '</td><td style="text-align: center;"><b>' + texte[j].score + '</b></td></tr>';
            }
            
            contenuTexte += '</tbody>';
            
            document.getElementById("cas_regle").innerHTML = contenuTexte;
            
            var types = $('*[id^="type_"]');
            
            for (var i = 0; i < types.length; i++)
            {
                listerTypes(types[i].id);
            }
            
            var verbes = $('*[id^="verbe_"]');
            
            for (var i = 0; i < verbes.length; i++)
            {
                listerVerbes(verbes[i].id);
            }
            
            $.material.input();
        })
        .fail(function() {
            console.log('Erreur dans le chargement des informations.');
        })
        .always(function() {
            //
        });
    }
}

function valider()
{    
    if (code_rule_pattern == null)
    {
        afficherRetour("modifs_refusees");
    }
    else
    {
        var cas_regle = [];
        
        for (var i = 0; i < cas_rule_pattern.length; i++)
        {
            var tab = cas_rule_pattern[i].condition.split(" ");
            
            for (var j = 0; j < tab.length; j++)
            {
                if (tab[j].includes("&nombre"))
                {
                    tab[j] = '&nombre="' + $('#nombre_' + i + '_' + j).val() + '"';
                }
                else if (tab[j].includes("&type"))
                {
                    tab[j] = '&type="' + $('#type_' + i + '_' + j).val() + '"';
                }
                else if (tab[j].includes("&verbe"))
                {
                    tab[j] = '&verbe="' + $('#verbe_' + i + '_' + j).val() + '"';
                }
                else if (tab[j].includes("&libre"))
                {
                    tab[j] = '&libre="' + $('#libre_' + i + '_' + j).val() + '"';
                }
            }
            
            cas_regle.push({condition: tab.join(" "), score: cas_rule_pattern[i].score});
        }
        
        code_rule_pattern = code_rule_pattern.replace(/_/g, "");
        if (mode === "modification")
        {
            afficherRetour("modifs_en_cours");
            
            $.ajax({
                url: './ActionServlet',
                type: 'POST',
                data: {
                    action: 'modification',
                    type: 'competence_specifique',
                    code: codeS,
                    categorie: document.getElementById("categorie_comp").value,
                    libelle: document.getElementById("libelle_comp").value,
                    compSpec: JSON.stringify(competences[0].compSpec),
                    rule_pattern: code_rule_pattern,
                    regle: JSON.stringify(cas_regle),
                    miseensituation: document.getElementById("mise_en_situation").value
                },
                async:false,
                dataType: 'json'
            })
            .done(function(data) {
                var retour = data.retour;

                if (retour.valide)
                {
                    afficherRetour("modifs_acceptees");
                    setTimeout(function() {
                        location.replace(document.referrer);
                    }, 1000);
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
            afficherRetour("creation_competence_s_en_cours");
            $.ajax({
                url: './ActionServlet',
                type: 'POST',
                data: {
                    action: 'creation',
                    type: 'competence_specifique',
                    code: document.getElementById("code_comp").value,
                    competence_generale: codeG,
                    categorie: document.getElementById("categorie_comp").value,
                    libelle: document.getElementById("libelle_comp").value,
                    ponderation: document.getElementById("ponderation_comp").value,
                    compSpec: JSON.stringify(competences[0].compSpec),
                    rule_pattern: code_rule_pattern,
                    regle: JSON.stringify(cas_regle),
                    miseensituation: document.getElementById("mise_en_situation").value
                },
                async:false,
                dataType: 'json'
            })
            .done(function(data) {
                var retour = data.retour;

                if (retour.valide)
                {
                    afficherRetour("creation_competence_s_acceptee");
                    setTimeout(function() {
                        window.location.href = document.referrer;
                    }, 1000);
                }
                else
                {
                    afficherRetour("creation_competence_s_refusee");
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
}

function changerRulePattern(id)
{
    code_rule_pattern = id;
    checkRulePattern();
}

function changerPonderation(val)
{
    if (competences[0].compSpec.length > 1)
    {
        var diff = 10 * (val - anciennePond);

        if (diff > 0)
        {
            for (var i = 0; i < diff; i++)
            {
                augmenterPond(codeG, codeS);
            }
        }
        else
        {
            for (var i = 0; i < -diff; i++)
            {
                diminuerPond(codeG, codeS);
            }
        }

        anciennePond = document.getElementById("ponderation_comp").value;
    }
    else
    {
        competences[0].compSpec[0].ponderation = 1;
        document.getElementById("ponderation_comp").value = 1;
        document.getElementById("ponderation_comp").disabled = "true";
    }
}

function annuler()
{
    if (mode === "modification")
    {
        init();
    }
    else if (mode === "creation")
    {
        location.replace(document.referrer);
    }
}

function listerTypes(id)
{
    var contenuHtml = "";
    
    contenuHtml += '<option>éléments</option>';
    contenuHtml += '<option>cas</option>';
    
    document.getElementById(id).innerHTML = contenuHtml;
}

function listerVerbes(id)
{
    var contenuHtml = "";
    
    switch(document.getElementById("categorie_comp").value)
    {
        case "Connaissance" :
            contenuHtml += '<option>identifiés</option>';
            contenuHtml += '<option>définis</option>';
            contenuHtml += '<option>nommés</option>';
            contenuHtml += '<option>rappelés</option>';
            contenuHtml += '<option>reproduits</option>';
            contenuHtml += '<option>mémorisés</option>';
            contenuHtml += '<option>ordonnés</option>';
            contenuHtml += '<option>arrangés</option>';
            
            break;
            
        case "Compréhension" :
            contenuHtml += '<option>identifiés</option>';
            contenuHtml += '<option>indiqués</option>';
            contenuHtml += '<option>classifiés</option>';
            contenuHtml += '<option>décrits</option>';
            contenuHtml += '<option>discutés</option>';
            contenuHtml += '<option>expliqués</option>';
            contenuHtml += '<option>exprimés</option>';
            contenuHtml += '<option>reconnus</option>';
            contenuHtml += '<option>choisis</option>';
            
            break;
            
        case "Application" :
            contenuHtml += '<option>employés</option>';
            contenuHtml += '<option>appliqués</option>';
            contenuHtml += '<option>résolus</option>';
            contenuHtml += '<option>utilisés</option>';
            contenuHtml += '<option>démontrés</option>';
            contenuHtml += '<option>illustrés</option>';
            contenuHtml += '<option>interprétés</option>';
            contenuHtml += '<option>planifiés</option>';
            contenuHtml += '<option>utilisés</option>';
            contenuHtml += '<option>choisis</option>';
            
            break;
            
        case "Analyse" :
            contenuHtml += '<option>analysés</option>';
            contenuHtml += '<option>estimés</option>';
            contenuHtml += '<option>calculés</option>';
            contenuHtml += '<option>distingués</option>';
            contenuHtml += '<option>examinés</option>';
            contenuHtml += '<option>testés</option>';
            contenuHtml += '<option>expérimentés</option>';
            contenuHtml += '<option>comparés</option>';
            contenuHtml += '<option>critiqués</option>';
            
            break;
            
        case "Synthèse" :
            contenuHtml += '<option>créés</option>';
            contenuHtml += '<option>conçus</option>';
            contenuHtml += '<option>formulés</option>';
            contenuHtml += '<option>organisés</option>';
            contenuHtml += '<option>gérés</option>';
            contenuHtml += '<option>proposés</option>';
            contenuHtml += '<option>installés</option>';
            contenuHtml += '<option>écrits</option>';
            contenuHtml += '<option>arrangés</option>';
            contenuHtml += '<option>construits</option>';
            
            break;
            
        case "Évaluation" :
            contenuHtml += '<option>évalués</option>';
            contenuHtml += '<option>choisis</option>';
            contenuHtml += '<option>comparés</option>';
            contenuHtml += '<option>justifiés</option>';
            contenuHtml += '<option>estimés</option>';
            contenuHtml += '<option>jugés</option>';
            contenuHtml += '<option>chiffrés</option>';
            contenuHtml += '<option>sélectionnés</option>';
            contenuHtml += '<option>arrangés</option>';
            
            break;
    }
    
    document.getElementById(id).innerHTML = contenuHtml;
}