
import alexandre.evalcomp.metier.modele.Apprenant;
import alexandre.evalcomp.metier.modele.AutoEvaluation;
import alexandre.evalcomp.metier.modele.CompetenceG;
import alexandre.evalcomp.metier.modele.CompetenceS;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.PrintWriter;
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
 * @author Alexandre
 */
public class ActionAutoevaluation extends Action {

    @Override
    public void execute(HttpServletRequest request, HttpServletResponse response)
    {
        try
        {
            Apprenant apprenant = (Apprenant)request.getSession(false).getAttribute("apprenant");
            CompetenceG cg = servM.trouverCompetenceGParId(request.getParameter("competence_generale"));

            JsonParser jsonParser = new JsonParser();
            JsonArray scores = (JsonArray)jsonParser.parse(request.getParameter("scores"));

            for (JsonElement e : scores)
            {
                CompetenceS c = servM.trouverCompetenceSParId(e.getAsJsonObject().get("competence").getAsString());
                Double valeur = e.getAsJsonObject().get("score").getAsDouble();
                
                servM.ajouterAutoevaluation(apprenant, c, valeur);
            }
            
            List<AutoEvaluation> evals = servM.listerAutoevaluationsParCompetenceG(apprenant, cg);
            
            for (AutoEvaluation a : evals)
            {
                Boolean trouve = false;
                
                for (JsonElement e : scores)
                {
                    if (e.getAsJsonObject().get("competence").getAsString().equals(a.getCompetence().getId()) && e.getAsJsonObject().get("score").getAsInt() == a.getValeur())
                    {
                        trouve = true;
                        break;
                    }
                }
                
                if (!trouve)
                {
                    servM.supprimerAutoevaluation(apprenant, a.getCompetence());
                }
            }
            
            JsonObject obj = new JsonObject();
            
            obj.addProperty("valide", Boolean.TRUE);
            
            PrintWriter out = response.getWriter();
            JsonObject container = new JsonObject();
            container.add("retour", obj);
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            String json = gson.toJson(container);
            out.println(json);
        }
        catch (Throwable ex) {
            Logger.getLogger(ActionAutoevaluation.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
}
