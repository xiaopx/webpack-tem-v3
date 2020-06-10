let $PX = require('./utils-new');
let popUpEvent = (function(){
	let popbtns = $PX.gEle('.pop-btns');
	let targetEle = null;
	if(popbtns){
		let len = popbtns.length;
		for(var i=0;i<len;i++){
			$PX.bindEvent(popbtns[i],'click',function(){
				targetEle = $PX.gEle(this.dataset.target);
				$PX.remC(targetEle,'hidden');
				TweenMax.fromTo(targetEle, .5, {opacity: 0}, {
					opacity: 1,
					ease: Sine.easeInOut,
					onComplete: function () {
						closePop(targetEle);
					}
				})
			})
		}
		function closePop(e){
			if(e){
				let closebtn = e.getElementsByClassName('pop-close-btn')[0];
				closebtn.onclick = () => close();
				function close(){
					TweenMax.fromTo(e, .5, {opacity: 1}, {
						opacity: 0,
						ease: Sine.easeInOut,
						onComplete: function () {
							$PX.addC(e,'hidden');
						}
					})
				}
			}
		}
	}
})()

//module.exports = popUpEvent;
