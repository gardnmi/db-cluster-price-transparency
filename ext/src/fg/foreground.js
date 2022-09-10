var db_plan = "premium";

const dbu_pricing = JSON.parse(`
		{
			"jobs_light_compute": {
				"name": "Jobs Light Compute",
				"standard": 0.07,
				"premium": 0.1,
				"enterprise": 0.13
			},
			"jobs_compute": {
				"name": "Jobs Compute",
				"standard": 0.1,
				"premium": 0.15,
				"enterprise": 0.2
			},
			"delta_live_tables_core": {
				"name": "Delta Live Tables Core",
				"standard": 0.2,
				"premium": 0.2,
				"enterprise": 0.2
			},
			"delta_live_tables_pro": {
				"name": "Delta Live Tables Pro",
				"standard": 0.25,
				"premium": 0.25,
				"enterprise": 0.25
			},
			"delta_live_tables_advanced": {
				"name": "Delta Live Tables Advanced",
				"standard": 0.36,
				"premium": 0.36,
				"enterprise": 0.36
			},
			"all_purpose_compute": {
				"name": "All-Purpose Compute",
				"standard": 0.4,
				"premium": 0.55,
				"enterprise": 0.65
			}
		}			
`);

function addCosts() {
	const el = document.getElementsByClassName("webapp-css-15va8q9")[0];
	var dbu = document.getElementsByClassName("webapp-css-1nlcg28")[0].textContent.split("-");
	db_plan = document.getElementById("type_select").value;

	if (document.getElementsByClassName("worker-num fake-static-input")[0]) {
		workers = parseFloat(document.getElementsByClassName("worker-num fake-static-input")[0].textContent);
	} else if (document.getElementsByClassName("min-worker fake-static-input")[0]) {
		minWorkers = parseFloat(document.getElementsByClassName("min-worker fake-static-input")[0].textContent);
		maxWorkers = parseFloat(document.getElementsByClassName("max-worker fake-static-input")[0].textContent);
	} else if (document.getElementById("cluster-input--worker")) {
		workers = parseFloat(document.getElementById("cluster-input--worker").value);
	} else if (document.getElementById("cluster-input--min-worker")) {
		var minWorkers = parseFloat(document.getElementById("cluster-input--min-worker").value);
		var maxWorkers = parseFloat(document.getElementById("cluster-input--max-worker").value);
	} else {
		workers = 0;
	}

	if (dbu.length === 2) {
		var dbuFirst = parseFloat(dbu[0]);
		var dbuSecond = parseFloat(dbu[1].replace(",", ""));

		var jobs_light_compute_cost = `$${(dbu_pricing.jobs_light_compute[db_plan] * dbuFirst).toFixed(2)} - $${(dbu_pricing.jobs_light_compute[db_plan] * dbuSecond).toFixed(2)}`;
		var jobs_compute_cost = `$${(dbu_pricing.jobs_compute[db_plan] * dbuFirst).toFixed(2)} - $${(dbu_pricing.jobs_compute[db_plan] * dbuSecond).toFixed(2)}`;
		var delta_live_tables_core_cost = `$${(dbu_pricing.delta_live_tables_core[db_plan] * dbuFirst).toFixed(2)} - $${(dbu_pricing.delta_live_tables_core[db_plan] * dbuSecond).toFixed(2)}`;
		var delta_live_tables_pro_cost = `$${(dbu_pricing.delta_live_tables_pro[db_plan] * dbuFirst).toFixed(2)} - $${(dbu_pricing.delta_live_tables_pro[db_plan] * dbuSecond).toFixed(2)}`;
		var delta_live_tables_advanced_cost = `$${(dbu_pricing.delta_live_tables_advanced[db_plan] * dbuFirst).toFixed(2)} - $${(dbu_pricing.delta_live_tables_advanced[db_plan] * dbuSecond).toFixed(2)}`;

		var all_purpose_compute_cost = `$${(dbu_pricing.all_purpose_compute[db_plan] * dbuFirst).toFixed(2)} - $${(dbu_pricing.all_purpose_compute[db_plan] * dbuSecond).toFixed(2)}`;
	} else {
		var dbuFirst = parseFloat(dbu[0]);
		var jobs_light_compute_cost = `$${(dbu_pricing.jobs_light_compute[db_plan] * dbuFirst).toFixed(2)}`;
		var jobs_compute_cost = `$${(dbu_pricing.jobs_compute[db_plan] * dbuFirst).toFixed(2)}`;
		var delta_live_tables_core_cost = `$${(dbu_pricing.delta_live_tables_core[db_plan] * dbuFirst).toFixed(2)}`;
		var delta_live_tables_pro_cost = `$${(dbu_pricing.delta_live_tables_pro[db_plan] * dbuFirst).toFixed(2)}`;
		var delta_live_tables_advanced_cost = `$${(dbu_pricing.delta_live_tables_advanced[db_plan] * dbuFirst).toFixed(2)}`;
		var all_purpose_compute_cost = `$${(dbu_pricing.all_purpose_compute[db_plan] * dbuFirst).toFixed(2)}`;
	}

	var region = document.getElementById("region_select").value;
	var url = `https://corsanywhere.herokuapp.com/https://b0.p.awsstatic.com/pricing/2.0/meteredUnitMaps/ec2/USD/current/ec2-ondemand-without-sec-sel/${region}/Linux/index.json`;

	fetch(url)
		.then((res) => res.json())
		.then((data) => {
			data = data.regions[region];
			data = Object.fromEntries(Object.entries(data).map(([k, v]) => [k.toLowerCase().split(" ")[0] + "." + k.toLowerCase().split(" ")[1], v]));

			let awsInstance = document.getElementsByClassName("webapp-css-1mzg3n8");

			if (awsInstance.length === 2) {
				var nodeInstance = awsInstance[0].textContent;
				var driverInstance = awsInstance[1].textContent;

				var nodeInstanceRate = parseFloat(data[awsInstance[0].textContent]["price"]);
				var driverInstanceRate = parseFloat(data[awsInstance[1].textContent]["price"]);

				driverInstancePrice = `$${driverInstanceRate.toFixed(2)}`;

				if (dbu.length === 2) {
					nodeInstancePrice = `$${(nodeInstanceRate * minWorkers).toFixed(2)} - $${(nodeInstanceRate * maxWorkers).toFixed(2)}`;
				} else {
					nodeInstancePrice = `$${(nodeInstanceRate * workers).toFixed(2)}`;
				}
			} else {
				var nodeInstance = awsInstance[0].textContent;
				var driverInstance = awsInstance[0].textContent;

				var nodeInstanceRate = parseFloat(data[awsInstance[0].textContent]["price"]);
				var driverInstanceRate = parseFloat(data[awsInstance[0].textContent]["price"]);

				driverInstancePrice = `$${driverInstanceRate.toFixed(2)}`;

				if (dbu.length === 2) {
					nodeInstancePrice = `$${(nodeInstanceRate * minWorkers).toFixed(2)} - $${(nodeInstanceRate * maxWorkers).toFixed(2)}`;
				} else {
					nodeInstancePrice = `$${(nodeInstanceRate * workers).toFixed(2)}`;
				}
			}

			var html = `
		
			<div id="extension">
			<div id="dbu-cost">	
			<hr>
			<h2 class="du-bois-light-typography webapp-css-1xj5vnu" style="margin-top: 0px;">
				DBU Cost/h &nbsp <small>(${db_plan})</small>
			</h2>
	
			<div class="webapp-css-1xp7jxr">
				<span class="webapp-css-1lwh3lh">${dbu_pricing.jobs_light_compute.name}</span>
				<span class="webapp-css-1d0tddh">${jobs_light_compute_cost}</span>
			</div>
	
			<div class="webapp-css-1xp7jxr">
				<span class="webapp-css-1lwh3lh">${dbu_pricing.jobs_compute.name}</span>
				<span class="webapp-css-1d0tddh">${jobs_compute_cost}</span>
			</div>
	
			<div class="webapp-css-1xp7jxr">
				<span class="webapp-css-1lwh3lh">${dbu_pricing.delta_live_tables_core.name}</span>
				<span class="webapp-css-1d0tddh">${delta_live_tables_core_cost}</span>
			</div>
	
			<div class="webapp-css-1xp7jxr">
				<span class="webapp-css-1lwh3lh">${dbu_pricing.delta_live_tables_pro.name}</span>
				<span class="webapp-css-1d0tddh">${delta_live_tables_pro_cost}</span>
			</div>
	
			<div class="webapp-css-1xp7jxr">
				<span class="webapp-css-1lwh3lh">${dbu_pricing.delta_live_tables_advanced.name}</span>
				<span class="webapp-css-1d0tddh">${delta_live_tables_advanced_cost}</span>
			</div>
	
			<div class="webapp-css-1xp7jxr">
				<span class="webapp-css-1lwh3lh">${dbu_pricing.all_purpose_compute.name}</span>
				<span class="webapp-css-1d0tddh">${all_purpose_compute_cost}</span>
			</div>
			<div id="instance-cost">	
			<hr>
			<h2 class="du-bois-light-typography webapp-css-1xj5vnu" style="margin-top: 0px;">
				AWS Cost/h &nbsp <small>(${region})</small>
			</h2>
	
			<div class="webapp-css-1xp7jxr">
				<span class="webapp-css-1lwh3lh">Workers ${nodeInstance}: </span>
				<span class="webapp-css-1d0tddh">${nodeInstancePrice}</span>
			</div>
	
			<div class="webapp-css-1xp7jxr">
				<span class="webapp-css-1lwh3lh">Driver ${driverInstance}: </span>
				<span class="webapp-css-1d0tddh">${driverInstancePrice}</span>
			</div>
			</div>
			</div>
			</div>`;

			var extensionEl = document.getElementById("extension");

			if (extensionEl) {
				extensionEl.remove();
				el.insertAdjacentHTML("beforeend", html);
			} else {
				el.insertAdjacentHTML("beforeend", html);
			}
		});
}

function update() {
	// var form = document.querySelector("form");
	document.addEventListener("click", () => {
		var current_url = window.location.toString();

		if (current_url.includes("clusters") && (current_url.includes("configuration") || current_url.includes("edit") || current_url.includes("create"))) {
			if (!document.getElementById("region_select")) {
				addRegionSelect();
			}

			if (!document.getElementById("type_select")) {
				addTypeSelect();
			}

			addCosts();
			// updateCosts();
			// setTimeout(addDbuCosts, 10);
		}
	});
}

function reload() {
	// var form = document.querySelector("form");

	document.addEventListener("mousemove", () => {
		var current_url = window.location.toString();

		if (current_url.includes("clusters") && (current_url.includes("configuration") || current_url.includes("edit") || current_url.includes("create"))) {
			if (!document.getElementById("region_select")) {
				addRegionSelect();
			}

			if (!document.getElementById("type_select")) {
				addTypeSelect();
				addCosts();
			}

			// updateCosts();
			// setTimeout(addDbuCosts, 10);
		}
	});
}

function addRegionSelect() {
	const el = document.getElementsByClassName(" webapp-css-1q7njkh")[0];

	//Create array of options to be added
	var array = ["US West (Oregon)", "US East (N. Virginia)", "US East (Ohio)", "US West (N. California)"];

	//Create and append select list
	var hrEl = document.createElement("hr");
	var labelEl = document.createElement("label");
	labelEl.textContent = "AWS Region";
	var divEl = document.createElement("div");
	divEl.className = "attribute-section";
	var selectList = document.createElement("select");
	selectList.id = "region_select";

	divEl.append(labelEl);
	divEl.appendChild(selectList);
	el.append(hrEl);
	el.append(divEl);

	//Create and append the options
	for (var i = 0; i < array.length; i++) {
		var option = document.createElement("option");
		option.value = array[i];
		option.text = array[i];
		selectList.appendChild(option);
	}
}

function addTypeSelect() {
	const el = document.getElementsByClassName(" webapp-css-1q7njkh")[0];

	//Create array of options to be added
	var array = ["premium", "standard", "enterprise"];

	//Create and append select list
	var labelEl = document.createElement("label");
	labelEl.textContent = "Databricks Account Type";
	var divEl = document.createElement("div");
	divEl.className = "attribute-section";
	var selectList = document.createElement("select");
	selectList.id = "type_select";

	divEl.append(labelEl);
	divEl.appendChild(selectList);
	el.append(divEl);

	//Create and append the options
	for (var i = 0; i < array.length; i++) {
		var option = document.createElement("option");
		option.value = array[i];
		option.text = array[i];
		selectList.appendChild(option);
	}
}

chrome.extension.sendMessage({}, function (response) {
	var extensionReady = setInterval(function () {
		var current_url = window.location.toString();
		console.log(current_url);
		if (current_url.includes("clusters") && (current_url.includes("configuration") || current_url.includes("edit") || current_url.includes("create"))) {
			var readyStateCheckInterval = setInterval(function () {
				if (document.readyState === "complete") {
					clearInterval(readyStateCheckInterval);

					// ----------------------------------------------------------
					// This part of the script triggers when page is done loading

					console.log("Running Extension");
					addRegionSelect();
					addTypeSelect();
					addCosts();
					update();
					reload();

					clearInterval(extensionReady);
					// ----------------------------------------------------------
				}
			}, 10);
		}
	}, 2000);
});
