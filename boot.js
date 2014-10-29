__inline('lib/scrat/scrat.js');

require.config(__FRAMEWORK_CONFIG__);

var baseArr = ['going','routing']
var controlArr = ['header','footer']									//ͷ����β��

//��ҳ��·�����ú�ģ���ļ���
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
	//·�ɺ͵�ҳ�����ó�ʼ��
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
	
	//��ʼҳ�������������������
	var page_controler = Going.mount_container('page-container' , { use_routing : true , routing_obj : Routing , listen_scroll : true })
	

	/*
	 *	��ҳ�����ģ�黯 + ����·���첽����ҳ��js�ļ� ���Ĵ���
	 */
	var pageTempArr = []
	for(var i = 0 ; i < pageArr.length ; i++)
	{
		var pageRoute = pageArr[i].route
		var pageModuleKey = pageArr[i].module

		pageTempArr[pageRoute] = pageModuleKey

		//���·�ɹ���ֻ��Ϊ����·������ʱ�첽���� ҳ��ģ��js
		Routing.add_route(pageRoute,function(params)
		{
			var route = this.route
			var pageKey = pageTempArr[route]

			//���첽���سɹ�֮��add_page�������add_route�Ļص��������ǵ�
			require.async(pageKey ,function(pageOptions){

				page_controler.add_page( pageKey , pageOptions)

				//��Ϊadd_page��hashchange�����Լ�ʹadd��Ҳ�������ҳ��Ĵ���Ҫrecheckһ��
				Routing.recheck()
			})
		})
	}

	setTimeout(function(){
		Routing.route_start()
	},10)
	
});