import React, { useState }from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import $ from 'jquery'; 
import Modal from 'react-bootstrap/Modal'

var socket;

function submit(){
	if($('#signin_user').val() !== "" && $('#signin_pass').val() !== ""){
		loader().then(function(data) {
			if(data){
				setCookie("casino_user", $('#signin_user').val(), 1);
				submit_form();
			} else {
				$('#loader_container').hide(); 
				$('#home').show();
				alert('You are not registered.')
			}
		});
	} else {
		if($('#signin_user').val() === ""){
			$('#signin_user_red').show();
		} else {
			$('#signin_user_red').hide();
		}
		if($('#signin_pass').val() === ""){
			$('#signin_pass_red').show();
		} else {
			$('#signin_pass_red').hide();
		}
	}	
}

function submit_recovery(){
	if($('#signin_email').val() !== "" && check_submit()){
		$("#recovery_form").submit();
	} else {
		if($('#signin_email').val() === ""){
			$('#signin_email_red').show();
			$('#signin_email_red').text("Please provide an email address")
		} else if(!check_submit()){
			$('#signin_email_red').show();
			$('#signin_email_red').text("Please provide a valid email")
		} else {
			$('#signin_email_red').hide();
		}
	}	
}

function loader(){
	return new Promise(function(resolve, reject){
		$('#loader_container').show(); 
		$('#home').hide();		
		socket.emit('signin_send', {user: $('#signin_user').val(), pass: $('#signin_pass').val()});	
		socket.on('signin_read', function(data){			
			resolve(data);
		});
	});
}

function submit_form(){
	return new Promise(function(resolve, reject){
		setTimeout(function(){
			$("#user_form").submit();
			resolve(true);
		}, 500);
	});
}

function check_submit(){
	var email = $('#signin_email').val();
	
	var regex_pass = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    var pass_result = regex_pass.test(email);
	
	//console.log('pass_result', email, regex_pass, pass_result);
	return pass_result;
}

function setCookie(cname,cvalue,exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function SignIn(props) {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
  	const handleShow = () => setShow(true);

	socket = props.socket;

	$('.full-height').attr('id', 'home');

	return (
		<div>
			<Form id="user_form" method="post" action="/registration">
				<Form.Control id="signin_user" className="input_yellow shadow_convex" type="text" name="user" placeholder="Username" defaultValue=""/>
				<h6 id="signin_user_red" className="text_red">You didn't write the username</h6>
				<Form.Control id="signin_pass" autoComplete="off" className="input_yellow shadow_convex" type="password" name="pass" placeholder="Password" defaultValue=""/>
				<h6 id="signin_pass_red" className="text_red">You didn't write the password</h6>
				<Button className="button_yellow shadow_convex" onClick={submit}>Sign In</Button>
				<div className="login_link_container">
					<div onClick={handleShow} id="link_forget"><h6>Forgot Username/Password?</h6></div>	
				</div>
			</Form>

			<Modal className="casino_modal" id="casino_modal" show={show} onHide={handleClose} size="sm">
				<Modal.Header closeButton>
					<Modal.Title>Forgot Username/Password?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>If you forgot your username or password you can reset it here</p>
					<Form id="recovery_form" method="post" action="/recovery">						
						<Form.Control id="signin_email" className="input_yellow" type="text" name="email" placeholder="Email" />
						<h6 id="signin_email_red" className="text_red"> </h6>
						<Button className="minor_check" onClick={submit_recovery}>Recover</Button>							
					</Form>
				</Modal.Body>				
			</Modal>
		</div>		
	);
}

export default SignIn;