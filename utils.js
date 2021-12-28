const axios = require("axios");

module.exports = {
    async getServers() {
        var res = await axios.get("http://23.88.126.6/servers.json");
        return res.data;
    },
    async getCSGOServer(ip, port) {
        var res = await axios.get(`http://query.li/api/csgo/${ip}/${port}`);
        if(!res.data.status.error) {
            return {
                name: res.data.game.info.server_name,
                maxPlayers: res.data.game.info.max_players,
                currentPlayers: res.data.game.info.player_count,
                map: res.data.game.info.map,
                ip: ip,
                port: port,
                type: "csgo"
            };
        } else {
            return {
                name: "Offline",
                maxPlayers: 0,
                currentPlayers: 0,
                map: "",
                ip: ip,
                port: port,
                type: "csgo"
            };
        }
    },
    async getMCServer(ip, port) {
        var res = await axios.get(`https://api.mcsrvstat.us/2/${ip}:${port}`);
        if(res.data.online) {
            return {
                name: res.data.motd.html[0],
                maxPlayers: res.data.players.max,
                currentPlayers: res.data.players.online,
                ip: ip,
                port: port,
                type: "minecraft"
            };
        } else {
            return {
                name: "Offline",
                maxPlayers: 0,
                currentPlayers: 0,
                ip: ip,
                port: port,
                type: "minecraft"
            };
        }
    }
}