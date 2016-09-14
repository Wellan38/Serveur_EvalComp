
import alexandre.evalcomp.metier.modele.Apprenant;
import alexandre.evalcomp.metier.modele.AutoEvaluation;
import alexandre.evalcomp.metier.modele.CompetenceG;
import alexandre.evalcomp.metier.modele.Score;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author alexa
 */
public class ActionHistorique extends Action
{

    @Override
    public void execute(HttpServletRequest request, HttpServletResponse response) {
        try
        {
            String type = request.getParameter("type");
            
            JsonArray liste = new JsonArray();
            
            Apprenant a;
            CompetenceG cg;
            
            switch(type)
            {
                case "scores":
                    a = servM.trouverApprenantParId(request.getParameter("apprenant"));

                    cg = servM.trouverCompetenceGParId(request.getParameter("competence"));

                    List<Score> scores = servM.historiqueScoresParCompetenceG(a, cg);

                    for (Score sc : scores)
                    {
                        JsonObject o = new JsonObject();

                        o.addProperty("apprenant", a.getId());
                        o.addProperty("competence", sc.getCompetence().getId());
                        o.addProperty("note", sc.getScore());
                        
                        SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy - HH:mm:ss");
                        
                        o.addProperty("date", format.format(sc.getDate()));

                        liste.add(o);
                    }
                    
                    break;
                    
                case "autoevaluations":
                    a = servM.trouverApprenantParId(request.getParameter("apprenant"));

                    cg = servM.trouverCompetenceGParId(request.getParameter("competence"));

                    List<AutoEvaluation> evals = servM.historiqueAutoevaluationsParCompetenceG(a, cg);

                    for (AutoEvaluation ev : evals)
                    {
                        JsonObject o = new JsonObject();

                        o.addProperty("apprenant", ev.getId());
                        o.addProperty("competence", ev.getCompetence().getId());
                        o.addProperty("note", ev.getValeur());
                        
                        SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy - HH:mm:ss");
                        
                        o.addProperty("date", format.format(ev.getDate()));

                        liste.add(o);
                    }
                    
                    break;
            }
            
            PrintWriter out = response.getWriter();
            JsonObject container = new JsonObject();
            container.add("liste", liste);
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            String json = gson.toJson(container);
            out.println(json);
        }
        catch (Throwable ex)
        {
            Logger.getLogger(ActionModification.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
}
