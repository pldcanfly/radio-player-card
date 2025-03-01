// radio-player-card.js
class RadioPlayerCard extends HTMLElement {
	 state = {
		player: undefined,
		station: undefined
	};

	stations = {
		oe3: { picture : "/local/custom-cards/radio-player/thumbs/oe3.png", type: "radio", id : "ORF Hitradio Ö3 | HQ" },
		arr: { picture : "/local/custom-cards/radio-player/thumbs/arr.png", type: "radio", id : "Austrian Rock Radio" },

	};


	set hass(hass) {
		if(!this.content) {
			this.innerHTML = `
				<ha-card>
					<div class="card-content"></div>
			<style type="text/css">
				${this.styles()}
			</style>
				</ha-card>
			`;

			this.content = this.querySelector("div");
		}

		this.render(hass);
	}
	
	render(hass) {
		// Setup HTML
		this.content.innerHTML = '';
		const players = this.config.players;


		let playerselect = `<div class="player-select select">`;
		for(const player of players) {
			const icon = player.icon;
			const value = player.entity;
			playerselect += `<div style="width:${100/players.length}%" ${value == this.state.player ? 'class="active"' : ''} data-value="${value}">
			<ha-icon icon="${icon}" style="pointer-events: none"></ha-icon>
				</div>`;
		}
		playerselect += `</div>`;

		this.content.innerHTML += playerselect;

		let stationselect = `<div class="station-select select">`;
		for(const id in this.stations) {
			const value = id;
			const picture = this.stations[id].picture;
			stationselect += `<div style="width:${100/Object.keys(this.stations).length}%; background-image: url(${picture})" ${value == this.state.station ? 'class="active"' : ''} data-value="${value}"></div>`;
		}
		stationselect += `</div>`;

		this.content.innerHTML += stationselect;


		if(this.state.station && this.state.player){
			this.content.innerHTML += `
				<button>Play</button>		
			`;

			this.querySelector("button").addEventListener('click', () => {
					hass.callService("music_assistant", "play_media",{
						entity_id: this.state.player,
						media_id: this.stations[this.state.station].id,
						media_type: this.stations[this.state.station].type
					});
				});
		}




		// Setup Handlers
		for( const element of this.querySelectorAll(".player-select div")) {
			element.addEventListener(
				'click',
				(e) => {
					this.state.player = (this.state.player != e.target.dataset.value) ? e.target.dataset.value : undefined;
					this.render(hass);
				}
			);	 
		}

		for( const element of this.querySelectorAll(".station-select div")) {
			element.addEventListener(
				'click',
				(e) => {
					this.state.station = (this.state.station != e.target.dataset.value) ? e.target.dataset.value : undefined;
					this.render(hass);
				}
			);	 
		}
		


	}

	styles() {
		return`
		radio-player-card .select {
			display: flex;
			width: 100%;
			gap: 15px;
		}

		radio-player-card .select + .select {
			margin-top: 15px;
		}


		radio-player-card .select div {
			display: inline-block;
			aspect-ratio: 1 / 1;

			box-shadow: 0 0 10px rgba(0,0,0,1);
			border-radius: 15px;

			background-repeat: no-repeat;
			background-position: center;
			background-size: 90%;
			transition: all 200ms;
		}

		radio-player-card .select div:hover {
			background-color: var(--divider-color);
		}
		radio-player-card .player-select div {
			display: grid;
			place-content: center;
		}
		radio-player-card .player-select div ha-icon {
			scale: 3;	
		}

		radio-player-card .select div.active {
			background-color: var(--accent-color);
		}

		radio-player-card button {
			width: 100%;
			display: inline-block;
	      		background-color: var(--dark-primary-color);
      			color: var(--text-primary-color);
      			border: none;
      			padding: 10px 20px;
      			border-radius: 4px;
      			font-size: 16px;
      			cursor: pointer;
      			transition: background-color 0.3s ease;
			margin-top: 15px;
		}
			
		.radio-player-card {
        		width: var(--card-width, 100%);
        		min-width: 300px;
        		max-width: 600px;
        		margin: 0 auto;
        		transition: width 0.3s ease;
      		}

		`;

	}



	setConfig(config) {
		if(!config.players) {
			throw("No players set");
		}
		this.config = config;
	}


}
  
customElements.define('radio-player-card', RadioPlayerCard);
