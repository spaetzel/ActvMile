/*
var ipv_activityType="1";
var ipv_activityName="Run";
var ipv_workoutActivityID="23t3eoKlRcm6WbobHNJmRQ==";


https://motoactv.com/data/workoutDetail.json?workoutActivityId=23t3eoKlRcm6WbobHNJmRQ%3D%3D&activity=1&r=0.8102906856220216

		*/
		
		


function formatTime(timestamp){
	// create a new javascript Date object based on the timestamp
	
	var date = new Date(timestamp);

	
	var formattedTime =  date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "T" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "Z";
	
	return formattedTime;
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
	$.ajax({
		url: "https://api.dailymile.com/entries.json",
		type: 'POST',
		data: entry,
		dataType: 'jsonp',
		success: function(json) {
			alert(json)
		},
		error: function(j,m,e){
			alert("error posting working");
		}
	});
}

var workoutId = "23t3eoKlRcm6WbobHNJmRQ==";
var detailsUrl = "https://motoactv.com/data/workoutDetail.json?workoutActivityId=";



	var url = detailsUrl + encodeURI( workoutId );
	//alert(url);
	try{
	$.ajax({
		url: url,
		data: { username: encodeURI('motorola@redune.com') },
		success: function(data){

			var startTime = data.summary.STARTTIME;
			var endTime = data.summary.ENDTIME;

			var notes =  data.journaldata.journalnotes;
			
			getShareUrl(workoutId, function(shareUrl){
			
				var message;
				if( notes)		
				{
					message = data.journaldata.journalnotes + " " + shareUrl;
				}else{
					message = shareUrl;
				}
				
				var entry = {
					lat: data.route[0].LATITUDE,
					lon: data.route[0].LONGITUDE,
					message: message,
					workout: {
						activity_type: "running",
						completed_at: formatTime( endTime ),
						distance: {
							value: endTime, 
							units: "kilometers"
						},
						duration: ( endTime - startTime ) / 1000,
						calories: data.summary.CALORIEBURN,
						title: data.journaldata.journalname
					}
				};
				
				postWorkout( entry );
			});
			
		},
		error: function(data, status, errorThrown){
			alert(data);
		}
	});
	}catch(ex){
		alert(ex);
	}

