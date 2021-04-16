class Product {
	constructor(title, count, price) {
		this.title = title;
		this.count = count;
		this.price = price;
	}
}

var store = [];

store.push(new Product("Яблоко", 5, 20))
store.push(new Product("Апельсин", 5, 20))
store.push(new Product("Банан", 5, 20))
store.push(new Product("Груша", 5, 20))
store.push(new Product("Брусника", 5, 20))

var basket = [];

webix.ready(function(){
	webix.ui({
				cols:[

				grid = 	{
						view:"datatable",
						container: "cont1", 
						id:"table",
						css: "ddd",
						columns:[
							{ id:"title", header:"Название", fillspace:true},
							{ id:"count", header:"Количество", width:150 },
							{ id:"price", header:"Цена", width:150 }
						],
						data:store,
						onClick: {
							"ddd": function(event){
								console.log(event.target.parentElement.childNodes);
							}
						}
					},
					{
						view:"datatable", 
						container: "cont2",
						id:"table1",
						columns:[
							{ id:"title", header:"Название", fillspace:true },
							{ id:"count", header:"Количество", width:150 },
							{ id:"price", header:"Цена", width:150 }
						],
						data:basket,
					}
				]

				
	})
})