import "../sass/common.scss";

if (process.env.NODE_ENV === 'production'){
  //console.log('你正在线上环境');
} else {
  //console.log('你正在使用开发环境');
}


let $PX = require('./module/utils-new');
let Slider = require('./module/slider');
let videoContrl = require('./module/video-new');
let popUpEvent = require('./module/popup');

let activeFocus = new Slider('#slider-items',{
  sliderScale: .3,
  isAuto: false,
  btnsFlag: true,
  pointFlag: true,
  syncFn: function(n,o){
  },
  callFn: function(n,o){
  }
});

let activeFocus2 = new Slider('#slider-items2',{
  moveType: 'opacity',
  btnsFlag: true,
  pointFlag: true,
  syncFn: function(n,o){
  },
  callFn: function(n,o){
  }
});

let activeFocus3 = new Slider('#slider-items3',{
  sliderScale: .9,
  itemsScall: .8,
  isAuto: false,
  midd: .5,
  btnsFlag: true,
  pointFlag: true,
  syncFn: function(n,o){
  },
  callFn: function(n,o){
  }
});


//let myAllVideoDefCreat1 = new videoContrl('assets/media/1.mp4',{parent:'#video1',muted:'muted',loop:true,isclosebtn:false,iscontrl:false});
//let myAllVideoDefCreat2 = new videoContrl('assets/media/new.mp4',{parent:'#video2',muted:'muted'});

function popVideoEndFn(){
  console.log('wobofangwanle');
}


let bindVideoDefEvents = function(){
	let getPopbtn = $PX.gEle('.popVideo');
  let len = getPopbtn.length;
	for (let i=0;i<len;i++) {
		$PX.bindEvent(getPopbtn[i],'click',function(){
			let src = this.dataset.source;
			let opt = {img: getPopbtn[i].dataset.img,parent:getPopbtn[i].dataset.parent,muted:getPopbtn[i].dataset.muted,loop:getPopbtn[i].dataset.loop,auto:getPopbtn[i].dataset.auto,call:eval(getPopbtn[i].dataset.call),endclose:getPopbtn[i].dataset.endclose,isclosebtn:getPopbtn[i].dataset.isclosebtn,iscontrl:getPopbtn[i].dataset.iscontrl,ismutedbtn:getPopbtn[i].dataset.ismutedbtn};
      this.newVideo = new videoContrl(src,opt);
		})
  }
  
  let getAutobtn = $PX.gEle('.autoVideo');
  let len1 = getAutobtn.length;
  for (let j=0;j<len1;j++) {
      let src = getAutobtn[j].dataset.source;
      let opt = {img: getAutobtn[j].dataset.img,parent:getAutobtn[j].dataset.parent,muted:getAutobtn[j].dataset.muted,loop:getAutobtn[j].dataset.loop,auto:getAutobtn[j].dataset.auto,call:eval(getAutobtn[j].dataset.call),endclose:getAutobtn[j].dataset.endclose,isclosebtn:getAutobtn[j].dataset.isclosebtn,iscontrl:getAutobtn[j].dataset.iscontrl,ismutedbtn:getAutobtn[j].dataset.ismutedbtn};
      if(!$PX.isIOS && $PX.isWeChat){
        
      }else{
        getAutobtn[j].newVideo = new videoContrl(src,opt);
      }
      $PX.bindEvent(getAutobtn[j],'click',function(){
        getAutobtn[j].newVideo = new videoContrl(src,opt);
      })
  }
}
//绑定POP video
bindVideoDefEvents();