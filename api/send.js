require('dotenv').config()
const nodemailer = require('nodemailer')

module.exports = async (request, response) => {
  try {
    const envParams = [
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USERNAME',
      'SMTP_PASSWORD',
      'ALLOWED_ORIGINS',
    ]
    for (const param of envParams) {
      if (!process.env[param]) {
        throw Error(`Environment variable ${param} missing!`)
      }
    }

    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',')
    if (!allowedOrigins.includes(request.headers.host)) {
      throw Error('Permission denied! Origin not verified.')
    }

    const body = JSON.parse(request.body)
    const formSet = {
      fromEmail: process.env[`FORM_${body.formId}_FROM_EMAIL`],
      fromName: process.env[`FORM_${body.formId}_FROM_NAME`],
      toEmail: process.env[`FORM_${body.formId}_TO_EMAIL`],
      subject: process.env[`FORM_${body.formId}_SUBJECT`],
    }
    if (
      formSet.fromEmail &&
      formSet.fromName &&
      formSet.toEmail &&
      formSet.subject
    ) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      })

      await transporter.sendMail({
        from: `"${formSet.fromName}" <${formSet.fromEmail}>`,
        to: formSet.toEmail,
        subject: formSet.subject,
        text: JSON.stringify(body.data),
        html: JSON.stringify(body.data),
      })

      response.json({ success: true })
    } else {
      throw Error('Form not found!')
    }
  } catch (error) {
    response.json({
      success: false,
      reason: error.message,
      originalError: error,
    })
  }
}
