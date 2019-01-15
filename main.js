//import saveAs from 'file-saver';
var acc = document.getElementsByClassName("accordion");
var i;
for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight){
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}
function generate() {
    output.innerText="";
    output.innerText+="en\n" +
        "conf t\n" +
        "hostname "+document.getElementById("hostname").value+"\n" +
        "enable secret "+document.getElementById("secret").value+"\n" +
        "description "+document.getElementById("description").value+"\n"+
        "banner motd #"+document.getElementById("banner").value+"#"+"\n";
    if(document.getElementById("encrypt").checked===true){
        output.innerText+="service password-encryption\n";
    }
    if(document.getElementById("domlookup").checked===true){
        output.innerText+="no ip domain-lookup\n";
    }
    if(document.getElementById("newuser").checked===true){
        output.innerText+="username cisco password "+ document.getElementById("passworduser").value +"\n" + "username cisco privilege 15\n";
    }
    if(document.getElementById("vtychecked").checked===true){
        output.innerText+="line vty 0 15\npassword "+document.getElementById("passwordvty").value+"\nlogin\nlogging syncronous\nexec-timeout 0 0\nexit\n";
    }
    if(document.getElementById("conschecked").checked===true){
        output.innerText+="line con 0\npassword "+document.getElementById("passwordcons").value+"\nlogin\nlogging syncronous\nexec-timeout 0 0\nexit\n";
    }
    //Interfaces
    if(document.getElementsByClassName("ips").length>0){
        for(let i=1; i<=document.getElementsByClassName("ips").length; i++){
            output.innerText+="int "+document.getElementById("name"+i).value+"\n" +
                "ip address " + document.getElementById("ip"+i).value + " " +document.getElementById("sub"+i).value+"\n"
                +"exit\n";
        }
    }
    //Static Routes
    if(document.getElementsByClassName("static").length>0){
        for(let i=1; i<=document.getElementsByClassName("static").length; i++){
            output.innerText+="ip route "+document.getElementById("networkstat"+i).value+" " + document.getElementById("subnetstat"+i).value+" " + document.getElementById("nexthop"+i).value+"\n";
        }
    }
    //Dynamic Routes
    if(document.getElementsByClassName("dynamic").length>0&&document.getElementById("ripv2").checked===true){
        output.innerText+="router rip\nversion 2\nno auto-summary\n";
        for(let i=1; i<=document.getElementsByClassName("dynamic").length; i++){
            output.innerText+="network "+document.getElementById("network"+i).value+"\n";
        }
        output.innerText+="exit\n";
    }
    document.getElementById("cliparea").innerText=document.getElementById("output").innerText;
    document.getElementById("output").style.display="block";
    document.getElementById("clip").style.display="block";
}
function newnetwork() {
    numberrouts = document.getElementsByClassName("dynamic").length+1;
    document.getElementById("dynnets").innerHTML+='<div id="dyn'+numberrouts+'">\n'+
        '                    <label for="network'+numberrouts+'">Network: </label>\n' +
        '                    <input type="text" name="network' + numberrouts + '" id="network'+numberrouts+'" class="dynamic">\n';
}
function newnetworkstat() {
    numberroutsstat = document.getElementsByClassName("static").length+1;
    document.getElementById("statnets").innerHTML+='<div id="stat'+numberroutsstat+'">\n'+
        '                    <label for="networkstat'+numberroutsstat+'">Dest. Network: </label>\n' +
        '                    <input type="text" name="networkstat' + numberroutsstat + '" id="networkstat'+numberroutsstat+'" class="static">\n' +

        '                    <label for="subentstat'+numberroutsstat+'">Dest. Network Mask: </label>\n' +
        '                    <input type="text" name="subnetstat' + numberroutsstat + '" id="subnetstat'+numberroutsstat+'" class="">\n' +

        '                    <label for="nexthop'+numberroutsstat+'">Next Hop ip: </label>\n' +
        '                    <input type="text" name="netxthop' + numberroutsstat + '" id="nexthop'+numberroutsstat+'" class="">\n';
}
function newint() {
    numberips = document.getElementsByClassName("ips").length+1;
    document.getElementById("ints").innerHTML+='<div id="ips'+numberips+'">\n'+
        '                    <label for="name'+numberips+'">Name: </label>\n' +
        '                    <input type="text" name="name' + numberips + '" id="name'+numberips+'" class="ips">\n' +
        '                    <label for="ip'+numberips+'">Ip-Address: </label>\n' +
        '                    <input type="text" name="ip'+numberips+'" id="ip'+numberips+'">\n' +
        '                    <label for="sub'+numberips+'">subnetmask: </label>\n' +
        '                    <input type="text" name="sub'+numberips+'" id="sub'+numberips+'"> </div>';
}
function toClip() {
    var copyTextarea = document.getElementById("cliparea");
    copyTextarea.focus();
    copyTextarea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        alert("Copied the text to clipboard! Now paste it to the CLI!");
    } catch (err) {
        console.log('Oops, unable to copy');
    }
}