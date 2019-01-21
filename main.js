//import saveAs from 'file-saver';

let listener = (e) => {
    e.target.classList.toggle("active");
    let panel = e.target.nextElementSibling;
    let style = panel.style

    style.maxHeight = style.maxHeight ? null : `${panel.scrollHeight}px`;
}

document.querySelectorAll(".accordion").forEach((e) => {
    e.addEventListener("click", listener)
})


function generate() {
    output.innerText = `
    en
    conf t
    hostname ${document.getElementById("hostname").value}
    enable secret ${document.getElementById("secret").value}
    description ${document.getElementById("description").value}
    banner motd #${document.getElementById("banner").value}#
    `
    

    if(document.getElementById("encrypt").checked){
        output.innerText += "service password-encryption\n";
    }

    if(document.getElementById("domlookup").checked){
        output.innerText += "no ip domain-lookup\n";
    }

    if(document.getElementById("newuser").checked){
        output.innerText += `
        username cisco password ${document.getElementById("passworduser").value}
        username cisco privilege 15
        `;
    }

    if(document.getElementById("vtychecked").checked){
        output.innerText += `
        line vty 0 15
        password ${document.getElementById("passwordvty").value}
        login
        logging syncronous
        exec-timeout 0 0
        exit
        `;
    }

    if(document.getElementById("conschecked").checked){
        output.innerText += `
        line con 0
        password ${document.getElementById("passwordcons").value}
        login
        logging syncronous
        exec-timeout 0 0
        exit
        `;
    }

    //Interfaces
    if(document.getElementsByClassName("ips").length > 0){
        for(let i=1; i <= document.getElementsByClassName("ips").length; i++){
            output.innerText += `
            int ${document.getElementById("name"+i).value}
            ip address ${document.getElementById("ip"+i).value} ${document.getElementById("sub"+i).value}
            exit
            `;
        }
    }

    //Static Routes
    if(document.getElementsByClassName("static").length>0){
        for(let i=1; i<=document.getElementsByClassName("static").length; i++){
            output.innerText += `
            ip route ${document.getElementById("networkstat"+i).value} ${document.getElementById("subnetstat"+i).value} ${document.getElementById("nexthop"+i).value}\n
            `;
        }
    }

    //Dynamic Routes
    if(document.getElementsByClassName("dynamic").length>0&&document.getElementById("ripv2").checked===true){
        output.innerText += `
        router rip
        version 2
        no auto-summary
        `;

        for(let i=1; i<=document.getElementsByClassName("dynamic").length; i++){
            output.innerText += `network ${document.getElementById("network"+i).value}\n`;
        }
        output.innerText += "exit\n";
    }

    document.getElementById("cliparea").innerText = document.getElementById("output").innerText;
    document.getElementById("output").style.display = "block";
    document.getElementById("clip").style.display = "block";
}

function newnetwork() {
    numberrouts = document.getElementsByClassName("dynamic").length + 1;
    document.getElementById("dynnets").innerHTML += `
    <div id="dyn${numberrouts}">
    <label for="network${numberrouts}">Network: </label>
    <input type="text" name="network${numberrouts}" id="network${numberrouts}" class="dynamic">`;
}

function newnetworkstat() {
    numberroutsstat = document.getElementsByClassName("static").length + 1;
    document.getElementById("statnets").innerHTML += `
        <div id="stat${numberroutsstat}">
        <label for="networkstat${numberroutsstat}">Dest. Network: </label>
        <input type="text" name="networkstat${numberroutsstat}" id=networkstat${numberroutsstat}" class="static">

        <label for="subentstat${numberroutsstat}">Dest. Network Mask: </label>
        <input type="text" name="subnetstat${numberroutsstat}" id="subnetstat${numberroutsstat}" class="">

        <label for="nexthop${numberroutsstat}">Next Hop ip: </label>
        <input type="text" name="netxthop${numberroutsstat}" id="nexthop${numberroutsstat}" class="">`;
}

function newint() {
    numberips = document.getElementsByClassName("ips").length + 1;
    document.getElementById("ints").innerHTML += `
    <div id="ips${numberips}">
    <label for="name${numberips}">Name: </label>
    <input type="text" name="name${numberips}" id="name${numberips}" class="ips">
    <label for="ip${numberips}">Ip-Address: </label>
    <input type="text" name="ip${numberips}" id="ip${numberips}">
    <label for="sub${numberips}">subnetmask: </label>
    <input type="text" name="sub${numberips}" id="sub${numberips}"> </div>
    `;
}

function toClip() {
    let copyTextarea = document.getElementById("cliparea");
    copyTextarea.focus();
    copyTextarea.select();
    try {
        let successful = document.execCommand('copy');
        let msg = successful ? 'successful' : 'unsuccessful';
        alert("Copied the text to clipboard! Now paste it to the CLI!");
    } catch (err) {
        console.log('Oops, unable to copy');
    }
}