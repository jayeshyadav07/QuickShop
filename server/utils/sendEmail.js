import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, message }) => {
	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to,
			subject,
			html: message,
		};

		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.error('Error sending email:', error);
	}
};

export default sendEmail;
