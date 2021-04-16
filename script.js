function validation() {
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;

	if (email.match(/\S+@\S+/)) {
		console.log("good e")
		document.getElementById("email").className = "";
		document.getElementById("ewarn").style.dispaly = "";
		if (password.length > 8) {
			console.log("good p")
			document.getElementById("pwarn").style.dispaly = "";
			document.getElementById("password").className = "";
			location.href = "./studyroom.html"
      return true;
		} else {
			document.getElementById("pwarn").style.dispaly = "block";
			document.getElementById("password").className = "incorrent";
      return false;
		}
	} else {
		console.log("bad e")
		document.getElementById("ewarn").style.dispaly = "block";
		document.getElementById("email").className = "incorrect";
		if (password.length > 8) {
			document.getElementById("pwarn").style.dispaly = "";
			document.getElementById("password").className = "";
            return false;
		} else {
			console.log("bad p")
			document.getElementById("pwarn").style.dispaly = "block";
			document.getElementById("password").className = "incorrent";
            return false;
		}
	}
}
