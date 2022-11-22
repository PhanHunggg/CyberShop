// tạo mảng lưu đẻ lưu loacal

const product = new ProductServices();
const productList = [];
let productCard = [];
let amount = 0;

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
  getAmountLocal();
};

// hàm xuất hiện mảng sp
document.getElementById("btn-shop").onclick = function () {
  document.querySelector(".store").classList.toggle("content");
};

const handlerCart = (id) => {
  amount = document.getElementById("amount").innerHTML;
  amount++;
  document.getElementById("amount").innerHTML = amount;

  product.getById(id).then(function (response) {
    let cardItems = {
      product: {
        id: response.data.id,
        price: response.data.price,
        image: response.data.image,
        name: response.data.name,
      },
      quantity: 1,
    };
    console.log(cardItems);
    console.log(productCard);

    if (productCard.length === 0) {
      productCard.push(cardItems);
    } else {
      for (let i = 0; i < productCard.length; i++) {
        if (productCard[i].product.id === cardItems.product.id) {
          productCard[i].quantity += 1;
          renderCard();
          setLocalStorage();
          setAmountLocal();
          return;
        }
      }
      productCard.push(cardItems);
    }
    renderCard();
    setLocalStorage();
    setAmountLocal();
  });
};

const renderCard = () => {
  let html = productCard.reduce((total, element) => {
    total += `
    <tr>
      <td><img
        src="../images/${element.product.image}"
        alt=""
        /></td>
      <td>${element.product.name}</td>
      <td><div id="buy__amount">
       <button onclick="handleMinus('${
         element.product.id
       }')" class="btn-minus"><i    class="fa-solid fa-minus"></i></button>
       <input type="text" name="amountProduct" id="amountProduct" value="${
         element.quantity
       }">
        <button onclick="handlePlus('${
          element.product.id
        }')" class="btn-plus"><i class="fa-solid fa-plus"></i></button>
      </div></td>
    <td>${element.product.price * element.quantity}</td>
    <td>
      <button onclick="deleteProduct('${
        element.product.id
      }')" class="btn-delete btn btn-danger"><i class="fa-solid fa-xmark"></i></button>
    </td>
  </tr>
    `;
    return total;
  }, "");

  document.getElementById("sanPham").innerHTML = html;
};

const handlePlus = (id) => {
  product.getById(id).then(function (response) {
    for (let i in productCard) {
      if (response.data.id === productCard[i].product.id) {
        productCard[i].quantity += 1;
        amount = document.getElementById("amount").innerHTML;
        amount++;
        document.getElementById("amount").innerHTML = amount;
        renderCard();
        setLocalStorage();
        setAmountLocal();
      }
    }
  });
};

const handleMinus = (id) => {
  product.getById(id).then(function (response) {
    for (let i in productCard) {
      if (response.data.id === productCard[i].product.id) {
        if (productCard[i].quantity <= 1) {
          productCard[i].quantity = 1;
        } else {
          productCard[i].quantity -= 1;
          amount = document.getElementById("amount").innerHTML;
          amount--;
          document.getElementById("amount").innerHTML = amount;
          renderCard();
          setLocalStorage();
          setAmountLocal();
        }
      }
    }
  });
};

const deleteProduct = (id) => {
  const inx = productCard.findIndex((element) => {
    return element.product.id === id;
  });

  const quantity = productCard[inx].quantity;
  productCard.splice(inx, 1);
  amount = document.getElementById("amount").innerHTML;
  amount -= quantity;
  document.getElementById("amount").innerHTML = amount;
  renderCard();
  setLocalStorage();
  setAmountLocal();
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

  productCard = data;

  renderCard();
};

const setAmountLocal = () => {
  localStorage.setItem("amount", amount);
};

const getAmountLocal = () => {
  const amount = localStorage.getItem("amount");
  if (!amount) amount = 0;
  document.getElementById("amount").innerHTML = amount;
};

//  Hàm tăng giảm số lượng
// function handlePlus(id) {
//   product.getById(id).then(function (response) {
//     var amount;
//     amount = document.getElementById("amountProduct").value;
//     amount++;
//     console.log(amount);
//     document.getElementById("amountProduct").value = amount;
//   });
// }
// function handleMinus() {
//   var amount = document.getElementById("amountProduct").value;
//   amount--;
//   document.getElementById("amountProduct").value = amount;
// }

//  hàm desc

// const handleDesc = (id) => {
//   product.getById(id).then(function (response) {
//     for (var i = 0; i < productList.length; i++) {
//       if (productList[i].id === response.data.id) {
//         document.getElementById("exampleModalLabel").innerHTML =
//           productList[i].name;
//         document.querySelector(".modal-body").innerHTML = productList[i].desc;
//       }
//     }
//   });
// };

// for (var i = 0; i < productList.length; i++) {
//   if (productList[i].id === response.data.id) {
//     productCard.push(productList[i]);
//   }
// }
