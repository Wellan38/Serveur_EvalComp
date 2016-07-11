
import alexandre.evalcomp.metier.modele.Apprenant;
import alexandre.evalcomp.metier.modele.CompetenceG;
import alexandre.evalcomp.metier.modele.Formation;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author Alex-Laptop
 */
public class ActionSuppression extends Action
{
    @Override
    public void execute(HttpServletRequest request, PrintWriter out)
    {
        try
        {
            String type = request.getParameter("type");
            
            JsonObject obj = new JsonObject();
            
            switch (type)
            {
                case "formation" :
                    Formation f = servM.trouverFormationParId(request.getParameter("code"));
                    
                    if (f != null)
                    {
                        obj.addProperty("valide", servM.supprimerFormation(f));
                    }
                    else
                    {
                        obj.addProperty("valide", Boolean.FALSE);
                    }
                    
                    break;
                    
                case "apprenant" :
                    Apprenant a = servM.trouverApprenantParId(request.getParameter("code"));
                    
                    if (a != null)
                    {
                        obj.addProperty("valide", servM.supprimerApprenant(a));
                    }
                    else
                    {
                        obj.addProperty("valide", Boolean.FALSE);
                    }
                    
                    break;
                    
                case "competence_generale" :
                    CompetenceG c = servM.trouverCompetenceGParId(request.getParameter("code"));
                    
                    if (c != null)
                    {
                        obj.addProperty("valide", servM.supprimerCompetenceG(c));
                    }
                    else
                    {
                        obj.addProperty("valide", Boolean.FALSE);
                    }
                    
                    break;
            }
            
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
