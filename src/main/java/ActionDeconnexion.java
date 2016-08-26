
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import java.io.PrintWriter;
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
public class ActionDeconnexion extends Action
{
    @Override
    public void execute(HttpServletRequest request, PrintWriter out) {
        try
        {
            HttpSession session = request.getSession();
            session.invalidate();
            
            JsonObject container = new JsonObject();
            container.addProperty("retour", Boolean.TRUE);
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            String json = gson.toJson(container);
            out.println(json);
        }
        catch(Exception e)
        {
            throw(e);
        }
    }
    
}
