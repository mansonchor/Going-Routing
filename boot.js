__inline('lib/scrat/scrat.js');

require.config(__FRAMEWORK_CONFIG__);

var baseArr = ['going','routing']
var controlArr = ['header','footer']									//头部、尾部

//单页面路由配置和模块文件名
var pageArr = [
	{ route : "hotList" , module : "hotList"},
	{ route : "newList" , module : "newList"},
	{ route : "search" , module : "search"},
	/*{ route : "picDetail/:id" , module : "picDetail"},
	{ route : "user" , module : "user"}*/
]

var requireArr = baseArr.concat(controlArr)

require.async(requireArr, function(av,Going,Routing) 
{
	//路由和单页面配置初始化
	Routing.initialize({
	
		not_hit : function()
		{
			//alert('not_hit')
		},
		default_route : "hotList",
		before_route : function()
		{
			
		}
	})
	
	//初始页面控制容器，参数设置
	var page_controler = Going.mount_container('page-container' , { use_routing : true , routing_obj : Routing , listen_scroll : true })
	

	/*
	 *	单页面代码模块化 + 根据路由异步加载页面js文件 核心处理
	 */
	var pageTempArr = []
	for(var i = 0 ; i < pageArr.length ; i++)
	{
		var pageRoute = pageArr[i].route
		var pageModuleKey = pageArr[i].module

		pageTempArr[pageRoute] = pageModuleKey

		//这个路由规则只是为了在路由命中时异步加载 页面模块js
		Routing.add_route(pageRoute,function(params)
		{
			var route = this.route
			var pageKey = pageTempArr[route]

			//在异步加载成功之后，add_page会把上面add_route的回调函数覆盖掉
			require.async(pageKey ,function(pageOptions){

				page_controler.add_page( pageKey , pageOptions)

				//因为add_page再hashchange后，所以即使add了也不会进行页面的处理，要recheck一次
				Routing.recheck()
			})
		})
	}

	setTimeout(function(){
		Routing.route_start()
	},10)
	
});