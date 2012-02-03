var clientId = "TGvDSuLUiT2Sl5m5Skz04yHBQi9NtFyCG29gY6Rt";
var detailsUrl = "https://motoactv.com/data/workoutDetail.json?workoutActivityId=";
var authUrl = "https://api.dailymile.com/oauth/authorize?response_type=token";
var oauthToken;
var tokenCookie = "dailymile_token";
var endTime;
var frame = "<iframe name='hiddenFrame' id='hiddenFrame'></iframe>";

function showLoading(){
	$('#metricGraph').hide();
	$('#activitySliderContainer').hide();
	$('.loader').show();
}

function showMessage(message){
	$('.loader').hide();
	$('#metricGraph').show();
	$('#metricGraph').text(message);
}

function getEntry(){
	var end = endTime / 1000;
	
	var padding = 100000;
	
	var url = "http://api.dailymile.com/people/me/entries.json?until=" + (end + padding ) + "&since=" + ( end - padding) + "&oauth_token=" + oauthToken;
	
	$.ajax({
		url: url,
		dataType: "jsonp",
		success: function(data){
			if( data && data.entries.length > 0 ){
				window.location = data.entries[0].url;
			}else{
				setTimeout(getEntry, 100 );
			}
			
		},
		error: function(jqXHR, textStatus, errorThrown){
			showMessage("An error occurred posting to dailymile. The error is: " + errorThrown + "<br/>A please <a href='mailto:actvmile@redune.com'>e-mail the developer for help</a>");
		}
	});
}

		
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}
		
function authorizeDailymile(){
	var message = "You need to authorize ActvMile to post to your dailymile account. You will be redirected to the authorization page and then back here. Click \"ActvMile\" again when you return to post your workout.";
	
	alert(message);

	var url = authUrl + "&client_id=" + clientId + "&redirect_uri=http://motoactv.com/workout/show";
	
	window.location = url;
	
}

function formatTime(timestamp){
	// create a new javascript Date object based on the timestamp

	var date = new Date(timestamp);
	
	//edited by engmex (pinr@rocketmail.com)
	//returns minutes not hours hence / by 60
	var offset = (curdate.getTimeZoneOffset()/60)
	
	

	//next line changed by engmex
	var formattedTime =  date.getFullYear() + "-" + ( date.getMonth() + 1 ) + "-" + date.getDate() + "T" + (date.getHours() + offset) + ":" + date.getMinutes() + ":" + date.getSeconds() + "Z";
	
	
	return formattedTime;
	
}		
	
function cleanString(input){
	return input.replace(/"/g, '&quot;').replace(/'/g, '');
}

function getShareUrl(id, callback) {

	var postData = {
		workoutActivityId: id
	};
	
	$.ajax({
		url: "/sharing/shareWorkout.json",
		type: 'POST',
		data: postData,
		dataType: 'json',
		success: function(json) {
			if (json && ((typeof json.code == "undefined") || (json.code > -1))) {
				var urlToShare = json.short_url;
			
				
				callback(urlToShare);
				
				
			}
			else {
				alert("Error getting share url");
			}
		}
	});
};

function postWorkout( entry ){

	var url = "https://api.dailymile.com/entries.json?oauth_token=" + oauthToken;

					
	var form = "<form action='" + url + "' target='hiddenFrame' id='hiddenForm' method='POST'> \
		<input type='hidden' name='lat' value='" + entry.lat + "'> \
		<input type='hidden' name='lon' value='" + entry.lon + "'> \
		<input type='hidden' name='workout[title]' value='" + entry.workout.title + "'> \
		<input type='hidden' name='workout[activity_type]' value='" + entry.workout.activity_type + "'> \
		<input type='hidden' name='workout[duration]' value='" + entry.workout.duration + "'> \
		<input type='hidden' name='workout[calories]' value='" + entry.workout.calories + "'> \
		<input type='hidden' name='workout[completed_at]' value='" + entry.workout.completed_at + "'> \
		<input type='hidden' name='workout[distance][value]' value='" + entry.workout.distance.value + "'> \
		<input type='hidden' name='workout[distance][units]' value='" + entry.workout.distance.units + "'> \
		<input type='hidden' name='message' value='" + entry.message + "'> \
		</form>"
		
	$(frame).appendTo('body');
	$(form).appendTo('body');
	
	$('#hiddenForm').submit();
	
	setTimeout(getEntry, 100 );
}

function getVariable( searchString ){
	var match;
	
	$('body script').each(function(){
		var text = $(this).text();

		var location = text.indexOf( searchString );
		
		if( location > 0 ){
			location = location + searchString.length;
			
			var end = text.indexOf('";', location);

		 match = text.substring(location, end );
		
		}
	});
	return match;
}


function getUnits(){

	return getVariable('ipv_userUnits = "');
}

function getWorkoutId(){

	return getVariable('ipv_workoutActivityID="');
}

function getWorkoutType(){
	var activityName = getVariable('var ipv_activityName="');
	
	if( activityName=='Walk'){
		return "walking";
	}else if( activityName == 'Run'){
		return "running";
	}else if( activityName == 'Cycle'){
		return "cycling";
	}
}

function doPost(){
	var workoutId = getWorkoutId();

	var units;
	if( getUnits() == 'METRIC' ){
		units = 'kilometers';
	}else{
		units = 'miles';
	}
	
	var workoutType = getWorkoutType();
	
	
	var cleanedId = workoutId.replace(/\+/g, '%2B').replace(/=/g, '%3D');

	var url = detailsUrl + cleanedId;

	$.ajax({
		url: url,
		success: function(data){

			var startTime = data.summary.STARTTIME;
			endTime = data.summary.ENDTIME;

			
			var notes;
			var name;
			
			if( data.journaldata ){
			 	notes =  data.journaldata.journalnotes;
				name = data.journaldata.journalname;
			}else{
				name = "";
			}
			
			getShareUrl(workoutId, function(shareUrl){
			
				var message;
				if( notes)		
				{
					message = notes + " " + shareUrl;
				}else{
					message = shareUrl;
				}
	
				
				var entry = {

					message: cleanString(message),
					workout: {
						activity_type: workoutType,
						completed_at: formatTime( endTime ),
						distance: {
							value: data.summary.DISTANCE, 
							units: units
						},
						duration: ( endTime - startTime ) / 1000,
						calories: data.summary.CALORIEBURN,
						title: cleanString(name)
					}
				};
			
			 	if( data.route.length > 0 ){
					entry.lat = data.route[0].LATITUDE;
					entry.lon = data.route[0].LONGITUDE;
				}
				
				postWorkout( entry );
			});
			
		},
		error: function(data, status, errorThrown){
			alert(data);
		}
	});

}

if( window.location.toString().indexOf("motoactv.com\/workout\/show") > 0 ){
	showLoading();
	
	oauthToken = readCookie(tokenCookie);
	
	if( oauthToken ){
	
		doPost();
	}else{
		var searchString = "access_token=";
		
		var loc = window.location.toString();
		
		var tokenLocation = loc.indexOf(searchString);
		
		if( tokenLocation > 0 ){
			oauthToken = loc.substring(tokenLocation + searchString.length );
			createCookie(tokenCookie, oauthToken, 365);
			
			doPost();
		}else{
			authorizeDailymile();
		}	
	}
}else{
	window.location = "https://motoactv.com/workout/show";
}
