const express = require("express");
const nodemailer = require("nodemailer");
const { Contact } = require("../models/user");


const submitContactForm = async (req, res) => {
const { firstName, lastName, company, email, phoneNumber, message } =
    req.body;

  try {
    // Save the form data to the database
    const contact = new Contact({
      firstName,
      lastName,
      company,
      email,
      phoneNumber,
      message,
    });
    await contact.save();

    // Send an email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass:  process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    const mailOptions = {
      from: "muindijoshua032@gmail.com",
      to: "muindijoshua033@gmail.com",
      subject: "New Contact Form Submission",
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res
      .status(500)
      .json({ error: "Failed to submit form. Please try again later." });
  }


};

module.exports = { submitContactForm };
