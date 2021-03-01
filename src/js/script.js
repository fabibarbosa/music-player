'use-strict'
const model = ( () => {
    //Função IIFE


    //Váriavel que guarda o index da música selecionada
    let state = 0;


    //Estrutura que simula um json
    songs = [
        {
            id: 0,
            name: "Smile",
            author: "Benjamin Tissot",
            cover: "src/img/smile.jpg",
            src: "src/song/bensound-smile.mp3",
            position: 1,
            tags : "positive,kids,pianno,fun"
        },
        {
            id : 1,
            name: "Once again",
            author: "Benjamin Tissot",
            cover: "src/img/onceagain.jpg",
            src: "src/song/bensound-onceagain.mp3",
            position: 3,
            tags: "poetic,emotional,guitar,hopeful"

        },
        {
            id: 2,
            name: "Brazil Samba",
            author: "Benjamin Tissot",
            cover: "src/img/brazilsamba.jpg",
            src: "src/song/bensound-brazilsamba.mp3",
            position: 2,
            tags : "Brazil,samba,happy,carnival"
        },

    ]

    return {

        //Expõe os dados do array song
        getData : () => {
            return songs
        },

        // Recebe um elemento que irá somar com o atual state
        setState : (newValue) => {
            state  += newValue;
        },

        //Permite a leitura da variável state
        readState : () => {
            return state;
        },

        //Alterar a posição de uma determinada música no array [position]
        changeSongPosition : (index, newPosition) => {
            songs[index].position = newPosition;
        }

    }

})();


const view = ( () => {



    const barLoad = (barElement, duration)=> {

    }
    //Seleciona os elementos do DOM

    const DOMplayer = {
        songEl : document.getElementById("song"),
        songNameEl : document.querySelector(".song-name"),
        songAuthorEl : document.querySelector(".song-author"),
        songCoverEl : document.querySelector(".song-cover"),
        buttonPlayPauseIconEl : document.querySelector(".btn-icon"),
        songLoad : document.querySelector(".player-progress-bar"),
        songLoadingBarEl : document.querySelector(".player-progress-bar-current"),
        songTimeDurationEl : document.querySelector(".time-duration"),
        songTimeCurrentEl : document.querySelector(".time-current"),

    }
  
   
    //Seleciona os principais elementos do dom
    const DOMstrings = {
        songEl : "#song",
        btnPlay : '.btn-play',
        btnNext : '.btn-next',
        btnPrevious : '.btn-previous',
        playListSong : '.playlist-song',
        loadBar : ".player-progress-bar"

    }

    const parentElementPlaylist = document.querySelector(".playlist-ul");

   return {
        //Cria um novo elemento html com base nos dados recebidos e insere o mesmo na tela
        renderPlayList : (data) => {
            const newPlaylistDom = `
                <li class="playlist-song" data-id="${data.id}">
                    <img class="playlist-song-cover" src="${data.cover}">
                    <div class="playlist-song-info">
                        <h6 class="playlist-song-name">${data.name}</h6>
                        <p class="playlist-song-author">${data.author}</p>
                    </div>
                </li>
            `
            parentElementPlaylist.insertAdjacentHTML("afterbegin", newPlaylistDom)
        },


        //Exporta o os elementos do dom
        exportDOMStrings : () => {
            return DOMstrings;
        },

        //Atualiza os dados do player com base na musica selecionada 
        updatePlayer : (data) => {
            DOMplayer.songLoadingBarEl.style.width = "0";
            DOMplayer.songEl.src = data.src ;
            DOMplayer.songNameEl.textContent = data.name;
            DOMplayer.songAuthorEl.textContent = data.author;
            DOMplayer.songCoverEl.src = data.cover;
            DOMplayer.buttonPlayPauseIconEl.classList = "bx bx-play";
        },

        //Método responsável por pausar ou iniciar a música
        playSAndPauseSong : (btn) => {
            if (DOMplayer.songEl.paused || DOMplayer.songEl.ended) {
                DOMplayer.songEl.play();
                return btn.classList = "bx bx-pause";
            }else {
                DOMplayer.songEl.pause();
                return btn.classList = "bx bx-play";
            }

            
        },

        //Função que realizar o efeito de disabled
        showButtonsReact : (element, status) => {
            if (status == 1) {
                return element.contains("btn--disabled") ? " " : element.add("btn--disabled"); 

            } {
                return element.contains("btn--disabled") ? element.remove("btn--disabled")  : ""; 

            }
        },

        //Função que carrega a barra da músca
        loadProgressBar : () => {
            let barLength = DOMplayer.songLoad.offsetWidth * (DOMplayer.songEl.currentTime / DOMplayer.songEl.duration);
            DOMplayer.songLoadingBarEl.style.width = barLength + "px";
            DOMplayer.songTimeCurrentEl.textContent = parseFloat(( DOMplayer.songEl.currentTime / 60).toFixed(2));
        },

        //Função que possibilidade escolher uma parte da música de acordo com  o clique no
        skipProgressBar : (e) =>  {
            let newCurrentTime = (e.offsetX/ e.target.offsetWidth) * DOMplayer.songEl.duration;
            DOMplayer.songEl.currentTime = newCurrentTime;
        }

    }

})();

const controller  = ( (appModel,appView) => {
    const songs = appModel.getData();
    const firstSong = songs[appModel.readState()];
    const domStrings = appView.exportDOMStrings();
    appView.updatePlayer(firstSong);



    //Pular para frente ou para trás uma música da playlist
    const skipPlayListSong = (element) => {
        let currentSate = appModel.readState();
        
        //Verifica se o botão acionado é o next
        if (element.dataset.action == "next") {
            if (currentSate == songs.length - 1) {
                appView.showButtonsReact(element.parentElement.classList,1)                
            }else {
                appView.showButtonsReact(document.querySelector(domStrings.btnPrevious).classList, 0)             
                appModel.setState(1);
                let newSong = songs[appModel.readState()];
                appView.updatePlayer(newSong)
            }

        }else {
            if (currentSate == 0) {
                appView.showButtonsReact(element.parentElement.classList,1)
                
            }else {
                appView.showButtonsReact(document.querySelector(domStrings.btnNext).classList, 0)             
                appModel.setState(-1);
                let newSong = songs[appModel.readState()];
                appView.updatePlayer(newSong)
            }
        }
    }

    //Função responsável por inicia os principais leitores de evento
    const setUpEventListener = () => {
        document.querySelector(domStrings.btnNext).addEventListener("click", (e) => {
            skipPlayListSong(e.target);
           // e.target.parentElement.setAttribute('disabled','');
        })

        document.querySelector(domStrings.btnPrevious).addEventListener("click", (e) => {
            skipPlayListSong(e.target);
           // e.target.parentElement.setAttribute('disabled','');
        })

        document.querySelector(domStrings.btnPlay).addEventListener("click", e => {
            appView.playSAndPauseSong(e.target);
        }) 

        document.querySelector(domStrings.songEl).addEventListener("timeupdate", () => {
            appView.loadProgressBar();
        });


        document.querySelector(domStrings.loadBar).addEventListener("click", (e) => {
            appView.skipProgressBar(e);
        })
    }

    //Ordena os elementos do array com base no atributo position
    orderedPlaylist = () => {
        songs.sort ( (a,b) => {
            return a.position - b.position;
        })
        songs.reverse();
        for (let i = 0; i < songs.length; i++) {
            appView.renderPlayList(songs[i]);
        }
        
    }
    orderedPlaylist();
    setUpEventListener();

    return {

    }

})(model,view);
