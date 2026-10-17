let projectTitle = 'CRUDS PROJECT';
document.title = projectTitle;

let title = document.querySelector('.title');
let price = document.querySelector('.price');
let tax = document.querySelector('.tax');
let ads = document.querySelector('.ads');
let discount = document.querySelector('.discount');
let total = document.querySelector('.total');
let count = document.querySelector('.count');
let cat = document.querySelector('.cat');
let create = document.querySelector('.create');
let delAll = document.querySelector('.del-all');
let delCount = document.querySelector('.del-count');
let updateIdx = -1;
let searchMood = 'title';
let searchByTitle = document.querySelector('.search-by-title');
let searchByCat = document.querySelector('.search-by-catedgory');
let searchBox = document.querySelector('.search-input');

// calculate tax and ads
price.addEventListener('keyup',()=>{
    if(price.value > 0){
        let t = +price.value * 14 / 100;
        let a = +price.value * 15 / 100;
        tax.value = t;
        ads.value = a;
    }
    else{
        tax.value = '';
        ads.value = '';
    }
    calculateTotal();
});

// calculate the total price
function calculateTotal(){
    if(price.value != ''){
        let tot = (+price.value + +tax.value + +ads.value);
        if(tot >= discount.value){
            total.innerHTML = tot - +discount.value;
            total.style.background = '#040'
        }
        else{
            total.innerHTML = '';
        total.style.background = 'rgb(104,1,1)';
        }
    }
    else{
        total.innerHTML = '';
        total.style.background = 'rgb(104,1,1)';
    }
}


// create product
let dataProdacts = [];
if(localStorage.products != null){
    dataProdacts = JSON.parse(localStorage.products);
}

create.addEventListener('click',()=>{
    let newPr = {
        title:title.value,
        price:price.value,
        taxes:tax.value,
        ads:ads.value,
        discount:discount.value,
        total:total.innerHTML,
        category:cat.value,
    };
    if(updateIdx === -1)
    {
        let prodCount = count.value > 1 ? count.value : 1;
        for(let i = 0; i < prodCount;i ++){
            dataProdacts.push(newPr);
        }

        //save all the products in local storage
        localStorage.products = JSON.stringify(dataProdacts);
    }
    else{
        dataProdacts[updateIdx] = newPr;
        localStorage.products = JSON.stringify(dataProdacts);
        create.innerHTML = 'Create';
        updateIdx = -1;
    }
    clearData();
    showData();
});


// clear inputs
function clearData(){
    title.value = '';
    price.value = '';
    tax.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    cat.value = '';
}


// show all data
function showData(word = ''){
    let n = dataProdacts.length;
    if(n === 0){
        delAll.style.display = 'none';
    }
    else{
        delAll.style.display = 'block';
    }
    let table = '';
    for(let i = 0;i < n; i++){
        if(word !== '' && searchMood === 'title' && word !== dataProdacts[i].title) continue;
        if(word !== '' && searchMood === 'category' && word !== dataProdacts[i].category) continue;
        
        table += `
            <tr>
                <td>${i+1}</td>
                <td>${dataProdacts[i].title}</td>
                <td>${dataProdacts[i].price}</td>
                <td>${dataProdacts[i].taxes}</td>
                <td>${dataProdacts[i].ads}</td>
                <td>${dataProdacts[i].discount}</td>
                <td>${dataProdacts[i].total}</td>
                <td>${dataProdacts[i].category}</td>
                <td><button onclick="updateData(${i})" class="update">update</button></td>
                <td><button onclick="removeData(${i})" class="delete">delete</button></td>
            </tr>
        `
    }
    calculateTotal();
    document.querySelector('.tbody').innerHTML = table;
    delCount = dataProdacts.length;
    document.querySelector('.del-count').innerHTML = delCount;
}
showData();


// delete one element
function removeData(i){
    dataProdacts.splice(i,1);
    localStorage.products = JSON.stringify(dataProdacts);
    showData();
}

// delete all elements
delAll.addEventListener('click',()=>{
    dataProdacts.splice(0);
    localStorage.products = JSON.stringify(dataProdacts);
    showData();
});


// update data
function updateData(i){
    let row = dataProdacts[i];
    title.value = row.title;
    price.value = row.price;
    tax.value = row.taxes;
    ads.value = row.ads;
    discount.value = row.discount;
    count.value = row.count;
    cat.value = row.category;
    calculateTotal();

    create.innerHTML = 'Update';
    updateIdx = i;
    scrollTo({
        top:0,
        behavior: 'smooth',
    })
}


// search
searchByTitle.addEventListener('click',()=>{
    searchMood = 'title';
    let searchWord = searchBox.value;
    showData(searchWord);
});


searchByCat.addEventListener('click',()=>{
    searchMood = 'category';
    let searchWord = searchBox.value;
    showData(searchWord);
});


searchBox.addEventListener('keyup',()=>{
    if(searchBox.value === ''){
        showData();
    }
});
