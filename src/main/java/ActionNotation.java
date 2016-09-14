
import alexandre.evalcomp.metier.modele.Apprenant;
import alexandre.evalcomp.metier.modele.CompetenceS;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.PrintWriter;
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
 * @author Alex-Laptop
 */
public class ActionNotation extends Action
{
    @Override
    public void execute(HttpServletRequest request, HttpServletResponse response)
    {
        try
        {
            Apprenant a = servM.trouverApprenantParId(request.getParameter("apprenant"));
            
            JsonParser jsonParser = new JsonParser();
            JsonArray demandes = (JsonArray)jsonParser.parse(request.getParameter("scores"));
            
            Boolean res = true;
            
            for (JsonElement e : demandes)
            {
                CompetenceS cs = servM.trouverCompetenceSParId(e.getAsJsonObject().get("competence").toString().replace("\"", ""));
                
                if (!servM.ajouterNote(a, cs, Double.valueOf(e.getAsJsonObject().get("note").getAsString())))
                {
                    res = false;
                    System.out.println("pas noté !");
                }
            }
            
            JsonObject obj = new JsonObject();
            
            obj.addProperty("valide", res);
            
            PrintWriter out = response.getWriter();
            JsonObject container = new JsonObject();
            container.add("retour", obj);
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
