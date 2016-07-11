/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var param = window.location.search.substring(1).split("&");
var mode = param[0].split("=")[1];
var code;
var liste_formations;
var competences_g;
var compSpec;
var scores;
var grades;
var seuils_min;
var seuils_max;
var myRadarChart;
var chartIsGeneral = true;

(function() {
    if (mode === "creation")
    {
        document.getElementById("details").setAttribute("class", "col-sm-12");
        document.getElementById("annuler").innerHTML += ' Retour aux apprenants';
        document.getElementById("valider").innerHTML += ' Créer l\'apprenant';
        listerFormations();
        afficherFormations();
    }
    else if (mode === "modification")
    {
        code = param[1].split("=")[1];
        document.getElementById("code_apprenant").disabled = "true";
        document.getElementById("annuler").innerHTML += ' Annuler les modifications';
        document.getElementById("valider").innerHTML += ' Valider les modifications';
        
        detailsApprenant(); 
        
        document.getElementById("myChart").onclick = function(evt)
        {
            var activePoints = myRadarChart.getElementsAtEvent(evt);
            var index = activePoints[0]["_index"];
            creerRadarSpecifique(competences_g[index].code);
            chartIsGeneral = false;
        };
    }
       
}());

function detailsApprenant()
{
    document.getElementById("legende").innerHTML = 'Apprenant : <h4><i class="glyphicon glyphicon-refresh gly-spin"></h4>';
    
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'apprenant',
            code: code
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        var apprenant = data.obj;
        
        document.getElementById("legende").innerHTML = "Apprenant : " + apprenant.nom;
        document.getElementById("code_apprenant").value = apprenant.code;
        document.getElementById("nom_apprenant").value = apprenant.nom;
        document.getElementById("fonction_apprenant").value = apprenant.fonction;
        document.getElementById("entreprise_apprenant").value = apprenant.entreprise;
        
        listerFormations();
        
        afficherFormations();
        
        if (apprenant.formation != null)
        {
            document.getElementById("details").setAttribute("class", "col-sm-6");
            document.getElementById("radar").setAttribute("class", "col-sm-6");
            document.getElementById("radar").innerHTML = '<label id="label_comp">Compétences générales :</label><canvas id="myChart"></canvas>';
            
            for (var i = 0; i < liste_formations.length; i++)
            {
                if (apprenant.formation === liste_formations[i].code)
                {
                    var f = liste_formations[0];
                    liste_formations[0] = liste_formations[i];
                    liste_formations[i] = f;
                }
            }

            detailsFormation(apprenant.formation);
            
            grades = apprenant.grades;
            console.log(grades);
            scores = apprenant.scores;

            creerRadarGeneral();
        }
        
        document.getElementById("legende").innerHTML = 'Apprenant : ' + apprenant.nom;
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function afficherFormations()
{
    var contenuHtml = '';
    
    for (var i = 0; i < liste_formations.length; i++)
    {
        contenuHtml += '<option id="formation_\'' + liste_formations[i].code + '\'">' + liste_formations[i].libelle + '</option>';
    }
    
    document.getElementById("formation_apprenant").innerHTML = contenuHtml;
}

function detailsFormation(formation)
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
        competences_g = data.liste;
        set_seuils(formation);
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function set_seuils(formation)
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'formation',
            code: formation
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        seuils_min = data.obj.seuils_min;
        seuils_max = data.obj.seuils_max;
        
        console.log(seuils_min);
        console.log(seuils_max);
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function creerRadarGeneral()
{
    var labels = [];
    var data = [];
    
    for (var i = 0; i < competences_g.length; i++)
    {
        var libelle = competences_g[i].libelle.split(" ")[0];
        labels.push(libelle);
        
        var contient = false;
        for (var j = 0; j < grades.length; j++)
        {
            if (grades[j].code_competence === competences_g[i].code)
            {
                data.push(grades[i].moyenne);
                contient = true;
                break;
            }
        }
        if (!contient)
        {
            data.push(null);
        }
    }
    
    var data_seuils_min = [];
    
    for (var i = 0; i < competences_g.length; i++)
    {
        for (var j = 0; j < seuils_min.length; j++)
        {
            if (seuils_min[j].competence_generale === competences_g[i].code)
            {
                data_seuils_min.push(seuils_min[j].seuil);
                break;
            }
        }
    }
    
    var data_seuils_max = [];
    
    for (var i = 0; i < competences_g.length; i++)
    {
        for (var j = 0; j < seuils_max.length; j++)
        {
            if (seuils_max[j].competence_generale === competences_g[i].code)
            {
                data_seuils_max.push(seuils_max[j].seuil);
                break;
            }
        }
    }
    
    var ctx = document.getElementById("myChart").getContext("2d");
    document.getElementById("myChart").setAttribute("width", $('#radar').width() * 0.32);
    myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
                labels: labels,
                datasets: [
                    {
                        label: "Seuils maximaux",
                        backgroundColor: "rgba(0,0,0,0)",
                        borderColor: "rgba(0,255,0,0.5)",
                        pointBackgroundColor: "rgba(0,255,0,0.5)",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(0,255,0,0.5)",
                        data: data_seuils_max
                    },
                    {
                        label: "Seuils minimaux",
                        backgroundColor: "rgba(0,0,0,0)",
                        borderColor: "rgba(255,0,0,0.5)",
                        pointBackgroundColor: "rgba(255,0,0,0.5)",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(255,0,0,0.5)",
                        data: data_seuils_min
                    },
                    {
                        label: "Moyennes de l'apprenant",
                        backgroundColor: "rgba(0,0,255,0.2)",
                        borderColor: "rgba(0,0,255,1)",
                        pointBackgroundColor: "rgba(0,0,255,1)",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(0,0,255,1)",
                        data: data
                    }
                ]  
            },
        options: {
            legend: {
                //display:false
            },
            scale: {
                ticks: {
                    min: 0,
                    max: 10
                }
            }
        }
    });
}

function listerFormations()
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'liste',
            type: 'formation'
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        liste_formations = data.liste;
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function creerRadarSpecifique(id)
{
    $.ajax({
        url: './ActionServlet',
        type: 'GET',
        data: {
            action: 'infos',
            type: 'competence_generale',
            code: id
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        var competence = data.obj;

        var labels = [];
        var data = [];

        for (var i = 0; i < competence.compSpec.length; i++)
        {
            for (var j = 0; j < scores.length; j++)
            {
                if (competence.compSpec[i].code === scores[j].code_competence)
                {
                    var libelle = competence.compSpec[i].libelle.split(" ")[0] + " : " + competence.compSpec[i].ponderation;
                    labels.push(libelle);
                    data.push(scores[j].valeur);
                }
            }
        }
        
        console.log(labels);
        console.log(data);
        
        var ctx = document.getElementById("myChart").getContext("2d");
        myRadarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                    labels: labels,
                    datasets: [
                        {
                            backgroundColor: "rgba(179,181,198,0.2)",
                            borderColor: "rgba(179,181,198,1)",
                            pointBackgroundColor: "rgba(179,181,198,1)",
                            pointBorderColor: "#fff",
                            pointHoverBackgroundColor: "#fff",
                            pointHoverBorderColor: "rgba(179,181,198,1)",
                            data: data
                        }
                    ]  
                },
            options: {
                legend: {
                    display:false
                },
                scale: {
                    ticks: {
                        min: 0,
                        max: 10
                    }
                }
            }
        });
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}

function validerModifs()
{
    document.getElementById("icone_retour").setAttribute("class", "glyphicon glyphicon-refresh gly-spin");
    
    var formation = document.getElementById("formation_apprenant");
    
    var id_form = formation[formation.selectedIndex].id.split("_")[1].replace(/'/g, "");
    
    console.log(id_form);
    
    if (mode === "modification")
    {
        $.ajax({
            url: './ActionServlet',
            type: 'POST',
            data: {
                action: 'modification',
                type: 'apprenant',
                code: document.getElementById('code_apprenant').value,
                nom: document.getElementById('nom_apprenant').value,
                fonction: document.getElementById('fonction_apprenant').value,
                entreprise: document.getElementById('entreprise_apprenant').value,
                formation: id_form
            },
            async:false,
            dataType: 'json'
        })
        .done(function(data) {

            var retour = data.retour;

            if (retour.valide)
            {
                document.getElementById("icone_retour").setAttribute("class", "glyphicon glyphicon-ok");
            }
            else
            {
                document.getElementById("icone_retour").setAttribute("class", "glyphicon glyphicon-remove");
            }

            setTimeout(function() {
                document.getElementById("icone_retour").setAttribute("class", "");
            }, 2000);
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
        $.ajax({
        url: './ActionServlet',
        type: 'POST',
        data: {
            action: 'creation',
            type: 'apprenant',
            code: document.getElementById('code_apprenant').value,
            nom: document.getElementById('nom_apprenant').value,
            fonction: document.getElementById('fonction_apprenant').value,
            entreprise: document.getElementById('entreprise_apprenant').value,
            formation: id_form
        },
        async:false,
        dataType: 'json'
    })
    .done(function(data) {
        
        var retour = data.retour;
        
        if (retour.valide)
        {
            document.getElementById("icone_retour").setAttribute("class", "glyphicon glyphicon-ok");
        }
        else
        {
            document.getElementById("icone_retour").setAttribute("class", "glyphicon glyphicon-remove");
        }
        
        setTimeout(function() {
            document.getElementById("icone_retour").setAttribute("class", "");
            window.location.href = "apprenant.html?mode=modification&code=" + document.getElementById('code_apprenant').value;
        }, 2000);
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
    }
}