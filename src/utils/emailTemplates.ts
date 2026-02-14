const {
  FE_BASE_URL,
  CONTACT_EMAIL,
} = process.env;

const contactInfo = `<p class="text">${CONTACT_EMAIL}</p>`;
const localeOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
};

const buildTemplate = (firstName: string, title: string, mainContent: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body, table, td, a {
      text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      margin: 0;
      padding: 0;
      width: 100% !important;
      font-family: Arial, sans-serif;
    }
    img {
      display: block;
      border: 0;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
    }
    .header img {
      width: 100px;
      height: auto;
      display: block;
      margin: 0 auto;
    }
    .content {
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      color: #333;
    }
    .content h2 {
      color: #e74c3c;
    }
    .content p {
      line-height: 1.6;
    }
    .reset-button {
      display: inline-block;
      padding: 10px 20px;
      color: #fff;
      background-color: #e74c3c;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      padding: 20px;
      background-color: #fafafa;
      border-radius: 0 0 8px 8px;
      color: #999;
    }
    .footer a {
      color: #e74c3c;
      text-decoration: none;
    }
    .footer .line {
      border-top: 1px solid #eaeaea;
      margin: 20px 0;
    }
    .social-icons {
      margin-top: 10px;
    }
    .social-icons img {
      width: 30px;
      height: auto;
      display: inline-block;
      margin-right: 5px;
    }
    .code-box {
      font-size: 24px;
      letter-spacing: 5px;
      padding: 10px 20px;
      background-color: #f0f0f0;
      border-radius: 5px;
      display: inline-block;
      margin: 10px 0;
    }
  </style>
</head>
    <body>
      <div class="email-container">
        <div class="header">
          <img src="https://weddingstory.nyc3.digitaloceanspaces.com/ead-backend1722877045180-logo.png" alt="Eve After Dark Logo">
        </div>
        <div class="content">
          <h2>Dear ${firstName}</h2>
          <h3>${title}</h3>
          ${mainContent}
        </div>
        <div class="footer">
          <p>If you have any questions or need further assistance, please do not hesitate to contact our support team at ${contactInfo}</p>
          <div class="line"></div>
          <p>&copy; 2024 Eve After Dark. All rights reserved.</p>
          <div class="social-icons">
            <a href="#"><img src="https://weddingstory.nyc3.digitaloceanspaces.com/ead-backend1722877112575-twitter-512.png" alt="Twitter"></a>
            <a href="#"><img src="https://weddingstory.nyc3.digitaloceanspaces.com/ead-backend1722877137473-facebook-7-512.png" alt="Facebook"></a>
            <a href="#"><img src="https://weddingstory.nyc3.digitaloceanspaces.com/ead-backend1722877158587-instagram-6-512.png" alt="Instagram"></a>
          </div>
        </div>
      </div>
    </body>
  </html>`;
};

export const getSpecialReservationEmail = (
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
  message: string
) => {
  const fullName = `${first_name} ${last_name}`;
  const mainContent = `
    <p>There is a new reservation request with the following details:</p>
    <div class="details">
        <p><strong>Name :</strong> ${fullName}</p>
        <p><strong>Phone Number :</strong> ${phone_number}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong> ${message}</p>
    </div>`;

  return buildTemplate("Admin", "Special Reservation Request", mainContent);
};

export const getWelcomeEmailTemplate = (first_name: string) => {
  const mainContent = `
    <p>Welcome to EAD Shortlets!</p>
    <p>Welcome to EAD Shortlets! We're thrilled to have you as part of our community.</p>
    <p>You can now start searching for the perfect property that fits your needs. If you don't find exactly what you're looking for, don't worry — you can make a special reservation request, and we'll help you find the right place. You can also view our <a href="${FE_BASE_URL}/faq">Frequently Asked Questions</a> in the homepage footer for quick answers.</p>
    <p>Are you interested in becoming a host? You can list your property and start earning today by clicking the <a href="${FE_BASE_URL}/host-type">Become a Host</a> button to begin your host journey!</p>
    <p>Don't forget to complete your profile to get the most out of your experience with us. If you need assistance at any time, feel free to reach out to our support team at <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>
    <p>We're excited to see you explore all that EAD Shortlets has to offer!</p>
    <p>Best regards,</p>
    <p>The EAD Shortlets Team</p>
    <a href="${FE_BASE_URL}" class="reset-button">Go to homepage</a>
  `;

  return buildTemplate(first_name, "Welcome to EAD Shortlets!", mainContent);
};

export const getInviteTemplate = (first_name: string, referral_code: string) => {
  const mainContent = `
  <p>${first_name} thought you'd love EAD Shortlets - a platform where you can find unique short-term rentals that feel like home and list your space to earn an income.</p>
  
  <h3>Why join EAD Shortlets?</h3>
  <ul>
    <li>Discover unique properties that match your style and budget.</li>
    <li>Seamlessly book short-term stays or even become a host yourself.</li>
    <li>Enjoy a community-driven experience with support every step of the way.</li>
  </ul>
  <p>Ready to get started? Click below to explore properties or create your free account.</p>
  <a href="${FE_BASE_URL}/invite/${referral_code}" class="button" style="display:inline-block; padding:10px 20px; background-color:#e74c3c; color:white; text-decoration:none; border-radius:5px; margin:20px 0; font-weight:bold;">Join EAD Shortlets Today</a>
  
  <p>If you have any questions, feel free to reach out at <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>. We look forward to welcoming you!</p>
  
  <p>Best regards,</p>
  <p>The EAD Shortlets Team</p>
`;
 
  return buildTemplate("", `${first_name} Invites You to Join EAD Shortlets!`, mainContent);
};

export const getReviewPrompt = (first_name: string, reviewer_profile_picture: string, reviewer_name: string, booking_location: string, booking_id: any) => {
  const mainContent = `
  <div style="border: 1px solid #eaeaea; border-radius: 8px; padding: 10px; display: flex; align-items: center; gap: 15px;">
    <img src="${reviewer_profile_picture}" alt="Host profile picture" style="width: 50px; height: 50px; border-radius: 50%;">
    <div>
      <strong>${reviewer_name}</strong><br>
      <span>${booking_location}</span>
    </div>
  </div>
  <p>You can read ${reviewer_name}'s feedback once you <strong>write a review</strong> of your own, or at the end of the review period in a week.</p>
  
  <h3>How was your booking with ${reviewer_name}?</h3>
  <a href="${FE_BASE_URL}/guest/booking-details/${booking_id}" class="button" style="display:inline-block; padding:10px 20px; background-color:#e74c3c; color:white; text-decoration:none; border-radius:5px; margin:20px 0; font-weight:bold;">Leave a review</a>
`;
 
  return buildTemplate(first_name, `Find out what ${reviewer_name} wrote`, mainContent);
};

export const getReviewNotification = (first_name: string, reviewer_role: string, comment: string, rating: any, reviewer_profile_picture: string, recipient_id: any) => {
  const recipientRole = reviewer_role === "host" ? "guest" : "host";
  const profileUrl = `${FE_BASE_URL}/${recipientRole}-info/${recipient_id}`;

  const mainContent = `
          <p>Thanks for booking with EAD Shortlets!</p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${reviewer_profile_picture}" alt="Host profile picture" style="width: 50px; height: 50px; border-radius: 50%;">
            <div>
              <strong>Sharon</strong><br>
              <span>Your ${reviewer_role}</span>
            </div>
          </div>
          <p>${comment}</p>
          <a href="${profileUrl}" style="color: #e74c3c; text-decoration: none;">Read on your profile</a>
          <h3>Rating</h3>
          <ul>
            <li>${rating} Stars</li>
          </ul>
`;
 
  return buildTemplate(first_name, `Your ${reviewer_role} made a review of your booking`, mainContent);
};

export const getVerificationCodeEmail = (first_name: string, email:string,  code: string) => {
  const mainContent = `
  <p>Welcome to EAD Shortlets! We are excited to have you join our community. To complete your registration,
        please verify your account by entering the following code:</p>
    <div class="details">
        <div class="code-box">${code}</div>
        <p>For your security, this code will expire in 5 minutes. If you did not create an account with
            <a href="mailto:${email}">${email}</a>, please ignore this
            email or contact our support team immediately.
        </p>
    </div>`;

  return buildTemplate(first_name, "Account verification", mainContent);
};

export const getResetPasswordCodeEmail = (first_name: string, code: string) => {
  const mainContent = `
  <p>We received a request to reset your password for your <strong>EAD Shortlets</strong> account. If you did
  not request this change, please ignore this email or contact our support team immediately.</p>
  <p>To reset your password, please enter the following code:</p>
  <div class="details">
      <div class="code-box">${code}</div>
  </div>
  <p>For your security, this code will expire in 30 minutes.</p>`;

  return buildTemplate(first_name, "password reset request", mainContent);
};

export const getUserKycApprovalTemplate = (id: number, first_name: string, last_name: string) => {
  const fullName = `${first_name} ${last_name}`;
  const currentDate = new Date().toLocaleDateString();
  const mainContent = `
  <p>We are pleased to inform you that your KYC (Know Your Customer) verification has been successfully
  completed and approved.</p>
  <h3>Approval Details:</h3>
  <p>
    <strong>User ID:</strong> ${id}<br>
    <strong>Name:</strong> ${fullName}<br>
    <strong>Approval Date:</strong> ${currentDate}
  </p>
  <p>Your listings will now be visible to guests on EAD Shortlets.</p>
  <p>To further increase your chances of being booked, earn a <strong>Verified</strong> badge for your listed
    properties.</p>
  <div class="button-container">
    <a href="${FE_BASE_URL}" class="reset-button">Go to Dashboard</a>
  </div>`;

  return buildTemplate(first_name, "User verification", mainContent);
};

export const getUserKycDenialTemplate = (id: number, first_name: string, last_name: string, reason: string) => {
  const fullName = `${first_name} ${last_name}`;
  const currentDate = new Date().toLocaleDateString();
  const mainContent = `
    <p>We regret to inform you that your KYC (Know Your Customer) verification could not be completed
    successfully at this time.</p>
    <h3>Denial Details:</h3>
    <p>
      <strong>User ID:</strong> ${id} <br>
      <strong>Name:</strong> ${fullName}<br>
      <strong>Denial Date:</strong> ${currentDate}
    </p>
    <h3>Reason for Denial:</h3>
    <p>
     ${reason}
    </p>
    <div class="button-container">
      <a href="${FE_BASE_URL}" class="reset-button">Go to Dashboard</a>
    </div>
    <p>Please contact our customer support ${contactInfo} for more
      information regarding the denial.</p>`;

  return buildTemplate(first_name, "User verification", mainContent);
};

export const getPropertyApprovalTemplate = (property_name: string, property_address: string, host_name: string ) => {
  const mainContent = `
  <p>We are delighted to inform you that your property verification has
  Been successfully completed and approved.</p>
  <h3>Approval Details:</h3>
  <p>
    <strong>Property Name:</strong> ${property_name}<br>
    <strong>Property Address:</strong> ${property_address}<br>
    <strong>Host Name:</strong> ${host_name}
  </p>
  <p>Your property is now <strong>Verified</strong>.</p>
  <p>Allowing you utmost visibility to guests and turning your home to
      Instant profit.</p>
  <div class="button-container">
    <a href="${FE_BASE_URL}" class="reset-button">Go to Dashboard</a>
  </div>`;

  return buildTemplate(host_name, "Property Verification Approval", mainContent);
};

export const getPropertyDenialTemplate = (id: number, property_address: string, host_name: string, reason: string) => {
  const currentDate = new Date().toLocaleDateString();
  const mainContent = `
  <p>We regret to inform you that your property verification could not be completed successfully at this time.</p>
  <h3>Denial Details:</h3>
  <p>
    <strong>Property ID:</strong> ${id}<br>
    <strong>Property Address:</strong> ${property_address}<br>
    <strong>Host Name:</strong> ${host_name}
    <strong>Denial Date:</strong> ${currentDate}
  </p>
  <h3>Reason for Denial:</h3>
    <p>
     ${reason}
    </p>
    <div class="button-container">
      <a href="${FE_BASE_URL}" class="reset-button">Go to Dashboard</a>
    </div>
    <p>Please contact our customer support ${contactInfo} for more
      information regarding the denial.</p>
  `;

  return buildTemplate(host_name, "Property verification", mainContent);
};

export const getInspectionApprovalTemplate = (property_name: string, property_address: string, host_name: string ) => {
  const mainContent = `
  <p>We are pleased to inform you that your property has successfully passed the inspection.</p>
  <h3>Approval Details:</h3>
  <p>
    <strong>Property Name:</strong> ${property_name}<br>
    <strong>Property Address:</strong> ${property_address}<br>
    <strong>Host Name:</strong> ${host_name}
  </p>
  <p>Your property is now <strong>Verified</strong>.</p>
  <p>Allowing you utmost visibility to guests and turning your home to
      Instant profit.</p>
  <div class="button-container">
    <a href="${FE_BASE_URL}" class="reset-button">Go to Dashboard</a>
  </div>`;

  return buildTemplate(host_name, "Property verification", mainContent);
};

export const getInspectionDenialTemplate = (id: number, property_address: string, host_name: string, reason: string) => {
  const currentDate = new Date().toLocaleDateString();
  const mainContent = `
  <p>We regret to inform you that your property inspection was not  successful at this time.</p>
    <h3>Denial Details:</h3>
    <p>
      <strong>Property ID:</strong> ${id}<br>
      <strong>Property Address:</strong> ${property_address}<br>
      <strong>Host Name:</strong> ${host_name}
      <strong>Denial Date:</strong> ${currentDate}
    </p>
    <h3>Reason for Denial:</h3>
    <p>
     ${reason}
    </p>
    <div class="button-container">
      <a href="${FE_BASE_URL}" class="reset-button">Go to Dashboard</a>
    </div>
    <p>Please contact our customer support ${contactInfo} for more
      information regarding the denial.</p>
    `;

  return buildTemplate(host_name, "Property verification", mainContent);
};

// export const getBookingApprovalTemplate = (property_name: string, property_address: string, host_name: string ) => {
//   const mainContent = `
//   <p>We are pleased to inform you that your booking for the property <strong>${property_name}</strong> located at <strong>${property_address}</strong> has been approved!</p>
//   <h3>Approval Details:</h3>
//   <p>
//     <strong>Property Name:</strong> ${property_name}<br>
//     <strong>Property Address:</strong> ${property_address}<br>
//     <strong>Host Name:</strong> ${host_name}
//     <strong>Check-in Date:</strong> ${check_in_date}
//   </p>
//   <p>Your property is now <strong>Verified</strong>.</p>
//   <p>Allowing you utmost visibility to guests and turning your home to
//       Instant profit.</p>
//   <div class="button-container">
//     <a href="#" class="reset-button">Go to Dashboard</a>
//   </div>`;

//   return buildTemplate(host_name, "Property verification", mainContent);
// };

export const getBookingConfirmationTemplate = (property_name: string, check_in_date: any, check_out_date: any, guest_name: string, property_media: string, booking_id: any ) => {
  const checkInDate = new Date(check_in_date).toLocaleString('en-US', localeOptions);
  const checkOutDate = new Date(check_out_date).toLocaleString('en-US', localeOptions);
  const mainContent = `
    <p>Great news! Your booking for <strong>${property_name}</strong> has been reserved from <strong>${checkInDate}</strong> to <strong>${checkOutDate}</strong>.</p>
    <img src=${property_media} alt="Property Image">
    <p>We're excited to host you. If you have any questions, feel free to reach out.</p>
    <a href="${FE_BASE_URL}/guest/booking-details/${booking_id}" class="reset-button">Go to booking</a>
    <p>Thank you for choosing EAD Shortlets!</p>
      `;

  return buildTemplate(guest_name, "Your Booking is Confirmed!", mainContent);
};

export const getBookingRequestDeniedTemplate = (
  guest_name: string, 
  property_name: string, 
  check_in_date: any, 
  check_out_date: any,
  reason: any
) => {
  const checkInDate = new Date(check_in_date).toLocaleString('en-US', localeOptions);
  const checkOutDate = new Date(check_out_date).toLocaleString('en-US', localeOptions);

  const mainContent = `
    <p>Unfortunately, your booking request for <strong>${property_name}</strong> from <strong>${checkInDate}</strong> to <strong>${checkOutDate}</strong> has been denied by the host.</p>
    <h3>Reason for Denial:</h3>
    <p>
     ${reason}
    </p>
    <p>You will receive a full refund in line with our cancellation policy. We apologise for the inconvenience. You can search for other available properties on EAD Shortlets or make a special reservation request if you need help finding a place.</p>
    <a href="${FE_BASE_URL}/search" class="reset-button">Go to Search</a>
    <p>Thank you for understanding.</p>
  `;

  return buildTemplate(guest_name, "Booking Request Denied", mainContent);
};

export const getBookingHostCancelledTemplate = (
  guest_name: string, 
  property_name: string, 
  check_in_date: any, 
  check_out_date: any
) => {
  const checkInDate = new Date(check_in_date).toLocaleString('en-US', localeOptions);
  const checkOutDate = new Date(check_out_date).toLocaleString('en-US', localeOptions);

  const mainContent = `
    <p>We regret to inform you that your host has cancelled your reservation at <strong>${property_name}</strong> for the dates <strong>${checkInDate}</strong> to <strong>${checkOutDate}</strong> .</p>
    <p>You will receive a full refund in line with our cancellation policy. If you need help finding another property, our support team is here to assist.
    Thank you for choosing EAD Shortlets.</p>
    <a href="${FE_BASE_URL}/search" class="reset-button">Go to Search</a>
    <p>Thank you for understanding.</p>
  `;

  return buildTemplate(guest_name, "Your Reservation Has Been Cancelled", mainContent);
};

export const getBookingGuestCancelledTemplate = (
  host_name: string,
  guest_name: string, 
  property_name: string, 
  check_in_date: any, 
  check_out_date: any,
  booking_id: any
) => {
  const checkInDate = new Date(check_in_date).toLocaleString('en-US', localeOptions);
  const checkOutDate = new Date(check_out_date).toLocaleString('en-US', localeOptions);

  const mainContent = `
    <p>Your guest <strong>${guest_name}</strong> has cancelled their booking for <strong>${property_name}</strong> from <strong>${checkInDate}</strong> to <strong>${checkOutDate}</strong>.</p>
    <p>Please refer to our cancellation policy for details regarding any applicable refund or charges.</p>
    <p>If you have any questions, feel free to contact support.</p>
    <a href="${FE_BASE_URL}/guest/booking-details/${booking_id}" class="reset-button">Go to Booking</a>
  `;

  return buildTemplate(host_name, "Your Guest Has Cancelled Their Reservation", mainContent);
};

export const getWalletDebitTemplate = (
  host_name: string, 
  amount: number, 
  reason: string, 
  debit_date: any
) => {
  const formattedDate = new Date(debit_date).toLocaleString('en-US', localeOptions);

  const mainContent = `
    <p>Your wallet has been debited.</p>
    <p><strong>Amount:</strong> NGN ${amount.toLocaleString()}</p>
    <p><strong>Reason for Debit:</strong> ${reason} <span style="font-size: 0.85em;">(Note: Could be Payout request and other reasons)</span></p>
    <p><strong>Date:</strong> ${formattedDate}</p>
    <p>You can view your updated wallet balance and transaction history by logging into your EAD Shortlets host dashboard.</p>
    <p>If you have any questions, please contact our support.</p>
    <a href="${FE_BASE_URL}" class="reset-button">Go to Dashboard</a>
  `;

  return buildTemplate(host_name, "Your Wallet Has Been Debited", mainContent);
};

export const getWalletCreditTemplate = (
  host_name: string, 
  amount: number, 
  reason: string, 
  credit_date: string
) => {
  const formattedDate = new Date(credit_date).toLocaleString('en-US', {
    day: 'numeric', 
    month: 'long', 
    year: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true 
  });

  const mainContent = `
    <p>Good news! Your wallet has been credited.</p>
    <p><strong>Amount:</strong> NGN ${amount.toLocaleString()}</p>
    <p><strong>Reason for Debit:</strong> ${reason}</p>
    <p><strong>Date:</strong> ${formattedDate}</p>
    <p>You can view your updated wallet balance and transaction history by logging into your EAD Shortlets host dashboard.</p>
    <p>If you have any questions, please contact our support.</p>
    <a href="${FE_BASE_URL}" class="reset-button">Go to Dashboard</a>
  `;

  return buildTemplate(host_name, "Your wallet has been credited", mainContent);
};

export const getNewBookingAlertTemplate = (
  host_name: string,
  guest_name: string,
  property_name: string,
  property_address: string,
  check_in_date: any,
  check_out_date: any,
  host_payout: number
) => {
  const checkInDate = new Date(check_in_date).toLocaleString('en-US', localeOptions);
  const checkOutDate = new Date(check_out_date).toLocaleString('en-US', localeOptions);
  const formattedPayout = host_payout.toLocaleString(); // Formats payout with commas

  const mainContent = `
    <p>You have a new booking!</p>
    <p><strong>Booking Details:</strong></p>
    <p><strong>Property:</strong> ${property_name} & ${property_address}</p>
    <p><strong>Guest:</strong> ${guest_name}</p>
    <p><strong>Check-in Date:</strong> ${checkInDate}</p>
    <p><strong>Check-out Date:</strong> ${checkOutDate}</p>
    <p><strong>Total Earnings:</strong> NGN ${formattedPayout}</p>
    <p>To view more details and manage this booking, visit your dashboard by clicking the button below:</p>
    <a href="${FE_BASE_URL}" class="reset-button">Go to booking</a>
    <p>If you have any questions, feel free to reach out to us.</p>
  `;

  return buildTemplate(host_name, `New Booking Alert: ${guest_name} Has Booked Your Property!`, mainContent);
};

export const getRefundProcessedTemplate = (
  guest_name: string,
  property_name: string,
  check_in_date: any,
  check_out_date: any,
  amount: number
) => {
  const checkInDate = new Date(check_in_date).toLocaleString('en-US', localeOptions);
  const checkOutDate = new Date(check_out_date).toLocaleString('en-US', localeOptions);
  const formattedAmount = amount.toLocaleString(); // Formats amount with commas

  const mainContent = `
    <p>Your booking request for <strong>${property_name}</strong> from <strong>${checkInDate}</strong> to <strong>${checkOutDate}</strong> was denied. As a result, your refund of <strong>NGN ${formattedAmount}</strong> has been processed.</p>
    <p>Funds will reflect in your bank account within 24 hours.</p>
    <p>If you need help finding another property, kindly contact our support team for assistance.</p>
    <a href="${FE_BASE_URL}/search" class="reset-button">Go to search</a>
  `;

  return buildTemplate(guest_name, "Your Refund Has Been Processed", mainContent);
};
