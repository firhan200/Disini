var myLat,myLong;
var map, infoWindow, marker, userMarker;
var icon = 'assets/img/mymarker.png';

$(document).ready(function(){     
 	initMap();
 	getLocation();	

  	// Initialize Firebase
	  var config = {
	    apiKey: "AIzaSyAEL2Kbqkrw7YewOrxKS0eXrr6yFJ81LEU",
	    authDomain: "disini-bb125.firebaseapp.com",
	    databaseURL: "https://disini-bb125.firebaseio.com",
	    projectId: "disini-bb125",
	    storageBucket: "disini-bb125.appspot.com",
	    messagingSenderId: "843413805729"
	  };
	  firebase.initializeApp(config);

  	// Get a reference to the database service
	var database = firebase.database();

	database.ref('positions').on('value', function(snapshot) {
	    snapshot.forEach(function(childSnapshot){
	    	setMarker(childSnapshot.val().latitude, childSnapshot.val().longitude);
	  	});			    
	});

	$(document).on('click','#save_position', function(){
		var uid = database.ref().child('positions').push().key;
		database.ref('positions/' + uid).set({
	    	latitude: myLat,
	    	longitude: myLong
	  	});
	  	infoWindow.close();
	  	console.log("Saved into firebase realtime database");
	})
})

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: -6.221970, lng: 106.847542},
	  zoom: 16
	});		
}

function setMarker(latitude, longitude){
	var userPos = {
          		lat: latitude,
          		lng: longitude
        	};
	userMarker = new google.maps.Marker({
		      		position: userPos,
					animation: google.maps.Animation,
					icon: icon,
		      		map: map
		    	});
}

function getLocation(){
	// Try HTML5 geolocation.
    if (navigator.geolocation) {   	    
      	navigator.geolocation.getCurrentPosition(function(position) {
        	var myPos = {
          		lat: position.coords.latitude,
          		lng: position.coords.longitude
        	};

        	marker = new google.maps.Marker({
          		position: myPos,
          		draggable: true,
    			animation: google.maps.Animation.BOUNCE,
          		map: map
        	});

        	//start info window
        	myLat = marker.getPosition().lat();
			myLong = marker.getPosition().lng();
        	infoWindow = new google.maps.InfoWindow({
          		content: "<h4>Your position</h4><b>lat:</b><br/>"+myLat+"<br/><b>long:</b><br/>"+myLong+"<br/><br/><button type='button' id='save_position' class='btn btn-xs btn-primary'>Save</button>"
        	});    

        	marker.addListener('click', function() {
		      infoWindow.open(map, marker);
		    });

		    window.google.maps.event.addListener(marker, 'dragend', (e) => {
		    	infoWindow.close();		    	
			  	myLat = marker.getPosition().lat();
			  	myLong = marker.getPosition().lng();
			  	console.log("lat: "+myLat+", long: "+myLong);
			  	infoWindow = new google.maps.InfoWindow({
		          	content: "<h4>Your position</h4><b>lat:</b><br/>"+myLat+"<br/><b>long:</b><br/>"+myLong+"<br/><br/><button type='button' id='save_position' class='btn btn-xs btn-primary'>Save</button>"
		      	});
			  	infoWindow.open(map, marker);			  	
			});

			google.maps.event.addListener(map, 'click', function(event) {
				infoWindow.close();		
			   	marker.setPosition(event.latLng);
			   	myLat = marker.getPosition().lat();
			  	myLong = marker.getPosition().lng();
			  	console.log("lat: "+myLat+", long: "+myLong);
			  	infoWindow = new google.maps.InfoWindow({
		          	content: "<h4>Your position</h4><b>lat:</b><br/>"+myLat+"<br/><b>long:</b><br/>"+myLong+"<br/><br/><button type='button' id='save_position' class='btn btn-xs btn-primary'>Save</button>"
		      	});
			  	infoWindow.open(map, marker);
			});

        	map.setCenter(myPos);
      	}, function() {
        	handleLocationError(true, infoWindow, map.getCenter());
      	});      	
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

function getDateTime(){
	var today = new Date();
	var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var datetime = time+" "+date;
	return datetime;
}