export default class ComponentServices {

  save(start,end,fileName) {
    let formParam = new FormData();
    formParam.append("startTime", start);
    formParam.append("endTime", end);
    try {
      fetch("http://localhost:5000/cutVideo", {
        method: 'POST',
        body: formParam
      }).then((response)=>{
        response.blob().then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
      });

      })
    } catch (error) {
      console.log(error)
    }
  }

  async uploadFile(file1) {
    let response = ''
    let formParam = new FormData();
    formParam.append("file", file1);
    formParam.append("filename", file1.name);
    try {
      response = await fetch("http://localhost:5000/uploadVideo", {
        method: 'POST',
        body: formParam
      })
      var result = await response.json();
      return result;
    } catch (error) {
      console.log(error)
    }
  }

}