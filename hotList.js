var header = require('header'),
	footer = require('footer')

var pageOptions = { 
	route : 'hotList',
	initialize : function()
	{
		//页面模板渲染
		var hotList = __inline('hotList.tpl')

		this.page_element.innerHTML = hotList
	},
	page_init : function()
	{
		//页面初始化建立时触发
	},
	page_show : function()
	{
		//页面每次显示都会触发
	},
	window_scroll : function(options)
	{
		if(options.nearBottom)
		{
			//页面滚动到底部时
		}
	},
	page_hide : function()
	{
		//页面每次隐藏时都会触发
	}
}

module.exports = pageOptions