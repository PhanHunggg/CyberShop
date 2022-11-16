// tạo mảng lưu đẻ lưu loacal

const product = new ProductServices();
const productList = [];

// lấy dữ liệu API xuống
const getProduct = () => {
  product.getList().then(function (response) {
    renderProduct(response.data);
    for (var i = 0; i < response.data.length; i++) {
      productList.push(response.data[i]);
    }
  });
};
console.log(productList);

// in dữ liệu ra màn hình
const renderProduct = (data) => {
  const html = data.reduce((total, element) => {
    total += `
    <div class="item">
<div class="card">
<div class="lines"></div>
<div class="imgBox">
<img
  src="../images/${element.image}"
  alt=""
/>
</div>
<div class="content">
<div class="details">
  <h2>${element.name}<br /></h2>
  <div class="data">
    <h3>${element.screen}<br /><span>Screen</span></h3>
    <h3>${element.price}$<br /><span>Price</span></h3>
  </div>
  <div class="actionBtn">
    <button onclick="handlerCart(${element.id})" id="add">Add</button>
    <button onclick="handleDesc(${element.id})" data-bs-toggle="modal" data-bs-target="#exampleModal" >Description</button>
  </div>
</div>
</div>
</div>
</div>
`;
    return total;
  }, "");

  document.getElementById("items").innerHTML = html;
};

// Khi window load thì chạy hàm render in ra màn hình
window.onload = () => {
  getProduct();
  getCardLocalStorage();
};

// hàm xuất hiện mảng sp
document.getElementById("btn-shop").onclick = function () {
  document.querySelector(".store").classList.toggle("content");
};

let productCard = [];
const handlerCart = (id) => {
  let test = document.getElementById("amount").innerHTML;
  test++;
  document.getElementById("amount").innerHTML = test;

  product.getById(id).then(function (response) {
    for (var i = 0; i < productList.length; i++) {
      if (productList[i].id === response.data.id) {
        productCard.push(productList[i]);
      }
    }
    renderCard(productCard, "sanPham");
    setLocalStorage();
    // saveData();
  });
};

const renderCard = (data, span) => {
  var html = data.reduce((total, element) => {
    total += `
    <tr>
      <td><img
        src="../images/${element.image}"
        alt=""
        /></td>
      <td>${element.name}</td>
      <td><div id="buy__amount">
       <button onclick="handleMinus('${element.id}')" class="btn-minus"><i    class="fa-solid fa-minus"></i></button>
       <input type="text" name="amountProduct" id="amountProduct" value="1">
        <button onclick="handlePlus('${element.id}')" class="btn-plus"><i class="fa-solid fa-plus"></i></button>
      </div></td>
    <td>${element.price}</td>
    <td>
      <button onclick="deleteProduct('${element.id}')" class="btn-delete btn btn-danger"><i class="fa-solid fa-xmark"></i></button>
    </td>
  </tr>
    `;
    return total;
  }, "");

  document.getElementById(span).innerHTML = html;
};

const setLocalStorage = () => {
  const stringtify = JSON.stringify(productCard);
  localStorage.setItem("card_List", stringtify);
};

const getLocalStorage = () => {
  const stringify = localStorage.getItem("card_List");
  if (stringify) {
    return JSON.parse(stringify);
  }
  return productCard;
};

const getCardLocalStorage = () => {
  const data = getLocalStorage();

  productCard = data.map((element) => {
    const product = new Product(
      element.id,
      element.name,
      element.price,
      element.screen,
      element.blackCamera,
      element.fontCamera,
      element.image,
      element.desc,
      element.type,
      element.amount
    );
    return product;
  });
  renderCard(productCard, "sanPham");
};

//  Hàm tăng giảm số lượng
function handlePlus(id) {
  product.getById(id).then(function (response) {
    var amount;
    amount = document.getElementById("amountProduct").value;
    amount++;
    console.log(amount);
    document.getElementById("amountProduct").value = amount;
  });
}
function handleMinus() {
  var amount = document.getElementById("amountProduct").value;
  amount--;
  document.getElementById("amountProduct").value = amount;
}

//  hàm desc

const handleDesc = (id) => {
  product.getById(id).then(function (response) {
    for (var i = 0; i < productList.length; i++) {
      if (productList[i].id === response.data.id) {
        document.getElementById("exampleModalLabel").innerHTML =
          productList[i].name;
        document.querySelector(".modal-body").innerHTML = productList[i].desc;
      }
    }
  });
}


const deleteProduct = (id) => {
  const inx = productCard.findIndex((element) => {
    return element.id === id
  })
  productCard.splice(inx, 1);
  renderCard(productCard, "sanPham");
  setLocalStorage();
}