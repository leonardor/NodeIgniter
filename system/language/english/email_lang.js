var lang = {
	'email_must_be_array': "The email validation method must be passed an array.",
	'email_invalid_address': "Invalid email address: %s",
	'email_attachment_missing': "Unable to locate the following email attachment: %s",
	'email_attachment_unreadable': "Unable to open this attachment: %s",
	'email_no_recipients': "You must include recipients: To, Cc, or Bcc",
	'email_send_failure_phpmail': "Unable to send email using PHP mail().  Your server might not be configured to send mail using this method.",
	'email_send_failure_sendmail': "Unable to send email using PHP Sendmail.  Your server might not be configured to send mail using this method.",
	'email_send_failure_smtp': "Unable to send email using PHP SMTP.  Your server might not be configured to send mail using this method.",
	'email_sent': "Your message has been successfully sent using the following protocol: %s",
	'email_no_socket': "Unable to open a socket to Sendmail. Please check settings.",
	'email_no_hostname': "You did not specify a SMTP hostname.",
	'email_smtp_error': "The following SMTP error was encountered: %s",
	'email_no_smtp_unpw': "Error: You must assign a SMTP username and password.",
	'email_failed_smtp_login': "Failed to send AUTH LOGIN command. Error: %s",
	'email_smtp_auth_un': "Failed to authenticate username. Error: %s",
	'email_smtp_auth_pw': "Failed to authenticate password. Error: %s",
	'email_smtp_data_failure': "Unable to send data: %s",
	'email_exit_status': "Exit status code: %s"
};
	
module.exports = lang;

/* End of file email_lang.php */
/* Location: ./system/language/english/email_lang.php */