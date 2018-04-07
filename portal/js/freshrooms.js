$(document).ready(function () {
	$("#saveNewProperty").on("click",function(){
		saveNewProperty();
	})
	
	$("#saveNewReview").on("click",function(){
		saveNewReview();
	})
	
	var propertyId = getParameterByName("propertyId");
	var propertyName = getParameterByName("propertyName");
	var user = getParameterByName("user");
	
	if(propertyId != null)
		$("#propertyId").val(propertyId);
	
	if(propertyName != null)
		$('#propertyName').val(propertyName);
	
	if(user != null)
		$("#user").val(user);
	
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function saveNewProperty(){
	var name = $("#name").val();
	var address = $("#address").val();
	var latitude = $("#latitude").val();
	var longitude = $("#longitude").val();
	var emailId = $("#emailId").val();
	var imageUrl = $("#imageUrl").val();
	var marketing = $("#marketing").val();
	var services = $("#services").val();
	var paymentType =$('input[name=paymentType]:checked').val();
	saveProperty(name,address,latitude, longitude, imageUrl,emailId,marketing, services, paymentType);
	
	alert("Saved");
}

function saveProperty(name,address,latitude,longitude,imageUrl,emailId, marketing, services, paymentType) {
 
  var postData = {
    name: name,
    address: address,
    coordinates: {
		latitude: latitude,
		longitude: longitude
	},
	imageUrl: imageUrl,
	emailId: emailId,
	marketing: marketing,
	keywords: services,
	payment: {
		paymentType: paymentType
	}
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('properties').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/properties/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}

function saveNewReview(){

	var propertyId = $("#propertyId").val();
	var user = $("#user").val();
	
	var clean = $("#clean").val();
	var infrastructure = $("#infrastructure").val();
	var safety = $("#safety").val();
	var overall = $("#overall").val();
	
	saveReview(propertyId, clean, infrastructure, safety, overall, user);
	
	alert("Saved");
}

function saveReview(propertyId, clean, infrastructure, safety, overall, user) {
 
  var postData = {
    clean: clean,
    infrastructure: infrastructure,
    safety: safety,
	overall: overall,
	user: user
  };
  
  var rootNode = 'reviews/' + propertyId;

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child(rootNode).push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates[rootNode + '/' + newPostKey] = postData;
  
  firebase.database().ref().update(updates);
	
  firebase.database().ref('/properties/' + propertyId).once('value').then(function (snapshot) {
    var property = snapshot.val();
	
	var count = 1;
	var rating = parseFloat(overall);
	
	if(property.review) {
		var existingCount = parseInt(property.review.count);
		var existingRating = parseFloat(property.review.rating);
		
		count += existingCount;
		rating = (((existingRating*existingCount) + rating)/count).toFixed(2);
	}
	
	firebase.database().ref('/properties/' + propertyId + '/review').set({
		count: count,
		rating: rating
	});
		 
  });
  
  return;
}