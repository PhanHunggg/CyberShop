function ProductServices() {
  this.getList = function () {
    return axios({
      url: "https://63661faa046eddf1baf95cec.mockapi.io/products",
      method: "GET",
    });
  };
  this.getById = function (id) {
    return axios({
      url: `https://63661faa046eddf1baf95cec.mockapi.io/products/${id}`,
      method: "GET",
    });
  };
  this.updateList = function(id,data){
    return axios({
      url: `https://63661faa046eddf1baf95cec.mockapi.io/products/${id}`,
      method: "PUT",
      data: data,
    })
  }
}
