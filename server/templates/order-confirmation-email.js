export const orderConfirmationTemplate = (name, orderId, totalAmount, address) => {
	return `
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="UTF-8" />
			</head>

			<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td align="center" style="padding:40px 20px;">
							<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
								<tr>
									<td align="center" style="background:#16a34a;padding:30px;">
										<h1 style="margin:0;color:#ffffff;">
											🎉 Order Confirmed
										</h1>
									</td>
								</tr>

								<tr>
									<td style="padding:40px;">

										<h2 style="margin-top:0;color:#111827;">
											Hello, ${name}! 👋
										</h2>

										<p style="font-size:16px;color:#4b5563;line-height:1.7;">
											Thank you for shopping with <strong>QuickShop</strong>.
											Your order has been successfully placed and is now being processed.
										</p>

										<table width="100%" cellpadding="12" cellspacing="0"
											style="margin:25px 0;border:1px solid #e5e7eb;border-radius:8px;">

											<tr>
												<td><strong>Order ID</strong></td>
												<td>${orderId}</td>
											</tr>

											<tr style="background:#f9fafb;">
												<td><strong>Total Paid</strong></td>
												<td>$${totalAmount.toFixed(2)}</td>
											</tr>

											<tr>
												<td><strong>Shipping Address</strong></td>
												<td>
													${address.street}<br />
													${address.city}
													${address.state ? `<br/>${address.state}` : ''}
													${address.postalCode ? ` - ${address.postalCode}` : ''}
													${address.country ? `<br/>${address.country}` : ''}
												</td>
											</tr>

											<tr style="background:#f9fafb;">
												<td><strong>Order Status</strong></td>
												<td>Processing ⏳</td>
											</tr>

										</table>

										<div style="text-align:center;margin:35px 0;">
											<a href="${process.env.CLIENT_URL}/orders/${orderId}"
												style="background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:bold;display:inline-block;">
												View Order
											</a>
										</div>

										<p style="font-size:15px;color:#6b7280;">
											We'll send another email once your order has been shipped.
										</p>

										<p style="margin-top:30px;color:#111827;">
											Thank you for choosing <strong>QuickShop</strong> ❤️
										</p>

									</td>
								</tr>

								<tr>
									<td align="center" style="background:#f9fafb;padding:20px;font-size:13px;color:#9ca3af;">
										Need help? Contact our support anytime.<br /><br />

										© 2026 QuickShop. All rights reserved.

									</td>
								</tr>

							</table>

						</td>
					</tr>
				</table>
			</body>
		</html>
`;
};
