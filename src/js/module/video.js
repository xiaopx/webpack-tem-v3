let $PX = require('./utils-new');
let videoContrl = (function () {
	let closeimgpath = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAABAAQMAAACX5T2IAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAEpJREFUKM9j+A8B/xCMAwxgwDbkGQeYoYwH7FBGAR+UYSEDZchYQBl8BVAG+wMog/kAgoGQQihGaEcYiLACYekB5kERGtRgYKYWANsvWDUU3jbYAAAAAElFTkSuQmCC';
	let videoBox = null;
	let videoEle = null;
	let videoMain = null;
	let videoPlay = false;
	let videoPar = null;
	let videoName = 'videoSelf';
	let closeBtn = null;
	let contNum = 0;
	let ops2 = {
		close: true,
		par: false,
		loop: '',
		img: ''
	}
	let closeCssText = 'z-index:10;width:50px;height:50px; background-size:100%;cursor:pointer;position:absolute;right:0px;top:0px;background-image:url(' + closeimgpath + ')';
	function playVideo(src, ops,isMuted){
		contNum++;
		if(ops && ops.par && ops.par != ''){
			videoPar = $PX.gEle('#'+ops.par);
			videoName = ops.par+'_v';
		}else{
			videoPar = document.body;
			videoName = 'videoSelf';
		}

		let html = `
				<span id="${'closeBtn'+contNum}" class="close-video" style="${closeCssText}"></span>
				<video id="${videoName}" src="${src}" 
				poster="${ops ? ops.img : ''}" 
				style="-o-object-fit: contain;object-fit: contain; -o-object-position: 50% 50%; object-position: 50% 50%;"
				x5-video-player-fullscreen="true"
				width="100%"
				height="100%"
				webkit-playsinline="true"
				x-webkit-airplay="true"
				playsinline="true"
				x5-playsinline=""
				${isMuted}>
				</video>
			`;
		let cvideoBox = document.createElement('div');
		cvideoBox.className = 'video_box';
		cvideoBox.id = 'videoBox'+contNum;
		cvideoBox.innerHTML = html;
		videoPar.appendChild(cvideoBox);
		if(ops && ops.par && ops.par != ''){
			videoMain = $PX.gEle('#'+ops.par+'_v');
			videoPar.videoBox = $PX.gEle('#'+'videoBox'+contNum);
			videoPar.videoBox.style.position = "absolute";


			videoPar.closeBtn = document.getElementById('closeBtn'+contNum); //$PX.gEle('#'+'closeBtn'+contNum);

		}else{
			videoPar.videoBox = $PX.gEle('#'+'videoBox'+contNum);
			//closeBtn.style.display = 'block';
			videoMain = $PX.gEle('#videoSelf');
			videoPar.videoBox.style.position = "fixed";

			videoPar.closeBtn =  document.getElementById('closeBtn'+contNum); //$PX.gEle('#'+'closeBtn'+contNum);

		}
		if($PX.isWeChat){
			document.addEventListener("WeixinJSBridgeReady", function() {  
				videoMain.play();
			});
		}else{
			videoMain.play();
		}
		
		videoPlay = true;

		if(ops && ops.par && ops.par != ''){
			videoPar = $PX.gEle('#'+ops.par);
			videoDEL = videoPar.videoBox;
		}
		videoPar.closeBtn.onclick = function(){
			closeVideo(ops,videoMain);
		}

		$PX.bindEvent(videoMain, 'ended', function () {
			closeVideo(ops,videoMain);
		})
	}

	function pauseVideo() {
		if (videoMain) {
			videoMain.pause();
			videoPlay = false;
		}
	}

	function closeVideo(ops,v) {
		if(ops && ops.loop == 'loop'){
			v.play();
		}else{

			console.log(videoPar,  videoPar.videoBox);

			TweenMax.to(videoPar.videoBox, .5, {
				opacity: 0,
				ease: Sine.easeInOut,
				onComplete: function () {
					if(ops && ops.par && ops.par != ''){
						videoPar = $PX.gEle('#'+ops.par);
						videoDEL = videoPar.videoBox;
					}else{
						videoPar = document.body;
						videoDEL = $PX.gEle('#'+'videoBox'+contNum);
					}
					videoPar.removeChild(videoDEL);
				}
			})
			videoPlay = false;
		}
	}

	

	return {
		play: function (src, ops,isMuted) {
			return playVideo(src, ops,isMuted);
		},
		pause: function () {
			return pauseVideo();
		},
		close: function(){
			return closeVideo();
		},
		status: function () {
			return videoPlay;
		}
	}

})()

module.exports = videoContrl;