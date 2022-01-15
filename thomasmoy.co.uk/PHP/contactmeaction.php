<?php
// the message
$msg = "Message From: " . $_POST["firstname"] . $_POST["lastname"] . "\n". "\n" . $_POST["emailaddress"] . "\n". "\n" . $_POST["message"];

// use wordwrap() if lines are longer than 70 characters
$msg = wordwrap($msg,70);

// send email
if(mail("t1moy@btinternet.com","Contact From Website",$msg))
{
    echo "Message accepted";
}
else {
    echo "Error: Message not accepted";
}
;
?>