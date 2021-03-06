let submit = {
  dom: document.currentScript.closest('soci-route'),
  init() {
    soci.registerPage(submit)
  },
  form: null, 
  onActivate() {
    console.log('submit page activate')
    submit.form = document.querySelector('#submit form')

    let title = document.querySelector('#submit input[name="title"]')
    title.focus()

    submit.submitButton = document.querySelector('#submit soci-button')
    submit.submitButton.addEventListener('click', submit.submit)
  },
  async submit(e) {
    console.log('submit time')
    if(submit.form.reportValidity()){
      let data = new FormData(submit.form)
      let type = document.querySelector('#submit soci-tab[active]').getAttribute('name').toLowerCase()
      let fileUploader = document.querySelector(`#submit soci-${type}-uploader`)
      if(fileUploader){
        let newPath = await fileUploader.move(data.get('url'))
        if(newPath == null) {
          console.error("Error moving file to its new url")
          return 0
        }
      }
      soci.postData('post/create', {
        title: data.get('title'),
        url: data.get('url'),
        content: data.get('description'),
        type: type,
        width: fileUploader?.width,
        height: fileUploader?.height
      }).then(e=>{
        if(e.url){
          submit.submitButton.success()
          window.history.pushState(null, null, e.url)
          window.dispatchEvent(new HashChangeEvent('hashchange'))
        }
        else {
          submit.submitButton.error()
        }
      })
    }
    else {
      submit.submitButton.error()
    }
  }
}

submit.init()