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
      'FORM_SET',
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

    const formSets = process.env.FORM_SET.split(',').map((item) => {
      const dataSet = item.split(':')
      return {
        formId: dataSet[0],
        toEmail: dataSet[1],
      }
    })

    const body = JSON.parse(request.body)
    const formSet = formSets.find((item) => item.formId === body.formId)
    if (!formSet) {
      throw Error('Form not found!')
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE || false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        ciphers: 'SSLv3',
      },
    })

    await transporter.sendMail({
      from:
        process.env.FROM_STRING ||
        '"Serverless Emailer" <noreply@indesignx.com>',
      to: formSet.toEmail,
      subject: 'New Form Submission',
      text: request.body,
      html: request.body,
    })

    response.json({ success: true })
  } catch (error) {
    response.json({
      success: false,
      reason: error.message,
      originalError: error,
    })
  }
}
