//const { $$ } = require("webix");



class Product {
	constructor(title, count, price) {
		this.title = title;
		this.count = count;
		this.price = price;
	}
}

var store = [];

store.push(new Product("Яблоко", 1, 21))
store.push(new Product("Апельсин", 2, 22))
store.push(new Product("Банан", 3, 23))
store.push(new Product("Груша", 4, 24))
store.push(new Product("Брусника", 5, 25))

var basket = [];


webix.ready(function(){
	webix.ui({

		rows: [
			({
				cols: [
					({
						view:"datatable",
						container: "store", 
						id:"storeTable",
						css: "table",
						columns:[
							{ id:"title", header:"Название", fillspace:true,  width:200},
							{ id:"count", header:"Количество", width:150 },
							{ id:"price", header:"Цена", width:150 }
						],
						select: "row",
						autoheight: true,
						autowidth: true,
						on:{	
							onAfterSelect: function(){
								productId = $$('storeTable').getSelectedId();
								productTitle = $$('storeTable').getItem(productId).title;
								
								incrementElement(basket, store, productTitle);
								decrementElement(store, productTitle);
								
								$$('storeTable').clearSelection();
								
								refreshTable($$('storeTable'), store);
								refreshTable($$('basketTable'), basket);
								
								$$('cost').define('template', getCost(basket));
								$$('cost').refresh();
							}
						},		
						data:store,
					}),
				
					({				
						container: "basket",
						view:"datatable", 
						id:"basketTable",
						css: "table",
						columns:[
							{ id:"title", header:"Название", fillspace:true, width:200 },
							{ id:"count", header:"Количество", width:150 },
							{ id:"price", header:"Цена", width:150 }
						],
						select: "row",
						autoheight: true,
						autowidth: true,
						on:{			
							onAfterSelect: function(){
								productId = $$('basketTable').getSelectedId();
								productTitle = $$('basketTable').getItem(productId).title;
								
								incrementElement(store, basket, productTitle);
								decrementElement(basket, productTitle);
								
								$$('basketTable').clearSelection();
			
								refreshTable($$('storeTable'), store);
								refreshTable($$('basketTable'), basket);
								
								$$('cost').define('template', getCost(basket));
								$$('cost').refresh();
							}
						},		
						data: basket,
					})
				],	
			}),

			({
				container: "cost",
				id: 'cost',
				view: "template",
				autoheight : true,
				template: getCost(basket) || '0'
			}),

			({
				view:"button", 
				id:"button", 
				value:"Добавить продукт", 
				css:"webix_primary", 
				autowidth: true,
				on:{
					onItemClick: function(){ 
						$$('popup').show() 
					}
				}
			}),

			({
			  container: 'window',
			  view:"popup",
			  id: 'popup',
			  height:250,
			  width:300,
			  body:{
				view:"form",
				id:"form",
				elements:[
					 { view:"text", label:'Название', name:"title", width: 400},
					 { view:"text", label:'Количество', name:"count", width: 400 },
					 { view:"text", label:'Цена', name:"price", width: 400 },
					 { view:"button", 
					   value:"Добавить", 
					   width: 300,
					   on: {
							onItemClick: function () {
								addProduct($$('form').getValues());
								//form.clear();
							}	
					   }
					 }
				]
			  }
			})
		]
	})	
})		


//функция уменьшающая количество продукта на 1 или удаляющая продукт из массива
function decrementElement(data, value) {
	for (let i = 0; i < data.length; i++) {
		if (data[i].title === value) {
			if (data[i].count === 1) {
				data.splice(i, 1);
			}
			else {
				data[i].count -= 1;
			}
		}
   }
   return
}

//функция увеличивает количество продукта на 1 или добавляет продукт из массива
function incrementElement(dataInc, dataDec, value) {
	isProductInData = false

	for (let i = 0; i < dataInc.length; i++) {
		if (dataInc[i].title === value) {
			dataInc[i].count += 1;
			isProductInData = true;
		}
	}

	if (isProductInData == false) {
		for (let i = 0; i < dataDec.length; i++) {
			if (dataDec[i].title === value) {
				dataInc[dataInc.length] = {title: value, count: 1, price: dataDec[i].price};
			}
		}
	}
	
	return
}

// функция считает цену
function getCost(data) {
	let cost = 0;
	if (data.length === 0) {
		return cost
	}

	for (let i = 0; i < data.length; i++) {
		cost += data[i].count * data[i].price;
	}

	return cost
}

// функция обновляет таблицу
function refreshTable(table, data) {
	table.clearAll();
	data.forEach(item => {
		table.add({
			title: item.title,
			count: item.count,
			price: item.price
		})
	})
}

// функция добавляет продукт в таблицу
function addProduct(values){
	if ( values.title != "" ) {
		productIsNew = true;
		countIsValid = false;
		priceIsValid = false;

		productTitle = values.title;
		productCount = Number(values.count);
		productPrice = Number(values.price);

		if (( productCount != "" ) && ( isNaN(productCount) === false )) {
			countIsValid = true;
		}

		if (( productPrice != "" ) && ( isNaN(productPrice) === false )) {
			priceIsValid = true;
		}

		store.forEach(item => {
			if (item.title == productTitle){
				productIsNew = false;

				if (countIsValid) {
					item.count += productCount;
				}

				if (priceIsValid) {
					item.price = productPrice;
				}

				basket.forEach(itemBusket => {
					if (itemBusket.title == productTitle){
						if (priceIsValid) {
							itemBusket.price = productPrice;
						}
					}
				})
			}
		})

		if (productIsNew === true){
			store.push(new Product(
				productTitle, 
				countIsValid ? productCount : 0,
				priceIsValid ? productPrice : 0
			))
		}
		
		refreshTable($$('storeTable'), store);
		refreshTable($$('basketTable'), basket);

		$$('cost').define('template', getCost(basket));
		$$('cost').refresh();
	}
}


// 1 вызов юай
// обращаться к комп по айди
// вынести обработчики событий в функцию attachEvents
// модальное окно для формы