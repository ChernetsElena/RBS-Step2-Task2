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


webix.ready(function () {

	webix.ui({
		rows: [
			{
				cols: [
					{rows: [
						{
							view: "template",
							template: "Склад",
							autoheight: true
						},

						{
							view: "datatable",
							id: "storeTable",
							css: "table",
							columns: [
								{ id: "title", header: "Название", fillspace: true, width: 200 },
								{ id: "count", header: "Количество", width: 150 },
								{ id: "price", header: "Цена", width: 150 }
							],
							select: "row",
							autoheight: true,
							autowidth: true,
							data: store,
						},
					]},


					{rows: [
						{
							view: "template",
							template: "Корзина",
							autoheight: true
						},

						{
							view: "datatable",
							id: "basketTable",
							css: "table",
							columns: [
								{ id: "title", header: "Название", fillspace: true, width: 200 },
								{ id: "count", header: "Количество", width: 150 },
								{ id: "price", header: "Цена", width: 150 }
							],
							select: "row",
							autoheight: true,
							autowidth: true,
							data: basket,
						}
					]}
				],
			},



			{
				id: 'cost',
				view: "template",
				autoheight: true,
				template: 'Стоимость: ' + (getCost(basket) || '0')
			},

			{
				view: "button",
				id: "showButton",
				value: "Добавить продукт",
				css: "webix_primary",
				autowidth: true,
			},


		]
	})

	webix.ui({

		view: "window",
		modal: true,
		id: 'window',
		close: true,
		height: 500, width: 600,
		head: {
			view: "toolbar", elements: [
				{
					view: "icon", icon: "wxi-close", click: function () {
						$$("window").hide();
					}
				}
			]
		},
		position: "center",

		body: {
			view: "form",
			id: "form",
			elements: [
				{ view: "text", label: 'Название', name: "title", width: 400, invalidMessage: "Введите название продукта" },
				{ view: "text", label: 'Количество', name: "count", width: 400, invalidMessage: "Введите количество (больше нуля)" },
				{ view: "text", label: 'Цена', name: "price", width: 400, value: "0", invalidMessage: "Введите цену" },
				{
					view: "button",
					id: "addButton",
					value: "Добавить",
					width: 300,
				}
			],
			rules: {
				"title": webix.rules.isNotEmpty,
				"count": webix.rules.isNumber && function(value){ return value > 0; },
				"price": webix.rules.isNumber && function(value){ return value >= 0; }
			}
		}

	})

	attachEvents();
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
				dataInc[dataInc.length] = { title: value, count: 1, price: dataDec[i].price };
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
function addProduct(values) {
	if ($$("form").validate()) {

		productIsNew = true;
		productTitle = values.title;
		productCount = Number(values.count);
		productPrice = Number(values.price);

		store.forEach(item => {
			if (item.title == productTitle) {
				productIsNew = false;

				item.count += productCount;

				item.price = productPrice;

				basket.forEach(itemBusket => {
					if (itemBusket.title == productTitle) {
						itemBusket.price = productPrice;
					}
				})
			}
		})

		if (productIsNew === true) {
			store.push(new Product(
				productTitle,
				productCount,
				productPrice
			))
		}

		refreshTable($$('storeTable'), store);
		refreshTable($$('basketTable'), basket);

		$$('cost').define('template', getCost(basket));
		$$('cost').refresh();

		$$('form').clear();
	}
}


function attachEvents() {

	$$('storeTable').attachEvent("onAfterSelect", function () {
		productId = $$('storeTable').getSelectedId();
		productTitle = $$('storeTable').getItem(productId).title;

		incrementElement(basket, store, productTitle);
		decrementElement(store, productTitle);

		$$('storeTable').clearSelection();

		refreshTable($$('storeTable'), store);
		refreshTable($$('basketTable'), basket);

		$$('cost').define('template', 'Стоимость: ' + getCost(basket));
		$$('cost').refresh();
	});

	$$('basketTable').attachEvent("onAfterSelect", function () {
		productId = $$('basketTable').getSelectedId();
		productTitle = $$('basketTable').getItem(productId).title;

		incrementElement(store, basket, productTitle);
		decrementElement(basket, productTitle);

		$$('basketTable').clearSelection();

		refreshTable($$('storeTable'), store);
		refreshTable($$('basketTable'), basket);

		$$('cost').define('template', getCost(basket));
		$$('cost').refresh();
	});

	$$('showButton').attachEvent("onItemClick", function () {
		$$('window').show();
	});

	$$('addButton').attachEvent("onItemClick", function () {
		addProduct($$('form').getValues());
	});
}


// 1 вызов юай
// обращаться к комп по айди
// вынести обработчики событий в функцию attachEvents
// модальное окно для формы