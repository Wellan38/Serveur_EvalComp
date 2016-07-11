var competences_g;
var grades;
var scores;
var seuils_min;
var seuils_max;

function creerGraphiqueGeneral()
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
    
    var type, options;
    
    if (competences_g.length > 2)
    {
        type = 'radar';
        options = {
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
            scales: {
                yAxes: [{
                    ticks: {
                        max: 10,
                        min: 0,
                        stepSize: 1
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
                        label: "Seuil minimal",
                        backgroundColor: "rgba(255,0,0,0.2)",
                        borderColor: "rgba(255,0,0,1)",
                        borderWidth: 2,
                        pointBackgroundColor: "rgba(255,0,0,0.5)",
                        pointBorderColor: "#fff",
                        data: data_seuils_min
                    },
                    {
                        label: "Moyenne de l'apprenant",
                        backgroundColor: "rgba(0,0,255,0.2)",
                        borderColor: "rgba(0,0,255,1)",
                        borderWidth: 2,
                        pointBackgroundColor: "rgba(0,0,255,1)",
                        pointBorderColor: "#fff",
                        data: data
                    },
                    {
                        label: "Seuil maximal",
                        backgroundColor: "rgba(0,255,0,0.2)",
                        borderColor: "rgba(0,255,0,1)",
                        borderWidth: 2,
                        pointBackgroundColor: "rgba(0,255,0,1)",
                        pointBorderColor: "#fff",
                        data: data_seuils_max
                    }
                ]  
            },
        options: options
    };
    
    myRadarChart = new Chart(ctx, infos);
}

function creerGraphiqueSpecifique(id)
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
        
        var ctx = document.getElementById("myChart").getContext("2d");
        var type = 'radar';
        var infos = {
            type: type,
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
        };
        
        myRadarChart = new Chart(ctx, infos);
    })
    .fail(function() {
        console.log('Erreur dans le chargement des informations.');
    })
    .always(function() {
        //
    });
}