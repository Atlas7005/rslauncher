var servers;
var activeServer;

(async function() {
    servers = await ipcRenderer.sendSync("getServers");
    var serverList = document.querySelector(".servers");
    var serversHTML = Object.keys(servers).map(key => {
        var server = servers[key];
        return `<li class="server" data-id="${server.id}">${key}</li>`;
    }).join("\n");
    serverList.innerHTML = serversHTML;

    var serverListItems = document.querySelectorAll(".server");
    serverListItems.forEach(item => {
        item.addEventListener("click", async e => {
            activeServer = await ipcRenderer.sendSync("getServerInfo", item.innerHTML);
            var serverInfo = document.querySelector(".serverinfo");
            if(activeServer.type === "csgo") {
                serverInfo.innerHTML = `
                    <img class="server-logo" src="logo.png" alt="Ruby Servers Logo">
                    <div class="server-info-items">
                        <div class="server-info-item">
                            <div class="server-info-item-title">Name</div>
                            <div class="server-info-item-value">${activeServer.name}</div>
                        </div>
                        <div class="server-info-item">
                            <div class="server-info-item-title">IP</div>
                            <div class="server-info-item-value">${activeServer.ip}</div>
                        </div>
                        <div class="server-info-item">
                            <div class="server-info-item-title">Port</div>
                            <div class="server-info-item-value">${activeServer.port}</div>
                        </div>
                        <div class="server-info-item">
                            <div class="server-info-item-title">Map</div>
                            <div class="server-info-item-value">${activeServer.map}</div>
                        </div>
                        <div class="server-info-item">
                            <div class="server-info-item-title">Players</div>
                            <div class="server-info-item-value">${activeServer.currentPlayers}/${activeServer.maxPlayers}</div>
                        </div>
                    </div>
                    <div class="server-info-connect">
                        <a href="steam://connect/${activeServer.ip}:${activeServer.port}">Connect</a>
                    </div>
                `;
            } else if(activeServer.type === "minecraft") {
                serverInfo.innerHTML = `
                    <img class="server-logo" src="logo.png" alt="Ruby Servers Logo">
                    <div class="server-info-items">
                        <div class="server-info-item">
                            <div class="server-info-item-title">Name</div>
                            <div class="server-info-item-value">${activeServer.name}</div>
                        </div>
                        <div class="server-info-item">
                            <div class="server-info-item-title">IP</div>
                            <div class="server-info-item-value">${activeServer.ip}</div>
                        </div>
                        <div class="server-info-item">
                            <div class="server-info-item-title">Port</div>
                            <div class="server-info-item-value">${activeServer.port}</div>
                        </div>
                        <div class="server-info-item">
                            <div class="server-info-item-title">Players</div>
                            <div class="server-info-item-value">${activeServer.currentPlayers}/${activeServer.maxPlayers}</div>
                        </div>
                    </div>
                    <div class="server-info-connect">
                        <div id="copyip" data-ip="${activeServer.ip}:${activeServer.port}">Copy IP</div>
                    </div>
                `;
                document.getElementById("copyip").addEventListener("click", e => {
                    copyToClipboard(e.target.dataset.ip);
                    e.target.innerHTML = "Copied!";
                    setTimeout(() => {
                        e.target.innerHTML = "Copy IP";
                    }, 1500);
                });
            }
        });
    });
})();

function copyToClipboard(str) {
    navigator.clipboard.writeText(str);
}

[...document.querySelectorAll(".titlebar .btns > button")].forEach(function(btn) {
    btn.addEventListener("click", function() {
        ipcRenderer.send(btn.classList[0]);
    });
});