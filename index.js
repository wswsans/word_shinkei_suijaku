console.log("神経衰弱 Script load");

var word_data = [];
$.ajax({
	type: "GET",
	url: "data.json",
	dataType: "json",
	async: false
})
.done(data => {
	console.log("data Loaded");
	word_data = data;
})
.fail(function (data) {
	console.log("can't Loaded");
	window.alert("データのロードに失敗したため、ご利用になりません");
})

$(()=> {
	$("div#tables").hide();
	$("button#set").click(e => {
		$("table").html("");
		len = $("input#length").val();
		let head = "";
		for (let m = 0; m < 2; m++) {
			head = ["fi", "la"][m];
			for (let i = 0; i < len; i++) {
				$("<tr>").attr({"id": `tr_${i}`}).attr("class", head).appendTo(`table#${head}`);
				for (let j = 0; j < len; j++) {
					$("<td>").attr({"id": `td_${i}_${j}`, "class": `words word_${head}`}).text(`${i}_${j}_${head}`).appendTo(`tr#tr_${i}.${head}`);
				}
			}
		}
		$("div#tables").show();
	}).click();
	$("button#start").click(e => {
		$("span#me").text("得点: 0").prop("score", 0);
		let randmized_list = [];
		let tmp = word_data;
		//--- シャッフルするやつ, tmpリストを1つずつ抽出しては入れ替えっていうやつやってる
		const checked = $("input#F_En").prop("checked");
		let result = {"data": [], "fi": [], "la": []};

		result.data = tmp.reduce((_,cur,idx) => {
			let rand = Math.floor(Math.random() * (idx + 1));
			tmp[idx] = tmp[rand];
			tmp[rand] = cur;
			return tmp;
		})
		result.data = result.data.slice(0, $("input#length").val()**2);

		// result[(checked) ? "fi" : "la"] = result.data
		result[(checked) ? "fi" : "la"] = result.data.reduce((_,cur,idx) => {
			let rand = Math.floor(Math.random() * (idx + 1));
			result.data[idx] = result.data[rand];
			result.data[rand] = cur;
			return result.data;
		})
		result[(checked) ? "fi" : "la"] = result[(checked) ? "fi" : "la"].map(x => x["en"]);
		// result[(checked) ? "la" : "fi"] = result.data
		result[(checked) ? "la" : "fi"] = result.data.reduce((_,cur,idx) => {
			let rand = Math.floor(Math.random() * (idx + 1));
			result.data[idx] = result.data[rand];
			result.data[rand] = cur;
			return result.data;
		})
		result[(checked) ? "la" : "fi"] = result[(checked) ? "la" : "fi"].map(x => x["ja"]);

		//--- 固定の人をカットしながら, ランダムを入れます, 今のところ流し入れる場所は固定です
		for (let i = 0; i < $("input#length").val()**2; i++) {
			$($(`td.word_fi`).get(i)).prop("text_data", result["fi"][i]).text("***");
			$($(`td.word_la`).get(i)).prop("text_data", result["la"][i]).text("***");
		}
		$("td.words").click(e => {
			if ($(e.target).hasClass("word_fi") && $("input#count").val() == "fi") {
				if ($("td.words").hasClass("opened")) return;
				$(e.target).text($(e.target).prop("text_data")).addClass("opened");
				$("input#count").val("la");
			} else if ($(e.target).hasClass("word_la") && $("input#count").val() == "la") {
				$(e.target).text($(e.target).prop("text_data"));
				$("input#count").val("fi");
				result.data.forEach((val, ind) => {
					if ($("td.opened").text() == val[(checked) ? "en" : "ja"]) {
						if ($(e.target).text() == val[(checked) ? "ja" : "en"]) {
							console.log("yes");
							let sc = $("span#me").prop("score") +1;
							$("span#me").prop("score", sc).text(`得点: ${sc}`);
							$("td.opened").removeClass("opened");
							$("input#count").val("fi");
						} else {
							console.log("no");
							setTimeout(() => {
								console.log("undo");
								$("td.opened").text("***").removeClass("opened");
								$(e.target).text("***");
							}, 2000);
						}
					}
				})
			}
		})
	})
})
