const postApi = 'http://localhost:3000/api/send'
const emailerForms = document.querySelectorAll('[data-emailer]')
for (const form of emailerForms) {
  form.action = 'javascript:void(0)'
  form.onsubmit = async () => {
    try {
      const data = Object.fromEntries(new FormData(form).entries())
      const formId = form.attributes.getNamedItem('data-emailer').nodeValue
      const callbackName = form.attributes.getNamedItem('data-emailer-callback')
        .nodeValue
      const formData = {
        formId,
        data,
      }
      const apiResponse = await fetch(postApi, {
        method: 'POST',
        body: JSON.stringify(formData),
      })
      const apiResult = await apiResponse.json()
      if (apiResult.success) {
        window[callbackName].call(undefined)
      } else {
        window[callbackName].call(
          undefined,
          `Emailer Error: ${apiResult.reason}`
        )
      }
    } catch (error) {
      window[callbackName].call(undefined, `Emailer Error: ${error}`)
    }
  }
}
