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
var code_rule_pattern = null;
var cas_rule_pattern = null;
var cas_regle = null;
var ajout;
var nombre;
var pourcentages;
var liste_rule_patterns = [];
var compteur_cas = 0;

var RP_EXCLUSIF;
var RP_PROGRESSIF;
var RP_LIBRE;

var verbes;
          
var verbe_sel;

var feminin;
var pluriel;

var slider_init = false;
var longueur_type = 1;

(function() {
    $.material.init();
    document.getElementById("valider").setAttribute("id", "valider_" + codeG + "_");
    init();
}());

function init()
{
    listerRulePatterns();
    
    RP_EXCLUSIF = trouverRulePattern("RP-EXCLUSIF");
    RP_PROGRESSIF = trouverRulePattern("RP-PROGRESSIF");
    RP_LIBRE = trouverRulePattern("RP-LIBRE");
    
    verbes = [
                {type: "Connaissance", liste: [
                    {infinitif: "Identifier", participe: "identifié"},
                    {infinitif: "Définir", participe: "défini"},
                    {infinitif: "Nommer", participe: "nommé"},
                    {infinitif: "Rappeler", participe: "rappelé"},
                    {infinitif: "Reproduire", participe: "reproduit"},
                    {infinitif: "Mémoriser", participe: "mémorisé"},
                    {infinitif: "Ordonner", participe: "ordonné"},
                    {infinitif: "Arranger", participe: "arrangé"}
                                             ]},
                {type: "Compréhension", liste: [
                    {infinitif: "Identifier", participe: "identifié"},
                    {infinitif: "Classifier", participe: "classifié"},
                    {infinitif: "Indiquer", participe: "indiqué"},
                    {infinitif: "Décrire", participe: "décrit"},
                    {infinitif: "Expliquer", participe: "expliqué"},
                    {infinitif: "Discuter", participe: "discuté"},
                    {infinitif: "Exprimer", participe: "exprimé"},
                    {infinitif: "Reconnaître", participe: "reconnu"},
                    {infinitif: "Choisir", participe: "choisi"}
                                             ]},
                {type: "Application", liste: [
                    {infinitif: "Employer", participe: "employé"},
                    {infinitif: "Appliquer", participe: "appliqué"},
                    {infinitif: "Résoudre", participe: "résolu"},
                    {infinitif: "Utiliser", participe: "utilisé"},
                    {infinitif: "Démontrer", participe: "démontré"},
                    {infinitif: "Illustrer", participe: "illustré"},
                    {infinitif: "Interpréter", participe: "interprété"},
                    {infinitif: "Planifier", participe: "planifié"},
                    {infinitif: "Utiliser", participe: "utilisé"},
                    {infinitif: "Choisir", participe: "choisi"}
                                           ]},
                {type: "Analyse", liste: [
                    {infinitif: "Analyser", participe: "analysé"},
                    {infinitif: "Estimer", participe: "estimé"},
                    {infinitif: "Calculer", participe: "calculé"},
                    {infinitif: "Distinguer", participe: "distingué"},
                    {infinitif: "Examiner", participe: "examiné"},
                    {infinitif: "Tester", participe: "testé"},
                    {infinitif: "Expérimenter", participe: "expérimenté"},
                    {infinitif: "Comparer", participe: "comparé"},
                    {infinitif: "Critiquer", participe: "critiqué"}
                                         ]},
                {type: "Synthèse", liste: [
                    {infinitif: "Créer", participe: "créé"},
                    {infinitif: "Concevoir", participe: "conçu"},
                    {infinitif: "Formuler", participe: "formulé"},
                    {infinitif: "Organiser", participe: "organisé"},
                    {infinitif: "Gérer", participe: "géré"},
                    {infinitif: "Proposer", participe: "proposé"},
                    {infinitif: "Installer", participe: "installé"},
                    {infinitif: "Écrire", participe: "écrit"},
                    {infinitif: "Arranger", participe: "arrangé"},
                    {infinitif: "Construire", participe: "construit"}
                                          ]},
                {type: "Évaluation", liste: [
                    {infinitif: "Évaluer", participe: "évalué"},
                    {infinitif: "Choisir", participe: "choisi"},
                    {infinitif: "Comparer", participe: "comparé"},
                    {infinitif: "Justifier", participe: "justifié"},
                    {infinitif: "Estimer", participe: "estimé"},
                    {infinitif: "Juger", participe: "jugé"}
                                            ]}
             ];
             
    afficherVerbe("libelle_verbe");
    $('#libelle_verbe').trigger("change");
    changerMES();
    
    if (mode === "modification")
    {
        codeS = param[2].split("=")[1];
        document.getElementById("valider_" + codeG + "_").innerHTML = '<span class="fa fa-check"></span> Valider les modifications';
        document.getElementById("annuler").innerHTML = '<span class="fa fa-times"></span> Annuler les modifications';
        detailsCompG();
        detailsCompS();
    }
    else if (mode === "creation")
    {
        document.getElementById("code_comp").disabled = false;
        document.getElementById("valider_" + codeG + "_").innerHTML = '<span class="fa fa-check"></span> Créer la compétence';
        document.getElementById("annuler").innerHTML = '<span class="fa fa-times"></span> Revenir aux compétences générales';
        detailsCompG();
        
        competences[0].compSpec.push(JSON.parse('{"code":null,"libelle":"","ponderation":0,"categorie":""}'));
        
        changerPonderation(0.2);
        
        afficherCompS(codeG, competences[0].compSpec, null);
    }
}

function trouverRulePattern(id)
{
    return liste_rule_patterns.find(function(p) {return p.code === id;});
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
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

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
        afficherVerbe(verbes[i].id);
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
        liste_rule_patterns = data.liste;
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
        if (i % 3 === 0)
        {
            contenuListe += '<div class="row">';
        }
        contenuListe += '<div class="col-sm-4" style="padding: 0px;"><div class="radio radio-primary" style="margin: 0px;">';
        contenuListe += '<label style="text-align: left; padding-left: 35px; color: black;"><input type="radio" name="regle" id="regle_' + patterns[i].code + '_" value="_' + patterns[i].code + '_" onclick="changerRulePattern(\'' + patterns[i].code + '\')" >' + patterns[i].libelle + '</label>';
        contenuListe += '</div></div>';
        
        if (i % 3 === 2)
        {
            contenuListe += '</div>';
        }
    }
    
    contenuListe += '</div>';
    
    $('#liste_rule_patterns').html(contenuListe);
    
    $('cas_regle').html("");
    
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

        var libelle = comp.libelle.split(" ");
        
        $('#legende').html('Compétence spécifique : ' + comp.libelle);
        $('#code_comp').val(comp.code).trigger("change");
        $('#categorie_comp').val(comp.categorie).trigger("change");
        $('#libelle_verbe').val(libelle[0]).trigger("change");
        $('#libelle_pronom').val(libelle[1]).trigger("change");
        
        var val = "";
        
        for (var i = 2; i < libelle.length; i++)
        {
            if (i > 2)
            {
                val += " ";
            }
            val += libelle[i];
        }
        
        feminin = comp.feminin;
        pluriel = comp.pluriel;
        
        if (comp.regle != null)
        {
            pourcentages = comp.regle.pourcentages;
        }
        
        $('#libelle_complement').val(val).trigger("change");
        
        if (feminin)
        {
            $('#feminin').prop("checked", true);
        }
        else
        {
            $('#feminin').prop("checked", false);
        }
        
        if (pluriel)
        {
            $('#pluriel').prop("checked", true).trigger("change");
        }
        else
        {
            $('#pluriel').prop("checked", false).trigger("change");
        }
        
        changerPronom();
        
        $('#ponderation_comp').val(comp.ponderation);
        $('#contexte').val(comp.miseensituation.contexte);
        $('#ressources').val(comp.miseensituation.ressources);
        $('#action').val(comp.miseensituation.action);
        anciennePond = comp.ponderation;
        
        if (comp.regle != null)
        {
            code_rule_pattern = comp.regle.pattern;
            
            checkRulePattern();
            
            cas_regle = comp.regle.cas;
            compteur_cas = cas_regle.length;
            
            for (var i = 0; i < cas_regle.length; i++)
            {
                cas_regle[i]["position"] = i;
                cas_regle[i].condition = cas_regle[i].condition.replace(/ % des /g, " ").replace(/ % de la /g, " ").replace(/ % du /g, " ").replace(/ % /g, " ");
            }
            
            afficherRegle(true);

            var cas = comp.regle.cas;
            
            for (var i = 0; i < cas.length; i++)
            {
                cas_regle[i].condition = cas_regle[i].condition.replace(/ % des /g, " ").replace(/ % de la /g, " ").replace(/ % du /g, " ").replace(/ % /g, " ");
            }

            for (var i = 0; i < cas.length; i++)
            {
                var tab = cas_regle[i].condition.split(" ");
                
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
                        longueur_type = valeur.split("_").length;
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
                    else if (tab[j].includes("&avoir"))
                    {
                        var valeur = tab[j].split("=")[1].replace(/"/g, "");
                        $('#avoir_' + i + '_' + j).val(valeur);
                    }
                }
            }
        }
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function afficherRegle(nouveau)
{
    if (nombre)
    {
        if (nouveau)
        {
            $('#categorie_nombres').html('<div class="togglebutton"><label>Comptage <input type="checkbox" id="switch_nombres" onchange="afficherRegle(false)"> Pourcentages</label></div>');
            
            $('#switch_nombres').prop("checked", pourcentages);
        }
        
        pourcentages = $('#switch_nombres').is(":checked");
    }
    else
    {
        $('#categorie_nombres').html("");
    }
    
    $.material.init();
    
    var contenuTexte = '<thead><tr><th>Condition</th><th>Score</th><th class="minimal-cell"></th><th class="minimal-cell"></th></tr></thead>';
            
    contenuTexte += '<tbody>';

    for (var j = 0; j < cas_regle.length; j++)
    {
        var tab = cas_regle[j].condition.split(" ");

        for (var k = 0; k < tab.length; k++)
        {
            if (tab[k] === "si" || tab[k] === "sinon")
            {
                tab[k] = '<b>' + tab[k] + '</b>';
            }
            if (tab[k].includes("&nombre"))
            {
                tab[k] = '<div class="form-group" style="margin: 0px;"><b><input type="text" class="form-control parametre" id="nombre_' + j + '_' + k + '" style="width: 30px; text-align: center;"></b>';
                if (nombre && pourcentages)
                {
                    if ((k > 0 && tab[k-1] != "entre") || k === 0)
                    {
                        if (pluriel)
                        {
                            tab[k] += '<p id="pourcent_' + j + '_' + k + '" class="parametre">% des</p>';
                        }
                        else
                        {
                            if (feminin)
                            {
                                tab[k] += '<p id="pourcent_' + j + '_' + k + '" class="parametre">% de la</p>';
                            }
                            else
                            {
                                tab[k] += '<p id="pourcent_' + j + '_' + k + '" class="parametre">% du</p>';
                            }
                        }
                    }
                    else
                    {
                        tab[k] += '<p id="entre_pourcent_' + j + '_' + k + '" class="parametre">%</p>';
                    }
                }

                tab[k] += '</div>';
            }
            else if (tab[k].includes("&type"))
            {
                tab[k] = '<div class="form-group" style="margin: 0px; padding-left: 0px;"><b><p id="type_' + j + '_' + k + '"></p></b></div>';
            }
            else if (tab[k].includes("&verbe"))
            {
                tab[k] = '<div class="form-group" style="margin: 0px;"><b><p id="verbe_' + j + '_' + k + '"></p></b></div>';
            }
            else if (tab[k].includes("&libre"))
            {
                tab[k] = '<div class="form-group" style="margin: 0px;"><b><input type="text" class="form-control parametre" id="libre_' + j + '_' + k + '" style="width: 100%;"></b></div>';
            }
            else if (tab[k].includes("&avoir"))
            {
                if (pluriel)
                {
                    tab[k] = 'ont';
                }
                else
                {
                    tab[k] = 'a';
                }
            }
        }

        var texte_parse = '<div class="form-inline">' + tab.join(" ") + '</div>';

        contenuTexte += '<tr id="cas_' + j + '"><td>' + texte_parse + '</td><td style="text-align: center; vertical-align: middle;"><b><div class="form-group" style="margin: 0px; width: 30px;"><input type="text" class="form-control parametre" id="note_' + j + '" value="' + cas_regle[j].score + '" style="text-align: center;"></div></b></td>';

        if (ajout)
        {
            if (j > 0 && j < cas_regle.length - 1)
            {
                contenuTexte += '<td style="vertical-align: middle;"><div class="text-center"><i id="icone_plus_' + j + '" class="clickable fa fa-plus-circle" onclick="ajouterCas(' + j + ')"></i></div></td>';
                contenuTexte += '<td style="vertical-align: middle;"><div class="text-center"><i id="icone_moins_' + j + '" class="clickable fa fa-minus-circle" onclick="retirerCas(' + j + ')"></i></div></td>';
            }
            else
            {
                contenuTexte += '<td></td><td></td>';
            }
        }

        contenuTexte += '</tr>';
    }

    contenuTexte += '</tbody>';

    document.getElementById("cas_regle").innerHTML = contenuTexte;
    
    var types = $('*[id^="type_"]');
            
    for (var i = 0; i < types.length; i++)
    {
        afficherType(types[i].id);
    }

    var verbes = $('*[id^="verbe_"]');

    for (var i = 0; i < verbes.length; i++)
    {
        afficherVerbe(verbes[i].id);
    }
}

function checkRulePattern()
{
    if (code_rule_pattern != null)
    {
        $("#regle_" + code_rule_pattern + "_").attr("checked", "");
        
        var p = liste_rule_patterns.find(function(pa){return pa.code === code_rule_pattern;});
    
        cas_rule_pattern = p.cas;
        cas_regle = p.cas;
        compteur_cas = cas_regle.length;

        for (var i = 0; i < cas_regle.length; i++)
        {
            cas_regle[i]["position"] = i;
        }
        ajout = p.ajout;
        nombre = p.nombre;
        afficherRegle(true);

        $.material.input();
        
        changerContenu();
    }
}

function valider()
{
    if ($('*[name="regle"]:checked').val() == null)
    {
        afficherRetour("modifs_refusees");
    }
    else
    {        
        var libelle = $('#libelle_verbe').val() + " " + $('#libelle_pronom').val().split(" ")[0] + " " + $('#libelle_complement').val();
        var cas = [];
        for (var i = 0; i < cas_regle.length; i++)
        {
            var tab = cas_regle[i].condition.split(" ");
            var position = cas_regle[i].position;
            
            for (var j = 0; j < tab.length; j++)
            {                
                if (tab[j].includes("&nombre"))
                {
                    tab[j] = '&nombre="' + $('#nombre_' + position + '_' + j).val() + '" ';
                    
                    if (pourcentages)
                    {
                        if (tab[j-1] === "entre")
                        {
                            tab[j] += "%";
                        }
                        else
                        {
                            if (pluriel)
                            {
                                tab[j] += "% des";
                            }
                            else
                            {
                                if (feminin)
                                {
                                    tab[j] += "% de la";
                                }
                                else
                                {
                                    tab[j] += "% du";
                                }
                            }
                        }
                    }
                }
                else if (tab[j].includes("&type"))
                {
                    tab[j] = ('&type="' + $('#type_' + position + '_' + j).html() + '"').replace(/ /g, "_");
                }
                else if (tab[j].includes("&verbe"))
                {
                    tab[j] = '&verbe="' + $('#verbe_' + position + '_' + j).html() + '"';
                }
                else if (tab[j].includes("&libre"))
                {
                    tab[j] = '&libre="' + $('#libre_' + position + '_' + j).val() + '"';
                }
                else if (tab[j].includes("&avoir"))
                {
                    tab[j] = '&avoir="';
                    
                    if (pluriel)
                    {
                        tab[j] += 'ont';
                    }
                    else
                    {
                        tab[j] += 'a';
                    }
                    
                    tab[j] += '"';
                }
            }
            
            cas.push({condition: tab.join(" "), score: $('#note_' + position).val()});
        }
        
        cas = cas.sort(function(a,b) {return b.score - a.score;});
        
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
                    libelle: libelle,
                    feminin: feminin,
                    pluriel: pluriel,
                    compSpec: JSON.stringify(competences[0].compSpec),
                    rule_pattern: code_rule_pattern,
                    pourcentages: pourcentages,
                    regle: JSON.stringify(cas),
                    contexte: document.getElementById("contexte").value,
                    ressources: document.getElementById("ressources").value,
                    actions: document.getElementById("action").value
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
                        //location.replace(document.referrer);
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
                    libelle: libelle,
                    feminin: feminin,
                    pluriel: pluriel,
                    ponderation: document.getElementById("ponderation_comp").value,
                    compSpec: JSON.stringify(competences[0].compSpec),
                    rule_pattern: code_rule_pattern,
                    pourcentages: pourcentages,
                    regle: JSON.stringify(cas),
                    contexte: document.getElementById("contexte").value,
                    ressources: document.getElementById("ressources").value,
                    actions: document.getElementById("action").value
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

function afficherType(id)
{
    var tab = $('#libelle_complement').val().split(" ");
    
    var nouveau_tab = [];
    
    for (var i = 0; i < longueur_type; i++)
    {
        nouveau_tab.push(tab[i]);
    }
    
    var val = nouveau_tab.join(" ");
    
    document.getElementById(id).innerHTML = val;
}

function afficherVerbe(id)
{
    if (id.startsWith("libelle_"))
    {
        var type = $('#categorie_comp').val();

        var v = verbes.find(function(v){return v.type === type;});

        var contenuHtml = '';

        for (var i = 0; i < v.liste.length; i++)
        {
            contenuHtml += '<option>' + v.liste[i]["infinitif"] + '</option>';
        }

        $('#' + id).html(contenuHtml);
    }
    else if (id.startsWith("verbe_"))
    {
        if (!feminin && !pluriel)
        {
            $('#' + id).html(verbe_sel.participe);
        }
        else if (feminin && !pluriel)
        {
            $('#' + id).html(verbe_sel.participe + "e");
        }
        else if (!feminin && pluriel)
        {
            $('#' + id).html(verbe_sel.participe + "s");
        }
        else if (feminin && pluriel)
        {
            $('#' + id).html(verbe_sel.participe + "es");
        }
    }
}

function ajouterCas(index)
{
    var rows = document.getElementById("cas_regle").rows;
    
    for (var i = 1; i < rows.length; i++)
    {
        if (index == rows[i].id.split("_")[1])
        {
            var row = document.getElementById("cas_regle").insertRow(i + 1);
            break;
        }
    }
    
    var c;
    
    for (var i = 0; i < cas_regle.length; i++)
    {
        if (cas_regle[i].position == index)
        {
            c = cas_regle[i];
            break;
        }
    }
    
    var tab = c.condition.split(" ");
    
    for (var i = 0; i < tab.length; i++)
    {
        if (tab[i] === "si")
        {
            tab[i] = '<b>' + tab[i] + '</b>';
        }
        if (tab[i].includes("&nombre"))
        {
            tab[i] = '<div class="form-group" style="margin: 0px;"><b><input type="text" class="form-control parametre" id="nombre_' + compteur_cas + '_' + i + '" style="width: 30px; text-align: center"></b>';
            
            if (nombre && pourcentages)
            {
                if ((i > 0 && tab[i-1] != "entre") || i === 0)
                {
                    if (pluriel)
                    {
                        tab[i] += '<p id="pourcent_' + compteur_cas + '_' + i + '" class="parametre">% des</p>';
                    }
                    else
                    {
                        if (feminin)
                        {
                            tab[i] += '<p id="pourcent_' + compteur_cas + '_' + i + '" class="parametre">% de la</p>';
                        }
                        else
                        {
                            tab[i] += '<p id="pourcent_' + compteur_cas + '_' + i + '" class="parametre">% du</p>';
                        }
                    }
                }
                else
                {
                    tab[i] += '<p id="entre_pourcent_' + compteur_cas + '_' + i + '" class="parametre">%</p>';
                }
            }
            
            tab[i] += '</div>';
        }
        else if (tab[i].includes("&type"))
        {
            tab[i] = '<div class="form-group" style="margin: 0px; padding-left: 0px;"><b><p id="type_' + compteur_cas + '_' + i + '"></p></b></div>';
        }
        else if (tab[i].includes("&verbe"))
        {
            tab[i] = '<div class="form-group" style="margin: 0px;"><b><p id="verbe_' + compteur_cas + '_' + i + '"></p></b></div>';
        }
        else if (tab[i].includes("&libre"))
        {
            tab[i] = '<div class="form-group" style="margin: 0px;"><b><input type="text" class="form-control parametre" id="libre_' + compteur_cas + '_' + i + '" style="width: 100%;"></b></div>';
        }
        else if (tab[i].includes("&avoir"))
        {
            if (pluriel)
            {
                tab[i] = 'ont';
            }
            else
            {
                tab[i] = 'a';
            }
        }
    }
    
    row.innerHTML = '<td><div class="form-inline">' + tab.join(" ") + '</div></td><td style="text-align: center; vertical-align: middle;"><b><div class="form-group" style="margin: 0px; width: 30px;"><input type="text" class="form-control parametre" id="note_' + compteur_cas + '" value="' + c.score + '" style="text-align: center;"></div></b></td>';
    
    row.innerHTML += '<td style="vertical-align: middle;"><div class="text-center"><i id="icone_plus_' + compteur_cas + '" class="clickable fa fa-plus-circle" onclick="ajouterCas(' + compteur_cas + ')"></i></div></td>';
    row.innerHTML += '<td style="vertical-align: middle;"><div class="text-center"><i id="icone_moins_' + compteur_cas + '" class="clickable fa fa-minus-circle" onclick="retirerCas(' + compteur_cas + ')"></i></div></td>';
    
    row.setAttribute("id", "cas_" + compteur_cas);
    
    var types = $('*[id^="type_' + compteur_cas + '"]');

    for (var i = 0; i < types.length; i++)
    {
        afficherType(types[i].id);
    }

    var verbes = $('*[id^="verbe_' + compteur_cas + '"]');

    for (var i = 0; i < verbes.length; i++)
    {
        afficherVerbe(verbes[i].id);
    }
    
    var c;
    
    for (var i = 0; i < cas_regle.length; i++)
    {
        if (index == cas_regle[i].position)
        {
            c = cas_regle[i];
            break;
        }
    }
    
    cas_regle.push({condition: c.condition, score: c.score, position: compteur_cas});    
    
    compteur_cas++;
    
    if (cas_regle.length > 3)
    {
        for (var i = 1; i < cas_regle.length - 1; i++)
        {
            $('#icone_moins_' + document.getElementById("cas_regle").rows[2].id.split("_")[1]).addClass("fa-minus-circle");
        }
    }
}

function retirerCas(index)
{
    var rows = document.getElementById("cas_regle").rows;
    
    for (var i = 1; i < rows.length; i++)
    {
        if (index == rows[i].id.split("_")[1])
        {
            document.getElementById("cas_regle").deleteRow(i);
            
            var aRetirer;
            for (var j = 0; j < cas_regle.length; j++)
            {
                if (cas_regle[j].position == index)
                {
                    aRetirer = j;
                }
            }

            cas_regle.splice(aRetirer, 1);

            if (cas_regle.length === 3)
            {
                $('#icone_moins_' + document.getElementById("cas_regle").rows[2].id.split("_")[1]).removeClass("fa-minus-circle");
            }
            
            break;
        }
    }
}

function changerMES()
{
    var ve = $('#libelle_verbe').val();
    var pronom = $('#libelle_pronom').html();
    var complement = $('#libelle_complement').val();
    
    var libelle = ve + " " + pronom + " " + complement + ".";
    $('#action').val(libelle);
    
    var liste = verbes.find(function(v) {return v.type === $('#categorie_comp').val();}).liste;
    
    verbe_sel = liste.find(function(v){return v.infinitif === ve;});
    
    var rp = [];
    
    if (!pluriel)
    {
        rp.push(RP_EXCLUSIF);
    }
    else
    {
        rp.push(RP_PROGRESSIF);
    }
    
    rp.push(RP_LIBRE);
    
    afficherListeRulePatterns(rp);
    
    $('#cas_regle').html("");
}

function changerPronom()
{
    if ($('#feminin').is(":checked"))
    {
        feminin = true;
    }
    else
    {
        feminin = false;
    }
    if ($('#pluriel').is(":checked"))
    {
        pluriel = true;
    }
    else
    {
        pluriel = false;
    }
    
    if (pluriel)
    {
        $('#libelle_pronom').html("les");
    }
    else
    {
        if (feminin)
        {
            $('#libelle_pronom').html("la");
        }
        else
        {
            $('#libelle_pronom').html("le");
        }
    }
    
    changerMES();
}

function changerContenu()
{
    if (code_rule_pattern != null && code_rule_pattern != "RP-LIBRE")
    {
        var contenu = $('#libelle_complement').val();
        $('#contenu_type').val(contenu);

        var tab = contenu.split(" ");
        var longueur_max = 0;

        var range = {};

        range['min'] = 0;

        for (var i = 0; i < tab.length; i++)
        {
            longueur_max += tab[i].length * 7.5;
        }

        longueur_max += 3.9 * (tab.length - 1);

        var longueur = 0;

        for (var i = 0; i < tab.length - 1; i++)
        {
            longueur += tab[i].length * 7.5 + 2;

            range[longueur / longueur_max * 100] = i+1;
        }

        range['max'] = tab.length;

        $('#slider_contenu').css("width", longueur_max);

        var skipSlider = document.getElementById('slider_contenu');

        if (!slider_init)
        {
            noUiSlider.create(skipSlider, {
                start: longueur_type,
                connect: "lower",
                range: range,
                snap: true
            });

            skipSlider.noUiSlider.on("update", function(){changerType();});

            slider_init = true;
        }
        else
        {
            skipSlider.noUiSlider.updateOptions({
                start: longueur_type,
                connect: "lower",
                range: range,
                snap: true
            });
        }

        var types = $('*[id^="type_"]');

        for (var i = 0; i < types.length; i++)
        {
            afficherType(types[i].id);
        }
    }
}

function changerType()
{
    if (code_rule_pattern != null && code_rule_pattern != "RP-LIBRE")
    {
        var val = document.getElementById("slider_contenu").noUiSlider.get();
        
        if (val != null)
        {
            longueur_type = val;
        }
        else
        {
            longueur_type = 1;
        }

        var types = $('*[id^="type"]');

        for (var i = 0; i < types.length; i++)
        {
            afficherType(types[i].id);
        }
    }
}