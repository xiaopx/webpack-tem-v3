let $PX = require('./utils-new');
class videoContrl{
	constructor(src,opt){
		videoContrl.totalNum++;
		this.src = src;				 //视频地址，必填  data-source="assets/media/1.mp4"
		this.parent=null;      //插入到那个元素， data-parent="#div1", 不写 插入到 body
		this.img=null;   //视频封面 data-img=""
		this.muted=null;       //是不是静音 data-muted="muted" ，默认不静音
		this.loop=false;			 //是否loop  data-loop="true"， 默认不loop
		this.autoPaly=true;    //是否自动播放 data-auto="false" ，默认自动播放
		this.endclose=true;		 //播放结束是否自动关闭，默认自动关闭
		this.isclosebtn=true;  //是否需要显示关闭按钮 data-isclosebtn="false"，不写 默认显示
		this.iscontrl=true;    //是否显示控制条  data-iscontrl="false"，默认显示
		this.ismutedbtn=false; //是否显示静音按钮 data-ismutedbtn="true" ，点击 打开/关闭 静音  默认不显示
		this.callFn=null;      //播放结束执行，data-call="fn"
		this.videoBox=null;
		this.videoMain=null;
		this.isMuteFlag=false; 
		this.currentTime=0;
		this.playState=false;
		this.closeBtn=null;  
		this.mutedBtn = false; 
		this.init(opt)
	}

	creat(opt){
		
		let videoboxBg = opt && opt.parent ? 'background-color: rgba(0,0,0,0);' : 'background-color: rgba(0,0,0,.85);'
		let videoboxCssText = `${videoboxBg}opacity:0;position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 999;`;
		let closeCssText = 'z-index:10;width:50px;height:50px; background-size:100%;cursor:pointer;position:absolute;right:0px;top:0px;background-image:url(' + videoContrl.closeimgpath + ')';
		
		let closehtml = this.isclosebtn ? `<span class="close-video" style="${closeCssText}"></span>` : '';
		let contrl = this.iscontrl ? `controls` : '';

		let mutedbtncssText = `position: absolute;right: 20px;bottom: 30px;z-index: 20;background: url(${videoContrl.mutedpath});background-position: 0 0;background-size: 100%;width: 28px;height: 23px;cursor: pointer;`
		let mutedbtnhtml = this.ismutedbtn ? `<em style="${mutedbtncssText}" class="muted-btn"></em>` : '';
		let videofit = opt && opt.parent ? '-o-object-fit: cover;object-fit: cover; -o-object-position: 50% 50%; object-position: 50% 50%;' : '-o-object-fit: contain;object-fit: contain; -o-object-position: 50% 50%; object-position: 50% 50%;';

		let html = `
				${closehtml}
				<video id="myVideoMain_${videoContrl.totalNum}" src="${this.src}" 
				poster="${this.img}" 
				${contrl} 
				style="${videofit}"
				x5-video-player-type="h5-page"
				width="100%"
				height="100%"
				webkit-playsinline="true"
				playsinline="true"
				controlslist="nofullscreen nodownload noremoteplayback"
				${this.muted}>
				</video>
				${mutedbtnhtml}
			`;

		this.videoBox = document.createElement('div');
		this.videoBox.className = 'video_box';
		this.videoBox.style.cssText = videoboxCssText;
		this.videoBox.id = 'myVideoBox' + (videoContrl.totalNum);
		this.videoBox.innerHTML = html;
		if(opt && opt.parent){
			this.videoBox.style.position = 'absolute'
		}else{
			this.videoBox.style.position = 'fixed'
		}
		this.parent.appendChild(this.videoBox);

		this.videoMain = this.videoBox.getElementsByTagName('video')[0];

		this.videoMain['disablePictureInPicture'] = true;

		if(this.muted){
			this.isMuteFlag=true;
		}

		if(this.ismutedbtn){
			this.mutedBtn = this.videoBox.getElementsByTagName('em')[0];
			this.mutedBtn.onclick = ()=> this.mutedcontrl();
		}
		if(this.isclosebtn){
			this.closeBtn = this.videoBox.getElementsByClassName('close-video')[0];
			this.closeBtn.onclick = ()=> this.close();
		}
		
		if(this.autoPaly){
			this.play();
		}

		this.playEnd();
	}

	play(){
		let _this = this;

		TweenMax.to(_this.videoBox, .5, {
			opacity: 1,
			ease: Sine.easeInOut,
			onComplete: function () {
				document.addEventListener("WeixinJSBridgeReady", function(){
					_this.videoMain.play();
				}, false);
				_this.videoMain.play();
				_this.playState=true;
				_this.update();
			}
		})

	}

	mutedcontrl(){
		if(this.muted){
			this.videoMain.muted = false;
			this.mutedBtn.style.backgroundPosition = '0 -25px';
		}else{
			this.videoMain.muted = true;
			this.mutedBtn.style.backgroundPosition = '0 0';
		}
		this.muted = !this.muted;
	}

	pause(){
		this.videoMain.pause();
		this.playState=false;
	}

	playEnd(){
		let _this = this;
		$PX.bindEvent(this.videoMain, 'ended', function () {
			if(_this.loop){
				_this.play();
			}else if(_this.endclose){
				_this.close();
			}else{
				
			}
			_this.playState=false;
			_this.callFn && _this.callFn();
		})
	}

	update(syncfn){
		let _this = this;
		$PX.bindEvent(this.videoMain,'timeupdate',function(){
			_this.currentTime=_this.videoMain.currentTime;
			syncfn && syncfn();
		})
	}

	close(){
		let _this = this;
		TweenMax.to(_this.videoBox, .5, {
			opacity: 0,
			ease: Sine.easeInOut,
			onComplete: function () {
				_this.parent.removeChild(_this.videoBox);
				_this.playState=false;
			}
		})
	}

	init(opt){
		opt && opt.img ? this.img = opt.img : this.img = '';
		opt && opt.parent ? this.parent = $PX.gEle(opt.parent) : this.parent = document.body;
		opt && opt.muted ? this.muted = 'muted' : this.muted = '';
		opt && typeof(eval(opt.loop)) == 'boolean' ? this.loop = eval(opt.loop) : this.loop = false;
		opt && typeof(eval(opt.isclosebtn)) == 'boolean' ? this.isclosebtn = eval(opt.isclosebtn) : this.isclosebtn = true;
		opt && typeof(eval(opt.auto)) == 'boolean' ? this.autoPaly = eval(opt.auto) : this.autoPaly = true;
		opt && typeof((opt.call)) == 'function' ? this.callFn = (opt.call) : this.callFn = null;
		opt && typeof(eval(opt.endclose)) == 'boolean' ? this.endclose = eval(opt.endclose) : this.endclose = true;
		opt && typeof(eval(opt.iscontrl)) == 'boolean' ? this.iscontrl = eval(opt.iscontrl) : this.iscontrl = true;
		opt && typeof(eval(opt.ismutedbtn)) == 'boolean' ? this.ismutedbtn = eval(opt.ismutedbtn) : this.ismutedbtn = false;
		this.creat(opt);
	}
}
videoContrl.closeimgpath = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAABAAQMAAACX5T2IAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAEpJREFUKM9j+A8B/xCMAwxgwDbkGQeYoYwH7FBGAR+UYSEDZchYQBl8BVAG+wMog/kAgoGQQihGaEcYiLACYekB5kERGtRgYKYWANsvWDUU3jbYAAAAAElFTkSuQmCC';
videoContrl.mutedpath = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAwCAMAAAA1verrAAAAilBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2N2iNAAAALXRSTlMAIPjxKxgHJeCqRuyYeThzu4hOMQNZQRHX0JSFYBXn28GzopuRZg5vtKOeaFjho4s8AAABbElEQVQ4y82S13aDMBBEx8LIdHAhbuAa22nz/7+Xo4WAQeDnzIMkuIddIV28TjJ7AT3fNZMbubCTq+wO3D0OVng4F3e9IScYSkH/yDGIVHEUrvAQKMtO5v5JaZ1WcBHGHUgTjTk5Bd5kbOMYuNU65hXAnu8WJFeIVKyR8DwAt6ZyjJRRr6dEYX11dmTyDCP/ElKC1Re5Qy9TJbBEeVUp+ln+nZD+UD8WnToVxPqT30NUIMoshJWZqu/TLWBnmU3wf/O2vY3DgFygji31jWwebal3PDXrJ6mDo9zMgUHNyiNbSHmdc1v389hCFHQ0gLAScSaslTpjChilRGphrdRLelL+DEoENlIfzM4nPMBpYSO1zwWgyS6spY6YAyvVgyJ1+2W357KS2jOdXYYidQNzkXrGEGZzWSO1QEwgVfcAYhkbqdv7WkvtpCe1bJiFVPUsqYGF/Co2zG2pARfScTMqdUBOMZKEHDcsUHMz/QJ6azYJYn7LKQAAAABJRU5ErkJggg==";
videoContrl.totalNum = 0;
module.exports = videoContrl;