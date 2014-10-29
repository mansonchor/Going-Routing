##介绍

SPA如果去除掉业务代码部分，控制层无非是两样东西：路由和页面控制。Routing和Going是分别抽象出来处理这两块的

在实际项目中，路由变化和页面切换往往存在映射关系，如果考虑模块化开发，1个路由地址->1个页面->1个页面js代码文件 是最理想的结构

在每一个完整的SPA业务里，都避免不了重复去写上面的映射控制关系。如果处理不当，还容易和业务的代码耦合


###Routing + Going 解决方案

结合使用 Routing 和 Going，加上scrat.js的模块管理，可以轻松解决映射控制。

使用这个组合解决方案的好处：
- 完整的路由页面映射控制解决方案，不需要再在业务里细化和支撑这种底层控制，低耦合
- 使用代码自动生成的思路，通过业务配置来统一化和自动化生成业务底层控制代码，不需要重复写boot，页面引入自动生成的boot.js SPA即可运行
- 框架里考虑到许多业务常见的控制需求，进行抽象和暴露方法、事件，方便业务使用
- 只抽象到控制层，View和Model层留给业务自行处理




##映射控制代码示例

[**Routing使用文档**](https://github.com/mansonchor/Routing)

[**Going使用文档**](https://github.com/mansonchor/Going)

**boot.js**

```javascript
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
```
