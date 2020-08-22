var maxN=8;
var i=1;

        function moren(e)
        {
            var event = window.event || e; 
            if (event.keyCode == 13) //网上找的demo，来判断是否为按下回车
                { 
                    baidu();
                    return flase;
                }
        }
        function baidu() {
            text = document.getElementsByClassName("searchinput")[0].value;
			url = 'https://www.baidu.com/s?wd=' + text;
			window.open(url,'_blank');
        }
        function google() {
            text = document.getElementsByClassName("searchinput")[0].value;
			url = 'https://www.google.com.hk/search?q=' + text;
			window.open(url,'_blank');
        }
        function bing() {
            text = document.getElementsByClassName("searchinput")[0].value;
			url = 'https://www.bing.com/search?q=' + text;
			window.open(url,'_blank');
        }
        function zhihu() {
            text = document.getElementsByClassName("searchinput")[0].value;
            if(text=="")//判断框里没有东西，不搜索，而是做成一个书签功能
            {
                window.open("https://www.zhihu.com/");
            }
            else
            {
                url = 'https://www.zhihu.com/search?q=' + text;
                window.open(url, '_blank');
            }
            //由以下代码测试，可得为""nothing
            /*if(text=="")
                alert("nothing");
            else if(text==" ")
                alert("blank");
            else if(text==null)
                alert("null");*/
        }
        function douban() {
            text = document.getElementsByClassName("searchinput")[0].value;
            if(text=="")
            {
                window.open("https://www.douban.com/");
            }
            else
            {
                url = 'https://www.douban.com/search?q=' + text;
                window.open(url, '_blank');
            }
        }
        function bilibili() {
            text = document.getElementsByClassName("searchinput")[0].value;
            if(text=="")
            {
                window.open("https://www.bilibili.com/");
            }
            else
            {
                url = 'https://search.bilibili.com/all?keyword=' + text;
                window.open(url, '_blank');
            }
        }
        function weixin() {
            text = document.getElementsByClassName("searchinput")[0].value;
            if(text=="")
            {
                window.open("https://weixin.sogou.com/");
            }
            else
            {
                url = 'https://weixin.sogou.com/weixin?type=2&query=' + text;
                window.open(url, '_blank');
            }
        }
        function weibo() {
            text = document.getElementsByClassName("searchinput")[0].value;
            if(text=="")
            {
                window.open("https://weibo.com/");
            }
            else
            {
                url = 'https://s.weibo.com/weibo?q=' + text;
                window.open(url, '_blank');
            }
            
        }
        function toutiao() {
            text = document.getElementsByClassName("searchinput")[0].value;
            if(text=="")
            {
                window.open("https://www.toutiao.com/");
            }
            else
            {
                url = 'https://www.toutiao.com/search/?keyword=' + text;
                window.open(url, '_blank');
            }  
        }
function changeLeft()
{
    //1.在全局里面设置背景，用JS没有找到相关的和函数
    //2.用id，给body设置一个id，很奇怪，没有试；js大部分都是通过id来修改CSS
    //3.最后用了班主任发的
    document.body.style.background='url(images/4.jpg)';
}
function changeRight()
{
	i++;
    var nowurl='images/'+ i +'.jpg';
    document.body.style.background="url("+nowurl+")";//可以用一个函数来判断是第几个，然后判断引出另外几个
}
function changeWallpaper()
{
switch(i) {
    case 1:changeWallpaper2();i++;break;
    case 2:changeWallpaper3();i++;break;
    case 3:changeWallpaper4();i++;break;
    case 4:changeWallpaper5();i++;break;
    case 5:changeWallpaper6();i++;break;
    case 6:changeWallpaper7();i++;break;
    case 7:changeWallpaper8();i++;break;
    case 8:changeWallpaper1();i=1;break;
} 

}
//以下为切换壁纸的代码
function changeWallpaper1()
{
	document.body.style.background='url(images/2.jpg)';
}
function changeWallpaper2()
{
	document.body.style.background='url(images/2.jpg)';
}
function changeWallpaper3()
{
	document.body.style.background='url(images/3.jpg)';
}
function changeWallpaper4()
{
	document.body.style.background='url(images/4.jpg)';
}
function changeWallpaper5()
{
	document.body.style.background='url(images/5.jpg)';
}
function changeWallpaper6()
{
	document.body.style.background='url(images/6.jpg)';
}
function changeWallpaper7()
{
	document.body.style.background='url(images/7.jpg)';
}
function changeWallpaper8()
{
	document.body.style.background='url(images/8.jpg)';
}
//以上，分割线

function hide()
{
	$(".logo").fadeToggle("fast");
}
function yijianfankui()
{
    window.open("https://wj.qq.com/s2/4819769/c679/");
}
function bizhitougao()
{
    window.open("https://wj.qq.com/s2/4820014/2c0d/");
}
function kuaijiefangwen()
{
    //document.getElementById('center').focus();
    //setInterval(document.getElementById('center').focus(), 1000);
    myVar = setInterval(function(){ document.getElementById('center').focus(); }, 2000);
}