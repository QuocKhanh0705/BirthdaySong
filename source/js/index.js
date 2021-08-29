const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'Soo Player'

const player = $('.player')
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const progress = $('#progress');
const playList = $('.playlist')

//get playlists 
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    // config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [{
            name: 'Yêu Rồi',
            singer: 'Tino',
            path: './assets/music/song1.mp3',
            image: './assets/img/Soo1.jpg'
        },
        {
            name: 'Cưới Nhau Nhé (Yes I Do)',
            singer: 'Hiền Hồ/ Bùi Anh Tuấn',
            path: './assets/music/song2.mp3',
            image: './assets/img/Soo2.jpg'
        },
        {
            name: 'Cầu Hôn',
            singer: 'Văn Mai Hương',
            path: './assets/music/song3.mp3',
            image: './assets/img/Soo3.jpg'
        },
        {
            name: 'You Are The Reason',
            singer: 'Calum Scott',
            path: './assets/music/song4.mp3',
            image: './assets/img/Soo4.jpg'
        }, {
            name: 'I Love You 3000',
            singer: 'Jackson',
            path: './assets/music/song5.mp3',
            image: './assets/img/Soo5.jpg'
        },
        {
            name: 'Beautiful In White',
            singer: 'Shane Filan',
            path: './assets/music/song6.mp3',
            image: './assets/img/Soo6.jpg'
        }, {
            name: 'Everything I Need',
            singer: 'Skylar Grey',
            path: './assets/music/song7.mp3',
            image: './assets/img/Soo7.jpg'
        },
        {
            name: 'Nothing\'s Change My Love For You',
            singer: 'Westlife',
            path: './assets/music/song8.mp3',
            image: './assets/img/Soo8.jpg'
        }, {
            name: 'When You Tell Me That You Love Me',
            singer: 'Westlife',
            path: './assets/music/song9.mp3',
            image: './assets/img/Soo9.jpg'
        },
    ],
    // setConfig: function(key, value) {
    //     this.config[key] = value;
    //     localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    // },
    render: function() {
        const htmls = this.songs.map((song, index) => {
                return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index= "${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div> 
            `
            })
            // noi chuoi
        playList.innerHTML = htmls.join('');
    },

    //dinh nghia cac thuoc tinh cho obj
    defineProperty: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    // tao su kien xu li su kien
    handleEvents: function() {
        const _this = this;

        //xu li cd-thumb quay/ dung
        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 10000,
            interactions: Infinity,
        })
        cdThumbAnimate.pause(); // khi bat dau la dung.

        //xu li phong to thu nho cd
        const cdWidth = cd.offsetWidth; // lay width of cd
        document.onscroll = function() {

            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            // console.log(window.scrollY) tuong tu
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0; // set value cd width when scroll
            cd.style.opacity = newCdWidth / cdWidth;
        }

        //khi click play
        playBtn.onclick = function() {
                if (_this.isPlaying) {
                    audio.pause();
                } else {
                    audio.play();
                }
            }
            // evenlistener play
        audio.onplay = function() {
                _this.isPlaying = true;
                player.classList.add("playing");
                cdThumbAnimate.play();
            }
            // evenlistener pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        }

        // evenlistener progress
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        //evenlistener seek song progress
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // khi next songs
        nextBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong();
                } else {
                    _this.nextSong();
                }
                audio.play();
                _this.render();
                _this.scrollActiveSong();
            }
            // khi pre songs
        prevBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong();
                } else {
                    _this.prevSong();
                }
                audio.play();
                _this.render();
                _this.scrollActiveSong();
            }
            // khi random songs
        randomBtn.onclick = function() {
                _this.isRandom = !_this.isRandom;
                // _this.setConfig('isRandom', _this.isRandom)
                randomBtn.classList.toggle("active", _this.isRandom); // neu boolean la true sẽ add và ngược lại
            }
            //xu ly Repeat songs
        repeatBtn.onclick = function() {
                _this.isRepeat = !_this.isRepeat;
                // _this.setConfig('isRepeat', _this.isRepeat)
                repeatBtn.classList.toggle("active", _this.isRepeat); // neu boolean la true sẽ add và ngược lại
            }
            // xu ly next audio end
        audio.onended = function() {
                if (_this.isRepeat) {
                    audio.play();
                } else {
                    nextBtn.click();
                }
            }
            // evenlistener play click
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || !e.target.closest('.option')) {
                //xu ly khi click vao bai hat
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                // xu ly khi click vao option
                if (e.target.closest('.option')) {

                }
            }
        }
    },

    // hiển thị current song khi vượt quá tầm nhìn
    scrollActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 300);
    },
    // loadConfig: function() {
    //     this.isRandom = this.config.isRandom;
    //     this.isRepeat = this.config.isRepeat;
    // },
    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name;
        cdThumb.style.background = `url('${this.currentSong.image}')`;
        cdThumb.style.backgroundSize = 'cover';
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }
        while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        // this.loadConfig();
        this.defineProperty(); //dinh nghia cac thuoc tinh cho obj
        this.handleEvents();

        this.loadCurrentSong(); // load info bai hat hien tai
        this.render();

        //hien thi trang thai ban dau cua button repeat & random
        // randomBtn.classList.toggle("active", this.isRandom);
        // repeatBtn.classList.toggle("active", this.isRepeat);
    }
}

app.start();
