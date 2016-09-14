
import alexandre.evalcomp.metier.service.*;
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
public abstract class Action {
    
    ServiceMetier servM;
    ServiceTechnique servT;
    
    public abstract void execute(HttpServletRequest request, HttpServletResponse response);
    
    public void setServices(ServiceMetier servM, ServiceTechnique servT)
    {
        this.servM = servM;
        this.servT = servT;
    }
}
