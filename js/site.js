// screen 1

let researchMapping = {
        "Explore emerging trends, risks or opportunities":"Exploring",
        "Define the vision / value prop for the product":"Exploring",
        "Understand the user needs and perceptions broadly":"Understanding",
        "Inform the overall product strategy":"Understanding",
        "Develop new features or user journeys":"Generating",
        "Inform development of an existing feature":"Generating",
        "Validate and prioritise planned backlog":"Evaluating",
        "Testing the usability of a feature":"Evaluating",
}

function resetScreen1(){
	$('#createcard_product').html('Product');
	$('#createcard_productheadline').html('...');
	$('#createcard_goals').html('...');
	$('#createcard_research').html('...');
	$('#createcard_details').html('...');
	$('#createcard_researchtitle').html('...');
	$('#createcard_researchdetails').html('...');
	$("#question0")[0].selectedIndex = 0;
	$("#question1")[0].selectedIndex = 0;
	$("#question2").val('');
	$("#question3")[0].selectedIndex = 0;
}

function updateTags(){

	answers.forEach(function(tags,i){
		let tagboxID = '#tagbox_'+i;
		$(tagboxID).html('');

		if(i!=2){

			tags.forEach(function(tag,j){

				let html = `
					<div class="tag label label-info">
	  					<span>{{ tag }}</span>
	  					<i id="{{ tagid }}" class="bi bi-x"></i>
					</div>`
				html = html.replace('{{ tag }}',tag);
				let tagID = 'tag_'+i+'_'+j;
				html = html.replace('{{ tagid }}',tagID);
				$(tagboxID).append(html);
				$('#'+tagID).on('click',function(){
					answers[i].splice(j,1);
					updateTags();
					updateCreateCard();
				});
			});
		}
	});
}

function updateCreateCard(){
	let products = answers[0][0];
	if(answers[0].length>1){
		products = products +" & " + answers[0][1]
	}
	let goals = answers[1][0];
	if(answers[1].length>1){
		goals = goals +" & " + answers[1][1]
	}
	let research = researchMapping[answers[3][0]];
	$('#createcard_product').html(products);
	$('#createcard_productheadline').html(products);
	$('#createcard_goals').html(goals);
	$('#createcard_research').html(research);
	$('#createcard_details').html(answers[2][0]);
	$('#createcard_researchtitle').html(research);
	$('#createcard_researchdetails').html(answers[3][0]);
	if(research!=undefined){
		$('#createcard_researchimage').html('<img width="100%" src="images/'+research+'_Icon.png" />');
	}	
}

let answers = [[],[],[],[]];
let cards = [];
if(localStorage.getItem("cards")!==null){
	let serializedState = localStorage.getItem("cards");
	cards = JSON.parse(serializedState);
}

$('#screen1').hide();
$('#screen2').show();
createDash();

$('#createcard').on('click',function(){
	cards.push(answers);
	$('#screen1').hide();
	$('#screen2').show();
	createDash();
});	

$('.questionoption').on('change',function(){
	let value = $(this).val();
	let dataIndex = parseInt($(this).attr('data-index'));
	if(answers[dataIndex].indexOf(value)==-1){
		if(dataIndex==3){
			answers[dataIndex] = [];
		}
		if(dataIndex<2){
			if(answers[dataIndex].length>1){
				answers[dataIndex].splice(1,1);
			}
		}
		answers[dataIndex].push(value);	
		
	}
	updateTags();
	updateCreateCard();
});

$('#question2').on('input',function(){
	console.log('here');
	console.log($('#question2').val());
	answers[2][0] = $('#question2').val();
	updateTags();
	updateCreateCard();
});

//screen 2

function createCard(cardOptions,index){
	let html = `
		<div class="col-lg-4 col-md-6">
			<div id={{ id }} class="cardbox">
	            <div class="row">
	                <div class="col-8">
	                    <p class="productheadline">{{ productheadline }}</p>
	                   

	                </div>
	                <div class="col-4">
	                    <div id="researchimage"><img width="100%" src="images/{{ researchimage }}_Icon.png" /></div>
	                </div>
	            </div>
	            <p class="researchtitle">A project to</p> 
	            <p class="projectcard_tagline"><span class="inputtext">{{ goals }}</span></p>
	            <p class="researchtitle">by {{ researchtitle }}</p>
	            <p class="projectcard_tagline"><span id="details" class="inputtext">{{ details }}</span></p>
        		<div class="cardbuttons">
        			<button id="{{ id2 }}" class="btn btn-light cardbutton">Export <i class="bi bi-save"></i></button>
        			<button id="{{ id3 }}" class="btn btn-light cardbutton">Remove <i class="bi bi-x"></i></button>
        		</div>
        	</div>
        </div>
	`

	console.log(cardOptions);
	let productHeadline = cardOptions[0][0];
	if(cardOptions[0].length>1){
		productHeadline = productHeadline +" & " + cardOptions[0][1]
	}
	html = html.replace('{{ productheadline }}',productHeadline).replace('{{ products }}',productHeadline);

	let goals = cardOptions[1][0];
	if(cardOptions[1].length>1){
		goals = goals +" & " + cardOptions[1][1]
	}
	html = html.replace('{{ goals }}',goals);

	let details = cardOptions[2][0];
	html = html.replace('{{ details }}',details);

	let research = researchMapping[cardOptions[3][0]];
	html = html.replace('{{ researchtitle }}',research);
	html = html.replace('{{ research }}',research);
	html = html.replace('{{ researchimage }}',research);

	let researchDetails = cardOptions[3][0];
	html = html.replace('{{ researchdetails }}',researchDetails);

	let id = 'card_'+index;
	html = html.replace('{{ id }}',id);

	let id2 = 'export_'+index;
	html = html.replace('{{ id2 }}',id2);

	let id3 = 'remove_'+index;
	html = html.replace('{{ id3 }}',id3);

	return html;

}

function createAddCard(){
	let html = `
		<div class="col-lg-4 col-md-6">
			<div class="cardbox addbox">
            	<button id="addcard" class="btn btn-light cardbutton">Add a card <i class="bi bi-plus-circle"></i></button>
            </div>
        </div>
	`
	return html;
}

function createDash(){
	saveCards();
	$('#dashboard').html('');
	cards.forEach(function(card,i){
		let cardHTML = createCard(card,i);
		$('#dashboard').append(cardHTML);

		$('#export_'+i).on('click',function(){
			exportCard('card_'+i);
		});

		$('#remove_'+i).on('click',function(){
			removeCard(i);
		});
	});
	let cardHTML = createAddCard();
	$('#dashboard').append(cardHTML);
	$('#addcard').on('click',function(){
		$('#screen1').show();
		$('#screen2').hide();
		answers = [[],[],[],[]];
		resetScreen1();
		updateTags()
		updateCreateCard();

	});
}


function saveCards(){
	let cardsstring = JSON.stringify(cards);
	localStorage.setItem('cards', cardsstring);
}

function removeCard(index){
	cards.splice(index,1);
	createDash();
}

function exportCard(id){
	console.log('#'+id);
	$('.cardbuttons').hide();
	$('.cardbox').css('box-shadow','unset');
    html2canvas($('#'+id)[0],{'scale':2}).then((canvas) => {
		console.log(canvas);
		$('.cardbuttons').show();
		$('.cardbox').css('box-shadow','0px 2px 2px #ccc');
        var a = document.createElement('a');
        a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        a.download = 'project_card.jpg';
        a.click();
	});
}