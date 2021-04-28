export default class FetchApi {
  constructor() {
    this.baseUrl = "https://reactmarathon-api.herokuapp.com/api/mk";
  }

  async getAllPlayers() {
    return await fetch(`${this.baseUrl}/players`).then((response) =>
      response.json()
    );
  }
  async getEnemyPlayer() {
    return await fetch(`${this.baseUrl}/player/choose`)
        .then((response) =>
            response.json()
        )
        .catch(error => console.error(error.message));
  }
  async getFightStats(payload) {
    return await fetch(`${this.baseUrl}/player/fight`, {
      method: "POST",
      body: JSON.stringify({
        hit: payload.hit,
        defence: payload.defence,
      }),
    }).then((response) => response.json());
  }
}
