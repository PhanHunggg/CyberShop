// tạo mảng lưu đẻ lưu loacal
var product = new ProductServices();
var productList=[]

// lấy dữ liệu API xuống
function getProduct() {
  product.getList().then(function (response) {
    renderProduct(response.data);
    for (var i = 0; i < response.data.length; i++) {
      productList.push(response.data[i]);
    }
  });
}
console.log(productList);

// in dữ liệu ra màn hình
function renderProduct(data) {
  var content = "";
  for (var i = 0; i < data.length; i++) {
    content += `
          <div class="item">
  <div class="card">
    <div class="lines"></div>
    <div class="imgBox">
      <img
        src="../images/${data[i].image}"
        alt=""
      />
    </div>
    <div class="content">
      <div class="details">
        <h2>${data[i].name}<br /></h2>
        <div class="data">
          <h3>${data[i].screen}<br /><span>Screen</span></h3>
          <h3>${data[i].price}$<br /><span>Price</span></h3>
        </div>
        <div class="actionBtn">
          <button onclick="handlerCart(${data[i].id})" id="add">Add</button>
          <button onclick="handleDesc(${data[i].id})" data-bs-toggle="modal" data-bs-target="#exampleModal" >Description</button>
        </div>
      </div>
    </div>
  </div>
  </div>
    `;
  }
  document.getElementById("items").innerHTML = content;
}

// Khi window load thì chạy hàm render in ra màn hình
window.onload = function () {
  getProduct();
  getData();
};

// hàm xuất hiện mảng sp
document.getElementById("btn-shop").onclick = function () {
  document.querySelector(".store").classList.toggle("content");
};

var productCard = [];
function handlerCart(id) {
  var test = document.getElementById("amount").innerHTML;
  test++;
  document.getElementById("amount").innerHTML = test;
  
  product.getById(id).then(function (response) {
    for (var i = 0; i < productList.length; i++) {
      if (productList[i].id === response.data.id) {
        productCard.push(productList[i]);
      }
    }
    renderCard(productCard, "sanPham");
    saveData();

  });
}




function renderCard (data,span){
  var content = ""
  for (var i = 0; i < data.length; i++){
    content+= `
    <tr>
    <td><img
    src="../images/${data[i].image}"
    alt=""
  /></td>
    <td>${data[i].name}</td>
    <td><div id="buy__amount">
    <button onclick="handleMinus(${data[i].id})" class="btn-minus"><i class="fa-solid fa-minus"></i></button>
    <input type="text" name="amountProduct" id="amountProduct" value="1">
    <button onclick="handlePlus(${data[i].id})" class="btn-plus"><i class="fa-solid fa-plus"></i></button>
  </div></td>
    <td>${data[i].price}</td>
  </tr>
    `
  }
  document.getElementById(span).innerHTML = content;
}
function saveData() {
  var productCardJS = JSON.stringify(productCard);
  localStorage.setItem("product", productCardJS);
}
function getData(){
  var JSONData = localStorage.setItem("product");
  if(!JSONData) return;
  var productCardLocal = JSON.parse(JSONData);
  productCard = mapData(productCardLocal);
  renderCard(productCard, "sanPham");
}
function mapData(data){
  var result = [];
  for (var i=0; i<data.length; i++){
    var oldCard = data[i];
    var newProduct = new Product(
      oldCard.id,
      oldCard.name,
      oldCard.price,
      oldCard.screen,
      oldCard.blackCamera,
      oldCard.fontCamera,
      oldCard.image,
      oldCard.desc,
      oldCard.type,
      oldCard.amount
    )
    result.push(newProduct);
  }
  return result;
}

//  Hàm tăng giảm số lượng
function handlePlus (id){
  product.getById(id).then(function(response){
    var amount = document.getElementById("amountProduct").value;
  amount++;
  document.getElementById("amountProduct").value = amount;
  })
}
function handleMinus (){
  var amount = document.getElementById("amountProduct").value;
  amount--;
  document.getElementById("amountProduct").value = amount;
}

//  hàm desc 

function handleDesc(id){
  product.getById(id).then(function(response){
    for(var i=0; i<productList.length; i++){
      if (productList[i].id === response.data.id){
        document.getElementById("exampleModalLabel").innerHTML = productList[i].name;
        document.querySelector(".modal-body").innerHTML = productList[i].desc;
      }
    }
  })

}

