/*
var ipv_activityType="1";
var ipv_activityName="Run";
var ipv_workoutActivityID="23t3eoKlRcm6WbobHNJmRQ==";


https://motoactv.com/data/workoutDetail.json?workoutActivityId=23t3eoKlRcm6WbobHNJmRQ%3D%3D&activity=1&r=0.8102906856220216

		*/
		
		
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
					$("#socialWaitDialog").dialog("close");

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
		
		

var workoutId = "23t3eoKlRcm6WbobHNJmRQ==";
var detailsUrl = "https://motoactv.com/data/workoutDetail.json?workoutActivityId=";



	var url = detailsUrl + encodeURI( workoutId );
	//alert(url);
	try{
	$.ajax({
		url: url,
		data: { username: encodeURI('motorola@redune.com') },
		success: function(data){

			var name = data.journaldata.journalname;
			var notes = data.journaldata.journalnotes;
			
			var distance = data.summary.DISTANCE;
			
			var startTime = data.summary.STARTTIME;
			var endTime = data.summary.ENDTIME;
			
			var elapsedTime = endTime - startTime;

			getShareUrl(workoutId, function(url){
				alert(url);
				window.open(url);
			});
			
		},
		error: function(data, status, errorThrown){
			alert(data);
		}
	});
	}catch(ex){
		alert(ex);
	}

