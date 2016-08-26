
import alexandre.evalcomp.metier.modele.Apprenant;
import alexandre.evalcomp.metier.modele.Personne;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author Alexandre
 */
public class ActionConnexion extends Action
{

    @Override
    public void execute(HttpServletRequest request, PrintWriter out)
    {
        try
        {            
            HttpSession session = request.getSession();

            String id = request.getParameter("identifiant");
            String mdp = request.getParameter("mot_de_passe");

            Personne p = servM.trouverPersonneParId(id);
            
            if (p != null)
            {
                if (mdp.equals(p.getMotDePasse()))
                {
                    session.setAttribute("personne", p);
                    
                    JsonObject retour = new JsonObject();
                    if (p.getType().equals(Personne.TypePersonne.Coordonateur) || p.getType().equals(Personne.TypePersonne.Formateur))
                    {
                        retour.addProperty("lien", "index_formateur.html");
                    }
                    else if (p.getType().equals(Personne.TypePersonne.Apprenant))
                    {
                        retour.addProperty("lien", "index_apprenant.html");
                        Apprenant ap = servM.trouverApprenantParCompte(p);
                        retour.addProperty("apprenant", ap.getId());
                        session.setAttribute("apprenant", ap);
                    }
                    
                    retour.addProperty("identifiant", p.getId());
                    retour.addProperty("nom", p.getNom());
                    retour.addProperty("type", p.getType().toString());
                    
                    JsonObject container = new JsonObject();
                    container.add("retour", retour);
                    Gson gson = new GsonBuilder().setPrettyPrinting().create();
                    String json = gson.toJson(container);
                    out.println(json);
                }
            }
        }
        catch (Throwable ex)
        {
            Logger.getLogger(ActionConnexion.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
}
