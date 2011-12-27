/*
var ipv_activityType="1";
var ipv_activityName="Run";
var ipv_workoutActivityID="23t3eoKlRcm6WbobHNJmRQ==";


https://motoactv.com/data/workoutDetail.json?workoutActivityId=23t3eoKlRcm6WbobHNJmRQ%3D%3D&activity=1&r=0.8102906856220216

		*/
		
		/*
		
getShareURLAndCall: function(callback, id) {

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
						moto.sharing.urlToShare = json.short_url;
						moto.sharing.urlToShare = encodeURI(moto.sharing.urlToShare);
						moto.sharing.urlToShare = moto.sharing.urlToShare.replace(/:/g, "%3A");
						moto.sharing.urlToShare = moto.sharing.urlToShare.replace(/\//g, "%2F");
						
						callback(moto.sharing.urlToShare);
					}
					else {
						moto.message(motostrings["workouts"]["latest"]["share"]["error"]["string"]);
					}
				}
			});
		};
		*/
		
var workoutId = "23t3eoKlRcm6WbobHNJmRQ==";
var detailsUrl = "https://motoactv.com/data/workoutDetail.json?workoutActivityId=";


$(function(){
	var url = detailsUrl + urlencode( workoutId );
	
	
});