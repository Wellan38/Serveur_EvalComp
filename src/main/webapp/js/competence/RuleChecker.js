/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

self.onmessage = function(e)
{
    var code_regle = e.data[0];
    
    var request = new XMLHttpRequest();
    
    request.open("GET", "./ActionServlet?action=infos&type=regle&code=" + code_regle, false);
    request.send();
    
    if (request.readyState===4 && request.status===200)
    {
        postMessage(request.responseText);
    }
    
    if(e.data[1] === 'stop')
    {
        close();
    }
};